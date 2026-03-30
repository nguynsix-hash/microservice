package com.example.orderservice.service;

import com.example.orderservice.domain.Order;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    public Order saveOrder(Order order);
    public List<Order> getAllOrders();
    public Optional<Order> getOrderById(Long id);
    public Order updateOrderStatus(Long id, String status);
}
