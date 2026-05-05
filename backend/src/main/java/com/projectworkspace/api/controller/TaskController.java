package com.projectworkspace.api.controller;

import com.projectworkspace.api.dto.task.TaskRequest;
import com.projectworkspace.api.dto.task.TaskResponse;
import com.projectworkspace.api.dto.task.TaskUpdateRequest;
import com.projectworkspace.api.entity.User;
import com.projectworkspace.api.service.TaskService;
import com.projectworkspace.api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskRequest request, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(request, currentUser(authentication)));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> list(Authentication authentication) {
        return ResponseEntity.ok(taskService.listTasks(currentUser(authentication)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody TaskUpdateRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.updateTask(id, request, currentUser(authentication)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        taskService.deleteTask(id, currentUser(authentication));
        return ResponseEntity.noContent().build();
    }

    private User currentUser(Authentication authentication) {
        return userService.getCurrentUser(authentication.getName());
    }
}
