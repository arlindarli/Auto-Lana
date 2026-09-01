package com.autolana.autolanabackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.autolana.autolanabackend.security.JwtService;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {
    private final JwtService jwtService;

    public AdminAuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        if ("admin@autolana.com".equals(email)
                && "AutoLana123!".equals(password)) {
            String token = jwtService.generateToken(email);

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message", "Login successful",
                            "token", token
                    )
            );
        }

        return ResponseEntity
                .status(401)
                .body(
                        Map.of(
                                "success", false,
                                "message", "Invalid email or password"
                        )
                );
    }
}