package com.example.car_ai_assignment.service;

import com.example.car_ai_assignment.entity.Car;
import com.example.car_ai_assignment.dto.RecommendationRequest;
import com.example.car_ai_assignment.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final CarRepository carRepository;

    public RecommendationService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public List<Map<String, Object>> getRankedRecommendations(RecommendationRequest request) {
        List<Car> allCars = carRepository.findAll();
        List<Map<String, Object>> recommendations = new ArrayList<>();

        for (Car car : allCars) {
            // 1. Core Hard Filters
            if (car.getPrice() > request.getMaxBudget() || car.getSeating() < request.getMinSeating()) {
                continue; // Skip cars that don't meet absolute basic constraints
            }

            double score = 50.0; // Baseline score
            StringBuilder reasoning = new StringBuilder("Fits your baseline constraints. ");

            // 2. Fuel Preference Match
            if (request.getPreferredFuel() != null && !request.getPreferredFuel().equalsIgnoreCase("Any")) {
                if (car.getFuelType().equalsIgnoreCase(request.getPreferredFuel())) {
                    score += 20;
                    reasoning.append("Matches your preferred fuel type (").append(car.getFuelType()).append("). ");
                } else {
                    score -= 15;
                }
            }

            // 3. User Priority Weighting
            if ("budget".equalsIgnoreCase(request.getPriority())) {
                // Higher score for cheaper cars relative to budget
                double savingsPercentage = (double) (request.getMaxBudget() - car.getPrice()) / request.getMaxBudget();
                score += (savingsPercentage * 30);
                reasoning.append("Highly optimized for your budget priority. ");
            } else if ("safety".equalsIgnoreCase(request.getPriority())) {
                if (car.getSafetyRating() >= 4) {
                    score += 30;
                    reasoning.append("Excellent safety choice with a ").append(car.getSafetyRating()).append("-star rating. ");
                } else {
                    score += (car.getSafetyRating() * 4);
                }
            } else if ("mileage".equalsIgnoreCase(request.getPriority())) {
                if (car.getMileage() > 35) {
                    score += 30;
                    reasoning.append("Outstanding fuel efficiency/range matches your high-mileage preference. ");
                } else {
                    score += (car.getMileage() * 0.5);
                }
            }

            // Bound checking for score
            score = Math.min(100.0, Math.max(0.0, score));

            // 4. Mock Review Key-Phrase Aggregator
            String mockReviewSummary = aggregateReviewSentiment(car);

            // Assemble output payload
            Map<String, Object> recommendationMap = new HashMap<>();
            recommendationMap.put("car", car);
            recommendationMap.put("matchScore", Math.round(score));
            recommendationMap.put("reasoning", reasoning.toString().trim());
            recommendationMap.put("sentimentSummary", mockReviewSummary);

            recommendations.add(recommendationMap);
        }

        // Sort by match score descending
        recommendations.sort((a, b) -> Long.compare((Long) b.get("matchScore"), (Long) a.get("matchScore")));

        return recommendations;
    }

    // Keyword-matching fallback helper to synthesize community feedback phrases
    private String aggregateReviewSentiment(Car car) {
        // Since your entity doesn't explicitly store an array of strings yet,
        // we dynamically simulate text-sentiment lookups based on specs
        if (car.getSafetyRating() >= 5) {
            return "Highly praised for its pristine safety record and build quality.";
        } else if (car.getMileage() > 40) {
            return "Owners frequently emphasize exceptional long-term fuel savings.";
        } else if (car.getFuelType().equalsIgnoreCase("EV")) {
            return "Acclaimed for rapid performance, though charging networks remain a mixed discussion.";
        }
        return "Generally well-regarded as a reliable daily commuter option.";
    }
}