package com.example.productrecommendationservice.feignClient;

import com.example.productrecommendationservice.model.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient (name = "product-catalog-service", url = "http://localhost:8810/")
public interface ProductClient {

    @GetMapping (value = "/products/{id}")
    public Product getProductById(@PathVariable(value = "id") Long productId);
}
