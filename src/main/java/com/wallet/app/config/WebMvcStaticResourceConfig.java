package com.wallet.app.config;

import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcStaticResourceConfig implements WebMvcConfigurer {

    private final String uploadDirectory;

    public WebMvcStaticResourceConfig(@Value("${app.upload-dir:uploads}") String uploadDirectory) {
        this.uploadDirectory = uploadDirectory;
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        Path uploadPath = Path.of(uploadDirectory).toAbsolutePath().normalize();
        String resourceLocation = uploadPath.toUri().toString();

        registry
            .addResourceHandler("/uploads/**")
            .addResourceLocations(resourceLocation);
    }
}
