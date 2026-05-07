package com.autominutes.user;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public record UserListItem(Long id, String username, String role) {}

    @GetMapping("/users")
    public List<UserListItem> listUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserListItem(u.getId(), u.getUsername(), u.getRole().name()))
                .toList();
    }
}
