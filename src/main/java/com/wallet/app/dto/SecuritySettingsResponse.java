package com.wallet.app.dto;

public record SecuritySettingsResponse(
    boolean twoFactorEnabled,
    boolean emailVerified,
    String accountStatus
) {
}
