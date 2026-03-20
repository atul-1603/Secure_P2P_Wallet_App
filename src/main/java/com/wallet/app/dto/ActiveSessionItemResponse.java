package com.wallet.app.dto;

import java.time.OffsetDateTime;

public record ActiveSessionItemResponse(
    String sessionId,
    String userAgent,
    String ipAddress,
    OffsetDateTime lastActiveAt,
    boolean current
) {
}
