package com.smartlink.hub.repository;

import com.smartlink.hub.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUserUsername(String username);
    Optional<Profile> findByUserId(Long userId);
}
