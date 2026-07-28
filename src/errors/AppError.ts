export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: ValidationErrorDetail[] | null
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(details: ValidationErrorDetail[]) {
    super(400, 'Validation failed', details);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
    this.name = 'ConflictError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(500, message);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
    this.name = 'NotFoundError';
  }
}
