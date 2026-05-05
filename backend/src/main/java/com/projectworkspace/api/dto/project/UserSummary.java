package com.projectworkspace.api.dto.project;

import com.projectworkspace.api.entity.Role;

public record UserSummary(
        Long id,
        String name,
        String email,
        Role role
) {
}
