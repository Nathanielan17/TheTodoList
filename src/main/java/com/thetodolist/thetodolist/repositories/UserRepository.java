package com.thetodolist.thetodolist.repositories;

import com.thetodolist.thetodolist.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {

    Boolean existsByUsername(String username);
}
