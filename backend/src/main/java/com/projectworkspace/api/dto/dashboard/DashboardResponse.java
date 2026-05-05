package com.projectworkspace.api.dto.dashboard;

public record DashboardResponse(
        long totalTasks,
        long completedTasks,
        long pendingTasks,
        long overdueTasks
) {
}
