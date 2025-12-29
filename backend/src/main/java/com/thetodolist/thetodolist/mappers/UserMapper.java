package com.thetodolist.thetodolist.mappers;

import com.thetodolist.thetodolist.dtos.RegisterUserRequest;
import com.thetodolist.thetodolist.dtos.UserDto;
import com.thetodolist.thetodolist.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User requestToUser(RegisterUserRequest registerUserRequest);

    @Mapping(target = "id", source = "id")
    UserDto userToUserDto(User user);
}
