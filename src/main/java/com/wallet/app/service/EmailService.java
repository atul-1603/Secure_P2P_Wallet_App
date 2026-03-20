package com.wallet.app.service;

public interface EmailService {

    void sendEmailVerificationOtp(String recipientEmail, String otpCode, long expiresInMinutes);

    void sendLoginOtp(String recipientEmail, String otpCode, long expiresInMinutes);
}
