package com.wallet.app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.wallet.app.dto.AuthResponse;
import com.wallet.app.dto.LoginRequest;
import com.wallet.app.dto.LoginResponse;
import com.wallet.app.dto.MessageResponse;
import com.wallet.app.dto.ResendEmailVerificationRequest;
import com.wallet.app.dto.RegisterRequest;
import com.wallet.app.dto.VerifyEmailRequest;
import com.wallet.app.dto.VerifyOtpRequest;
import com.wallet.app.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping({"/register", "/signup"})
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/verify-email")
    @ResponseStatus(HttpStatus.OK)
    public AuthResponse verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        return authService.verifyEmail(request);
    }

    @PostMapping("/resend-verification-otp")
    @ResponseStatus(HttpStatus.OK)
    public MessageResponse resendVerificationOtp(@Valid @RequestBody ResendEmailVerificationRequest request) {
        return authService.resendEmailVerificationOtp(request);
    }

    @PostMapping({"/login", "/signin"})
    @ResponseStatus(HttpStatus.OK)
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/verify-otp")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponse verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return authService.verifyLoginOtp(request);
    }
}
