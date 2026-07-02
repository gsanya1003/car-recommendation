package com.example.car_ai_assignment.repository;

import com.example.car_ai_assignment.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface  CarRepository extends JpaRepository<Car, Long> {
}
