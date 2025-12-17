package com.thetodolist.thetodolist.dtos;

import lombok.Data;

@Data
public class UpdateTodoRequest {
    private String newTask;
    private Boolean completed;
}
