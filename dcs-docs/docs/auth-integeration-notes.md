# Auth Integration Notes (Neda)

## Signup Page (signup.tsx)

### Implemented

- Connected signup form to Supabase authentication
- Integrated shared validation utilities from `lib/validation.ts`
- Email normalised before submission
- Display name sanitised before submission
- Backend errors handled using `InlineNotification`

### Architecture Decisions

- Passwords are validated but **not sanitised**
- Email normalised using `normaliseEmail()`
- Display name sanitised using `sanitiseInput()`

### Known Limitation

Validation errors currently appear in a global notice rather than field-level inline errors under each input.

This may be handled later when frontend validation layout is finalised.

### TODO

Later improvement for confirm-email page:

Pass the user email when navigating:

router.push({
pathname: '/auth/confirm-email',
params: { email: trimmedEmail },
});

### supabase coflict with UI in reset password

Supabase reset password flow uses email link verification.

The current UI includes a "confirmation code" input, but Supabase
does not require a code. The reset link already verifies the user.

The code input is therefore currently unused.
