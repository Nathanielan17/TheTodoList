package com.thetodolist.thetodolist.services;

import com.thetodolist.thetodolist.entities.Todo;
import com.thetodolist.thetodolist.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@AllArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public void getTodos(){
        var user = userRepository.findById(1L).orElseThrow(()->new RuntimeException("User not found"));

        var todos = user.getTodos();
        for (Todo t: todos){
            System.out.println(t);
        }
    }
}
