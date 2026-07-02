export interface Car {
  id: number;
  brand: string;
  model: string;
  fuelType: string;
  price: number;
  seating: number;
  mileage: number;
  safetyRating: number;
}

export interface RecommendationResponse {
  car: Car;
  matchScore: number;
  reasoning: string;
  sentimentSummary: string;
}

export interface QuestionnaireData {
  maxBudget: number;
  preferredFuel: string;
  minSeating: number;
  priority: 'safety' | 'mileage' | 'budget';
}