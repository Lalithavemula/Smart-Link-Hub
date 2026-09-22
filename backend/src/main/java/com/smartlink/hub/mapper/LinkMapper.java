package com.smartlink.hub.mapper;

import com.smartlink.hub.dto.LinkDto;
import com.smartlink.hub.entity.Link;
import org.springframework.stereotype.Component;

@Component
public class LinkMapper {

    public LinkDto toDto(Link link) {
        if (link == null) {
            return null;
        }

        LinkDto dto = new LinkDto();
        dto.setId(link.getId());
        dto.setTitle(link.getTitle());
        dto.setUrl(link.getUrl());
        dto.setSortOrder(link.getSortOrder());
        dto.setActive(link.isActive());

        return dto;
    }

    public Link toEntity(LinkDto dto) {
        if (dto == null) {
            return null;
        }

        Link link = new Link();
        link.setId(dto.getId());
        link.setTitle(dto.getTitle());
        link.setUrl(dto.getUrl());
        link.setSortOrder(dto.getSortOrder());
        link.setActive(dto.isActive());

        return link;
    }

    public void updateEntityFromDto(LinkDto dto, Link link) {
        if (dto == null || link == null) {
            return;
        }

        link.setTitle(dto.getTitle());
        link.setUrl(dto.getUrl());
        link.setSortOrder(dto.getSortOrder());
        link.setActive(dto.isActive());
    }
}
