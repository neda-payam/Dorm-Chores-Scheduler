import {
  containsSqlInjection,
  isBlank,
  normaliseEmail,
  sanitiseInput,
  trimInput,
  validateDisplayName,
  validateEmail,
  validateNoSqlInjection,
  validatePassword,
  validateRequired,
  validateResetPasswordFields,
  validateSignInFields,
  validateSignUpFields,
} from './validation';
import { ValidationError } from './errors';

describe('isBlank', () => {
  test('returns true for null', () => {
    expect(isBlank(null)).toBe(true);
  });

  test('returns true for undefined', () => {
    expect(isBlank(undefined)).toBe(true);
  });

  test('returns true for empty string', () => {
    expect(isBlank('')).toBe(true);
  });

  test('returns true for whitespace only', () => {
    expect(isBlank('   ')).toBe(true);
    expect(isBlank('\t')).toBe(true);
    expect(isBlank('\n')).toBe(true);
  });

  test('returns false for non-empty string', () => {
    expect(isBlank('hello')).toBe(false);
    expect(isBlank('  hello  ')).toBe(false);
  });
});

describe('trimInput', () => {
  test('removes leading whitespace', () => {
    expect(trimInput('  hello')).toBe('hello');
  });

  test('removes trailing whitespace', () => {
    expect(trimInput('hello  ')).toBe('hello');
  });

  test('removes both leading and trailing whitespace', () => {
    expect(trimInput('  hello  ')).toBe('hello');
  });

  test('preserves internal whitespace', () => {
    expect(trimInput('  hello world  ')).toBe('hello world');
  });

  test('returns empty string for whitespace only', () => {
    expect(trimInput('   ')).toBe('');
  });
});

describe('containsSqlInjection', () => {
  // Should detect SQL injection patterns
  test('detects OR 1=1 injection', () => {
    expect(containsSqlInjection("' OR 1=1")).toBe(true);
    expect(containsSqlInjection("'OR 1=1")).toBe(true);
    expect(containsSqlInjection("' or 1=1")).toBe(true);
  });

  test('detects OR string comparison injection', () => {
    expect(containsSqlInjection("' OR 'a'='a'")).toBe(true);
    expect(containsSqlInjection("' OR 'x'='x")).toBe(true);
  });

  test('detects DROP TABLE injection', () => {
    expect(containsSqlInjection('; DROP TABLE users')).toBe(true);
    expect(containsSqlInjection(';DROP TABLE users')).toBe(true);
  });

  test('detects DELETE FROM injection', () => {
    expect(containsSqlInjection('; DELETE FROM users')).toBe(true);
  });

  test('detects INSERT INTO injection', () => {
    expect(containsSqlInjection('; INSERT INTO users')).toBe(true);
  });

  test('detects UPDATE SET injection', () => {
    expect(containsSqlInjection('; UPDATE users SET admin=1')).toBe(true);
  });

  test('detects SQL comments (--)', () => {
    expect(containsSqlInjection('admin--')).toBe(true);
    expect(containsSqlInjection('; -- comment')).toBe(true);
  });

  test('detects block comments', () => {
    expect(containsSqlInjection('/* comment */')).toBe(true);
  });

  test('detects UNION SELECT injection', () => {
    expect(containsSqlInjection('UNION SELECT * FROM users')).toBe(true);
    expect(containsSqlInjection('union select password')).toBe(true);
  });

  test('detects EXEC injection', () => {
    expect(containsSqlInjection('EXEC sp_executesql')).toBe(true);
    expect(containsSqlInjection('EXEC(')).toBe(true);
  });

  test('detects xp_ stored procedures', () => {
    expect(containsSqlInjection('xp_cmdshell')).toBe(true);
  });

  test('detects hex values', () => {
    expect(containsSqlInjection('0x41424344')).toBe(true);
  });

  test('detects CHAR() function', () => {
    expect(containsSqlInjection('CHAR(65)')).toBe(true);
  });

  test('detects CONCAT() function', () => {
    expect(containsSqlInjection('CONCAT(a,b)')).toBe(true);
  });

  test('detects semicolon after quote', () => {
    expect(containsSqlInjection("' ; SELECT")).toBe(true);
  });

  // Should NOT detect valid inputs
  test('allows normal text', () => {
    expect(containsSqlInjection('John Smith')).toBe(false);
    expect(containsSqlInjection('hello@example.com')).toBe(false);
  });

  test('allows numbers', () => {
    expect(containsSqlInjection('12345')).toBe(false);
  });
});

describe('sanitiseInput', () => {
  test('removes single quotes', () => {
    expect(sanitiseInput("test'value")).toBe('testvalue');
  });

  test('removes double quotes', () => {
    expect(sanitiseInput('test"value')).toBe('testvalue');
  });

  test('removes backslashes', () => {
    expect(sanitiseInput('test\\value')).toBe('testvalue');
  });

  test('removes semicolons', () => {
    expect(sanitiseInput('test;value')).toBe('testvalue');
  });

  test('removes SQL comment dashes', () => {
    expect(sanitiseInput('test--value')).toBe('testvalue');
  });

  test('removes block comment start', () => {
    expect(sanitiseInput('test/*value')).toBe('testvalue');
  });

  test('removes block comment end', () => {
    expect(sanitiseInput('test*/value')).toBe('testvalue');
  });

  test('trims whitespace', () => {
    expect(sanitiseInput('  test  ')).toBe('test');
  });

  test('handles multiple dangerous characters', () => {
    expect(sanitiseInput("'; DROP TABLE--")).toBe('DROP TABLE');
  });
});

describe('validateRequired', () => {
  test('fails for empty string', () => {
    expect(() => validateRequired('', 'Username')).toThrow(
      new ValidationError('Username is required.'),
    );
  });

  test('fails for whitespace only', () => {
    expect(() => validateRequired('   ', 'Username')).toThrow(
      new ValidationError('Username is required.'),
    );
  });

  test('passes for non-empty string', () => {
    expect(() => validateRequired('john', 'Username')).not.toThrow();
  });

  test('uses provided field name in error', () => {
    expect(() => validateRequired('', 'Email address')).toThrow(
      new ValidationError('Email address is required.'),
    );
  });
});

describe('validateNoSqlInjection', () => {
  test('fails for SQL injection attempt', () => {
    expect(() => validateNoSqlInjection("' OR 1=1", 'Username')).toThrow(
      new ValidationError('Username contains invalid characters.'),
    );
  });

  test('passes for clean input', () => {
    expect(() => validateNoSqlInjection('John Smith', 'Username')).not.toThrow();
  });
});

describe('validateDisplayName', () => {
  // Required check
  test('fails for empty string', () => {
    expect(() => validateDisplayName('')).toThrow(new ValidationError('Display name is required.'));
  });

  test('fails for whitespace only', () => {
    expect(() => validateDisplayName('   ')).toThrow(
      new ValidationError('Display name is required.'),
    );
  });

  // SQL injection check
  test('fails for SQL injection attempt', () => {
    expect(() => validateDisplayName("'; DROP TABLE users--")).toThrow(
      new ValidationError('Display name contains invalid characters.'),
    );
  });

  // Length checks
  test('fails for name shorter than 3 characters', () => {
    expect(() => validateDisplayName('Ab')).toThrow(
      new ValidationError('Display name must be at least 3 characters.'),
    );
  });

  test('fails for name longer than 32 characters', () => {
    expect(() => validateDisplayName('A'.repeat(33))).toThrow(
      new ValidationError('Display name must be no more than 32 characters.'),
    );
  });

  // Character checks
  test('fails for name with numbers', () => {
    expect(() => validateDisplayName('John123')).toThrow(
      new ValidationError(
        'Display name must contain letters only (no numbers or special characters).',
      ),
    );
  });

  test('fails for name with special characters', () => {
    expect(() => validateDisplayName('John@Smith')).toThrow(
      new ValidationError(
        'Display name must contain letters only (no numbers or special characters).',
      ),
    );
  });

  // Valid cases
  test('passes for valid name with letters only', () => {
    expect(() => validateDisplayName('John')).not.toThrow();
  });

  test('passes for valid name with spaces', () => {
    expect(() => validateDisplayName('John Smith')).not.toThrow();
  });

  test('passes for minimum length (3 chars)', () => {
    expect(() => validateDisplayName('Jon')).not.toThrow();
  });

  test('passes for maximum length (32 chars)', () => {
    expect(() => validateDisplayName('A'.repeat(32))).not.toThrow();
  });
});

describe('validateEmail', () => {
  // Required check
  test('fails for empty string', () => {
    expect(() => validateEmail('')).toThrow(new ValidationError('Email address is required.'));
  });

  // SQL injection check
  test('fails for SQL injection attempt', () => {
    expect(() => validateEmail("test' OR 1=1@example.com")).toThrow(
      new ValidationError('Email address contains invalid characters.'),
    );
  });

  // Space check
  test('fails for email with spaces', () => {
    expect(() => validateEmail('test @example.com')).toThrow(
      new ValidationError('Email address cannot contain spaces.'),
    );
  });

  // Length checks
  test('fails for email shorter than 5 characters', () => {
    expect(() => validateEmail('a@b')).toThrow(
      new ValidationError('Email address must be at least 5 characters.'),
    );
  });

  test('fails for email longer than 254 characters', () => {
    expect(() => validateEmail('a'.repeat(250) + '@b.com')).toThrow(
      new ValidationError('Email address must be no more than 254 characters.'),
    );
  });

  // @ symbol checks
  test('fails for email without @', () => {
    expect(() => validateEmail('testexample.com')).toThrow(
      new ValidationError('Email address must contain exactly one "@" symbol.'),
    );
  });

  test('fails for email with multiple @', () => {
    expect(() => validateEmail('test@@example.com')).toThrow(
      new ValidationError('Email address must contain exactly one "@" symbol.'),
    );
  });

  // Dot after @ check
  test('fails for email without dot after @', () => {
    expect(() => validateEmail('test@examplecom')).toThrow(
      new ValidationError('Email address must contain a "." after the "@" symbol.'),
    );
  });

  // Valid cases
  test('passes for valid email', () => {
    expect(() => validateEmail('test@example.com')).not.toThrow();
  });

  test('passes for email with subdomain', () => {
    expect(() => validateEmail('test@mail.example.com')).not.toThrow();
  });

  test('passes for email with plus sign', () => {
    expect(() => validateEmail('test+tag@example.com')).not.toThrow();
  });

  test('passes for email with dots in local part', () => {
    expect(() => validateEmail('first.last@example.com')).not.toThrow();
  });

  test('trims whitespace before validation', () => {
    expect(() => validateEmail('  test@example.com  ')).not.toThrow();
  });
});

describe('normaliseEmail', () => {
  test('converts to lowercase', () => {
    expect(normaliseEmail('Test@Example.COM')).toBe('test@example.com');
  });

  test('trims whitespace', () => {
    expect(normaliseEmail('  test@example.com  ')).toBe('test@example.com');
  });

  test('trims and lowercases together', () => {
    expect(normaliseEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com');
  });
});

describe('validatePassword', () => {
  // Required check
  test('fails for empty string', () => {
    expect(() => validatePassword('')).toThrow(new ValidationError('Password is required.'));
  });

  // SQL injection check
  test('fails for SQL injection attempt', () => {
    expect(() => validatePassword("Pass1!' OR 1=1")).toThrow(
      new ValidationError('Password contains invalid characters.'),
    );
  });

  // Length checks
  test('fails for password shorter than 6 characters', () => {
    expect(() => validatePassword('Aa1!')).toThrow(
      new ValidationError('Password must be at least 6 characters.'),
    );
  });

  test('fails for password longer than 100 characters', () => {
    expect(() => validatePassword('Aa1!' + 'a'.repeat(100))).toThrow(
      new ValidationError('Password must be no more than 100 characters.'),
    );
  });

  // Character requirement checks
  test('fails for password without uppercase letter', () => {
    expect(() => validatePassword('password1!')).toThrow(
      new ValidationError('Password must contain at least 1 uppercase letter.'),
    );
  });

  test('fails for password without lowercase letter', () => {
    expect(() => validatePassword('PASSWORD1!')).toThrow(
      new ValidationError('Password must contain at least 1 lowercase letter.'),
    );
  });

  test('fails for password without number', () => {
    expect(() => validatePassword('Password!')).toThrow(
      new ValidationError('Password must contain at least 1 number.'),
    );
  });

  test('fails for password without symbol', () => {
    expect(() => validatePassword('Password1')).toThrow(
      new ValidationError('Password must contain at least 1 symbol.'),
    );
  });

  // Valid cases
  test('passes for valid password', () => {
    expect(() => validatePassword('Password1!')).not.toThrow();
  });

  test('passes for password with various symbols', () => {
    expect(() => validatePassword('Password1@')).not.toThrow();
    expect(() => validatePassword('Password1#')).not.toThrow();
    expect(() => validatePassword('Password1$')).not.toThrow();
    expect(() => validatePassword('Password1%')).not.toThrow();
    expect(() => validatePassword('Password1^')).not.toThrow();
    expect(() => validatePassword('Password1&')).not.toThrow();
    expect(() => validatePassword('Password1*')).not.toThrow();
  });

  test('passes for minimum length password (6 chars)', () => {
    expect(() => validatePassword('Pa1!aa')).not.toThrow();
  });

  test('passes for maximum length password (100 chars)', () => {
    expect(() => validatePassword('Aa1!' + 'a'.repeat(96))).not.toThrow();
  });
});

describe('validateSignInFields', () => {
  test('fails for invalid email', () => {
    expect(() => validateSignInFields('invalid-email', 'Password1!')).toThrow(
      new ValidationError('Email address must contain exactly one "@" symbol.'),
    );
  });

  test('fails for empty password', () => {
    expect(() => validateSignInFields('test@example.com', '')).toThrow(
      new ValidationError('Password is required.'),
    );
  });

  test('passes with valid email and any non-empty password', () => {
    // Sign-in only requires password to be present, not fully validated
    expect(() => validateSignInFields('test@example.com', 'weak')).not.toThrow();
  });

  test('passes with valid credentials', () => {
    expect(() => validateSignInFields('test@example.com', 'Password1!')).not.toThrow();
  });
});

describe('validateSignUpFields', () => {
  test('fails for invalid email', () => {
    expect(() => validateSignUpFields('invalid-email', 'Password1!')).toThrow(
      new ValidationError('Email address must contain exactly one "@" symbol.'),
    );
  });

  test('fails for weak password (no uppercase)', () => {
    expect(() => validateSignUpFields('test@example.com', 'password1!')).toThrow(
      new ValidationError('Password must contain at least 1 uppercase letter.'),
    );
  });

  test('fails for weak password (no symbol)', () => {
    expect(() => validateSignUpFields('test@example.com', 'Password1')).toThrow(
      new ValidationError('Password must contain at least 1 symbol.'),
    );
  });

  test('passes with valid email and strong password', () => {
    expect(() => validateSignUpFields('test@example.com', 'Password1!')).not.toThrow();
  });
});

describe('validateResetPasswordFields', () => {
  test('fails for empty email', () => {
    expect(() => validateResetPasswordFields('')).toThrow(
      new ValidationError('Email address is required.'),
    );
  });

  test('fails for invalid email', () => {
    expect(() => validateResetPasswordFields('invalid-email')).toThrow(
      new ValidationError('Email address must contain exactly one "@" symbol.'),
    );
  });

  test('passes for valid email', () => {
    expect(() => validateResetPasswordFields('test@example.com')).not.toThrow();
  });
});
