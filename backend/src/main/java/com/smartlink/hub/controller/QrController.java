package com.smartlink.hub.controller;

import com.smartlink.hub.entity.AnalyticsEventType;
import com.smartlink.hub.entity.Link;
import com.smartlink.hub.entity.Profile;
import com.smartlink.hub.entity.Resume;
import com.smartlink.hub.exception.ResourceNotFoundException;
import com.smartlink.hub.repository.LinkRepository;
import com.smartlink.hub.repository.ProfileRepository;
import com.smartlink.hub.repository.ResumeRepository;
import com.smartlink.hub.service.AnalyticsService;
import com.smartlink.hub.service.QrCodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/qr")
@Tag(name = "Public QR Generator", description = "Public endpoints generating QR codes in PNG format with integrated analytics tracking")
public class QrController {

    private final QrCodeService qrCodeService;
    private final AnalyticsService analyticsService;
    private final ProfileRepository profileRepository;
    private final LinkRepository linkRepository;
    private final ResumeRepository resumeRepository;
    private final String appDomain;

    public QrController(QrCodeService qrCodeService,
                        AnalyticsService analyticsService,
                        ProfileRepository profileRepository,
                        LinkRepository linkRepository,
                        ResumeRepository resumeRepository,
                        @Value("${app.domain:http://localhost:8081}") String appDomain) {
        this.qrCodeService = qrCodeService;
        this.analyticsService = analyticsService;
        this.profileRepository = profileRepository;
        this.linkRepository = linkRepository;
        this.resumeRepository = resumeRepository;
        this.appDomain = appDomain;
    }

    @GetMapping(value = "/profile/{username}", produces = MediaType.IMAGE_PNG_VALUE)
    @Operation(summary = "Generate Profile QR Code", description = "Generates a 300x300 QR Code pointing to the user's public profile URL")
    public ResponseEntity<byte[]> getProfileQr(@PathVariable String username, HttpServletRequest request) {
        Profile profile = profileRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User/Profile not found with username: " + username));

        // Track Scan
        analyticsService.logEvent(
                profile.getUser().getId(),
                null,
                AnalyticsEventType.QR_SCAN,
                getClientIp(request),
                request.getHeader("User-Agent")
        );

        String targetUrl = appDomain + "/u/" + username;
        byte[] qrBytes = qrCodeService.generateQrCodeImage(targetUrl, 300, 300);
        return ResponseEntity.ok(qrBytes);
    }

    @GetMapping(value = "/link/{linkId}", produces = MediaType.IMAGE_PNG_VALUE)
    @Operation(summary = "Generate Link QR Code", description = "Generates a 300x300 QR Code pointing to a specific tracking link URL")
    public ResponseEntity<byte[]> getLinkQr(@PathVariable Long linkId, HttpServletRequest request) {
        Link link = linkRepository.findByIdAndIsActive(linkId, true)
                .orElseThrow(() -> new ResourceNotFoundException("Active link not found with ID: " + linkId));

        // Track Scan
        analyticsService.logEvent(
                link.getProfile().getUser().getId(),
                link.getId(),
                AnalyticsEventType.QR_SCAN,
                getClientIp(request),
                request.getHeader("User-Agent")
        );

        String targetUrl = link.getUrl();
        byte[] qrBytes = qrCodeService.generateQrCodeImage(targetUrl, 300, 300);
        return ResponseEntity.ok(qrBytes);
    }

    @GetMapping(value = "/resume/{userId}", produces = MediaType.IMAGE_PNG_VALUE)
    @Operation(summary = "Generate Resume QR Code", description = "Generates a 300x300 QR Code pointing to the user's uploaded resume document URL")
    public ResponseEntity<byte[]> getResumeQr(@PathVariable Long userId, HttpServletRequest request) {
        Resume resume = resumeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Uploaded resume not found for user ID: " + userId));

        // Track Scan
        analyticsService.logEvent(
                userId,
                null,
                AnalyticsEventType.QR_SCAN,
                getClientIp(request),
                request.getHeader("User-Agent")
        );

        String targetUrl = appDomain + resume.getFilePath();
        byte[] qrBytes = qrCodeService.generateQrCodeImage(targetUrl, 300, 300);
        return ResponseEntity.ok(qrBytes);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
