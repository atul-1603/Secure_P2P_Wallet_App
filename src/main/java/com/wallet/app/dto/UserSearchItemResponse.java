package com.wallet.app.dto;

import java.util.UUID;

public record UserSearchItemResponse(
    UUID userId,
    String fullName,
    String email,
    String profileImageUrl
) {
}