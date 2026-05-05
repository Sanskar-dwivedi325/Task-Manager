package com.projectworkspace.api.dto.task;

import com.projectworkspace.api.entity.TaskStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TaskUpdateRequest(
        @Size(max = 160) String title,
        @Size(max = 5000) String description,
        TaskStatus status,
        Long assignedToId,
        @FutureOrPresent LocalDate dueDate,
        Long projectId
) {
}
