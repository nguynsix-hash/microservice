package com.example.productcatalogservice.service;

import com.example.productcatalogservice.entity.ProductReview;
import java.util.List;

public interface ProductReviewService {
    List<ProductReview> getReviewsByProductId(Long productId);
    ProductReview saveReview(ProductReview review);
    void deleteReview(Long id);
}
