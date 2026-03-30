package com.example.productcatalogservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.productcatalogservice.entity.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    public List<Product> findAllByCategory_CategoryName(String categoryName);
    public List<Product> findAllByProductName(String name);
}
