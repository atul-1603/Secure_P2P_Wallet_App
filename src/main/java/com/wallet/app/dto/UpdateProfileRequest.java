package com.wallet.app.dto;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
    @Size(max = 100, message = "full name cannot exceed 100 characters")
    String fullName,
    Boolean emailAlerts,
    Boolean transferAlerts
) {
}
