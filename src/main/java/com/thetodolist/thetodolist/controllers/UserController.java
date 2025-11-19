package com.thetodolist.thetodolist.controllers;

import com.thetodolist.thetodolist.entities.User;
import com.thetodolist.thetodolist.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/users")
public class UserController {
    private UserRepository userRepository;

    @GetMapping()
    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }
}
