package com.smartlink.hub.controller;

import com.smartlink.hub.dto.ApiResponse;
import com.smartlink.hub.dto.ProfileDto;
import com.smartlink.hub.security.UserPrincipal;
import com.smartlink.hub.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileDto>> getMyProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        ProfileDto profileDto = profileService.getProfileByUserId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(profileDto));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<ProfileDto>> updateMyProfile(@AuthenticationPrincipal UserPrincipal currentUser,
                                                                   @Valid @RequestBody ProfileDto profileDto) {
        ProfileDto updated = profileService.updateProfile(currentUser.getId(), currentUser.getUsername(), profileDto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Profile updated successfully"));
    }
}
