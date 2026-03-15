package com.wallet.app.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record DepositResponse(
    UUID transactionId,
    UUID walletId,
    BigDecimal amount,
    String currency,
    String status,
    String reference,
    BigDecimal updatedBalance,
    OffsetDateTime completedAt
) {
}
