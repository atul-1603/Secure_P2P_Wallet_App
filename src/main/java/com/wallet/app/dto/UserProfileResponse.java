package com.wallet.app.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record UserProfileResponse(
    UUID userId,
    String username,
    String fullName,
    String email,
    boolean emailVerified,
    String profileImageUrl,
    String accountStatus,
    boolean accountRestricted,
    String kycStatus,
    String kycDocumentType,
    String kycDocumentUrl,
    boolean twoFactorEnabled,
    OffsetDateTime createdAt,
    ProfilePreferencesResponse preferences
) {
}
