package com.wallet.app.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.wallet.app.dto.UserSearchItemResponse;
import com.wallet.app.service.UserSearchService;

@RestController
@RequestMapping({"/api/users", "/users"})
public class UserSearchController {

    private final UserSearchService userSearchService;

    public UserSearchController(UserSearchService userSearchService) {
        this.userSearchService = userSearchService;
    }

    @GetMapping("/search")
    @ResponseStatus(HttpStatus.OK)
    public List<UserSearchItemResponse> searchUsers(@RequestParam("query") String query,
                                                    Authentication authentication) {
        return userSearchService.searchUsers(authentication.getName(), query);
    }
}