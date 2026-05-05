package com.projectworkspace.api.dto.auth;

import com.projectworkspace.api.entity.Role;

public record AuthResponse(
        String token,
        Long id,
        String name,
        String email,
        Role role
) {
}
