package com.wallet.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactUpsertRequest(
    @NotBlank
    @Size(max = 100)
    String contactName,

    @NotBlank
    @Email
    @Size(max = 255)
    String contactEmail
) {
}