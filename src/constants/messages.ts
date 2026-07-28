export const VALIDATION_MESSAGES = {
  FULL_NAME: {
    REQUIRED: 'Full name is required',
    MIN_LENGTH: 'Full name must be at least 2 characters',
    MAX_LENGTH: 'Full name must not exceed 255 characters',
    INVALID_FORMAT: 'Full name must contain only letters, spaces, and hyphens',
    MIN_WORDS: 'Full name must contain at least 2 words'
  },
  EMPLOYEE_CODE: {
    REQUIRED: 'Employee code is required',
    MIN_LENGTH: 'Employee code must be at least 3 characters',
    MAX_LENGTH: 'Employee code must not exceed 50 characters',
    INVALID_FORMAT: 'Employee code format is invalid. Expected format: letters followed by digits (e.g., VT001234)'
  },
  DEPARTMENT: {
    REQUIRED: 'Department is required',
    MIN_LENGTH: 'Department must be at least 2 characters',
    MAX_LENGTH: 'Department must not exceed 255 characters'
  },
  PHONE_NUMBER: {
    REQUIRED: 'Phone number is required',
    INVALID_FORMAT: 'Phone number must be a valid Vietnamese phone number (10-11 digits, starting with 0)'
  }
};

export const ERROR_MESSAGES = {
  EMPLOYEE_CODE_ALREADY_REGISTERED: 'Employee code already registered',
  PHONE_NUMBER_ALREADY_REGISTERED: 'Phone number already registered for another employee',
  FAILED_TO_CREATE_REGISTRATION: 'Failed to create registration',
  FAILED_TO_FETCH_REGISTRATIONS: 'Failed to fetch registrations',
  DATABASE_CONNECTION_NOT_AVAILABLE: 'Database connection not available',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  INVALID_REQUEST_BODY: 'Request body must be a valid JSON object'
};

export const SUCCESS_MESSAGES = {
  REGISTRATION_CREATED: 'Registration created successfully'
};
