package com.wallet.app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.wallet.app.dto.CreateWalletRequest;
import com.wallet.app.dto.DepositRequest;
import com.wallet.app.dto.DepositResponse;
import com.wallet.app.dto.WalletResponse;
import com.wallet.app.service.WalletService;

import jakarta.validation.Valid;

@RestController
@RequestMapping({"/wallets", "/wallet"})
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @PostMapping("/me")
    @ResponseStatus(HttpStatus.CREATED)
    public WalletResponse createMyWallet(@Valid @RequestBody(required = false) CreateWalletRequest request,
                                         Authentication authentication) {
        return walletService.createWalletForCurrentUser(authentication.getName(), request);
    }

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public WalletResponse getMyWallet(Authentication authentication) {
        return walletService.getWalletForCurrentUser(authentication.getName());
    }

    @PostMapping("/deposit")
    @ResponseStatus(HttpStatus.OK)
    public DepositResponse deposit(@Valid @RequestBody DepositRequest request,
                                   Authentication authentication) {
        return walletService.depositForCurrentUser(authentication.getName(), request);
    }
}
