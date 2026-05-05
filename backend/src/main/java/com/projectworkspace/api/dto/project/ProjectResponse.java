package com.projectworkspace.api.dto.project;

import java.time.Instant;
import java.util.List;

public record ProjectResponse(
        Long id,
        String name,
        String description,
        UserSummary createdBy,
        Instant createdAt,
        List<UserSummary> members
) {
}
