package com.wallet.app.dto;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TransferRequest(
    @NotNull
    UUID toWalletId,

    @NotNull
    @DecimalMin(value = "0.0001", message = "amount must be greater than zero")
    BigDecimal amount,

    @Size(max = 100)
    String reference,

    @Size(max = 255)
    String note
) {
}
