package com.autolana.autolanabackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "No file selected"));
            }

            Files.createDirectories(Paths.get(UPLOAD_DIR));

            String originalFilename = file.getOriginalFilename();
            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(
                        originalFilename.lastIndexOf(".")
                );
            }

            String filename = UUID.randomUUID() + extension;

            Path filePath = Paths.get(UPLOAD_DIR + filename);

            Files.write(filePath, file.getBytes());

            return ResponseEntity.ok(
                    Map.of(
                            "imageUrl", "/uploads/" + filename
                    )
            );

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Image upload failed"));
        }
    }
}