package com.thetodolist.thetodolist.controllers;

import com.thetodolist.thetodolist.dtos.LoginRequest;
import com.thetodolist.thetodolist.mappers.UserMapper;
import com.thetodolist.thetodolist.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @PostMapping(value = "/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ){
        var user = userRepository.findByUsername(request.getUsername()).orElse(null);
        if(user == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("user", "username does not exist")
            );
        }

        if(!user.getPassword().equals(request.getPassword())){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(
                    Map.of("user", "password does not match")
            );
        }


        return ResponseEntity.status(HttpStatus.OK)
                .body(userMapper.userToUserDto(user));
    }
}
