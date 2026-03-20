package com.wallet.app.service;

import com.wallet.app.dto.AuthResponse;
import com.wallet.app.dto.LoginRequest;
import com.wallet.app.dto.LoginResponse;
import com.wallet.app.dto.MessageResponse;
import com.wallet.app.dto.ResendEmailVerificationRequest;
import com.wallet.app.dto.RegisterRequest;
import com.wallet.app.dto.VerifyEmailRequest;
import com.wallet.app.dto.VerifyOtpRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse verifyEmail(VerifyEmailRequest request);

    MessageResponse resendEmailVerificationOtp(ResendEmailVerificationRequest request);

    LoginResponse login(LoginRequest request);

    LoginResponse verifyLoginOtp(VerifyOtpRequest request);
}
