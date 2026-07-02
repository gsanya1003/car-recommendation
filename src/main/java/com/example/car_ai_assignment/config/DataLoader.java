package com.example.car_ai_assignment.config;

import com.example.car_ai_assignment.entity.Car;
import com.example.car_ai_assignment.repository.CarRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;

@Component
public class DataLoader implements CommandLineRunner {

    private final CarRepository carRepository;

    public DataLoader(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (carRepository.count() == 0) {
            carRepository.saveAll(Arrays.asList(
                    // Matching your exact constructor signature:
                    // new Car(brand, model, fuelType, price, seating, mileage, safetyRating)
                    new Car("Tesla", "Model Y", "EV", 47990, 5, 120.0, 5),
                    new Car("Toyota", "Camry Hybrid", "Hybrid", 28400, 5, 51.0, 5),
                    new Car("Honda", "Odyssey", "Gasoline", 37800, 8, 22.0, 4),
                    new Car("Hyundai", "Ioniq 5", "EV", 41450, 5, 110.0, 5),
                    new Car("Ford", "Explorer", "Gasoline", 36760, 7, 24.0, 4),
                    new Car("Kia", "EV9", "EV", 54900, 7, 89.0, 5),
                    new Car("Chevrolet", "Bolt EV", "EV", 26500, 5, 120.0, 4),
                    new Car("Toyota", "RAV4 Hybrid", "Hybrid", 31500, 5, 41.0, 5),
                    new Car("Subaru", "Outback", "Gasoline", 28890, 5, 28.0, 5),
                    new Car("Mazda", "CX-90", "Hybrid", 39590, 7, 56.0, 5),
                    new Car("Chrysler", "Pacific Hybrid", "Hybrid", 49900, 7, 32.0, 4),
                    new Car("BMW", "i4", "EV", 57900, 5, 109.0, 4),
                    new Car("Lexus", "RX", "Gasoline", 49950, 5, 24.0, 5),
                    new Car("Nissan", "Leaf", "EV", 28140, 5, 111.0, 4),
                    new Car("Honda", "CR-V Hybrid", "Hybrid", 34350, 5, 40.0, 5)
            ));
            System.out.println("--- H2 Database Successfully Seeded with 15 Rich Car Entries ---");
        }
    }
}