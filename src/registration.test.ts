import { describe, it, expect } from 'vitest';
import { RegistrationValidator } from './validation/registrationValidator';
import { RegistrationService } from './services/registrationService';

describe('RegistrationValidator', () => {
  describe('validate', () => {
    it('should accept valid registration data', () => {
      const data = {
        fullName: 'Nguyễn Văn An',
        employeeCode: 'VT001234',
        department: 'Trung tâm Công nghệ',
        phoneNumber: '0987654321'
      };

      const result = RegistrationValidator.validate(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject missing required fields', () => {
      const data = {
        fullName: 'Nguyễn Văn An',
        employeeCode: 'VT001234'
      };

      const result = RegistrationValidator.validate(data);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject invalid phone numbers', () => {
      const testCases = [
        { phoneNumber: '123456789', valid: false },
        { phoneNumber: '1234567890', valid: false },
        { phoneNumber: '0987654321', valid: true },
        { phoneNumber: '09876543210', valid: true },
        { phoneNumber: '098765432101', valid: false },
        { phoneNumber: 'abcdefghij', valid: false }
      ];

      testCases.forEach(({ phoneNumber, valid }) => {
        const data = {
          fullName: 'Nguyễn Văn An',
          employeeCode: 'VT001234',
          department: 'Trung tâm Công nghệ',
          phoneNumber
        };

        const result = RegistrationValidator.validate(data);
        if (valid) {
          expect(result.errors.filter(e => e.field === 'phoneNumber')).toHaveLength(0);
        } else {
          expect(result.errors.some(e => e.field === 'phoneNumber')).toBe(true);
        }
      });
    });

    it('should trim whitespace from fields', () => {
      const data = {
        fullName: '  Nguyễn Văn An  ',
        employeeCode: ' VT001234 ',
        department: '  Trung tâm Công nghệ  ',
        phoneNumber: ' 0987654321 '
      };

      const sanitized = RegistrationValidator.sanitizeRequest(data);
      expect(sanitized.fullName).toBe('Nguyễn Văn An');
      expect(sanitized.employeeCode).toBe('VT001234');
      expect(sanitized.department).toBe('Trung tâm Công nghệ');
      expect(sanitized.phoneNumber).toBe('0987654321');
    });

    it('should reject empty request body', () => {
      const result = RegistrationValidator.validate(null);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject non-string fields', () => {
      const data = {
        fullName: 123,
        employeeCode: ['VT001234'],
        department: { name: 'Test' },
        phoneNumber: true
      };

      const result = RegistrationValidator.validate(data);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate correct Vietnamese phone numbers', () => {
      const validNumbers = [
        '0987654321',
        '0912345678',
        '09876543210',
        '01234567890'
      ];

      validNumbers.forEach(number => {
        expect(RegistrationValidator.isValidPhoneNumber(number)).toBe(true);
      });
    });

    it('should reject invalid Vietnamese phone numbers', () => {
      const invalidNumbers = [
        '123456789',
        '1987654321',
        '098765432101',
        'abcdefghij'
      ];

      invalidNumbers.forEach(number => {
        expect(RegistrationValidator.isValidPhoneNumber(number)).toBe(false);
      });
    });
  });
});
