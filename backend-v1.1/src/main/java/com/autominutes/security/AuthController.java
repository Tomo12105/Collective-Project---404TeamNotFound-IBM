package com.autominutes.security;

import com.autominutes.security.dto.AuthDtos;
import com.autominutes.user.User;
import com.autominutes.user.UserRepository;
import com.autominutes.user.UserRole;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(
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

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthDtos.AuthResponse register(@Valid @RequestBody AuthDtos.RegisterRequest req) {
        if (userRepository.existsByUsername(req.username())) {
            throw new IllegalArgumentException("Username already exists");
        }
        User u = new User();
        u.setUsername(req.username());
        u.setPassword(passwordEncoder.encode(req.password()));
        u.setRole(UserRole.USER);
        userRepository.save(u);

        String token = jwtService.createToken(u.getUsername(), Map.of("role", u.getRole().name()));
        return new AuthDtos.AuthResponse(token, u.getUsername(), u.getRole().name());
    }

    @PostMapping("/login")
    public AuthDtos.AuthResponse login(@Valid @RequestBody AuthDtos.LoginRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.username(), req.password())
            );
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid username/password");
        }

        User u = userRepository.findByUsername(req.username()).orElseThrow();
        String token = jwtService.createToken(u.getUsername(), Map.of("role", u.getRole().name()));
        return new AuthDtos.AuthResponse(token, u.getUsername(), u.getRole().name());
    }
}
