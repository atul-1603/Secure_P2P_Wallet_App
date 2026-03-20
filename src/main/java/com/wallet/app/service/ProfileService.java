package com.wallet.app.service;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

import com.wallet.app.dto.ActiveSessionItemResponse;
import com.wallet.app.dto.ChangePasswordRequest;
import com.wallet.app.dto.MessageResponse;
import com.wallet.app.dto.SecuritySettingsResponse;
import com.wallet.app.dto.UpdateProfileRequest;
import com.wallet.app.dto.UpdateSecuritySettingsRequest;
import com.wallet.app.dto.UserProfileResponse;

public interface ProfileService {

    UserProfileResponse getMyProfile(String username);

    UserProfileResponse updateMyProfile(String username, UpdateProfileRequest request);

    UserProfileResponse uploadAvatar(String username, MultipartFile file);

    MessageResponse changePassword(String username, ChangePasswordRequest request);

    SecuritySettingsResponse updateSecuritySettings(String username, UpdateSecuritySettingsRequest request);

    List<ActiveSessionItemResponse> getActiveSessions(String username, HttpServletRequest request);
}
