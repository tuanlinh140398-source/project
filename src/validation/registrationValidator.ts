import { RegistrationRequest } from '../types/index.js';

export interface ValidationError {
  field: string;
  message: string;
}

export class RegistrationValidator {
  static validate(data: any): { valid: boolean; errors: ValidationError[] } {
    const errors: ValidationError[] = [];

    // Check if data is an object
    if (!data || typeof data !== 'object') {
      return { valid: false, errors: [{ field: 'body', message: 'Request body must be a valid JSON object' }] };
    }

    // Validate fullName
    const fullName = this.trimField(data.fullName);
    if (!fullName) {
      errors.push({ field: 'fullName', message: 'Full name is required' });
    } else if (fullName.length < 2) {
      errors.push({ field: 'fullName', message: 'Full name must be at least 2 characters' });
    } else if (fullName.length > 255) {
      errors.push({ field: 'fullName', message: 'Full name must not exceed 255 characters' });
    }

    // Validate employeeCode
    const employeeCode = this.trimField(data.employeeCode);
    if (!employeeCode) {
      errors.push({ field: 'employeeCode', message: 'Employee code is required' });
    } else if (employeeCode.length < 3) {
      errors.push({ field: 'employeeCode', message: 'Employee code must be at least 3 characters' });
    } else if (employeeCode.length > 50) {
      errors.push({ field: 'employeeCode', message: 'Employee code must not exceed 50 characters' });
    }

    // Validate department
    const department = this.trimField(data.department);
    if (!department) {
      errors.push({ field: 'department', message: 'Department is required' });
    } else if (department.length < 2) {
      errors.push({ field: 'department', message: 'Department must be at least 2 characters' });
    } else if (department.length > 255) {
      errors.push({ field: 'department', message: 'Department must not exceed 255 characters' });
    }

    // Validate phoneNumber
    const phoneNumber = this.trimField(data.phoneNumber);
    if (!phoneNumber) {
      errors.push({ field: 'phoneNumber', message: 'Phone number is required' });
    } else if (!this.isValidPhoneNumber(phoneNumber)) {
      errors.push({ field: 'phoneNumber', message: 'Phone number must be a valid Vietnamese phone number (10-11 digits, starting with 0)' });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static trimField(value: any): string {
    if (typeof value !== 'string') {
      return '';
    }
    return value.trim();
  }

  static isValidPhoneNumber(phoneNumber: string): boolean {
    // Vietnamese phone number format: 10-11 digits, starting with 0
    // Format: 0XX XXXX XXXX or 0XXXXXXXXXX or 0XXXXXXXXXXX
    const phoneRegex = /^0\d{9,10}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }

  static sanitizeRequest(data: any): RegistrationRequest {
    return {
      fullName: this.trimField(data.fullName),
      employeeCode: this.trimField(data.employeeCode),
      department: this.trimField(data.department),
      phoneNumber: this.trimField(data.phoneNumber)
    };
  }
}
