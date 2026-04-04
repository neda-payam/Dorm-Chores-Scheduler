import { UnauthorisedError, ValidationError, formatErrorMessage } from './errors';
import { supabase } from './supabase';
import {
  normaliseEmail,
  validateDisplayName,
  validateResetPasswordFields,
  validateSignInFields,
  validateSignUpFields,
} from './validation';

export async function signInUser(email: string, password: string) {
  const normEmail = normaliseEmail(email);
  validateSignInFields(normEmail, password);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normEmail,
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new UnauthorisedError('Invalid login credentials');
    }
    throw new Error(formatErrorMessage(error.message)); // Other unknown errors
  }

  return data;
}

export async function signUpUser(
  email: string,
  password: string,
  displayName: string,
  role: string,
) {
  const normEmail = normaliseEmail(email);

  validateDisplayName(displayName);
  validateSignUpFields(normEmail, password);

  const { data, error } = await supabase.auth.signUp({
    email: normEmail,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      throw new ValidationError('User already registered');
    }
    throw new Error(formatErrorMessage(error.message));
  }

  const userId = data.user?.id;
  if (userId) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        is_manager: role === 'manager',
      })
      .eq('id', userId);

    if (profileError) {
      console.warn('Failed to update profile role:', formatErrorMessage(profileError.message));
    }
  }

  return data;
}

export async function updateDisplayName(userId: string, newDisplayName: string) {
  validateDisplayName(newDisplayName);

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: newDisplayName })
    .eq('id', userId);

  if (error) {
    throw new Error(formatErrorMessage(error.message));
  }
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(formatErrorMessage(error.message));
  }
}

export async function resetPassword(email: string) {
  const normEmail = normaliseEmail(email);
  validateResetPasswordFields(normEmail);

  const { error } = await supabase.auth.resetPasswordForEmail(normEmail);

  if (error) {
    // Note: Suapbase typically doesn't reveal if user exists by default for security,
    // but we handle error if explicit.
    throw new Error(formatErrorMessage(error.message));
  }
}

export async function getCurrentUser() {
  // Use getUser() to securely hit the API and ensure the session is currently valid
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const role = await getUserRole(user.id);

  return {
    ...user,
    role,
  };
}

export async function getUserRole(userId: string): Promise<'student' | 'manager' | null> {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('is_manager')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // The user profile was not found
    }
    throw new Error(formatErrorMessage(error.message));
  }

  return data?.is_manager ? 'manager' : 'student';
}

export async function isAuthenticated(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}
