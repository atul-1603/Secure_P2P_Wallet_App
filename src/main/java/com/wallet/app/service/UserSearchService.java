package com.wallet.app.service;

import java.util.List;

import com.wallet.app.dto.UserSearchItemResponse;

public interface UserSearchService {

    List<UserSearchItemResponse> searchUsers(String username, String query);
}