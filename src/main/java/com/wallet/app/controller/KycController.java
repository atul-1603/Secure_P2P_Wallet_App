package com.wallet.app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.wallet.app.dto.KycReviewRequest;
import com.wallet.app.dto.KycStatusResponse;
import com.wallet.app.dto.KycUploadResponse;
import com.wallet.app.service.KycService;

import jakarta.validation.Valid;

@RestController
@RequestMapping({"/api/kyc", "/kyc"})
public class KycController {

    private final KycService kycService;

    public KycController(KycService kycService) {
        this.kycService = kycService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public KycUploadResponse uploadDocument(@RequestParam("documentType") String documentType,
                                            @RequestPart("file") MultipartFile file,
                                            Authentication authentication) {
        return kycService.uploadDocument(authentication.getName(), documentType, file);
    }

    @GetMapping("/status")
    @ResponseStatus(HttpStatus.OK)
    public KycStatusResponse getStatus(Authentication authentication) {
        return kycService.getStatus(authentication.getName());
    }

    @PostMapping("/review")
    @ResponseStatus(HttpStatus.OK)
    public KycStatusResponse reviewKycStatus(@Valid @RequestBody KycReviewRequest request,
                                             Authentication authentication) {
        return kycService.reviewStatus(authentication.getName(), request);
    }
}
