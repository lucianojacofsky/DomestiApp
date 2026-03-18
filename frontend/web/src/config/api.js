// frontend/web/src/config/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  WORKERS_ENDPOINT: `${API_BASE_URL}/workers`,
  USERS_ENDPOINT: `${API_BASE_URL}/users`,
  PAYMENTS_ENDPOINT: `${API_BASE_URL}/payments`,
};

export default API_CONFIG;
