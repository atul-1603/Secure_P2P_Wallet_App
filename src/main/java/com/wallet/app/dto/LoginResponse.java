package com.wallet.app.dto;

import java.util.UUID;

public record LoginResponse(
    String message,
    UUID userId,
    String username,
    String email,
    String status,
    String tokenType,
    String accessToken,
    long accessTokenExpiresInMs,
    String refreshToken,
    long refreshTokenExpiresInMs
) {
}
