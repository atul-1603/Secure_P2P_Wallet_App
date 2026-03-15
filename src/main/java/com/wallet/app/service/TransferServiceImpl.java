package com.wallet.app.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.wallet.app.dto.TransactionHistoryItem;
import com.wallet.app.dto.TransferRequest;
import com.wallet.app.dto.TransferResponse;
import com.wallet.app.entity.Transaction;
import com.wallet.app.entity.User;
import com.wallet.app.entity.Wallet;
import com.wallet.app.repository.TransactionRepository;
import com.wallet.app.repository.UserRepository;
import com.wallet.app.repository.WalletRepository;

@Service
public class TransferServiceImpl implements TransferService {

    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public TransferServiceImpl(
        WalletRepository walletRepository,
        UserRepository userRepository,
        TransactionRepository transactionRepository
    ) {
        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional
    public TransferResponse transfer(String username, TransferRequest request) {
        User sender = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "user not found"));

        Wallet senderWallet = walletRepository.findByUserId(sender.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "sender wallet not found"));

        UUID senderWalletId = senderWallet.getId();
        UUID receiverWalletId = request.toWalletId();

        if (senderWalletId.equals(receiverWalletId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cannot transfer to same wallet");
        }

        BigDecimal amount = normalizeAmount(request.amount());

        Wallet firstLocked;
        Wallet secondLocked;
        boolean senderFirst = senderWalletId.compareTo(receiverWalletId) < 0;

        if (senderFirst) {
            firstLocked = walletRepository.findByIdForUpdate(senderWalletId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "sender wallet not found"));
            secondLocked = walletRepository.findByIdForUpdate(receiverWalletId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "receiver wallet not found"));
        } else {
            firstLocked = walletRepository.findByIdForUpdate(receiverWalletId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "receiver wallet not found"));
            secondLocked = walletRepository.findByIdForUpdate(senderWalletId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "sender wallet not found"));
        }

        Wallet lockedSender = senderFirst ? firstLocked : secondLocked;
        Wallet lockedReceiver = senderFirst ? secondLocked : firstLocked;

        ensureWalletIsActive(lockedSender, "sender wallet is not active");
        ensureWalletIsActive(lockedReceiver, "receiver wallet is not active");

        if (!lockedSender.getCurrency().equals(lockedReceiver.getCurrency())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "currency mismatch between wallets");
        }

        if (lockedSender.getBalance().compareTo(amount) < 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "insufficient balance");
        }

        lockedSender.setBalance(lockedSender.getBalance().subtract(amount));
        lockedReceiver.setBalance(lockedReceiver.getBalance().add(amount));

        Transaction transaction = new Transaction();
        transaction.setFromWalletId(lockedSender.getId());
        transaction.setToWalletId(lockedReceiver.getId());
        transaction.setAmount(amount);
        transaction.setCurrency(lockedSender.getCurrency());
        transaction.setTransactionType("TRANSFER");
        transaction.setStatus("COMPLETED");
        transaction.setReference(normalizeReference(request.reference()));
        transaction.setNote(request.note());
        transaction.setCompletedAt(OffsetDateTime.now());

        Transaction savedTransaction = transactionRepository.save(transaction);

        return new TransferResponse(
            savedTransaction.getId(),
            lockedSender.getId(),
            lockedReceiver.getId(),
            savedTransaction.getAmount(),
            savedTransaction.getCurrency(),
            savedTransaction.getStatus(),
            savedTransaction.getReference(),
            lockedSender.getBalance(),
            lockedReceiver.getBalance(),
            savedTransaction.getCompletedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionHistoryItem> getRecentTransactions(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "user not found"));

        Wallet wallet = walletRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "wallet not found"));

        UUID walletId = wallet.getId();

        return transactionRepository
            .findTop100ByFromWalletIdOrToWalletIdOrderByCreatedAtDesc(walletId, walletId)
            .stream()
            .map(this::toHistoryItem)
            .toList();
    }

    private BigDecimal normalizeAmount(BigDecimal amount) {
        if (amount == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "amount is required");
        }
        if (amount.scale() > 4) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "amount scale cannot exceed 4 decimals");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "amount must be greater than zero");
        }
        return amount;
    }

    private String normalizeReference(String reference) {
        if (reference == null || reference.isBlank()) {
            return "TX-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase(Locale.ROOT);
        }
        return reference.trim();
    }

    private void ensureWalletIsActive(Wallet wallet, String message) {
        if (!"ACTIVE".equalsIgnoreCase(wallet.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, message);
        }
    }

    private TransactionHistoryItem toHistoryItem(Transaction transaction) {
        return new TransactionHistoryItem(
            transaction.getId(),
            transaction.getFromWalletId(),
            transaction.getToWalletId(),
            transaction.getAmount(),
            transaction.getCurrency(),
            transaction.getTransactionType(),
            transaction.getStatus(),
            transaction.getReference(),
            transaction.getNote(),
            transaction.getCreatedAt(),
            transaction.getCompletedAt()
        );
    }
}
