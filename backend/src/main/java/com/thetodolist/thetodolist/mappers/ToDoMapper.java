package com.thetodolist.thetodolist.mappers;

import com.thetodolist.thetodolist.dtos.CreateTodoRequest;
import com.thetodolist.thetodolist.dtos.ToDoDto;
import com.thetodolist.thetodolist.entities.Todo;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ToDoMapper {
    Todo toTodo(CreateTodoRequest request);
    ToDoDto toTodoDto(Todo todo);
}
