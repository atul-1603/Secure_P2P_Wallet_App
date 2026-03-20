package com.wallet.app.dto;

import java.util.UUID;

public record LoginResponse(
    String message,
    UUID userId,
    String username,
    String email,
    String status,
    boolean otpRequired,
    long otpExpiresInSeconds,
    String tokenType,
    String accessToken,
    long accessTokenExpiresInMs,
    String refreshToken,
    long refreshTokenExpiresInMs
) {
}
