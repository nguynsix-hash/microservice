package com.example.productcatalogservice.service;

import com.example.productcatalogservice.entity.Category;
import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    Category saveCategory(Category category);
    void deleteCategory(Long id);
}
