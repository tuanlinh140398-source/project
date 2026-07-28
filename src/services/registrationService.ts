import { D1Database, Registration, RegistrationRequest } from '../types/index.js';
import { RegistrationRepository } from '../repositories/registrationRepository.js';
import { RegistrationValidator, ValidationError } from '../validation/registrationValidator.js';

export class RegistrationService {
  private repository: RegistrationRepository;

  constructor(db: D1Database) {
    this.repository = new RegistrationRepository(db);
  }

  async register(data: any): Promise<{
    success: boolean;
    data?: Registration;
    errors?: ValidationError[];
    error?: string;
  }> {
    // Validate input
    const validation = RegistrationValidator.validate(data);
    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    // Sanitize input
    const sanitizedData = RegistrationValidator.sanitizeRequest(data);

    // Check if employee code already exists
    const existingRegistration = await this.repository.findByEmployeeCode(sanitizedData.employeeCode);
    if (existingRegistration) {
      return {
        success: false,
        error: 'Employee code already registered'
      };
    }

    // Create registration
    try {
      const registration = await this.repository.create(sanitizedData);
      return {
        success: true,
        data: registration
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create registration'
      };
    }
  }

  async getAll(): Promise<{
    success: boolean;
    data?: Registration[];
    error?: string;
  }> {
    try {
      const registrations = await this.repository.findAll();
      return {
        success: true,
        data: registrations
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch registrations'
      };
    }
  }
}
