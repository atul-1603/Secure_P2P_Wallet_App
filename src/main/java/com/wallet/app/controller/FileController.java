package com.wallet.app.controller;

import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.wallet.app.dto.FileUploadResponse;
import com.wallet.app.service.FileStorageService;

@RestController
@RequestMapping({"/api/files", "/files"})
public class FileController {

    private static final long MAX_FILE_SIZE = 25 * 1024 * 1024;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
        "text/plain",
        "application/octet-stream"
    );

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public FileUploadResponse uploadFile(@RequestPart("file") MultipartFile file,
                                         @RequestParam(value = "category", required = false) String category) {
        FileStorageService.StoredFile storedFile = fileStorageService.store(
            file,
            category,
            ALLOWED_CONTENT_TYPES,
            MAX_FILE_SIZE
        );

        return new FileUploadResponse(
            storedFile.fileName(),
            storedFile.fileUrl(),
            storedFile.contentType(),
            storedFile.size(),
            storedFile.uploadedAt()
        );
    }
}
