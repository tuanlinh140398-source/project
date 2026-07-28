import { z } from 'zod';
import { VALIDATION_MESSAGES as VM } from '../constants/messages.js';

const FULL_NAME_PATTERN = /^[a-zA-Zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ\s\-]+$/;
const EMPLOYEE_CODE_PATTERN = /^[a-zA-Z]+\d+$/;
const PHONE_NUMBER_PATTERN = /^0\d{9,10}$/;

export const registrationSchema = z.object({
  fullName: z
    .string(({ message: VM.FULL_NAME.REQUIRED }))
    .min(2, { message: VM.FULL_NAME.MIN_LENGTH })
    .max(255, { message: VM.FULL_NAME.MAX_LENGTH })
    .regex(FULL_NAME_PATTERN, { message: VM.FULL_NAME.INVALID_FORMAT })
    .refine(
      (name) => name.trim().split(/\s+/).length >= 2,
      { message: VM.FULL_NAME.MIN_WORDS }
    ),
  employeeCode: z
    .string({ message: VM.EMPLOYEE_CODE.REQUIRED })
    .min(3, { message: VM.EMPLOYEE_CODE.MIN_LENGTH })
    .max(50, { message: VM.EMPLOYEE_CODE.MAX_LENGTH })
    .regex(EMPLOYEE_CODE_PATTERN, { message: VM.EMPLOYEE_CODE.INVALID_FORMAT })
    .transform((code) => code.toUpperCase()),
  department: z
    .string({ message: VM.DEPARTMENT.REQUIRED })
    .min(2, { message: VM.DEPARTMENT.MIN_LENGTH })
    .max(255, { message: VM.DEPARTMENT.MAX_LENGTH }),
  phoneNumber: z
    .string({ message: VM.PHONE_NUMBER.REQUIRED })
    .regex(PHONE_NUMBER_PATTERN, { message: VM.PHONE_NUMBER.INVALID_FORMAT })
    .transform((phone) => phone.replace(/\s/g, ''))
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
