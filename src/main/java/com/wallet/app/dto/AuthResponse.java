package com.wallet.app.dto;

import java.util.UUID;

public record AuthResponse(
    String message,
    UUID userId,
    String username,
    String email,
    String status
) {
}
