package com.wallet.app.service;

import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.wallet.app.dto.AuthResponse;
import com.wallet.app.dto.LoginRequest;
import com.wallet.app.dto.LoginResponse;
import com.wallet.app.dto.RegisterRequest;
import com.wallet.app.entity.User;
import com.wallet.app.repository.UserRepository;
import com.wallet.app.security.JwtTokenProvider;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final WalletService walletService;

    public AuthServiceImpl(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtTokenProvider jwtTokenProvider,
        WalletService walletService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.walletService = walletService;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedUsername = request.username().trim();
        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByUsername(normalizedUsername)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "username already exists");
        }
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "email already exists");
        }

        User user = new User();
        user.setUsername(normalizedUsername);
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);
        walletService.createDefaultWalletForUser(savedUser.getId());

        return new AuthResponse(
            "registration successful",
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getStatus()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String identifier = request.usernameOrEmail().trim();

        User user = userRepository.findByUsernameOrEmail(identifier, identifier.toLowerCase(Locale.ROOT))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid credentials");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        return new LoginResponse(
            "login successful",
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getStatus(),
            "Bearer",
            accessToken,
            jwtTokenProvider.getAccessTokenExpirationMs(),
            refreshToken,
            jwtTokenProvider.getRefreshTokenExpirationMs()
        );
    }
}
