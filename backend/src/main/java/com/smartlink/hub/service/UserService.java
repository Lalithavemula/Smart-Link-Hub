package com.smartlink.hub.service;

import com.smartlink.hub.dto.RegisterRequest;
import com.smartlink.hub.entity.Profile;
import com.smartlink.hub.entity.Role;
import com.smartlink.hub.entity.RoleName;
import com.smartlink.hub.entity.User;
import com.smartlink.hub.exception.BadRequestException;
import com.smartlink.hub.repository.ProfileRepository;
import com.smartlink.hub.repository.RoleRepository;
import com.smartlink.hub.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       ProfileRepository profileRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email Address already in use");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        // Assign default role (USER)
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_USER)));
        user.setRoles(Collections.singleton(userRole));

        User savedUser = userRepository.save(user);

        // Auto-create an empty profile for the newly registered user
        Profile profile = new Profile();
        profile.setUser(savedUser);
        profile.setName(savedUser.getUsername());
        profile.setBio("Hello! I am " + savedUser.getUsername());
        profileRepository.save(profile);

        return savedUser;
    }
}
