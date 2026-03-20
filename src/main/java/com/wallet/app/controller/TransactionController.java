package com.wallet.app.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.wallet.app.dto.TransactionHistoryItem;
import com.wallet.app.dto.TransferRequest;
import com.wallet.app.dto.TransferResponse;
import com.wallet.app.service.TransferService;

import jakarta.validation.Valid;

@RestController
@RequestMapping({"/transactions", "/wallet"})
public class TransactionController {

    private final TransferService transferService;

    public TransactionController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping("/transfer")
    @ResponseStatus(HttpStatus.OK)
    public TransferResponse transfer(@Valid @RequestBody TransferRequest request,
                                     Authentication authentication) {
        return transferService.transfer(authentication.getName(), request);
    }

    @GetMapping("/history")
    @ResponseStatus(HttpStatus.OK)
    public List<TransactionHistoryItem> history(Authentication authentication) {
        return transferService.getRecentTransactions(authentication.getName());
    }
}
