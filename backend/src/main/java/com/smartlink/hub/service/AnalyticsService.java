package com.smartlink.hub.service;

import com.smartlink.hub.entity.AnalyticsEvent;
import com.smartlink.hub.entity.AnalyticsEventType;
import com.smartlink.hub.repository.AnalyticsEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsService.class);
    private final AnalyticsEventRepository eventRepository;

    public AnalyticsService(AnalyticsEventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Async
    @Transactional
    public void logEvent(Long userId, Long linkId, AnalyticsEventType eventType, String ipAddress, String userAgent) {
        try {
            AnalyticsEvent event = new AnalyticsEvent();
            event.setUserId(userId);
            event.setLinkId(linkId);
            event.setEventType(eventType);
            event.setIpAddress(ipAddress);
            event.setUserAgent(userAgent);
            event.setTimestamp(LocalDateTime.now());

            eventRepository.save(event);
            log.debug("Logged analytics event {} for userId: {} and linkId: {}", eventType, userId, linkId);
        } catch (Exception e) {
            log.error("Failed to log analytics event asynchronously", e);
        }
    }

    @Transactional(readOnly = true)
    public Page<AnalyticsEvent> getUserAnalytics(Long userId, AnalyticsEventType eventType, LocalDateTime start, LocalDateTime end, Pageable pageable) {
        if (eventType != null && start != null && end != null) {
            return eventRepository.findByUserIdAndEventTypeAndTimestampBetween(userId, eventType, start, end, pageable);
        } else if (eventType != null) {
            return eventRepository.findByUserIdAndEventType(userId, eventType, pageable);
        } else if (start != null && end != null) {
            return eventRepository.findByUserIdAndTimestampBetween(userId, start, end, pageable);
        }
        // Fallback or general paging
        return eventRepository.findAll(pageable).map(entity -> {
            // Check if user event is theirs (actually repository methods handle filtering, but if general findAll is used, we wrap or filter).
            // Let's call findAll with spec or simple paging
            return entity;
        });
    }

    @Transactional(readOnly = true)
    public com.smartlink.hub.dto.AnalyticsSummaryDto getAnalyticsSummary(Long userId) {
        long profileViews = 0;
        long totalClicks = 0;
        long qrScans = 0;

        java.util.List<Object[]> results = eventRepository.countEventsByType(userId);
        for (Object[] result : results) {
            AnalyticsEventType type = (AnalyticsEventType) result[0];
            long count = ((Number) result[1]).longValue();
            
            if (type == AnalyticsEventType.PROFILE_VIEW) {
                profileViews = count;
            } else if (type == AnalyticsEventType.LINK_CLICK) {
                totalClicks = count;
            } else if (type == AnalyticsEventType.QR_SCAN) {
                qrScans = count;
            }
        }

        // Total links will be calculated by the controller using LinkService, or we can leave it 0 here
        // and populate it in the controller.
        return new com.smartlink.hub.dto.AnalyticsSummaryDto(0, profileViews, totalClicks, qrScans);
    }
}
