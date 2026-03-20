package com.wallet.app.controller;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.wallet.app.dto.ActiveSessionItemResponse;
import com.wallet.app.dto.ChangePasswordRequest;
import com.wallet.app.dto.MessageResponse;
import com.wallet.app.dto.SecuritySettingsResponse;
import com.wallet.app.dto.UpdateProfileRequest;
import com.wallet.app.dto.UpdateSecuritySettingsRequest;
import com.wallet.app.dto.UserProfileResponse;
import com.wallet.app.service.ProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public UserProfileResponse getMyProfile(Authentication authentication) {
        return profileService.getMyProfile(authentication.getName());
    }

    @PutMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public UserProfileResponse updateMyProfile(@Valid @RequestBody UpdateProfileRequest request,
                                               Authentication authentication) {
        return profileService.updateMyProfile(authentication.getName(), request);
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public UserProfileResponse uploadAvatar(@RequestPart("file") MultipartFile file,
                                            Authentication authentication) {
        return profileService.uploadAvatar(authentication.getName(), file);
    }

    @PostMapping("/change-password")
    @ResponseStatus(HttpStatus.OK)
    public MessageResponse changePassword(@Valid @RequestBody ChangePasswordRequest request,
                                          Authentication authentication) {
        return profileService.changePassword(authentication.getName(), request);
    }

    @PatchMapping("/security")
    @ResponseStatus(HttpStatus.OK)
    public SecuritySettingsResponse updateSecurity(@Valid @RequestBody UpdateSecuritySettingsRequest request,
                                                   Authentication authentication) {
        return profileService.updateSecuritySettings(authentication.getName(), request);
    }

    @GetMapping("/sessions")
    @ResponseStatus(HttpStatus.OK)
    public List<ActiveSessionItemResponse> getActiveSessions(Authentication authentication,
                                                              HttpServletRequest request) {
        return profileService.getActiveSessions(authentication.getName(), request);
    }
}
