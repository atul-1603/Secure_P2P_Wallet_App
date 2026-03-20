package com.wallet.app.dto;

import java.time.OffsetDateTime;

public record KycStatusResponse(
    String status,
    String documentType,
    String documentUrl,
    OffsetDateTime updatedAt
) {
}
