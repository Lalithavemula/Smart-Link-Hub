package com.smartlink.hub.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartlink.hub.service.RateLimiterService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RateLimiterService rateLimiterService;
    private final ObjectMapper objectMapper;

    public RateLimitingFilter(RateLimiterService rateLimiterService, ObjectMapper objectMapper) {
        this.rateLimiterService = rateLimiterService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String ip = getClientIp(request);

        boolean allowed = true;
        String limitKey = "";

        if (path.startsWith("/api/v1/auth/login")) {
            limitKey = "login:" + ip;
            allowed = rateLimiterService.isAllowed(limitKey, 10, 60); // 10 attempts per minute
        } else if (path.startsWith("/qr/")) {
            limitKey = "qr:" + ip;
            allowed = rateLimiterService.isAllowed(limitKey, 30, 60); // 30 scans per minute
        } else if (path.startsWith("/api/v1/analytics")) {
            limitKey = "analytics:" + ip;
            allowed = rateLimiterService.isAllowed(limitKey, 100, 60); // 100 events per minute
        }

        if (!allowed) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setHeader("X-RateLimit-Limit", "Blocked");
            response.setHeader("X-RateLimit-Remaining", "0");

            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("success", false);
            errorDetails.put("errorCode", "RATE_LIMIT_EXCEEDED");
            errorDetails.put("message", "Too many requests. Please try again later.");
            errorDetails.put("path", path);
            errorDetails.put("timestamp", LocalDateTime.now().toString());
            errorDetails.put("traceId", MDC.get("traceId"));

            objectMapper.writeValue(response.getOutputStream(), errorDetails);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
