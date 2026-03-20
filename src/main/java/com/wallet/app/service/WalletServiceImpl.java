package com.wallet.app.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.wallet.app.dto.CreateWalletRequest;
import com.wallet.app.dto.DepositRequest;
import com.wallet.app.dto.DepositResponse;
import com.wallet.app.dto.WalletResponse;
import com.wallet.app.entity.Transaction;
import com.wallet.app.entity.User;
import com.wallet.app.entity.Wallet;
import com.wallet.app.repository.TransactionRepository;
import com.wallet.app.repository.UserRepository;
import com.wallet.app.repository.WalletRepository;

@Service
public class WalletServiceImpl implements WalletService {

    private static final String INR_CURRENCY = "INR";

    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public WalletServiceImpl(
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
    public WalletResponse createWalletForCurrentUser(String username, CreateWalletRequest request) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "user not found"));

        if (walletRepository.existsByUserId(user.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "wallet already exists for user");
        }

        Wallet wallet = new Wallet();
        wallet.setUserId(user.getId());
        wallet.setCurrency(normalizeCurrency(request == null ? null : request.currency()));
        wallet.setStatus("ACTIVE");

        Wallet savedWallet = walletRepository.save(wallet);
        return toResponse(savedWallet);
    }

    @Override
    @Transactional(readOnly = true)
    public WalletResponse getWalletForCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "user not found"));

        Wallet wallet = walletRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "wallet not found"));

        return toResponse(wallet);
    }

    @Override
    @Transactional
    public DepositResponse depositForCurrentUser(String username, DepositRequest request) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "user not found"));

        Wallet wallet = walletRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "wallet not found"));

        Wallet lockedWallet = walletRepository.findByIdForUpdate(wallet.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "wallet not found"));

        if (!"ACTIVE".equalsIgnoreCase(lockedWallet.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "wallet is not active");
        }

        BigDecimal amount = normalizeAmount(request.amount());
        String reference = normalizeDepositReference(request.reference());

        lockedWallet.setBalance(lockedWallet.getBalance().add(amount));

        Transaction transaction = new Transaction();
        transaction.setFromWalletId(null);
        transaction.setToWalletId(lockedWallet.getId());
        transaction.setAmount(amount);
        transaction.setCurrency(lockedWallet.getCurrency());
        transaction.setTransactionType("DEPOSIT");
        transaction.setStatus("COMPLETED");
        transaction.setReference(reference);
        transaction.setNote(request.note());
        transaction.setCompletedAt(OffsetDateTime.now());

        Transaction savedTransaction = transactionRepository.save(transaction);

        return new DepositResponse(
            savedTransaction.getId(),
            lockedWallet.getId(),
            savedTransaction.getAmount(),
            savedTransaction.getCurrency(),
            savedTransaction.getStatus(),
            savedTransaction.getReference(),
            lockedWallet.getBalance(),
            savedTransaction.getCompletedAt()
        );
    }

    @Override
    @Transactional
    public void createDefaultWalletForUser(UUID userId) {
        if (walletRepository.existsByUserId(userId)) {
            return;
        }

        Wallet wallet = new Wallet();
        wallet.setUserId(userId);
        wallet.setCurrency(INR_CURRENCY);
        wallet.setStatus("ACTIVE");
        walletRepository.save(wallet);
    }

    private String normalizeCurrency(String currency) {
        if (currency == null || currency.isBlank()) {
            return INR_CURRENCY;
        }

        String normalized = currency.trim().toUpperCase(Locale.ROOT);
        if (!INR_CURRENCY.equals(normalized)) {
            return INR_CURRENCY;
        }

        return normalized;
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

    private String normalizeDepositReference(String reference) {
        if (reference == null || reference.isBlank()) {
            return "DEP-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase(Locale.ROOT);
        }
        return reference.trim();
    }

    private WalletResponse toResponse(Wallet wallet) {
        return new WalletResponse(
            wallet.getId(),
            wallet.getUserId(),
            wallet.getBalance(),
            wallet.getCurrency(),
            wallet.getStatus(),
            wallet.getCreatedAt(),
            wallet.getUpdatedAt()
        );
    }
}
