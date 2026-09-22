package com.smartlink.hub.service;

import com.smartlink.hub.dto.LinkDto;
import com.smartlink.hub.entity.Link;
import com.smartlink.hub.entity.Profile;
import com.smartlink.hub.entity.User;
import com.smartlink.hub.exception.BadRequestException;
import com.smartlink.hub.mapper.LinkMapper;
import com.smartlink.hub.repository.LinkRepository;
import com.smartlink.hub.repository.ProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LinkServiceTest {

    @Mock
    private LinkRepository linkRepository;

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private LinkMapper linkMapper;

    @InjectMocks
    private LinkService linkService;

    private User testUser;
    private Profile testProfile;
    private Link testLink;
    private LinkDto testLinkDto;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        testProfile = new Profile();
        testProfile.setId(1L);
        testProfile.setUser(testUser);

        testLink = new Link();
        testLink.setId(1L);
        testLink.setProfile(testProfile);
        testLink.setTitle("Github");
        testLink.setUrl("https://github.com");
        testLink.setActive(true);

        testLinkDto = new LinkDto();
        testLinkDto.setTitle("Github");
        testLinkDto.setUrl("https://github.com");
        testLinkDto.setSortOrder(0);
    }

    @Test
    void testCreateLink_Success() {
        when(profileRepository.findById(1L)).thenReturn(Optional.of(testProfile));
        when(linkMapper.toEntity(any(LinkDto.class))).thenReturn(testLink);
        when(linkRepository.save(any(Link.class))).thenReturn(testLink);
        when(linkMapper.toDto(any(Link.class))).thenReturn(testLinkDto);

        LinkDto result = linkService.createLink(1L, 1L, testLinkDto);

        assertNotNull(result);
        verify(linkRepository, times(1)).save(any(Link.class));
    }

    @Test
    void testCreateLink_Unauthorized() {
        when(profileRepository.findById(1L)).thenReturn(Optional.of(testProfile));

        // Attempting to create a link with non-owner userId=2L
        assertThrows(BadRequestException.class, () -> 
                linkService.createLink(2L, 1L, testLinkDto)
        );

        verify(linkRepository, never()).save(any(Link.class));
    }
}
