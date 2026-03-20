package com.wallet.app.dto;

import java.math.BigDecimal;

public record VerifyPaymentResponse(
    String status,
    String message,
    BigDecimal updatedBalance
) {
}
