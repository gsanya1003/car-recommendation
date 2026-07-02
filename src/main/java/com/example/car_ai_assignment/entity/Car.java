package com.example.car_ai_assignment.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Car")
public class Car {

    @Id
    @GeneratedValue
    private Long id;

    private String brand;
    private String model;
    private String fuelType;
    private int price;
    private int seating;
    private double mileage;
    private int safetyRating;

    public String getBrand() {
        return brand;
    }

    public String getModel() {
        return model;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public void setSeating(int seating) {
        this.seating = seating;
    }

    public void setMileage(double mileage) {
        this.mileage = mileage;
    }

    public void setSafetyRating(int safetyRating) {
        this.safetyRating = safetyRating;
    }

    public Long getId() {
        return id;
    }

    public String getFuelType() {
        return fuelType;
    }

    public int getPrice() {
        return price;
    }

    public int getSeating() {
        return seating;
    }

    public double getMileage() {
        return mileage;
    }

    public int getSafetyRating() {
        return safetyRating;
    }

    public Car() {
    }

    public Car(String brand, String model, String fuelType, int price, int seating, double mileage, int safetyRating) {
        this.brand = brand;
        this.model = model;
        this.fuelType = fuelType;
        this.price = price;
        this.seating = seating;
        this.mileage = mileage;
        this.safetyRating = safetyRating;
    }



}
