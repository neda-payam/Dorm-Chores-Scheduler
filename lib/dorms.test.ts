import { getCurrentUser } from './auth';
import {
  createDorm,
  deleteDorm,
  getDormById,
  getDormsByManager,
  joinDorm,
  leaveDorm,
  updateDorm,
} from './dorms';
import { supabase } from './supabase';

jest.mock('./supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock('./auth', () => ({
  getCurrentUser: jest.fn(),
}));

describe('Dorms System', () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase = {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockReturnThis(),
      match: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    };
    (supabase.from as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('getDormById', () => {
    it('returns a dorm for a valid ID', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'dorm-1' },
        error: null,
      });
      const dorm = await getDormById('dorm-1');
      expect(dorm?.id).toBe('dorm-1');
    });

    it('returns null for a non-existent ID', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' },
      });
      const dorm = await getDormById('bad-id');
      expect(dorm).toBeNull();
    });
  });

  describe('getDormsByManager', () => {
    it('returns dorms created by manager', async () => {
      mockSupabase.order.mockResolvedValueOnce({
        data: [{ id: 'dorm-1', created_by: 'mgr-1' }],
        error: null,
      });
      const dorms = await getDormsByManager('mgr-1');
      expect(dorms).toHaveLength(1);
      expect(dorms[0].created_by).toBe('mgr-1');
    });
  });

  describe('createDorm', () => {
    it('creates a dorm with valid data', async () => {
      mockSupabase.eq.mockResolvedValueOnce({ count: 0, error: null });
      mockSupabase.eq.mockResolvedValueOnce({ count: 0, error: null });
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'dorm-1', name: 'Maple' },
        error: null,
      });
      const dorm = await createDorm({ name: 'Maple' }, 'user-1');
      expect(dorm.name).toBe('Maple');
    });

    it('throws error when user has reached max created dorms', async () => {
      mockSupabase.eq.mockResolvedValueOnce({ count: 3, error: null });
      await expect(createDorm({ name: 'Maple' }, 'user-1')).rejects.toThrow(
        'You can only create up to 3 dorms. Delete one you created to make room.',
      );
    });

    it('throws error if name is missing', async () => {
      await expect(createDorm({ name: '' }, 'user-1')).rejects.toThrow('Dorm name is required');
    });
  });

  describe('updateDorm', () => {
    it('updates a dorm successfully', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'dorm-1', name: 'Oak' },
        error: null,
      });
      const dorm = await updateDorm('dorm-1', { name: 'Oak' });
      expect(dorm.name).toBe('Oak');
    });
  });

  describe('deleteDorm', () => {
    it('deletes a dorm successfully', async () => {
      (getCurrentUser as jest.Mock).mockResolvedValueOnce({ id: 'user-1' });
      mockSupabase.single.mockResolvedValueOnce({
        data: { created_by: 'user-1' },
        error: null,
      });
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { id: 'dorm-1' },
        error: null,
      });
      await expect(deleteDorm('dorm-1')).resolves.not.toThrow();
    });
  });

  describe('joinDorm', () => {
    it('joins a dorm successfully', async () => {
      mockSupabase.eq.mockResolvedValueOnce({ count: 0, error: null });
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'dorm-1' },
        error: null,
      });

      mockSupabase.single.mockResolvedValueOnce({
        data: { user_id: 'user-1', dorm_id: 'dorm-1' },
        error: null,
      });

      const member = await joinDorm('user-1', 'CODE12');
      expect(member.user_id).toBe('user-1');
      expect(member.dorm_id).toBe('dorm-1');
    });

    it('throws error when user has reached max dorm memberships', async () => {
      mockSupabase.eq.mockResolvedValueOnce({ count: 5, error: null });
      await expect(joinDorm('user-1', 'CODE12')).rejects.toThrow(
        'You can only be part of up to 5 dorms.',
      );
    });
  });

  describe('leaveDorm', () => {
    it('leaves a dorm successfully', async () => {
      mockSupabase.match.mockResolvedValueOnce({ error: null });
      await expect(leaveDorm('user-1', 'dorm-1')).resolves.not.toThrow();
    });
  });
});
