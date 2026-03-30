package com.example.productcatalogservice.service;

import com.example.productcatalogservice.entity.Product;
import com.example.productcatalogservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getAllProductByCategory(String category) {
        return productRepository.findAllByCategory_CategoryName(category);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.getOne(id);
    }

    @Override
    public List<Product> getAllProductsByName(String name) {
        return productRepository.findAllByProductName(name);
    }

    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            if(productDetails.getProductName() != null) product.setProductName(productDetails.getProductName());
            if(productDetails.getPrice() != null) product.setPrice(productDetails.getPrice());
            if(productDetails.getDiscription() != null) product.setDiscription(productDetails.getDiscription());
            if(productDetails.getAvailability() != 0) product.setAvailability(productDetails.getAvailability());
            if(productDetails.getCategory() != null) product.setCategory(productDetails.getCategory());
            return productRepository.save(product);
        }
        return null;
    }

    @Override
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }
}
