import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatErrorMessage } from './errors';
import { supabase } from './supabase';

export const AVAILABILITY_STATUSES = ['available', 'unavailable'] as const;

export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

const DEFAULT_STATUS: AvailabilityStatus = 'available';

function isAvailabilityStatus(value: unknown): value is AvailabilityStatus {
  return typeof value === 'string' && AVAILABILITY_STATUSES.includes(value as AvailabilityStatus);
}

function getAvailabilityCacheKey(userId: string): string {
  return `availability_status_${userId}`;
}

async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id || null;
}

export async function getAvailabilityStatus(): Promise<AvailabilityStatus> {
  const userId = await getCurrentUserId();
  if (!userId) return DEFAULT_STATUS;

  let cachedStatus: AvailabilityStatus | null = null;
  const cachedValue = await AsyncStorage.getItem(getAvailabilityCacheKey(userId));
  if (isAvailabilityStatus(cachedValue)) {
    cachedStatus = cachedValue;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('availability_status')
    .eq('id', userId)
    .single();

  if (error) {
    if (cachedStatus) return cachedStatus;
    throw new Error(formatErrorMessage(error.message));
  }

  const dbStatus = data?.availability_status;
  const resolvedStatus = isAvailabilityStatus(dbStatus) ? dbStatus : cachedStatus || DEFAULT_STATUS;

  await AsyncStorage.setItem(getAvailabilityCacheKey(userId), resolvedStatus);
  return resolvedStatus;
}

export async function setAvailabilityStatus(status: AvailabilityStatus): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  await AsyncStorage.setItem(getAvailabilityCacheKey(userId), status);

  const { error } = await supabase
    .from('profiles')
    .update({ availability_status: status })
    .eq('id', userId);

  if (error) throw new Error(formatErrorMessage(error.message));
}
