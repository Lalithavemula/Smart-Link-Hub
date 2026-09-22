package com.smartlink.hub.repository;

import com.smartlink.hub.entity.AnalyticsEvent;
import com.smartlink.hub.entity.AnalyticsEventType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEvent, Long> {
    Page<Pageable> findByUserId(Long userId, Pageable pageable);
    Page<AnalyticsEvent> findByUserIdAndEventType(Long userId, AnalyticsEventType eventType, Pageable pageable);
    Page<AnalyticsEvent> findByUserIdAndTimestampBetween(Long userId, LocalDateTime start, LocalDateTime end, Pageable pageable);
    Page<AnalyticsEvent> findByUserIdAndEventTypeAndTimestampBetween(Long userId, AnalyticsEventType eventType, LocalDateTime start, LocalDateTime end, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT e.eventType, COUNT(e) FROM AnalyticsEvent e WHERE e.userId = :userId GROUP BY e.eventType")
    java.util.List<Object[]> countEventsByType(Long userId);
}
