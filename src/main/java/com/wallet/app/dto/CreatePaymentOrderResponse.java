package com.wallet.app.dto;

import java.math.BigDecimal;

public record CreatePaymentOrderResponse(
    String orderId,
    BigDecimal amount,
    String currency,
    String key
) {
}
