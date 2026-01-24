package com.thetodolist.thetodolist.controllers;

import com.thetodolist.thetodolist.config.JwtConfig;
import com.thetodolist.thetodolist.dtos.JwtResponse;
import com.thetodolist.thetodolist.dtos.LoginRequest;
import com.thetodolist.thetodolist.mappers.UserMapper;
import com.thetodolist.thetodolist.repositories.UserRepository;
import com.thetodolist.thetodolist.services.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final JwtConfig jwtConfig;

    @PostMapping(value = "/login")
    public ResponseEntity<JwtResponse> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        var cookie = jwtService.generateCookie(refreshToken);

        response.addCookie(cookie);


        return ResponseEntity.ok(new JwtResponse(accessToken));
    }

    @PostMapping(value = "/refresh")
    public ResponseEntity<JwtResponse> refresh(
            @CookieValue(value = "refreshToken") String refreshToken,
            HttpServletResponse response
    ){
        if (!jwtService.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        var userId = jwtService.getUserIdFromToken(refreshToken);
        var user = userRepository.findById(userId).orElseThrow();
        var accessToken = jwtService.generateAccessToken(user);

        return ResponseEntity.ok(new JwtResponse(accessToken));
    }


    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Void> handleBadCredentialsException(){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
