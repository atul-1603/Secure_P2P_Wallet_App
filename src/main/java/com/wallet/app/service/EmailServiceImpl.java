package com.wallet.app.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final SendGridEmailService sendGridEmailService;

    public EmailServiceImpl(SendGridEmailService sendGridEmailService) {
        this.sendGridEmailService = sendGridEmailService;
    }

    @Override
    public void sendEmailVerificationOtp(String recipientEmail, String otpCode, long expiresInMinutes) {
        sendOtpMessage(
            recipientEmail,
            "Secure P2P Wallet - Verify your email",
            "Email Verification",
            otpCode,
            expiresInMinutes
        );
    }

    @Override
    public void sendLoginOtp(String recipientEmail, String otpCode, long expiresInMinutes) {
        sendOtpMessage(
            recipientEmail,
            "Secure P2P Wallet - Your login verification code",
            "Login Verification",
            otpCode,
            expiresInMinutes
        );
    }

    private void sendOtpMessage(
        String recipientEmail,
        String subject,
        String title,
        String otpCode,
        long expiresInMinutes
    ) {
        String normalizedRecipient = recipientEmail == null ? "" : recipientEmail.trim();
        if (!StringUtils.hasText(normalizedRecipient)) {
            throw new IllegalArgumentException("recipient email is required for otp delivery");
        }

        String body = """
            Hello,

            %s request received for your Secure P2P Wallet account.

            Your one-time password (OTP) is: %s

            This OTP will expire in %d minutes and can be used only once.
            If you did not request this, please ignore this email and secure your account.

            Regards,
            Secure P2P Wallet Security Team
            """.formatted(title, otpCode, expiresInMinutes);

        LOGGER.info("Sending OTP mail '{}' to {}", title, normalizedRecipient);
        LOGGER.info("DEVELOPMENT MODE OTP INTERCEPT - User: {}, OTP: {}", normalizedRecipient, otpCode);
        sendGridEmailService.sendEmail(normalizedRecipient, subject, body);
        LOGGER.info("OTP mail '{}' sent to {}", title, normalizedRecipient);
    }
}
