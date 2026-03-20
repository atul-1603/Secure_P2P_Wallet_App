package com.wallet.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record VerifyOtpRequest(
    @NotBlank
    @Size(max = 255)
    String usernameOrEmail,

    @NotBlank
    @Pattern(regexp = "^\\d{6}$", message = "otp must be a 6-digit code")
    String otpCode
) {
}
