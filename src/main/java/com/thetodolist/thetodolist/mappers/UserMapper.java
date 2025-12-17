package com.thetodolist.thetodolist.mappers;

import com.thetodolist.thetodolist.dtos.RegisterUserRequest;
import com.thetodolist.thetodolist.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User requestToUser(RegisterUserRequest registerUserRequest);

}
