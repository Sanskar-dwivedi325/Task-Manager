package com.projectworkspace.api.service;

import com.projectworkspace.api.dto.project.ProjectResponse;
import com.projectworkspace.api.dto.project.UserSummary;
import com.projectworkspace.api.dto.task.TaskResponse;
import com.projectworkspace.api.entity.Project;
import com.projectworkspace.api.entity.Task;
import com.projectworkspace.api.entity.User;
import org.springframework.stereotype.Component;

import java.util.Comparator;

@Component
public class MapperService {

    public UserSummary toUserSummary(User user) {
        return new UserSummary(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public ProjectResponse toProjectResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                toUserSummary(project.getCreatedBy()),
                project.getCreatedAt(),
                project.getMembers().stream()
                        .sorted(Comparator.comparing(User::getName))
                        .map(this::toUserSummary)
                        .toList()
        );
    }

    public TaskResponse toTaskResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                toUserSummary(task.getAssignedTo()),
                task.getDueDate(),
                task.getProject().getId(),
                task.getProject().getName()
        );
    }
}
