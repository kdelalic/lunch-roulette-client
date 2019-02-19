// Production check
export const DEVELOPMENT_MODE = process.env.NODE_ENV !== 'production';

export const BASE_SERVER_URL = DEVELOPMENT_MODE
  ? 'http://localhost:5000'
  : process.env.REACT_APP_SERVER_URL;

// Number of restaurants to return per api call
export const LIMIT = 50;

// Maximum offset until it resets back to 0
export const RESTAURANT_RESET = 900;

// Highest logger level to use
export const LOGGER_LEVEL = process.env.LOGGER_LEVEL || 'info';

// Logger levels to use
export const LOGGER_LEVELS = { error: 0, warn: 1, info: 2, trace: 3, debug: 4 };

// Threshold for refilling restaurants array (percentage)
export const REFILL_THRESHOLD = 0.2;
