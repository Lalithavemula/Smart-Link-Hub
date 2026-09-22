package com.smartlink.hub.dto;

public class ApiErrorResponse {
    private boolean success;
    private String errorCode;
    private String message;
    private String path;
    private String timestamp;
    private String traceId;

    public ApiErrorResponse() {
    }

    public ApiErrorResponse(boolean success, String errorCode, String message, String path, String timestamp, String traceId) {
        this.success = success;
        this.errorCode = errorCode;
        this.message = message;
        this.path = path;
        this.timestamp = timestamp;
        this.traceId = traceId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getTraceId() {
        return traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    public static class Builder {
        private boolean success;
        private String errorCode;
        private String message;
        private String path;
        private String timestamp;
        private String traceId;

        public Builder success(boolean success) {
            this.success = success;
            return this;
        }

        public Builder errorCode(String errorCode) {
            this.errorCode = errorCode;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder path(String path) {
            this.path = path;
            return this;
        }

        public Builder timestamp(String timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public Builder traceId(String traceId) {
            this.traceId = traceId;
            return this;
        }

        public ApiErrorResponse build() {
            return new ApiErrorResponse(success, errorCode, message, path, timestamp, traceId);
        }
    }
}
