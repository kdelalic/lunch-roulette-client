// Production check
export const DEVELOPMENT_MODE = process.env.NODE_ENV !== 'production';

export const BASE_SERVER_URL = DEVELOPMENT_MODE
  ? 'http://localhost:5000'
  : process.env.REACT_APP_SERVER_URL;

// Number of restaurants to return per api call
export const LIMIT = 50;

// Maximum offset until it resets back to 0
export const RESTAURANT_RESET = 500;

// Highest logger level to use
export const LOGGER_LEVEL = process.env.LOGGER_LEVEL || 'info';

// Logger levels to use
export const LOGGER_LEVELS = { error: 0, warn: 1, info: 2, verbose: 3, debug: 4 };

// Threshold for refilling restaurants array (percentage of LIMIT)
export const REFILL_THRESHOLD = 0.2;

// API Key for Google Maps
export const GOOGLE_MAPS_API_KEY = 'AIzaSyBhiG6J4HBexqPKFHKpmDDzhS48EAd3UxE';

// Default zoom level for Google Maps
export const DEFAULT_MAP_ZOOM = 14;

// Paper elevation value for panel containers
export const INNER_CONTAINER_ELEVATION = 1;

// Default search radius
export const DEFAULT_RADIUS = 2500;

// Amount by which to increment radius if no restaurants are returned
export const RADIUS_INCREMENT = 1000;

// API URLS
export const API = {
  GET: {
    RESTAURANTS: (latitude, longitude, offset, limit, radius, term) =>
      `${BASE_SERVER_URL}/api/restaurants?latitude=${latitude}&longitude=${longitude}&offset=${offset}&limit=${limit}&radius=${radius}&term=${term}`,
    REVIEWS: restaurantID => `${BASE_SERVER_URL}/api/reviews/${restaurantID}`
  }
};
