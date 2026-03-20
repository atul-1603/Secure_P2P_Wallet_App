package com.wallet.app.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record CreatePaymentOrderRequest(
    @NotNull
    @DecimalMin(value = "0.01", message = "amount must be greater than zero")
    BigDecimal amount
) {
}
