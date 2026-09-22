package com.smartlink.hub.controller;

import com.smartlink.hub.dto.ApiResponse;
import com.smartlink.hub.dto.LinkDto;
import com.smartlink.hub.dto.ProfileDto;
import com.smartlink.hub.entity.AnalyticsEventType;
import com.smartlink.hub.entity.Link;
import com.smartlink.hub.entity.Profile;
import com.smartlink.hub.entity.Resume;
import com.smartlink.hub.exception.ResourceNotFoundException;
import com.smartlink.hub.repository.LinkRepository;
import com.smartlink.hub.repository.ProfileRepository;
import com.smartlink.hub.repository.ResumeRepository;
import com.smartlink.hub.service.AnalyticsService;
import com.smartlink.hub.service.LinkService;
import com.smartlink.hub.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class PublicController {

    private final ProfileService profileService;
    private final LinkService linkService;
    private final AnalyticsService analyticsService;
    private final ProfileRepository profileRepository;
    private final LinkRepository linkRepository;
    private final ResumeRepository resumeRepository;
    private final String appDomain;

    public PublicController(ProfileService profileService,
                            LinkService linkService,
                            AnalyticsService analyticsService,
                            ProfileRepository profileRepository,
                            LinkRepository linkRepository,
                            ResumeRepository resumeRepository,
                            @Value("${app.domain:http://localhost:8081}") String appDomain) {
        this.profileService = profileService;
        this.linkService = linkService;
        this.analyticsService = analyticsService;
        this.profileRepository = profileRepository;
        this.linkRepository = linkRepository;
        this.resumeRepository = resumeRepository;
        this.appDomain = appDomain;
    }

    @GetMapping("/u/{username}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPublicProfile(
            @PathVariable String username,
            HttpServletRequest request) {

        ProfileDto profile = profileService.getPublicProfile(username);
        List<LinkDto> links = linkService.getActiveLinksForProfile(profile.getId());
        
        // Convert URLs to tracking URLs for analytics redirects
        for (LinkDto link : links) {
            link.setUrl(appDomain + "/l/" + link.getId());
        }

        // Asynchronously log the view event
        Profile rawProfile = profileRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        
        analyticsService.logEvent(
                rawProfile.getUser().getId(),
                null,
                AnalyticsEventType.PROFILE_VIEW,
                getClientIp(request),
                request.getHeader("User-Agent")
        );

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("profile", profile);
        responseData.put("links", links);

        return ResponseEntity.ok(ApiResponse.success(responseData, "Public profile fetched successfully"));
    }

    @GetMapping("/l/{linkId}")
    public ResponseEntity<Void> redirectLink(@PathVariable Long linkId, HttpServletRequest request) {
        Link link = linkRepository.findByIdAndIsActive(linkId, true)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found with ID: " + linkId));

        analyticsService.logEvent(
                link.getProfile().getUser().getId(),
                link.getId(),
                AnalyticsEventType.LINK_CLICK,
                getClientIp(request),
                request.getHeader("User-Agent")
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(link.getUrl()));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }



    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
