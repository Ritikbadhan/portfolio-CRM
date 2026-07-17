export const APP_CONSTANTS = {
  APP_NAME: 'Portfolio CMS',
  DEFAULT_LANGUAGE: 'en',
};

export const API_URLS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  PROJECTS: '/projects',
};
