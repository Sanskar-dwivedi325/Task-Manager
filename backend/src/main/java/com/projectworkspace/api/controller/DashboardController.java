package com.projectworkspace.api.controller;

import com.projectworkspace.api.dto.dashboard.DashboardResponse;
import com.projectworkspace.api.entity.User;
import com.projectworkspace.api.service.DashboardService;
import com.projectworkspace.api.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserService userService;

    public DashboardController(DashboardService dashboardService, UserService userService) {
        this.dashboardService = dashboardService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> get(Authentication authentication) {
        User currentUser = userService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(dashboardService.getDashboard(currentUser));
    }
}
