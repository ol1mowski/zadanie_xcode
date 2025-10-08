package com.taskxcode.task_xcode.exception;

public class ExternalApiException extends RuntimeException {
    public ExternalApiException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public ExternalApiException(String message) {
        super(message);
    }
}
