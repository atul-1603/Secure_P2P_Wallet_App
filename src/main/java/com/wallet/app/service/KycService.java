package com.wallet.app.service;

import org.springframework.web.multipart.MultipartFile;

import com.wallet.app.dto.KycReviewRequest;
import com.wallet.app.dto.KycStatusResponse;
import com.wallet.app.dto.KycUploadResponse;

public interface KycService {

    KycUploadResponse uploadDocument(String username, String documentType, MultipartFile file);

    KycStatusResponse getStatus(String username);

    KycStatusResponse reviewStatus(String username, KycReviewRequest request);
}
