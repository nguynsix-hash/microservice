package com.example.productcatalogservice.controller;

import com.example.productcatalogservice.entity.ProductReview;
import com.example.productcatalogservice.http.header.HeaderGenerator;
import com.example.productcatalogservice.service.ProductReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ProductReviewController {

    @Autowired
    private ProductReviewService productReviewService;

    @Autowired
    private HeaderGenerator headerGenerator;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductReview>> getReviewsByProduct(@PathVariable("productId") Long productId) {
        List<ProductReview> reviews = productReviewService.getReviewsByProductId(productId);
        if (!reviews.isEmpty()) {
            return new ResponseEntity<>(reviews, headerGenerator.getHeadersForSuccessGetMethod(), HttpStatus.OK);
        }
        return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<ProductReview> addReview(@RequestBody ProductReview review) {
        if (review != null && review.getProduct() != null && review.getProduct().getId() != null) {
            try {
                ProductReview savedReview = productReviewService.saveReview(review);
                return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable("id") Long id) {
        try {
            productReviewService.deleteReview(id);
            return new ResponseEntity<>(headerGenerator.getHeadersForSuccessGetMethod(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
