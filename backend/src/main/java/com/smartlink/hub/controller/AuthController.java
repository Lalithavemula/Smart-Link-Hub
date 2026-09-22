package com.smartlink.hub.controller;

import com.smartlink.hub.dto.*;
import com.smartlink.hub.entity.User;
import com.smartlink.hub.security.JwtTokenProvider;
import com.smartlink.hub.service.TokenBlacklistService;
import com.smartlink.hub.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;
    private final TokenBlacklistService blacklistService;

    public AuthController(AuthenticationManager authenticationManager,
                          UserService userService,
                          JwtTokenProvider tokenProvider,
                          TokenBlacklistService blacklistService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.tokenProvider = tokenProvider;
        this.blacklistService = blacklistService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = userService.registerUser(registerRequest);
        return ResponseEntity.ok(ApiResponse.success("User registered successfully with ID: " + user.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtAuthenticationResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateAccessToken(authentication);
        Long userId = tokenProvider.getUserIdFromJWT(jwt);
        String refreshToken = tokenProvider.generateRefreshToken(userId);

        return ResponseEntity.ok(ApiResponse.success(new JwtAuthenticationResponse(jwt, refreshToken)));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<JwtAuthenticationResponse>> refreshAccessToken(@Valid @RequestBody TokenRefreshRequest refreshRequest) {
        String refreshToken = refreshRequest.getRefreshToken();

        if (StringUtils.hasText(refreshToken) && tokenProvider.validateToken(refreshToken)) {
            if (blacklistService.isTokenBlacklisted(refreshToken)) {
                return ResponseEntity.badRequest().body(ApiResponse.success(null, "Refresh token is blacklisted"));
            }

            Long userId = tokenProvider.getUserIdFromJWT(refreshToken);
            
            // Rotate token: blacklist old refresh token, generate new access and refresh tokens
            long remainingLife = tokenProvider.getRemainingLifetimeMs(refreshToken);
            blacklistService.blacklistToken(refreshToken, remainingLife);

            String newAccessToken = tokenProvider.generateAccessTokenFromUserId(userId);
            String newRefreshToken = tokenProvider.generateRefreshToken(userId);

            return ResponseEntity.ok(ApiResponse.success(new JwtAuthenticationResponse(newAccessToken, newRefreshToken)));
        }

        return ResponseEntity.badRequest().body(ApiResponse.success(null, "Invalid refresh token"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logoutUser(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            long remainingLife = tokenProvider.getRemainingLifetimeMs(token);
            blacklistService.blacklistToken(token, remainingLife);
            return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
        }
        return ResponseEntity.badRequest().body(ApiResponse.success(null, "No authorization token found"));
    }
}
