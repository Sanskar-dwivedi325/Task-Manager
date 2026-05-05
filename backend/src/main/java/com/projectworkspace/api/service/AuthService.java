package com.projectworkspace.api.service;

import com.projectworkspace.api.dto.auth.AuthResponse;
import com.projectworkspace.api.dto.auth.LoginRequest;
import com.projectworkspace.api.dto.auth.SignupRequest;
import com.projectworkspace.api.entity.User;
import com.projectworkspace.api.exception.BadRequestException;
import com.projectworkspace.api.repository.UserRepository;
import com.projectworkspace.api.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());

        User saved = userRepository.save(user);
        return buildAuthResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User account was not found"));
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user, Map.of("role", user.getRole().name(), "name", user.getName()));
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
