package com.smartlink.hub.controller;

import com.smartlink.hub.dto.ApiResponse;
import com.smartlink.hub.entity.Profile;
import com.smartlink.hub.entity.Resume;
import com.smartlink.hub.entity.User;
import com.smartlink.hub.exception.ResourceNotFoundException;
import com.smartlink.hub.repository.ProfileRepository;
import com.smartlink.hub.repository.ResumeRepository;
import com.smartlink.hub.repository.UserRepository;
import com.smartlink.hub.security.UserPrincipal;
import com.smartlink.hub.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Encoding;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/uploads")
public class FileUploadController {

    private final FileStorageService fileStorageService;
    private final ProfileRepository profileRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    
    public FileUploadController(FileStorageService fileStorageService,
                                ProfileRepository profileRepository,
                                ResumeRepository resumeRepository,
                                UserRepository userRepository) {
        this.fileStorageService = fileStorageService;
        this.profileRepository = profileRepository;
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    @PostMapping(
            value = "/profile-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @Operation(
            summary = "Upload Profile Image",
            description = "Uploads a new JPG, JPEG, or PNG profile image for the authenticated user."
    )
    public ResponseEntity<ApiResponse<String>> uploadProfileImage(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestPart("file") @Parameter(
                    description = "Profile image file to upload (JPEG, PNG, WEBP; max 2MB)",
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
            ) MultipartFile file) {
        
        String filePath = fileStorageService.storeFile(file, "profiles");

        Profile profile = profileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        
        // Delete old profile image if exists
        if (profile.getProfileImageUrl() != null) {
            fileStorageService.deleteFile(profile.getProfileImageUrl());
        }

        profile.setProfileImageUrl(filePath);
        profileRepository.save(profile);

        return ResponseEntity.ok(ApiResponse.success(filePath, "Profile image uploaded successfully"));
    }

    @PostMapping(
            value = "/resume",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @Operation(
            summary = "Upload Resume PDF",
            description = "Uploads a resume PDF file for the authenticated user."
    )
    public ResponseEntity<ApiResponse<String>> uploadResume(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestPart("file") @Parameter(
                    description = "Resume PDF file to upload (PDF; max 5MB)",
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
            ) MultipartFile file) {

        String filePath = fileStorageService.storeFile(file, "resumes");

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Resume resume = resumeRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    Resume r = new Resume();
                    r.setUser(user);
                    return r;
                });

        // Delete old file if exists
        if (resume.getFilePath() != null) {
            fileStorageService.deleteFile(resume.getFilePath());
        }

        resume.setFilePath(filePath);
        resume.setFileName(file.getOriginalFilename());
        resumeRepository.save(resume);

        return ResponseEntity.ok(ApiResponse.success(filePath, "Resume uploaded successfully"));
    }
}
