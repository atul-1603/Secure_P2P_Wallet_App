package com.wallet.app.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateSecuritySettingsRequest(
    @NotNull
    Boolean twoFactorEnabled
) {
}
