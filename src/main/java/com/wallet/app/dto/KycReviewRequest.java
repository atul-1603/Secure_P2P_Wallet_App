package com.wallet.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record KycReviewRequest(
    @NotBlank
    @Pattern(regexp = "^(?i)(VERIFIED|REJECTED|PENDING)$", message = "status must be VERIFIED, REJECTED, or PENDING")
    String status
) {
}
