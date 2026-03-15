package com.wallet.app.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record WalletResponse(
    UUID walletId,
    UUID userId,
    BigDecimal balance,
    String currency,
    String status,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
}
