package com.wallet.app.dto;

import java.time.OffsetDateTime;

public record KycUploadResponse(
    String status,
    String documentType,
    String documentUrl,
    OffsetDateTime updatedAt,
    String message
) {
}
