package com.wallet.app.service;

import com.wallet.app.dto.AuthResponse;
import com.wallet.app.dto.LoginRequest;
import com.wallet.app.dto.LoginResponse;
import com.wallet.app.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
