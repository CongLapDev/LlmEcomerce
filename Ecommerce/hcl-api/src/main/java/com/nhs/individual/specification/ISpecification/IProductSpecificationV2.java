package com.nhs.individual.specification.ISpecification;

import com.nhs.individual.views.ProductOverView;
import com.nhs.individual.views.ProductOverView_;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public interface IProductSpecificationV2 extends GeneralSpecification<ProductOverView> {
    static Specification<ProductOverView> inCategory(List<Integer> categoryId) {
        return (root, criteriaQuery, criteriaBuilder) -> root.get(ProductOverView_.CATEGORY_ID).in(categoryId);
    }
    static Specification<ProductOverView> priceLimit(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, criteriaQuery, criteriaBuilder) -> criteriaBuilder.and(criteriaBuilder.greaterThanOrEqualTo(root.get(ProductOverView_.MIN_PRICE),minPrice),
                criteriaBuilder.lessThan(root.get(ProductOverView_.MAX_PRICE),maxPrice));
    }

    static Specification<ProductOverView> relativeName(String name) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            String[] extract = name.trim().split("[._ |]");
            List<Predicate> list = new ArrayList<>();
            list.add( criteriaBuilder.like(root.get(ProductOverView_.NAME), "%" + name.trim() + "%"));
            for (String s : extract) {
                list.add(criteriaBuilder.like(root.get(ProductOverView_.NAME), "%" + s + "%"));
            }
            list.add(criteriaBuilder.like(root.get(ProductOverView_.MANUFACTURER),"%"+name+"%"));
            return criteriaBuilder.or(list.toArray(new Predicate[0]));
        };
    }
}
