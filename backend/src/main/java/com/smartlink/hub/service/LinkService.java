package com.smartlink.hub.service;

import com.smartlink.hub.dto.LinkDto;
import com.smartlink.hub.entity.Link;
import com.smartlink.hub.entity.Profile;
import com.smartlink.hub.exception.BadRequestException;
import com.smartlink.hub.exception.ResourceNotFoundException;
import com.smartlink.hub.mapper.LinkMapper;
import com.smartlink.hub.repository.LinkRepository;
import com.smartlink.hub.repository.ProfileRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LinkService {

    private final LinkRepository linkRepository;
    private final ProfileRepository profileRepository;
    private final LinkMapper linkMapper;

    public LinkService(LinkRepository linkRepository,
                       ProfileRepository profileRepository,
                       LinkMapper linkMapper) {
        this.linkRepository = linkRepository;
        this.profileRepository = profileRepository;
        this.linkMapper = linkMapper;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "links", key = "#profileId")
    public List<LinkDto> getActiveLinksForProfile(Long profileId) {
        return linkRepository.findByProfileIdAndIsActiveOrderBySortOrderAsc(profileId, true)
                .stream()
                .map(linkMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<LinkDto> getActiveLinksForProfilePaged(Long profileId, Pageable pageable) {
        return linkRepository.findByProfileIdAndIsActive(profileId, true, pageable)
                .map(linkMapper::toDto);
    }

    @Transactional
    @CacheEvict(value = "links", key = "#profileId")
    public LinkDto createLink(Long userId, Long profileId, LinkDto linkDto) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        if (!profile.getUser().getId().equals(userId)) {
            throw new BadRequestException("You do not own this profile");
        }

        Link link = linkMapper.toEntity(linkDto);
        link.setProfile(profile);
        link.setActive(true);

        Link saved = linkRepository.save(link);
        return linkMapper.toDto(saved);
    }

    @Transactional
    @CacheEvict(value = "links", key = "#profileId")
    public LinkDto updateLink(Long userId, Long profileId, Long linkId, LinkDto linkDto) {
        Link link = linkRepository.findByIdAndIsActive(linkId, true)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found"));

        if (!link.getProfile().getId().equals(profileId) || !link.getProfile().getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized to modify this link");
        }

        linkMapper.updateEntityFromDto(linkDto, link);
        Link saved = linkRepository.save(link);
        return linkMapper.toDto(saved);
    }

    @Transactional
    @CacheEvict(value = "links", key = "#profileId")
    public void deleteLink(Long userId, Long profileId, Long linkId) {
        Link link = linkRepository.findByIdAndIsActive(linkId, true)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found"));

        if (!link.getProfile().getId().equals(profileId) || !link.getProfile().getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized to delete this link");
        }

        // Soft delete
        link.setActive(false);
        linkRepository.save(link);
    }

    @Transactional
    @CacheEvict(value = "links", key = "#profileId")
    public void reorderLinks(Long userId, Long profileId, List<Long> linkIds) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        if (!profile.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to profile links");
        }

        List<Link> links = linkRepository.findByProfileIdAndIsActiveOrderBySortOrderAsc(profileId, true);
        Map<Long, Link> linkMap = links.stream().collect(Collectors.toMap(Link::getId, l -> l));

        for (int i = 0; i < linkIds.size(); i++) {
            Long id = linkIds.get(i);
            Link link = linkMap.get(id);
            if (link != null) {
                link.setSortOrder(i);
                linkRepository.save(link);
            }
        }
    }
}
