package com.nhs.individual.service;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryService {

    @Value("${cloudinary.cloud_name}")
    private String cloudName;

    @Value("${cloudinary.api_key}")
    private String apiKey;

    @Value("${cloudinary.api_secret}")
    private String apiSecret;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        Map<String, Object> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        config.put("secure", true);
        cloudinary = new Cloudinary(config);
    }

    public String upload(MultipartFile file, String folder) {
        try {
            Map<String, Object> options = new HashMap<>();
            if (folder != null && !folder.trim().isEmpty()) {
                options.put("folder", folder);
            }
            
            System.out.println("[CloudinaryService] Uploading file to folder: " + (folder != null ? folder : "root"));
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            String secureUrl = uploadResult.get("secure_url").toString();
            System.out.println("[CloudinaryService] ✓ Upload successful: " + secureUrl);
            return secureUrl;
        } catch (IOException e) {
            System.err.println("[CloudinaryService] ❌ Upload failed: " + e.getMessage());
            throw new RuntimeException("Error mapping Cloudinary upload", e);
        }
    }
}
