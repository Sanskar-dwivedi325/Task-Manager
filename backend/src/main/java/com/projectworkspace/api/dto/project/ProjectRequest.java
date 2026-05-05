package com.projectworkspace.api.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record ProjectRequest(
        @NotBlank @Size(max = 140) String name,
        @NotBlank @Size(max = 5000) String description,
        Set<Long> memberIds
) {
}
