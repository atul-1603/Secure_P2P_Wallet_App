package com.wallet.app.service;

import java.util.Locale;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.wallet.app.dto.KycReviewRequest;
import com.wallet.app.dto.KycStatusResponse;
import com.wallet.app.dto.KycUploadResponse;
import com.wallet.app.entity.User;
import com.wallet.app.repository.UserRepository;

@Service
public class KycServiceImpl implements KycService {

    private static final long KYC_MAX_FILE_SIZE = 25 * 1024 * 1024;
    private static final Set<String> ALLOWED_KYC_CONTENT_TYPES = Set.of(
        "image/jpeg",
        "image/png",
        "application/pdf"
    );
    private static final Set<String> ALLOWED_DOCUMENT_TYPES = Set.of(
        "AADHAAR",
        "PAN",
        "PASSPORT",
        "DRIVING_LICENSE"
    );

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public KycServiceImpl(UserRepository userRepository, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional
    public KycUploadResponse uploadDocument(String username, String documentType, MultipartFile file) {
        User user = getUserByUsername(username);
        String normalizedDocumentType = normalizeDocumentType(documentType);

        FileStorageService.StoredFile storedFile = fileStorageService.store(
            file,
            "kyc",
            ALLOWED_KYC_CONTENT_TYPES,
            KYC_MAX_FILE_SIZE
        );

        user.setKycStatus("PENDING");
        user.setKycDocumentType(normalizedDocumentType);
        user.setKycDocumentUrl(storedFile.fileUrl());

        User savedUser = userRepository.save(user);

        return new KycUploadResponse(
            savedUser.getKycStatus(),
            savedUser.getKycDocumentType(),
            savedUser.getKycDocumentUrl(),
            savedUser.getUpdatedAt(),
            "kyc document uploaded successfully. status is now pending verification"
        );
    }

    @Override
    @Transactional(readOnly = true)
    public KycStatusResponse getStatus(String username) {
        User user = getUserByUsername(username);

        return new KycStatusResponse(
            user.getKycStatus(),
            user.getKycDocumentType(),
            user.getKycDocumentUrl(),
            user.getUpdatedAt()
        );
    }

    @Override
    @Transactional
    public KycStatusResponse reviewStatus(String username, KycReviewRequest request) {
        User user = getUserByUsername(username);

        String normalizedStatus = request.status().trim().toUpperCase(Locale.ROOT);
        user.setKycStatus(normalizedStatus);

        User savedUser = userRepository.save(user);

        return new KycStatusResponse(
            savedUser.getKycStatus(),
            savedUser.getKycDocumentType(),
            savedUser.getKycDocumentUrl(),
            savedUser.getUpdatedAt()
        );
    }

    private String normalizeDocumentType(String documentType) {
        if (documentType == null || documentType.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "document type is required");
        }

        String normalized = documentType
            .trim()
            .replace('-', '_')
            .replace(' ', '_')
            .toUpperCase(Locale.ROOT);

        if (!ALLOWED_DOCUMENT_TYPES.contains(normalized)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "document type must be one of AADHAAR, PAN, PASSPORT, DRIVING_LICENSE"
            );
        }

        return normalized;
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "user not found"));
    }
}
