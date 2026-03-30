package com.example.productcatalogservice.service;

import com.example.productcatalogservice.entity.ProductReview;
import com.example.productcatalogservice.repository.ProductReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductReviewServiceImpl implements ProductReviewService {

    @Autowired
    private ProductReviewRepository productReviewRepository;

    @Override
    public List<ProductReview> getReviewsByProductId(Long productId) {
        return productReviewRepository.findByProductId(productId);
    }

    @Override
    public ProductReview saveReview(ProductReview review) {
        return productReviewRepository.save(review);
    }

    @Override
    public void deleteReview(Long id) {
        productReviewRepository.deleteById(id);
    }
}
