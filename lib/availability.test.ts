import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAvailabilityStatus, setAvailabilityStatus } from './availability';
import { supabase } from './supabase';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('./supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('Availability', () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase = {
      select: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    };
    (supabase.from as jest.Mock).mockReturnValue(mockSupabase);
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'user-1' } },
    });
  });

  it('returns default availability when unauthenticated', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null } });

    const status = await getAvailabilityStatus();
    expect(status).toBe('available');
  });

  it('returns db availability and caches it', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    mockSupabase.single.mockResolvedValueOnce({
      data: { availability_status: 'unavailable' },
      error: null,
    });

    const status = await getAvailabilityStatus();

    expect(status).toBe('unavailable');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('availability_status_user-1', 'unavailable');
  });

  it('falls back to cached value when db read fails', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('unavailable');
    mockSupabase.single.mockResolvedValueOnce({
      data: null,
      error: { message: 'failed' },
    });

    const status = await getAvailabilityStatus();
    expect(status).toBe('unavailable');
  });

  it('persists availability to cache and database', async () => {
    mockSupabase.eq.mockResolvedValueOnce({ error: null });

    await setAvailabilityStatus('unavailable');

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('availability_status_user-1', 'unavailable');
    expect(mockSupabase.update).toHaveBeenCalledWith({ availability_status: 'unavailable' });
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'user-1');
  });
});
