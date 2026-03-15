package com.wallet.app.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import com.wallet.app.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtTokenProvider {

    private static final String CLAIM_TYPE = "type";
    private static final String CLAIM_USER_ID = "userId";

    private final String jwtSecret;
    private final long accessTokenExpirationMs;
    private final long refreshTokenExpirationMs;

    private SecretKey key;

    public JwtTokenProvider(
        @Value("${security.jwt.secret}") String jwtSecret,
        @Value("${security.jwt.access-token-expiration-ms}") long accessTokenExpirationMs,
        @Value("${security.jwt.refresh-token-expiration-ms}") long refreshTokenExpirationMs
    ) {
        this.jwtSecret = jwtSecret;
        this.accessTokenExpirationMs = accessTokenExpirationMs;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

    @PostConstruct
    void init() {
        if (jwtSecret == null || jwtSecret.length() < 32) {
            throw new IllegalStateException("JWT secret must be at least 32 characters");
        }
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user) {
        return generateToken(user, accessTokenExpirationMs, "access");
    }

    public String generateRefreshToken(User user) {
        return generateToken(user, refreshTokenExpirationMs, "refresh");
    }

    public long getAccessTokenExpirationMs() {
        return accessTokenExpirationMs;
    }

    public long getRefreshTokenExpirationMs() {
        return refreshTokenExpirationMs;
    }

    public boolean validateAccessToken(String token) {
        return validateTokenType(token, "access");
    }

    public boolean validateRefreshToken(String token) {
        return validateTokenType(token, "refresh");
    }

    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);
        String username = claims.getSubject();
        return new UsernamePasswordAuthenticationToken(
            username,
            null,
            List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    public UUID getUserId(String token) {
        Claims claims = parseClaims(token);
        return UUID.fromString(claims.get(CLAIM_USER_ID, String.class));
    }

    private String generateToken(User user, long expirationMs, String tokenType) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(expirationMs);

        return Jwts.builder()
            .subject(user.getUsername())
            .claim(CLAIM_USER_ID, user.getId().toString())
            .claim(CLAIM_TYPE, tokenType)
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiry))
            .signWith(key)
            .compact();
    }

    private boolean validateTokenType(String token, String expectedType) {
        try {
            Claims claims = parseClaims(token);
            String type = claims.get(CLAIM_TYPE, String.class);
            return expectedType.equals(type);
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
