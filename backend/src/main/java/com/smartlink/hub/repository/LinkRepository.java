package com.smartlink.hub.repository;

import com.smartlink.hub.entity.Link;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LinkRepository extends JpaRepository<Link, Long> {
    List<Link> findByProfileIdAndIsActiveOrderBySortOrderAsc(Long profileId, boolean isActive);
    Page<Link> findByProfileIdAndIsActive(Long profileId, boolean isActive, Pageable pageable);
    Optional<Link> findByIdAndIsActive(Long id, boolean isActive);
}
