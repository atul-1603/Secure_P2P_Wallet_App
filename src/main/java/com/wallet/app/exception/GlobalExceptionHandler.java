package com.wallet.app.exception;

import java.time.OffsetDateTime;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiErrorResponse> handleMaxUploadSizeExceeded(
        MaxUploadSizeExceededException exception,
        HttpServletRequest request
    ) {
        return buildErrorResponse(
            HttpStatus.PAYLOAD_TOO_LARGE,
            "file exceeds maximum size of 25MB",
            request.getRequestURI()
        );
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<ApiErrorResponse> handleMultipartException(
        MultipartException exception,
        HttpServletRequest request
    ) {
        if (hasMaxUploadSizeCause(exception)) {
            return buildErrorResponse(
                HttpStatus.PAYLOAD_TOO_LARGE,
                "file exceeds maximum size of 25MB",
                request.getRequestURI()
            );
        }

        return buildErrorResponse(
            HttpStatus.BAD_REQUEST,
            "invalid multipart request",
            request.getRequestURI()
        );
    }

    private boolean hasMaxUploadSizeCause(Throwable throwable) {
        Throwable current = throwable;
        while (current != null) {
            if (current instanceof MaxUploadSizeExceededException) {
                return true;
            }
            current = current.getCause();
        }
        return false;
    }

    private ResponseEntity<ApiErrorResponse> buildErrorResponse(
        HttpStatus status,
        String message,
        String path
    ) {
        ApiErrorResponse response = new ApiErrorResponse(
            OffsetDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            path
        );

        return ResponseEntity.status(status).body(response);
    }

    public record ApiErrorResponse(
        OffsetDateTime timestamp,
        int status,
        String error,
        String message,
        String path
    ) {
    }
}
