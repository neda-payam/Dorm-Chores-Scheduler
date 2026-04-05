import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from './auth';
import { formatErrorMessage } from './errors';
import { supabase } from './supabase';

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

  // Remove all associated dependencies to prevent foreign key errors.
  // We ignore errors on dependencies in case the tables are empty or rename/missing.
  await supabase.from('chores').delete().eq('dorm_id', dormId);
  await supabase.from('repair_requests').delete().eq('dorm_id', dormId);
  await supabase.from('repairs').delete().eq('dorm_id', dormId);
  await supabase.from('dorm_members').delete().eq('dorm_id', dormId);

  const { error } = await supabase.from('dorms').delete().eq('id', dormId);

  if (error) throw new Error(formatErrorMessage(error.message));
}

export async function joinDorm(userId: string, joinCode: string): Promise<DormMember> {
  if (!userId) throw new Error('User ID is required');
  if (!joinCode) throw new Error('Join code is required');

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
