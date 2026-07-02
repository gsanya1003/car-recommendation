package com.example.car_ai_assignment.dto;

public class RecommendationRequest {
    private int maxBudget;
    private String preferredFuel; // EV, Hybrid, Gasoline, Diesel, Any
    private int minSeating;
    private String priority; // "budget", "safety", "mileage"

    // Getters and Setters
    public int getMaxBudget() { return maxBudget; }
    public void setMaxBudget(int maxBudget) { this.maxBudget = maxBudget; }

    public String getPreferredFuel() { return preferredFuel; }
    public void setPreferredFuel(String preferredFuel) { this.preferredFuel = preferredFuel; }

    public int getMinSeating() { return minSeating; }
    public void setMinSeating(int minSeating) { this.minSeating = minSeating; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}