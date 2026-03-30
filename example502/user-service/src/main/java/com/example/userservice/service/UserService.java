package com.example.userservice.service;

import java.util.List;

import com.example.userservice.entity.User;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(Long id);
    User getUserByName(String userName);
    User saveUser(User user);
    void deleteUser(Long id);
    User updateUser(Long id, User userDetails);
}
