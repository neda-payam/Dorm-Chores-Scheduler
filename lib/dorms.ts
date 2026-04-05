import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from './auth';
import { formatErrorMessage } from './errors';
import { supabase } from './supabase';

const MAX_DORMS_CREATED_PER_USER = 3;
const MAX_DORM_MEMBERSHIPS_PER_USER = 5;

function isMissingTableError(error: any): boolean {
  if (!error) return false;
  const code = error.code || '';
  const message = String(error.message || '').toLowerCase();

  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    message.includes('could not find the table') ||
    message.includes('schema cache')
  );
}

async function deleteByDormId(table: string, dormId: string): Promise<void> {
  const { error } = await supabase.from(table).delete().eq('dorm_id', dormId);
  if (error && !isMissingTableError(error)) {
    throw new Error(formatErrorMessage(error.message));
  }
}

async function tryDeleteDormRow(dormId: string) {
  return await supabase.from('dorms').delete().eq('id', dormId).select('id').maybeSingle();
}

export interface DormData {
  name: string;
  join_code?: string;
}

export interface Dorm {
  id: string;
  name: string;
  join_code: string;
  created_by: string;
  created_at: string;
}

export interface DormMember {
  user_id: string;
  dorm_id: string;
  joined_at: string;
}

export async function getDormById(dormId: string): Promise<Dorm | null> {
  if (!dormId) throw new Error('Dorm ID is required');

  const { data, error } = await supabase.from('dorms').select('*').eq('id', dormId).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(formatErrorMessage(error.message));
  }
  return data as Dorm;
}

export async function getDormsByManager(userId: string): Promise<Dorm[]> {
  if (!userId) throw new Error('User ID is required');

  const { data, error } = await supabase
    .from('dorms')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(formatErrorMessage(error.message));
  return data as Dorm[];
}

export async function getDormMembers(dormId: string): Promise<DormMember[]> {
  if (!dormId) throw new Error('Dorm ID is required');

  const { data, error } = await supabase
    .from('dorm_members')
    .select('*')
    .eq('dorm_id', dormId)
    .order('joined_at', { ascending: false });

  if (error) throw new Error(formatErrorMessage(error.message));
  return data as DormMember[];
}

export async function generateInviteCode(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createDorm(dormData: DormData, userId: string): Promise<Dorm> {
  if (!dormData.name || dormData.name.trim() === '') {
    throw new Error('Dorm name is required');
  }
  if (!userId) throw new Error('User ID is required');

  const { count: createdCount, error: createdCountError } = await supabase
    .from('dorms')
    .select('id', { count: 'exact', head: true })
    .eq('created_by', userId);

  if (createdCountError) throw new Error(formatErrorMessage(createdCountError.message));
  if ((createdCount || 0) >= MAX_DORMS_CREATED_PER_USER) {
    throw new Error(
      `You can only create up to ${MAX_DORMS_CREATED_PER_USER} dorms. Delete one you created to make room.`,
    );
  }

  const { count: membershipCount, error: membershipCountError } = await supabase
    .from('dorm_members')
    .select('dorm_id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (membershipCountError) throw new Error(formatErrorMessage(membershipCountError.message));
  if ((membershipCount || 0) >= MAX_DORM_MEMBERSHIPS_PER_USER) {
    throw new Error(`You can only be part of up to ${MAX_DORM_MEMBERSHIPS_PER_USER} dorms.`);
  }

  const joinCode = await generateInviteCode();

  const { data, error } = await supabase
    .from('dorms')
    .insert([
      {
        name: dormData.name.trim(),
        join_code: joinCode,
        created_by: userId,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(formatErrorMessage(error.message));
  return data as Dorm;
}

export async function updateDorm(dormId: string, updatedData: Partial<DormData>): Promise<Dorm> {
  if (!dormId) throw new Error('Dorm ID is required');
  if (updatedData.name !== undefined && updatedData.name.trim() === '') {
    throw new Error('Dorm name cannot be empty');
  }

  const { data, error } = await supabase
    .from('dorms')
    .update(updatedData)
    .eq('id', dormId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') throw new Error('Dorm not found');
    throw new Error(formatErrorMessage(error.message));
  }
  return data as Dorm;
}

export async function deleteDorm(dormId: string): Promise<void> {
  if (!dormId) throw new Error('Dorm ID is required');

  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data: dorm, error: fetchError } = await supabase
    .from('dorms')
    .select('created_by')
    .eq('id', dormId)
    .single();

  if (fetchError) throw new Error(formatErrorMessage(fetchError.message));
  if (!dorm) throw new Error('Dorm not found');

  if (dorm.created_by !== user.id) {
    throw new Error('Only the creator of the dorm can delete it.');
  }

  const firstAttempt = await tryDeleteDormRow(dormId);
  if (!firstAttempt.error && firstAttempt.data) {
    return;
  }

  if (firstAttempt.error && firstAttempt.error.code === '23503') {
    await deleteByDormId('chores', dormId);
    await deleteByDormId('repair_requests', dormId);
    await deleteByDormId('repairs', dormId);
    await deleteByDormId('dorm_members', dormId);

    const retryAttempt = await tryDeleteDormRow(dormId);
    if (retryAttempt.error) throw new Error(formatErrorMessage(retryAttempt.error.message));
    if (!retryAttempt.data) {
      throw new Error('Dorm was not deleted. You may not have permission to delete this dorm.');
    }
    return;
  }

  if (firstAttempt.error) {
    throw new Error(formatErrorMessage(firstAttempt.error.message));
  }

  if (!firstAttempt.data) {
    throw new Error('Dorm was not deleted. You may not have permission to delete this dorm.');
  }
}

export async function joinDorm(userId: string, joinCode: string): Promise<DormMember> {
  if (!userId) throw new Error('User ID is required');
  if (!joinCode) throw new Error('Join code is required');

  const { count: membershipCount, error: membershipCountError } = await supabase
    .from('dorm_members')
    .select('dorm_id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (membershipCountError) throw new Error(formatErrorMessage(membershipCountError.message));
  if ((membershipCount || 0) >= MAX_DORM_MEMBERSHIPS_PER_USER) {
    throw new Error(`You can only be part of up to ${MAX_DORM_MEMBERSHIPS_PER_USER} dorms.`);
  }

  const { data: dorm, error: dormError } = await supabase
    .from('dorms')
    .select('*')
    .eq('join_code', joinCode.trim().toUpperCase())
    .single();

  if (dormError || !dorm) {
    throw new Error('Invalid join code or dorm not found');
  }

  const { data, error } = await supabase
    .from('dorm_members')
    .insert([
      {
        user_id: userId,
        dorm_id: dorm.id,
      },
    ])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('User is already in a dorm');
    }
    throw new Error(formatErrorMessage(error.message));
  }

  return data as DormMember;
}

export async function leaveDorm(userId: string, dormId: string): Promise<void> {
  if (!userId) throw new Error('User ID is required');
  if (!dormId) throw new Error('Dorm ID is required');

  const { error } = await supabase
    .from('dorm_members')
    .delete()
    .match({ user_id: userId, dorm_id: dormId });

  if (error) throw new Error(formatErrorMessage(error.message));
}

export async function inviteUserToDorm(userId: string, dormId: string): Promise<DormMember> {
  if (!userId) throw new Error('User ID is required');
  if (!dormId) throw new Error('Dorm ID is required');

  const { count: membershipCount, error: membershipCountError } = await supabase
    .from('dorm_members')
    .select('dorm_id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (membershipCountError) throw new Error(formatErrorMessage(membershipCountError.message));
  if ((membershipCount || 0) >= MAX_DORM_MEMBERSHIPS_PER_USER) {
    throw new Error(`You can only be part of up to ${MAX_DORM_MEMBERSHIPS_PER_USER} dorms.`);
  }

  const { data, error } = await supabase
    .from('dorm_members')
    .insert([
      {
        user_id: userId,
        dorm_id: dormId,
      },
    ])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('User is already in a dorm');
    }
    throw new Error(formatErrorMessage(error.message));
  }

  return data as DormMember;
}

export async function getActiveDormId(): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user?.id) return null;

  try {
    const activeDormId = await AsyncStorage.getItem(`active_dorm_id_${user.id}`);
    if (activeDormId) {
      const { data, error } = await supabase
        .from('dorm_members')
        .select('dorm_id')
        .eq('user_id', user.id)
        .eq('dorm_id', activeDormId)
        .single();

      if (!error && data) {
        return activeDormId;
      }
    }
  } catch (err) {
    console.warn('Failed to read active dorm from storage', err);
  }

  const { data: members, error } = await supabase
    .from('dorm_members')
    .select('dorm_id')
    .eq('user_id', user.id)
    .order('joined_at', { ascending: false })
    .limit(1);

  if (error || !members || members.length === 0) return null;
  return members[0].dorm_id;
}

export async function setActiveDormId(dormId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user?.id) return;
  await AsyncStorage.setItem(`active_dorm_id_${user.id}`, dormId);
}
