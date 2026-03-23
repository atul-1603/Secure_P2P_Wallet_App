package com.wallet.app.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;
    private final String configuredFromAddress;
    private final String smtpUsername;

    public EmailServiceImpl(
        JavaMailSender mailSender,
        @Value("${mail.from:}") String configuredFromAddress,
        @Value("${spring.mail.username:${SMTP_USERNAME:}}") String smtpUsername
    ) {
        this.mailSender = mailSender;
        this.configuredFromAddress = configuredFromAddress;
        this.smtpUsername = smtpUsername;
    }

    @Override
    @Async
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
    @Async
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

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(resolveFromAddress());
        message.setTo(normalizedRecipient);
        message.setSubject(subject);
        message.setText(body);

        LOGGER.info("Sending OTP mail '{}' to {}", title, normalizedRecipient);
        mailSender.send(message);
        LOGGER.info("OTP mail '{}' sent to {}", title, normalizedRecipient);
    }

    private String resolveFromAddress() {
        String normalizedConfiguredFrom = configuredFromAddress == null ? "" : configuredFromAddress.trim();
        String normalizedSmtpUsername = smtpUsername == null ? "" : smtpUsername.trim();

        if (!StringUtils.hasText(normalizedConfiguredFrom)) {
            if (!StringUtils.hasText(normalizedSmtpUsername)) {
                return "no-reply@wallet.local";
            }
            return normalizedSmtpUsername;
        }

        if (isGmailSmtpUser(normalizedSmtpUsername)
            && StringUtils.hasText(normalizedSmtpUsername)
            && !normalizedConfiguredFrom.equalsIgnoreCase(normalizedSmtpUsername)) {
            LOGGER.warn(
                "Configured MAIL_FROM '{}' differs from Gmail SMTP user '{}'; using SMTP user as sender for reliable delivery",
                normalizedConfiguredFrom,
                normalizedSmtpUsername
            );
            return normalizedSmtpUsername;
        }

        return normalizedConfiguredFrom;
    }

    private boolean isGmailSmtpUser(String username) {
        return StringUtils.hasText(username) && username.toLowerCase().endsWith("@gmail.com");
    }
}
