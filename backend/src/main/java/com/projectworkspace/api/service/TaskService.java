package com.projectworkspace.api.service;

import com.projectworkspace.api.dto.task.TaskRequest;
import com.projectworkspace.api.dto.task.TaskResponse;
import com.projectworkspace.api.dto.task.TaskUpdateRequest;
import com.projectworkspace.api.entity.Project;
import com.projectworkspace.api.entity.Role;
import com.projectworkspace.api.entity.Task;
import com.projectworkspace.api.entity.TaskStatus;
import com.projectworkspace.api.entity.User;
import com.projectworkspace.api.exception.BadRequestException;
import com.projectworkspace.api.exception.ForbiddenException;
import com.projectworkspace.api.exception.ResourceNotFoundException;
import com.projectworkspace.api.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final UserService userService;
    private final MapperService mapperService;

    public TaskService(
            TaskRepository taskRepository,
            ProjectService projectService,
            UserService userService,
            MapperService mapperService
    ) {
        this.taskRepository = taskRepository;
        this.projectService = projectService;
        this.userService = userService;
        this.mapperService = mapperService;
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request, User currentUser) {
        ensureAdmin(currentUser);
        Project project = projectService.findProject(request.projectId());
        User assignee = userService.getUser(request.assignedToId());
        ensureMemberCanReceiveTask(project, assignee);

        Task task = new Task();
        task.setTitle(request.title().trim());
        task.setDescription(request.description().trim());
        task.setStatus(request.status() == null ? TaskStatus.TODO : request.status());
        task.setDueDate(request.dueDate());
        task.setProject(project);
        task.setAssignedTo(assignee);

        return mapperService.toTaskResponse(taskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> listTasks(User currentUser) {
        List<Task> tasks = currentUser.getRole() == Role.ADMIN
                ? taskRepository.findAllDetailed()
                : taskRepository.findAssignedTasks(currentUser.getId());
        return tasks.stream().map(mapperService::toTaskResponse).toList();
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskUpdateRequest request, User currentUser) {
        Task task = findTask(id);
        if (currentUser.getRole() == Role.MEMBER) {
            ensureAssigned(task, currentUser);
            if (request.status() == null) {
                throw new BadRequestException("Members can only update task status");
            }
            task.setStatus(request.status());
            return mapperService.toTaskResponse(task);
        }

        if (request.title() != null) {
            task.setTitle(request.title().trim());
        }
        if (request.description() != null) {
            task.setDescription(request.description().trim());
        }
        if (request.status() != null) {
            task.setStatus(request.status());
        }
        if (request.dueDate() != null) {
            task.setDueDate(request.dueDate());
        }
        if (request.projectId() != null) {
            task.setProject(projectService.findProject(request.projectId()));
        }
        if (request.assignedToId() != null) {
            User assignee = userService.getUser(request.assignedToId());
            ensureMemberCanReceiveTask(task.getProject(), assignee);
            task.setAssignedTo(assignee);
        }
        ensureMemberCanReceiveTask(task.getProject(), task.getAssignedTo());
        return mapperService.toTaskResponse(task);
    }

    @Transactional
    public void deleteTask(Long id, User currentUser) {
        ensureAdmin(currentUser);
        taskRepository.delete(findTask(id));
    }

    private Task findTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }

    private void ensureMemberCanReceiveTask(Project project, User assignee) {
        if (assignee.getRole() != Role.MEMBER) {
            throw new BadRequestException("Tasks can only be assigned to MEMBER users");
        }
        boolean projectMember = project.getMembers().stream().anyMatch(member -> member.getId().equals(assignee.getId()));
        if (!projectMember) {
            throw new BadRequestException("Assignee must be a member of the selected project");
        }
    }

    private void ensureAssigned(Task task, User user) {
        if (!task.getAssignedTo().getId().equals(user.getId())) {
            throw new ForbiddenException("You can only update tasks assigned to you");
        }
    }

    private void ensureAdmin(User user) {
        if (user.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Admin access is required");
        }
    }
}
