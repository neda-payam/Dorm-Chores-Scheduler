export function formatErrorMessage(message?: string): string {
  if (!message) return 'An unexpected error occurred.';
  return message.charAt(0).toUpperCase() + message.slice(1);
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(formatErrorMessage(message));
    this.name = 'NotFoundError';
  }
}

export class UnauthorisedError extends Error {
  constructor(message: string) {
    super(formatErrorMessage(message));
    this.name = 'UnauthorisedError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(formatErrorMessage(message));
    this.name = 'ValidationError';
  }
}
