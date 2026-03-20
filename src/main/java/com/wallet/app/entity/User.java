package com.wallet.app.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, updatable = false)
    private UUID id;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Size(max = 100)
    @Column(name = "full_name", length = 100)
    private String fullName;

    @NotBlank
    @Size(min = 60, max = 255)
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @NotBlank
    @Email
    @Size(max = 255)
    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "two_factor_enabled", nullable = false)
    private boolean twoFactorEnabled = true;

    @Column(name = "preference_email_alerts", nullable = false)
    private boolean preferenceEmailAlerts = true;

    @Column(name = "preference_transfer_alerts", nullable = false)
    private boolean preferenceTransferAlerts = true;

    @Size(max = 255)
    @Column(name = "profile_image_url", length = 255)
    private String profileImageUrl;

    @NotBlank
    @Size(max = 20)
    @Column(name = "kyc_status", nullable = false, length = 20)
    private String kycStatus = "PENDING";

    @Size(max = 20)
    @Column(name = "kyc_document_type", length = 20)
    private String kycDocumentType;

    @Size(max = 255)
    @Column(name = "kyc_document_url", length = 255)
    private String kycDocumentUrl;

    @Column(name = "last_password_changed_at")
    private OffsetDateTime lastPasswordChangedAt;

    @Column(name = "otp_code", length = 16)
    private String otpCode;

    @Column(name = "otp_expiry")
    private OffsetDateTime otpExpiry;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public User() {
    }

    @PrePersist
    void ensureDefaults() {
        if (status == null || status.isBlank()) {
            status = "ACTIVE";
        }
        if (fullName == null || fullName.isBlank()) {
            fullName = username;
        }
        if (kycStatus == null || kycStatus.isBlank()) {
            kycStatus = "PENDING";
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public boolean isTwoFactorEnabled() {
        return twoFactorEnabled;
    }

    public void setTwoFactorEnabled(boolean twoFactorEnabled) {
        this.twoFactorEnabled = twoFactorEnabled;
    }

    public boolean isPreferenceEmailAlerts() {
        return preferenceEmailAlerts;
    }

    public void setPreferenceEmailAlerts(boolean preferenceEmailAlerts) {
        this.preferenceEmailAlerts = preferenceEmailAlerts;
    }

    public boolean isPreferenceTransferAlerts() {
        return preferenceTransferAlerts;
    }

    public void setPreferenceTransferAlerts(boolean preferenceTransferAlerts) {
        this.preferenceTransferAlerts = preferenceTransferAlerts;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getKycStatus() {
        return kycStatus;
    }

    public void setKycStatus(String kycStatus) {
        this.kycStatus = kycStatus;
    }

    public String getKycDocumentType() {
        return kycDocumentType;
    }

    public void setKycDocumentType(String kycDocumentType) {
        this.kycDocumentType = kycDocumentType;
    }

    public String getKycDocumentUrl() {
        return kycDocumentUrl;
    }

    public void setKycDocumentUrl(String kycDocumentUrl) {
        this.kycDocumentUrl = kycDocumentUrl;
    }

    public OffsetDateTime getLastPasswordChangedAt() {
        return lastPasswordChangedAt;
    }

    public void setLastPasswordChangedAt(OffsetDateTime lastPasswordChangedAt) {
        this.lastPasswordChangedAt = lastPasswordChangedAt;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public OffsetDateTime getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(OffsetDateTime otpExpiry) {
        this.otpExpiry = otpExpiry;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
