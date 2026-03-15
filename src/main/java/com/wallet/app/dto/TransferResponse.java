package com.wallet.app.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record TransferResponse(
    UUID transactionId,
    UUID fromWalletId,
    UUID toWalletId,
    BigDecimal amount,
    String currency,
    String status,
    String reference,
    BigDecimal senderBalance,
    BigDecimal receiverBalance,
    OffsetDateTime completedAt
) {
}
