package com.projectworkspace.api.service;

import com.projectworkspace.api.dto.project.UserSummary;
import com.projectworkspace.api.entity.Role;
import com.projectworkspace.api.entity.User;
import com.projectworkspace.api.exception.ResourceNotFoundException;
import com.projectworkspace.api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MapperService mapperService;

    public UserService(UserRepository userRepository, MapperService mapperService) {
        this.userRepository = userRepository;
        this.mapperService = mapperService;
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user was not found"));
    }

    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public List<UserSummary> listMembers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.MEMBER)
                .map(mapperService::toUserSummary)
                .toList();
    }
}
