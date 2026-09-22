package com.smartlink.hub.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class TokenBlacklistService {

    private static final Logger log = LoggerFactory.getLogger(TokenBlacklistService.class);
    private final StringRedisTemplate redisTemplate;
    
    // In-memory fallback map if Redis is down
    private final ConcurrentHashMap<String, Long> fallbackBlacklist = new ConcurrentHashMap<>();

    public TokenBlacklistService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void blacklistToken(String token, long expirationMs) {
        String key = "blacklist:" + token;
        try {
            redisTemplate.opsForValue().set(key, "true", expirationMs, TimeUnit.MILLISECONDS);
            log.info("Token blacklisted in Redis successfully");
        } catch (Exception e) {
            log.warn("Redis unavailable while blacklisting token, using in-memory fallback. Error: {}", e.getMessage());
            fallbackBlacklist.put(token, System.currentTimeMillis() + expirationMs);
        }
    }

    public boolean isTokenBlacklisted(String token) {
        String key = "blacklist:" + token;
        try {
            Boolean hasKey = redisTemplate.hasKey(key);
            return hasKey != null && hasKey;
        } catch (Exception e) {
            log.warn("Redis unavailable while checking blacklist, checking in-memory fallback. Error: {}", e.getMessage());
            Long expiry = fallbackBlacklist.get(token);
            if (expiry != null) {
                if (expiry > System.currentTimeMillis()) {
                    return true;
                } else {
                    fallbackBlacklist.remove(token);
                }
            }
            return false;
        }
    }
}
