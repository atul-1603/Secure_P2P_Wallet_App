package com.wallet.app.service;

import java.util.List;

import com.wallet.app.dto.TransactionHistoryItem;
import com.wallet.app.dto.TransferRequest;
import com.wallet.app.dto.TransferResponse;

public interface TransferService {

    TransferResponse transfer(String username, TransferRequest request);

    List<TransactionHistoryItem> getRecentTransactions(String username);
}
