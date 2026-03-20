package com.wallet.app.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FileStorageService {

    private static final long DEFAULT_MAX_FILE_SIZE = 25 * 1024 * 1024;

    private final Path uploadRootDirectory;

    public FileStorageService(@Value("${app.upload-dir:uploads}") String uploadDir) {
        try {
            this.uploadRootDirectory = Path.of(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(this.uploadRootDirectory);
        } catch (IOException exception) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "unable to initialize upload directory",
                exception
            );
        }
    }

    public StoredFile store(
        MultipartFile file,
        String category,
        Set<String> allowedContentTypes,
        long maxFileSizeBytes
    ) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "file is required");
        }

        long maxSize = maxFileSizeBytes > 0 ? maxFileSizeBytes : DEFAULT_MAX_FILE_SIZE;
        if (file.getSize() > maxSize) {
            double maxSizeMb = maxSize / (1024d * 1024d);
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                String.format(Locale.ROOT, "file size exceeds %.0fMB limit", maxSizeMb)
            );
        }

        String contentType = normalizeContentType(file.getContentType());
        if (!allowedContentTypes.isEmpty() && !allowedContentTypes.contains(contentType)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "unsupported file type");
        }

        String normalizedCategory = normalizeCategory(category);
        String extension = extractSafeExtension(file.getOriginalFilename());
        String generatedName = UUID.randomUUID().toString().replace("-", "") + extension;

        try {
            Path categoryDirectory = uploadRootDirectory.resolve(normalizedCategory).normalize();
            Files.createDirectories(categoryDirectory);

            Path targetPath = categoryDirectory.resolve(generatedName).normalize();
            if (!targetPath.startsWith(categoryDirectory)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid file path");
            }

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            return new StoredFile(
                generatedName,
                "/uploads/" + normalizedCategory + "/" + generatedName,
                contentType,
                file.getSize(),
                OffsetDateTime.now()
            );
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "unable to store file", exception);
        }
    }

    private String normalizeCategory(String category) {
        if (category == null || category.isBlank()) {
            return "misc";
        }

        String normalized = category.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9_-]", "");
        return normalized.isBlank() ? "misc" : normalized;
    }

    private String normalizeContentType(String contentType) {
        if (contentType == null || contentType.isBlank()) {
            return "application/octet-stream";
        }
        return contentType.toLowerCase(Locale.ROOT);
    }

    private String extractSafeExtension(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            return "";
        }

        String normalized = originalFilename.trim();
        int dotIndex = normalized.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex >= normalized.length() - 1) {
            return "";
        }

        String extension = normalized.substring(dotIndex + 1)
            .toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9]", "");

        if (extension.isBlank()) {
            return "";
        }

        return "." + extension;
    }

    public record StoredFile(
        String fileName,
        String fileUrl,
        String contentType,
        long size,
        OffsetDateTime uploadedAt
    ) {
    }
}
