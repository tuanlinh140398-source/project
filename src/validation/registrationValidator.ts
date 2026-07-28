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
    } else if (!this.isValidFullName(fullName)) {
      errors.push({ field: 'fullName', message: 'Full name must contain only letters, spaces, and hyphens' });
    } else if (!this.hasAtLeastTwoWords(fullName)) {
      errors.push({ field: 'fullName', message: 'Full name must contain at least 2 words' });
    }

    // Validate employeeCode
    const employeeCode = this.trimField(data.employeeCode);
    if (!employeeCode) {
      errors.push({ field: 'employeeCode', message: 'Employee code is required' });
    } else if (employeeCode.length < 3) {
      errors.push({ field: 'employeeCode', message: 'Employee code must be at least 3 characters' });
    } else if (employeeCode.length > 50) {
      errors.push({ field: 'employeeCode', message: 'Employee code must not exceed 50 characters' });
    } else if (!this.isValidEmployeeCodeFormat(employeeCode)) {
      errors.push({ field: 'employeeCode', message: 'Employee code format is invalid. Expected format: letters followed by digits (e.g., VT001234)' });
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

  static isValidFullName(fullName: string): boolean {
    // Allow only Vietnamese letters, spaces, and hyphens
    // Vietnamese letters include a-z, à-ỿ with diacritics
    const nameRegex = /^[a-zA-Zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ\s\-]+$/;
    return nameRegex.test(fullName);
  }

  static hasAtLeastTwoWords(fullName: string): boolean {
    const words = fullName.trim().split(/\s+/);
    return words.length >= 2;
  }

  static isValidEmployeeCodeFormat(employeeCode: string): boolean {
    // Employee code format: letters followed by digits (e.g., VT001234)
    const codeRegex = /^[a-zA-Z]+\d+$/;
    return codeRegex.test(employeeCode);
  }

  static sanitizeRequest(data: any): RegistrationRequest {
    return {
      fullName: this.trimField(data.fullName),
      employeeCode: this.trimField(data.employeeCode).toUpperCase(),
      department: this.trimField(data.department),
      phoneNumber: this.trimField(data.phoneNumber)
    };
  }
}
