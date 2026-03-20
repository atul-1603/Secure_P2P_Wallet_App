package com.wallet.app.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.wallet.app.dto.UserSearchItemResponse;
import com.wallet.app.entity.User;
import com.wallet.app.repository.UserRepository;

@Service
public class UserSearchServiceImpl implements UserSearchService {

    private static final int SEARCH_LIMIT = 15;

    private final UserRepository userRepository;

    public UserSearchServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSearchItemResponse> searchUsers(String username, String query) {
        User currentUser = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "user not found"));

        if (query == null || query.isBlank()) {
            return List.of();
        }

        List<User> results = userRepository.searchActiveUsers(query.trim(), PageRequest.of(0, SEARCH_LIMIT));

        return results.stream()
            .filter(user -> !user.getId().equals(currentUser.getId()))
            .map(user -> new UserSearchItemResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getProfileImageUrl()
            ))
            .toList();
    }
}