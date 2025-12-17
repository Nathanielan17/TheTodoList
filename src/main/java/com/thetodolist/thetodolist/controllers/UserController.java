package com.thetodolist.thetodolist.controllers;

import com.thetodolist.thetodolist.dtos.ChangePasswordRequest;
import com.thetodolist.thetodolist.dtos.RegisterUserRequest;
import com.thetodolist.thetodolist.mappers.UserMapper;
import com.thetodolist.thetodolist.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/users")
public class UserController {
    private UserRepository userRepository;
    private UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterUserRequest request) {

        if (userRepository.existsByUsername(request.getUsername())){
            return ResponseEntity.badRequest().body(
                    Map.of("username", "Username is already in use.")
            );
        }
        var user = userMapper.requestToUser(request);
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(request);
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable(name = "id") Long id,
            @RequestBody ChangePasswordRequest request
    ){
        var user = userRepository.findById(id).orElse(null);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable(name = "id") Long id){
        var user = userRepository.findById(id).orElse(null);
        if (user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        userRepository.delete(user);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
