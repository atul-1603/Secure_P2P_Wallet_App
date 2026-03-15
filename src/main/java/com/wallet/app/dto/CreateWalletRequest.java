package com.wallet.app.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateWalletRequest(
    @Size(min = 3, max = 3)
    @Pattern(regexp = "^[A-Za-z]{3}$", message = "currency must be a 3-letter code")
    String currency
) {
}
