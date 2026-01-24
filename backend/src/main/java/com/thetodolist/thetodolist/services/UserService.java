package com.thetodolist.thetodolist.services;

import com.thetodolist.thetodolist.entities.Todo;
import com.thetodolist.thetodolist.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;


@AllArgsConstructor
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
         var user = userRepository.findByUsername(username).orElseThrow(
                 () -> new UsernameNotFoundException("user not found"));

         return new User(
                 user.getUsername(),
                 user.getPassword(),
                 Collections.emptyList()
         );
    }
}
