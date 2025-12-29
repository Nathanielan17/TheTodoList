package com.thetodolist.thetodolist.controllers;

import com.thetodolist.thetodolist.dtos.CreateTodoRequest;
import com.thetodolist.thetodolist.dtos.ToDoDto;
import com.thetodolist.thetodolist.dtos.UpdateTodoRequest;
import com.thetodolist.thetodolist.mappers.ToDoMapper;
import com.thetodolist.thetodolist.repositories.TodoRepository;
import com.thetodolist.thetodolist.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/todos")
public class TodoController {

    private final UserRepository userRepository;
    private final ToDoMapper toDoMapper;
    private final TodoRepository todoRepository;

    @PostMapping("/{userId}/create")
    public ResponseEntity<ToDoDto> createTodo(
            @PathVariable(name = "userId") Long id,
            @RequestBody CreateTodoRequest request
    ){
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        var todo = toDoMapper.toTodo(request);
        todo.setUser(user);

        todoRepository.save(todo);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDoMapper.toTodoDto(todo));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ToDoDto>> getTodos(
            @PathVariable(name = "userId") Long id
    ){
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        var todoDtos = user.getTodos().stream().map(toDoMapper::toTodoDto).toList();
        return ResponseEntity.ok().body(todoDtos);

    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> updateTodo(
            @PathVariable(name = "id") Long id,
            @RequestBody UpdateTodoRequest request
    ){
        var todo = todoRepository.findById(id).orElse(null);
        if (todo == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        todo.setCompleted(request.getCompleted());
        todo.setTask(request.getNewTask());
        todoRepository.save(todo);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(
            @PathVariable(name = "id") Long id
    ){
        var todo = todoRepository.findById(id).orElse(null);
        if (todo == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        todoRepository.delete(todo);
        return ResponseEntity.ok().build();
    }
}
