package com.projectworkspace.api.config;

import com.projectworkspace.api.entity.Project;
import com.projectworkspace.api.entity.Role;
import com.projectworkspace.api.entity.Task;
import com.projectworkspace.api.entity.TaskStatus;
import com.projectworkspace.api.entity.User;
import com.projectworkspace.api.repository.ProjectRepository;
import com.projectworkspace.api.repository.TaskRepository;
import com.projectworkspace.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            User admin = user("Avery Stone", "admin@projectworkspace.dev", "password123", Role.ADMIN, passwordEncoder);
            User member = user("Maya Chen", "maya@projectworkspace.dev", "password123", Role.MEMBER, passwordEncoder);
            User secondMember = user("Noah Patel", "noah@projectworkspace.dev", "password123", Role.MEMBER, passwordEncoder);
            userRepository.saveAll(Set.of(admin, member, secondMember));

            Project launch = new Project();
            launch.setName("Client Portal Launch");
            launch.setDescription("Coordinate the first production release for the customer portal.");
            launch.setCreatedBy(admin);
            launch.setMembers(Set.of(member, secondMember));
            projectRepository.save(launch);

            taskRepository.save(task("Review onboarding copy", "Tighten the onboarding steps before QA sign-off.", TaskStatus.IN_PROGRESS, member, launch, LocalDate.now().plusDays(3)));
            taskRepository.save(task("Prepare release checklist", "Confirm migration, rollback, and monitoring tasks.", TaskStatus.TODO, secondMember, launch, LocalDate.now().plusDays(5)));
            taskRepository.save(task("Archive beta feedback", "Move validated beta notes into the launch workspace.", TaskStatus.DONE, member, launch, LocalDate.now().minusDays(1)));
        };
    }

    private User user(String name, String email, String password, Role role, PasswordEncoder passwordEncoder) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        return user;
    }

    private Task task(String title, String description, TaskStatus status, User assignee, Project project, LocalDate dueDate) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setStatus(status);
        task.setAssignedTo(assignee);
        task.setProject(project);
        task.setDueDate(dueDate);
        return task;
    }
}
