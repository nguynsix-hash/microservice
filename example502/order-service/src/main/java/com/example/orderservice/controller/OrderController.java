package com.example.orderservice.controller;

import com.example.orderservice.domain.Item;
import com.example.orderservice.domain.Order;
import com.example.orderservice.domain.User;
import com.example.orderservice.feignclient.UserClient;
import com.example.orderservice.http.header.HeaderGenerator;
import com.example.orderservice.service.OrderService;
import com.example.orderservice.utilities.OrderUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class OrderController {

    @Autowired
    private UserClient userClient;

    @Autowired
    private OrderService orderService;

    @Autowired
    private HeaderGenerator headerGenerator;

    @PostMapping(value = "/order/{userId}")
    public ResponseEntity<Order> saveOrder(
            @PathVariable("userId") Long userId,
            @RequestBody List<Item> cart,
            HttpServletRequest request){

        User user = userClient.getUserById(userId);
        if(cart != null && user != null) {
            Order order = this.createOrder(cart, user);
            try{
                orderService.saveOrder(order);
                return new ResponseEntity<Order>(
                        order,
                        headerGenerator.getHeadersForSuccessPostMethod(request, order.getId()),
                        HttpStatus.CREATED);
            }catch (Exception ex){
                ex.printStackTrace();
                return new ResponseEntity<Order>(
                        headerGenerator.getHeadersForError(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        return new ResponseEntity<Order>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/orders")
    public ResponseEntity<List<Order>> getAllOrders(){
        List<Order> orders = orderService.getAllOrders();
        if(!orders.isEmpty()){
            return new ResponseEntity<>(orders, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/order/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable("id") Long id){
        return orderService.getOrderById(id)
                .map(order -> new ResponseEntity<>(order, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    private Order createOrder(List<Item> cart, User user) {
        Order order = new Order();
        order.setItems(cart);
        order.setUser(user);
        order.setTotal(OrderUtilities.countTotalPrice(cart));
        order.setOrderedDate(LocalDate.now());
        order.setStatus("PAYMENT_EXPECTED");
        return order;
    }

    @PutMapping(value = "/order/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable("id") Long id, @RequestParam("status") String status) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            if(updatedOrder != null) {
                return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
