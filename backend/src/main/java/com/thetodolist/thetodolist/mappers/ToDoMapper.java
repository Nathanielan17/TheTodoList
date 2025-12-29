package com.thetodolist.thetodolist.mappers;

import com.thetodolist.thetodolist.dtos.CreateTodoRequest;
import com.thetodolist.thetodolist.dtos.ToDoDto;
import com.thetodolist.thetodolist.entities.Todo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface ToDoMapper {
    Todo toTodo(CreateTodoRequest request);
    @Mapping(source = "id", target = "id")
    ToDoDto toTodoDto(Todo todo);
}
