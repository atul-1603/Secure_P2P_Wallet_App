package com.wallet.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResendEmailVerificationRequest(
    @NotBlank
    @Email
    @Size(max = 255)
    String email
) {
}
