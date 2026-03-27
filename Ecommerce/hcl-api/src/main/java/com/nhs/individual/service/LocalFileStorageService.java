package com.nhs.individual.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class LocalFileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        // Ensure folder exists
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = "";
        int dotIndex = originalFileName.lastIndexOf('.');
        if (dotIndex >= 0 && dotIndex < originalFileName.length() - 1) {
            extension = originalFileName.substring(dotIndex);
        }

        String fileName = UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(fileName);

        // Save file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + fileName;
    }
}

