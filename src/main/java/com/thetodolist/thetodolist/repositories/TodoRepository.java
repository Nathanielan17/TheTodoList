package com.thetodolist.thetodolist.repositories;

import com.thetodolist.thetodolist.entities.Todo;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TodoRepository extends JpaRepository<Todo, Long> {
}