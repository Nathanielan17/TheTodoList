package com.thetodolist.thetodolist.controllers;

import com.thetodolist.thetodolist.dtos.ChangePasswordRequest;
import com.thetodolist.thetodolist.dtos.JwtResponse;
import com.thetodolist.thetodolist.dtos.RegisterUserRequest;
import com.thetodolist.thetodolist.dtos.UserDto;
import com.thetodolist.thetodolist.mappers.UserMapper;
import com.thetodolist.thetodolist.repositories.UserRepository;
import com.thetodolist.thetodolist.services.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private UserMapper userMapper;
    private PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody RegisterUserRequest request,
            HttpServletResponse response
    ) {

        if (userRepository.existsByUsername(request.getUsername())){
            return ResponseEntity.badRequest().body(
                    Map.of("RegisterError:", "Username unavailable.")
            );
        }

        // Create and set user into database
        var user = userMapper.requestToUser(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        var cookie = jwtService.generateCookie(refreshToken);
        response.addCookie(cookie);

        return ResponseEntity.ok(new JwtResponse(accessToken));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(){
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var userId = Long.valueOf(authentication.getPrincipal().toString());
        var user = userRepository.findById(userId).orElseThrow();
        var userDto = userMapper.userToUserDto(user);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request
    ){
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var userId = (Long) authentication.getPrincipal();
        var user = userRepository.findById(userId).orElse(null);
        if (user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of("message", "User not found.")
            );
        }
        if (!(user.getPassword().equals(request.getOldPassword()))){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        user.setPassword(request.getNewPassword());
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/")
    public ResponseEntity<?> deleteUser(){
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var userId = (Long) authentication.getPrincipal();
        var user = userRepository.findById(userId).orElse(null);
        if (user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        userRepository.delete(user);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
