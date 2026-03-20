package com.wallet.app.dto;

public record ProfilePreferencesResponse(
    boolean emailAlerts,
    boolean transferAlerts
) {
}
