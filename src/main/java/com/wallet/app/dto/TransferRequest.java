package com.wallet.app.dto;

import java.math.BigDecimal;
import java.util.Locale;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record TransferRequest(
    @JsonAlias({"receiverWalletId", "toWalletId"})
    UUID receiverWalletId,

    @Email(message = "receiverEmail must be a valid email")
    @Size(max = 255)
    String receiverEmail,

    @DecimalMin(value = "0.0001", message = "amount must be greater than zero")
    BigDecimal amount,

    @Size(max = 100)
    String reference,

    @Size(max = 255)
    String note
) {
    public UUID toWalletId() {
        return receiverWalletId;
    }

    public String normalizedReceiverEmail() {
        if (receiverEmail == null || receiverEmail.isBlank()) {
            return null;
        }
        return receiverEmail.trim().toLowerCase(Locale.ROOT);
    }

    @AssertTrue(message = "either receiverWalletId or receiverEmail is required")
    public boolean hasRecipient() {
        return receiverWalletId != null || normalizedReceiverEmail() != null;
    }
}
