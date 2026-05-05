package com.projectworkspace.api.dto.task;

import com.projectworkspace.api.dto.project.UserSummary;
import com.projectworkspace.api.entity.TaskStatus;

import java.time.LocalDate;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        UserSummary assignedTo,
        LocalDate dueDate,
        Long projectId,
        String projectName
) {
}
