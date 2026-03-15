package com.wallet.app.service;

import java.util.UUID;

import com.wallet.app.dto.CreateWalletRequest;
import com.wallet.app.dto.DepositRequest;
import com.wallet.app.dto.DepositResponse;
import com.wallet.app.dto.WalletResponse;

public interface WalletService {

    WalletResponse createWalletForCurrentUser(String username, CreateWalletRequest request);

    WalletResponse getWalletForCurrentUser(String username);

    DepositResponse depositForCurrentUser(String username, DepositRequest request);

    void createDefaultWalletForUser(UUID userId);
}
