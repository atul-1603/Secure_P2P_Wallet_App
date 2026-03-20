package com.wallet.app.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ContactResponse(
    UUID id,
    String contactName,
    String contactEmail,
    OffsetDateTime createdAt
) {
}