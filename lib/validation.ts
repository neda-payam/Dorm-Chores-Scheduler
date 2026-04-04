// Validation utility functions for form inputs with SQL injection protection

import { ValidationError } from './errors';
// Check if a value is blank (empty, null, undefined, or whitespace only)
export function isBlank(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === '';
}

// Remove trailing and leading whitespace from input
export function trimInput(value: string): string {
  return value.trim();
}

// SQL injection patterns to detect and reject
// Includes: ' OR 1=1, DROP TABLE, DELETE FROM, INSERT INTO, UPDATE SET, --, UNION SELECT, etc.
// Reference: https://owasp.org/www-community/attacks/SQL_Injection
const SQL_INJECTION_PATTERNS = [
  /'\s*OR\s+1\s*=\s*1/i,
  /'\s*OR\s+'.*'\s*=\s*'/i,
  /;\s*DROP\s+TABLE/i,
  /;\s*DELETE\s+FROM/i,
  /;\s*INSERT\s+INTO/i,
  /;\s*UPDATE\s+.*\s+SET/i,
  /--/,
  /;\s*--/,
  /\/\*.*\*\//,
  /UNION\s+SELECT/i,
  /EXEC(\s+|\()/i,
  /xp_/i,
  /0x[0-9a-fA-F]+/,
  /CHAR\s*\(/i,
  /CONCAT\s*\(/i,
  /'\s*;\s*/,
];

// Check for SQL injection attempts in input
export function containsSqlInjection(value: string): boolean {
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(value));
}

// Sanitise input by removing potentially dangerous characters (quotes, backslashes, semicolons, SQL comments)
// Use this before database submission
export function sanitiseInput(value: string): string {
  return value
    .replace(/['"\\;]/g, '') // Remove quotes, backslashes, semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comment start
    .replace(/\*\//g, '') // Remove block comment end
    .trim();
}

// Validate that a field is not blank (required field check)
export function validateRequired(value: string, fieldName: string): void {
  if (isBlank(value)) {
    throw new ValidationError(`${fieldName} is required.`);
  }
  return;
}

// Validate input does not contain SQL injection patterns
export function validateNoSqlInjection(value: string, fieldName: string): void {
  if (containsSqlInjection(value)) {
    throw new ValidationError(`${fieldName} contains invalid characters.`);
  }
  return;
}

// Validate display name:
// - 3-32 characters, letters and spaces only, no numbers/special chars
// - Must pass SQL injection check
export function validateDisplayName(value: string): void {
  // Check if blank first
  validateRequired(value, 'Display name');

  // SQL injection check
  validateNoSqlInjection(value, 'Display name');

  const trimmedValue = trimInput(value);

  // Length check
  if (trimmedValue.length < 3) {
    throw new ValidationError('Display name must be at least 3 characters.');
  }
  if (trimmedValue.length > 32) {
    throw new ValidationError('Display name must be no more than 32 characters.');
  }

  // Letters and spaces only (no numbers or special characters)
  const lettersAndSpacesOnly = /^[a-zA-Z\s]+$/;
  if (!lettersAndSpacesOnly.test(trimmedValue)) {
    throw new ValidationError(
      'Display name must contain letters only (no numbers or special characters).',
    );
  }

  return;
}

// Validate email address:
// - 5-254 characters, exactly one "@", at least one "." after "@"
// - No spaces, valid email format (e.g., example@domain.com)
// - Must pass SQL injection check
export function validateEmail(value: string): void {
  // Check if blank first
  validateRequired(value, 'Email address');

  // SQL injection check
  validateNoSqlInjection(value, 'Email address');

  const trimmedValue = trimInput(value);

  // No spaces allowed
  if (/\s/.test(trimmedValue)) {
    throw new ValidationError('Email address cannot contain spaces.');
  }

  // Length check
  if (trimmedValue.length < 5) {
    throw new ValidationError('Email address must be at least 5 characters.');
  }
  if (trimmedValue.length > 254) {
    throw new ValidationError('Email address must be no more than 254 characters.');
  }

  // Must contain exactly one "@"
  const atCount = (trimmedValue.match(/@/g) || []).length;
  if (atCount !== 1) {
    throw new ValidationError('Email address must contain exactly one "@" symbol.');
  }

  // Must have at least one "." after "@"
  const atIndex = trimmedValue.indexOf('@');
  const domainPart = trimmedValue.substring(atIndex + 1);
  if (!domainPart.includes('.')) {
    throw new ValidationError('Email address must contain a "." after the "@" symbol.');
  }

  // Valid email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedValue)) {
    throw new ValidationError('Please enter a valid email address.');
  }

  return;
}

// Normalise email for storage (trim and lowercase)
export function normaliseEmail(value: string): string {
  return trimInput(value).toLowerCase();
}

// Validate password:
// - 6-100 characters
// - Must contain: 1 uppercase, 1 lowercase, 1 number, 1 symbol
// - Must pass SQL injection check
export function validatePassword(value: string): void {
  // Check if blank first
  validateRequired(value, 'Password');

  // SQL injection check
  validateNoSqlInjection(value, 'Password');

  // Length check
  if (value.length < 6) {
    throw new ValidationError('Password must be at least 6 characters.');
  }
  if (value.length > 100) {
    throw new ValidationError('Password must be no more than 100 characters.');
  }

  // Must contain at least 1 uppercase letter
  if (!/[A-Z]/.test(value)) {
    throw new ValidationError('Password must contain at least 1 uppercase letter.');
  }

  // Must contain at least 1 lowercase letter
  if (!/[a-z]/.test(value)) {
    throw new ValidationError('Password must contain at least 1 lowercase letter.');
  }

  // Must contain at least 1 number
  if (!/[0-9]/.test(value)) {
    throw new ValidationError('Password must contain at least 1 number.');
  }

  // Must contain at least 1 symbol
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(value)) {
    throw new ValidationError('Password must contain at least 1 symbol.');
  }

  return;
}

// Validate sign-in fields (email validation + password required check)
export function validateSignInFields(email: string, password: string): void {
  // Email validation
  validateEmail(email);

  // Password required check only for sign-in (not full validation)
  validateRequired(password, 'Password');

  return;
}

// Validate sign-up fields (email + full password validation)
export function validateSignUpFields(email: string, password: string): void {
  // Email validation
  validateEmail(email);

  // Full password validation for sign-up
  validatePassword(password);

  return;
}

// Validate password reset fields (email only)
export function validateResetPasswordFields(email: string): void {
  validateEmail(email);
}
