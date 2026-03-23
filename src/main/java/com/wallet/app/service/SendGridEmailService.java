package com.wallet.app.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class SendGridEmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SendGridEmailService.class);
    private static final String SENDGRID_ENDPOINT = "https://api.sendgrid.com/v3/mail/send";

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String fromEmail;

    public SendGridEmailService(
        @Value("${SENDGRID_API_KEY}") String apiKey,
        @Value("${SENDGRID_FROM_EMAIL:${mail.from:no-reply@wallet.local}}") String fromEmail
    ) {
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
        this.objectMapper = new ObjectMapper();
        this.apiKey = apiKey;
        this.fromEmail = fromEmail;
    }

    @Async
    public void sendEmail(String to, String subject, String body) {
        String normalizedTo = to == null ? "" : to.trim();
        if (!StringUtils.hasText(normalizedTo)) {
            LOGGER.warn("Skipping email send because recipient is empty");
            return;
        }
        if (!StringUtils.hasText(apiKey)) {
            LOGGER.error("SENDGRID_API_KEY is not configured; email to {} was not sent", normalizedTo);
            return;
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SENDGRID_ENDPOINT))
                .timeout(Duration.ofSeconds(15))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(buildPayload(normalizedTo, subject, body)))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            int statusCode = response.statusCode();
            if (statusCode < 200 || statusCode >= 300) {
                LOGGER.error("SendGrid delivery failed for {} with status {} and body {}", normalizedTo, statusCode,
                    response.body());
                return;
            }

            LOGGER.info("SendGrid delivery queued for {} with status {}", normalizedTo, statusCode);
        } catch (IOException | InterruptedException ex) {
            if (ex instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            LOGGER.error("SendGrid email send failed for {}", normalizedTo, ex);
        }
    }

    private String buildPayload(String to, String subject, String body) throws IOException {
        ObjectNode root = objectMapper.createObjectNode();
        ObjectNode fromNode = root.putObject("from");
        fromNode.put("email", fromEmail);

        ArrayNode personalizations = root.putArray("personalizations");
        ObjectNode personalization = personalizations.addObject();
        ArrayNode toArray = personalization.putArray("to");
        ObjectNode toNode = toArray.addObject();
        toNode.put("email", to);

        root.put("subject", subject);

        ArrayNode content = root.putArray("content");
        ObjectNode contentNode = content.addObject();
        contentNode.put("type", "text/plain");
        contentNode.put("value", body);

        return objectMapper.writeValueAsString(root);
    }
}
