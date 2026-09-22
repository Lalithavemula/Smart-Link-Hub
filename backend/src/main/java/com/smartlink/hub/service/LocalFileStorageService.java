package com.smartlink.hub.service;

import com.smartlink.hub.exception.FileUploadException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(LocalFileStorageService.class);

    private final Path rootLocation;
    
    private static final List<String> IMAGE_TYPES = List.of("image/jpeg", "image/png", "image/webp");
    private static final List<String> PDF_TYPES = List.of("application/pdf");

    public LocalFileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new FileUploadException("Could not initialize storage directory", e);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String directory) {
        if (file.isEmpty()) {
            throw new FileUploadException("Failed to store empty file");
        }

        // Clean path to prevent directory traversal
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        if (originalFilename.contains("..")) {
            throw new FileUploadException("Cannot store file with relative path outside current directory " + originalFilename);
        }

        // Determine type and validate
        String contentType = file.getContentType();
        if ("resumes".equalsIgnoreCase(directory)) {
            if (contentType == null || !PDF_TYPES.contains(contentType)) {
                throw new FileUploadException("Only PDF resumes are allowed");
            }
            if (file.getSize() > 5 * 1024 * 1024) { // 5MB limit
                throw new FileUploadException("Resume file size cannot exceed 5MB");
            }
        } else if ("profiles".equalsIgnoreCase(directory)) {
            if (contentType == null || !IMAGE_TYPES.contains(contentType)) {
                throw new FileUploadException("Only JPEG, PNG, and WEBP images are allowed");
            }
            if (file.getSize() > 2 * 1024 * 1024) { // 2MB limit
                throw new FileUploadException("Profile image size cannot exceed 2MB");
            }
        } else {
            throw new FileUploadException("Invalid upload category target: " + directory);
        }

        // Generate a secure, unique filename to prevent overwriting and collisions
        String fileExtension = getFileExtension(originalFilename);
        String secureFileName = UUID.randomUUID().toString() + (fileExtension.isEmpty() ? "" : "." + fileExtension);

        try {
            Path targetDir = this.rootLocation.resolve(directory);
            Files.createDirectories(targetDir);

            Path targetFile = targetDir.resolve(secureFileName);
            Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);

            log.info("Stored file successfully at: {}", targetFile);
            return "/" + directory + "/" + secureFileName;
        } catch (IOException e) {
            throw new FileUploadException("Failed to store file " + originalFilename, e);
        }
    }

    @Override
    public void deleteFile(String filePath) {
        if (filePath == null || filePath.startsWith("http://") || filePath.startsWith("https://")) {
            log.info("Skipping deletion of external URL or null path: {}", filePath);
            return;
        }
        try {
            // Remove leading slash if present to make path relative to rootLocation
            String relativePath = filePath.startsWith("/") ? filePath.substring(1) : filePath;
            Path file = this.rootLocation.resolve(relativePath).normalize();
            if (Files.exists(file)) {
                Files.delete(file);
                log.info("Deleted file successfully: {}", file);
            }
        } catch (IOException e) {
            log.error("Failed to delete file at path: {}", filePath, e);
        }
    }

    private String getFileExtension(String filename) {
        int lastIndex = filename.lastIndexOf('.');
        if (lastIndex == -1) {
            return "";
        }
        return filename.substring(lastIndex + 1);
    }
}
