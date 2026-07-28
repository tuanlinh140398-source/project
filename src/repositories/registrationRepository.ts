import { D1Database, Registration, RegistrationRequest } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../utils/logger.js';

export class RegistrationRepository {
  constructor(private db: D1Database) {}

  async create(data: RegistrationRequest): Promise<Registration> {
    const id = uuidv4();
    const now = new Date();
    const createdAt = now.toISOString();

    Logger.debug('Creating registration', { id, employeeCode: data.employeeCode });

    await this.db
      .prepare(
        `INSERT INTO registrations (id, full_name, employee_code, department, phone_number, created_at, created_at_formatted)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        data.fullName,
        data.employeeCode,
        data.department,
        data.phoneNumber,
        createdAt,
        now.toLocaleDateString('vi-VN')
      )
      .run();

    Logger.debug('Registration created', { id });

    return {
      id,
      fullName: data.fullName,
      employeeCode: data.employeeCode,
      department: data.department,
      phoneNumber: data.phoneNumber,
      createdAt
    };
  }

  async findByEmployeeCode(employeeCode: string): Promise<Registration | null> {
    const result = await this.db
      .prepare('SELECT * FROM registrations WHERE employee_code = ?')
      .bind(employeeCode.toUpperCase())
      .first();

    if (!result) {
      return null;
    }

    return this.mapRow(result);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Registration | null> {
    const result = await this.db
      .prepare('SELECT * FROM registrations WHERE phone_number = ?')
      .bind(phoneNumber)
      .first();

    if (!result) {
      return null;
    }

    return this.mapRow(result);
  }

  async findAll(): Promise<Registration[]> {
    const result = await this.db
      .prepare('SELECT * FROM registrations ORDER BY created_at DESC')
      .all();

    if (!result.results) {
      return [];
    }

    return result.results.map(row => this.mapRow(row));
  }

  private mapRow(row: any): Registration {
    return {
      id: row.id,
      fullName: row.full_name,
      employeeCode: row.employee_code,
      department: row.department,
      phoneNumber: row.phone_number,
      createdAt: row.created_at
    };
  }
}
