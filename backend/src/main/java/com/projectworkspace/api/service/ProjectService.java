package com.projectworkspace.api.service;

import com.projectworkspace.api.dto.project.ProjectRequest;
import com.projectworkspace.api.dto.project.ProjectResponse;
import com.projectworkspace.api.entity.Project;
import com.projectworkspace.api.entity.Role;
import com.projectworkspace.api.entity.User;
import com.projectworkspace.api.exception.BadRequestException;
import com.projectworkspace.api.exception.ForbiddenException;
import com.projectworkspace.api.exception.ResourceNotFoundException;
import com.projectworkspace.api.repository.ProjectRepository;
import com.projectworkspace.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final MapperService mapperService;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository, MapperService mapperService) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.mapperService = mapperService;
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, User currentUser) {
        ensureAdmin(currentUser);

        Project project = new Project();
        project.setName(request.name().trim());
        project.setDescription(request.description().trim());
        project.setCreatedBy(currentUser);
        project.setMembers(resolveMembers(request.memberIds()));

        return mapperService.toProjectResponse(projectRepository.save(project));
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> listProjects(User currentUser) {
        List<Project> projects = currentUser.getRole() == Role.ADMIN
                ? projectRepository.findAllDetailed()
                : projectRepository.findAssignedProjects(currentUser.getId());
        return projects.stream().map(mapperService::toProjectResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(Long id, User currentUser) {
        Project project = findProject(id);
        ensureProjectAccess(project, currentUser);
        return mapperService.toProjectResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request, User currentUser) {
        ensureAdmin(currentUser);
        Project project = findProject(id);
        project.setName(request.name().trim());
        project.setDescription(request.description().trim());
        project.setMembers(resolveMembers(request.memberIds()));
        return mapperService.toProjectResponse(project);
    }

    @Transactional
    public void deleteProject(Long id, User currentUser) {
        ensureAdmin(currentUser);
        Project project = findProject(id);
        projectRepository.delete(project);
    }

    public Project findProject(Long id) {
        return projectRepository.findDetailedById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    private Set<User> resolveMembers(Set<Long> memberIds) {
        if (memberIds == null || memberIds.isEmpty()) {
            return new HashSet<>();
        }

        Set<User> members = new HashSet<>(userRepository.findAllById(memberIds));
        if (members.size() != memberIds.size()) {
            throw new BadRequestException("One or more project members were not found");
        }
        members.forEach(member -> {
            if (member.getRole() != Role.MEMBER) {
                throw new BadRequestException("Only MEMBER users can be assigned to projects");
            }
        });
        return members;
    }

    private void ensureProjectAccess(Project project, User user) {
        if (user.getRole() == Role.ADMIN) {
            return;
        }
        boolean assigned = project.getMembers().stream().anyMatch(member -> member.getId().equals(user.getId()));
        if (!assigned) {
            throw new ForbiddenException("You do not have access to this project");
        }
    }

    private void ensureAdmin(User user) {
        if (user.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Admin access is required");
        }
    }
}
