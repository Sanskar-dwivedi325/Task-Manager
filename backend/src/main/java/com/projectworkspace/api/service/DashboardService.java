package com.projectworkspace.api.service;

import com.projectworkspace.api.dto.dashboard.DashboardResponse;
import com.projectworkspace.api.entity.Role;
import com.projectworkspace.api.entity.TaskStatus;
import com.projectworkspace.api.entity.User;
import com.projectworkspace.api.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class DashboardService {

    private final TaskRepository taskRepository;

    public DashboardService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public DashboardResponse getDashboard(User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            long total = taskRepository.count();
            long completed = taskRepository.countByStatus(TaskStatus.DONE);
            return new DashboardResponse(
                    total,
                    completed,
                    total - completed,
                    taskRepository.countByDueDateBeforeAndStatusNot(LocalDate.now(), TaskStatus.DONE)
            );
        }

        long total = taskRepository.countByAssignedToId(currentUser.getId());
        long completed = taskRepository.countByAssignedToIdAndStatus(currentUser.getId(), TaskStatus.DONE);
        return new DashboardResponse(
                total,
                completed,
                total - completed,
                taskRepository.countByAssignedToIdAndDueDateBeforeAndStatusNot(currentUser.getId(), LocalDate.now(), TaskStatus.DONE)
        );
    }
}
