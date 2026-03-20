package com.wallet.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VerifyPaymentRequest(
    @NotBlank
    @Size(max = 100)
    String orderId,

    @NotBlank
    @Size(max = 100)
    String paymentId,

    @NotBlank
    @Size(max = 255)
    String signature
) {
}
