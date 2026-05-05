package com.projectworkspace.api.dto.task;

import com.projectworkspace.api.entity.TaskStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TaskRequest(
        @NotBlank @Size(max = 160) String title,
        @NotBlank @Size(max = 5000) String description,
        TaskStatus status,
        @NotNull Long assignedToId,
        @NotNull @FutureOrPresent LocalDate dueDate,
        @NotNull Long projectId
) {
}
