package com.wallet.app.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record TransactionHistoryItem(
    UUID transactionId,
    UUID fromWalletId,
    UUID toWalletId,
    BigDecimal amount,
    String currency,
    String transactionType,
    String status,
    String reference,
    String note,
    OffsetDateTime createdAt,
    OffsetDateTime completedAt
) {
}
