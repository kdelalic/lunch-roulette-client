// Production check
export const DEVELOPMENT_MODE = process.env.NODE_ENV !== 'production';

export const BASE_SERVER_URL = DEVELOPMENT_MODE
  ? 'http://localhost:5000'
  : process.env.REACT_APP_SERVER_URL;

// Number of restaurants to return per api call
export const LIMIT = 50;

// Maximum offset until it resets back to 0
export const RESTAURANT_RESET = 900;
