import { D1Database, Registration, RegistrationRequest } from '../types/index.js';
import { RegistrationRepository } from '../repositories/registrationRepository.js';
import { registrationSchema } from '../validation/schemas.js';
import { ConflictError, DatabaseError } from '../errors/AppError.js';
import { ERROR_MESSAGES } from '../constants/messages.js';

export class RegistrationService {
  private repository: RegistrationRepository;

  constructor(db: D1Database) {
    this.repository = new RegistrationRepository(db);
  }

  async register(data: any): Promise<Registration> {
    // Data is already validated by middleware, but we parse again as safety measure
    const validatedData = registrationSchema.parse(data);

    // Check if employee code already exists (case-insensitive)
    const existingByCode = await this.repository.findByEmployeeCode(validatedData.employeeCode);
    if (existingByCode) {
      throw new ConflictError(ERROR_MESSAGES.EMPLOYEE_CODE_ALREADY_REGISTERED);
    }

    // Check if phone number already exists
    const existingByPhone = await this.repository.findByPhoneNumber(validatedData.phoneNumber);
    if (existingByPhone) {
      throw new ConflictError(ERROR_MESSAGES.PHONE_NUMBER_ALREADY_REGISTERED);
    }

    // Create registration
    try {
      const registration = await this.repository.create(validatedData as RegistrationRequest);
      return registration;
    } catch (error) {
      throw new DatabaseError(ERROR_MESSAGES.FAILED_TO_CREATE_REGISTRATION);
    }
  }

  async getAll(): Promise<Registration[]> {
    try {
      const registrations = await this.repository.findAll();
      return registrations;
    } catch (error) {
      throw new DatabaseError(ERROR_MESSAGES.FAILED_TO_FETCH_REGISTRATIONS);
    }
  }
}
