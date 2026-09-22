package com.smartlink.hub.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class RateLimiterService {

    private static final Logger log = LoggerFactory.getLogger(RateLimiterService.class);
    private final StringRedisTemplate redisTemplate;

    public RateLimiterService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Slide Window Rate Limiter
     * @param key Identifies user/ip + endpoint
     * @param limit Maximum allowed requests in the window
     * @param windowSeconds Duration of the window in seconds
     * @return true if allowed, false if limit exceeded
     */
    public boolean isAllowed(String key, int limit, int windowSeconds) {
        try {
            long now = System.currentTimeMillis();
            long windowMs = windowSeconds * 1000L;
            long boundary = now - windowMs;

            String redisKey = "rate_limit:" + key;

            // Remove members outside current window
            redisTemplate.opsForZSet().removeRangeByScore(redisKey, 0, boundary);

            // Fetch total elements in current window
            Long count = redisTemplate.opsForZSet().zCard(redisKey);

            if (count != null && count >= limit) {
                log.warn("Rate limit exceeded for key: {}", key);
                return false;
            }

            // Insert new request entry
            redisTemplate.opsForZSet().add(redisKey, UUID.randomUUID().toString(), now);
            // Auto expire key after window duration to save space
            redisTemplate.expire(redisKey, windowSeconds, TimeUnit.SECONDS);
            return true;
        } catch (Exception e) {
            log.warn("Redis rate limiter failed, falling back to allow request. Error: {}", e.getMessage());
            // Fallback strategy: allow request in case of Redis failure to maintain uptime (fail-open)
            return true;
        }
    }
}
