package com.smartlink.hub.service;

import com.smartlink.hub.dto.ProfileDto;
import com.smartlink.hub.entity.Profile;
import com.smartlink.hub.exception.ResourceNotFoundException;
import com.smartlink.hub.mapper.ProfileMapper;
import com.smartlink.hub.repository.ProfileRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    public ProfileService(ProfileRepository profileRepository, ProfileMapper profileMapper) {
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "profiles", key = "#username")
    public ProfileDto getPublicProfile(String username) {
        Profile profile = profileRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for username: " + username));
        return profileMapper.toDto(profile);
    }

    @Transactional(readOnly = true)
    public ProfileDto getProfileByUserId(Long userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for userId: " + userId));
        return profileMapper.toDto(profile);
    }

    @Transactional
    @CacheEvict(value = "profiles", key = "#username")
    public ProfileDto updateProfile(Long userId, String username, ProfileDto profileDto) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for userId: " + userId));

        profileMapper.updateEntityFromDto(profileDto, profile);
        Profile savedProfile = profileRepository.save(profile);
        return profileMapper.toDto(savedProfile);
    }
}
