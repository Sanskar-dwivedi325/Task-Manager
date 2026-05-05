package com.projectworkspace.api.controller;

import com.projectworkspace.api.dto.project.ProjectRequest;
import com.projectworkspace.api.dto.project.ProjectResponse;
import com.projectworkspace.api.entity.User;
import com.projectworkspace.api.service.ProjectService;
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
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;

    public ProjectController(ProjectService projectService, UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> create(@Valid @RequestBody ProjectRequest request, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(request, currentUser(authentication)));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> list(Authentication authentication) {
        return ResponseEntity.ok(projectService.listProjects(currentUser(authentication)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> get(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(projectService.getProject(id, currentUser(authentication)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(projectService.updateProject(id, request, currentUser(authentication)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        projectService.deleteProject(id, currentUser(authentication));
        return ResponseEntity.noContent().build();
    }

    private User currentUser(Authentication authentication) {
        return userService.getCurrentUser(authentication.getName());
    }
}
