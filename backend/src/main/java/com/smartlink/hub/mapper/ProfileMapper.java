package com.smartlink.hub.mapper;

import com.smartlink.hub.dto.ProfileDto;
import com.smartlink.hub.entity.Profile;
import org.springframework.stereotype.Component;

@Component
public class ProfileMapper {

    public ProfileDto toDto(Profile profile) {
        if (profile == null) {
            return null;
        }

        ProfileDto dto = new ProfileDto();
        dto.setId(profile.getId());
        dto.setName(profile.getName());
        dto.setBio(profile.getBio());
        dto.setProfileImageUrl(profile.getProfileImageUrl());
        dto.setGithubUrl(profile.getGithubUrl());
        dto.setLinkedinUrl(profile.getLinkedinUrl());
        dto.setTwitterUrl(profile.getTwitterUrl());
        dto.setInstagramUrl(profile.getInstagramUrl());
        dto.setYoutubeUrl(profile.getYoutubeUrl());
        
        if (profile.getUser() != null) {
            dto.setUsername(profile.getUser().getUsername());
        }

        return dto;
    }

    public void updateEntityFromDto(ProfileDto dto, Profile profile) {
        if (dto == null || profile == null) {
            return;
        }

        profile.setName(dto.getName());
        profile.setBio(dto.getBio());
        profile.setGithubUrl(dto.getGithubUrl());
        profile.setLinkedinUrl(dto.getLinkedinUrl());
        profile.setTwitterUrl(dto.getTwitterUrl());
        profile.setInstagramUrl(dto.getInstagramUrl());
        profile.setYoutubeUrl(dto.getYoutubeUrl());
        if (dto.getProfileImageUrl() != null) {
            profile.setProfileImageUrl(dto.getProfileImageUrl());
        }
    }
}
