package com.example.car_ai_assignment.controller;

import com.example.car_ai_assignment.entity.Car;
import com.example.car_ai_assignment.dto.RecommendationRequest;
import com.example.car_ai_assignment.dto.ShortlistRequest;
import com.example.car_ai_assignment.repository.CarRepository;
import com.example.car_ai_assignment.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows your frontend application to make API requests without CORS blocks
public class CarController {

    private final CarRepository carRepository;
    private final RecommendationService recommendationService;

    // In-memory Shortlist tracker mimicking a user session state
    private final Set<Long> userShortlist = new HashSet<>();

    public CarController(CarRepository carRepository, RecommendationService recommendationService) {
        this.carRepository = carRepository;
        this.recommendationService = recommendationService;
    }

    // 1. Fetch & Filter raw inventory data
    @GetMapping("/cars")
    public ResponseEntity<List<Car>> getAllCars() {
        return ResponseEntity.ok(carRepository.findAll());
    }

    // 2. Process Questionnaire responses & return dynamically ranked recommendations
    @PostMapping("/recommend")
    public ResponseEntity<List<Map<String, Object>>> getRecommendations(@RequestBody RecommendationRequest request) {
        List<Map<String, Object>> recommendations = recommendationService.getRankedRecommendations(request);
        return ResponseEntity.ok(recommendations);
    }

    // 3. Retrieve current saved shortlist details
    @GetMapping("/shortlist")
    public ResponseEntity<List<Car>> getShortlist() {
        List<Car> shortlistedCars = carRepository.findAllById(userShortlist);
        return ResponseEntity.ok(shortlistedCars);
    }

    // 4. Add a specific vehicle to the shortlist
    @PostMapping("/shortlist")
    public ResponseEntity<Map<String, String>> addToShortlist(@RequestBody ShortlistRequest request) {
        Map<String, String> response = new HashMap<>();
        if (carRepository.existsById(request.getCarId())) {
            userShortlist.add(request.getCarId());
            response.put("message", "Car added to shortlist successfully.");
            return ResponseEntity.ok(response);
        }
        response.put("error", "Car ID not found.");
        return ResponseEntity.status(404).body(response);
    }

    // 5. Remove a vehicle from the shortlist
    @DeleteMapping("/shortlist/{id}")
    public ResponseEntity<Map<String, String>> removeFromShortlist(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        if (userShortlist.contains(id)) {
            userShortlist.remove(id);
            response.put("message", "Car removed from shortlist successfully.");
            return ResponseEntity.ok(response);
        }
        response.put("error", "Car not found in shortlist.");
        return ResponseEntity.status(404).body(response);
    }
}