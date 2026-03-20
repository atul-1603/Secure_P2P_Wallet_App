package com.wallet.app.dto;

import java.time.OffsetDateTime;

public record FileUploadResponse(
    String fileName,
    String fileUrl,
    String contentType,
    long size,
    OffsetDateTime uploadedAt
) {
}
