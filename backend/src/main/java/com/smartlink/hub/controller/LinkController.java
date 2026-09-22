package com.smartlink.hub.controller;

import com.smartlink.hub.dto.ApiResponse;
import com.smartlink.hub.dto.LinkDto;
import com.smartlink.hub.security.UserPrincipal;
import com.smartlink.hub.service.LinkService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/profiles/{profileId}/links")
public class LinkController {

    private final LinkService linkService;

    public LinkController(LinkService linkService) {
        this.linkService = linkService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LinkDto>>> getLinks(@PathVariable Long profileId) {
        List<LinkDto> links = linkService.getActiveLinksForProfile(profileId);
        return ResponseEntity.ok(ApiResponse.success(links));
    }

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Page<LinkDto>>> getLinksPaged(
            @PathVariable Long profileId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "sortOrder") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        Page<LinkDto> links = linkService.getActiveLinksForProfilePaged(profileId, pageable);
        return ResponseEntity.ok(ApiResponse.success(links));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LinkDto>> createLink(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long profileId,
            @Valid @RequestBody LinkDto linkDto) {
        LinkDto created = linkService.createLink(currentUser.getId(), profileId, linkDto);
        return ResponseEntity.ok(ApiResponse.success(created, "Link created successfully"));
    }

    @PutMapping("/{linkId}")
    public ResponseEntity<ApiResponse<LinkDto>> updateLink(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long profileId,
            @PathVariable Long linkId,
            @Valid @RequestBody LinkDto linkDto) {
        LinkDto updated = linkService.updateLink(currentUser.getId(), profileId, linkId, linkDto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Link updated successfully"));
    }

    @DeleteMapping("/{linkId}")
    public ResponseEntity<ApiResponse<String>> deleteLink(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long profileId,
            @PathVariable Long linkId) {
        linkService.deleteLink(currentUser.getId(), profileId, linkId);
        return ResponseEntity.ok(ApiResponse.success("Link deleted successfully"));
    }

    @PostMapping("/reorder")
    public ResponseEntity<ApiResponse<String>> reorderLinks(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long profileId,
            @RequestBody List<Long> linkIds) {
        linkService.reorderLinks(currentUser.getId(), profileId, linkIds);
        return ResponseEntity.ok(ApiResponse.success("Links reordered successfully"));
    }
}
