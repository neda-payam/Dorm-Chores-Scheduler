import { getDormMembers } from './dorms';
import { formatErrorMessage } from './errors';
import { supabase } from './supabase';

export interface ChoreMeta {
  due_in_days?: number;
  assignedTo?: string | null;
  category?: string | null;
  isRecurring?: boolean | null;
  frequency?: string | null;
  rotation?: string[];
  rotIdx?: number;
}

export interface ChoreData {
  title: string;
  description?: string;
  status?: string;
  due_in_days?: number;
  meta?: ChoreMeta;
}

export interface Chore extends ChoreData {
  id: string;
  dorm_id: string;
  created_at: string;
  assignedName?: string;
}

export function packChoreData(data: ChoreData): any {
  const payload: any = {
    title: data.title,
    status: data.status,
  };
  if (data.meta) {
    const metaStr = JSON.stringify(data.meta);
    payload.description = `${data.description || ''}___META=${metaStr}`;
  } else {
    payload.description = data.description || null;
  }
  return payload;
}

export function parseChore(data: any): Chore {
  const chore: Chore = { ...data };
  if (chore.description && chore.description.includes('___META=')) {
    const parts = chore.description.split('___META=');
    chore.description = parts[0];
    try {
      chore.meta = JSON.parse(parts[1]);
    } catch (e) {
      chore.meta = {};
    }
  } else {
    chore.meta = {};
  }
  return chore;
}

export async function getChores(dormId: string): Promise<Chore[]> {
  if (!dormId) throw new Error('Dorm ID is required');

  const { data, error } = await supabase
    .from('chores')
    .select('*')
    .eq('dorm_id', dormId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(formatErrorMessage(error.message));
  const chores = (data as any[]).map(parseChore);

  const assigneeIds = [
    ...new Set(chores.map((c) => c.meta?.assignedTo).filter(Boolean)),
  ] as string[];
  if (assigneeIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', assigneeIds);

    if (profiles) {
      const profileMap = profiles.reduce(
        (acc, p) => {
          acc[p.id] = p.display_name;
          return acc;
        },
        {} as Record<string, string>,
      );

      chores.forEach((c) => {
        if (c.meta?.assignedTo) {
          c.assignedName = profileMap[c.meta.assignedTo] || 'Unknown User';
        }
      });
    }
  }

  return chores;
}

export async function getChoreById(choreId: string): Promise<Chore | null> {
  if (!choreId) throw new Error('Chore ID is required');

  const { data, error } = await supabase.from('chores').select('*').eq('id', choreId).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(formatErrorMessage(error.message));
  }
  return parseChore(data);
}

export async function createChore(dormId: string, choreData: ChoreData): Promise<Chore> {
  if (!dormId) throw new Error('Dorm ID is required');
  if (!choreData.title || choreData.title.trim() === '') {
    throw new Error('Chore title is required');
  }

  if (!choreData.meta?.assignedTo) {
    const members = await getDormMembers(dormId);
    if (members && members.length > 0) {
      const rotation = members.map((m) => m.user_id).sort(() => Math.random() - 0.5);

      choreData.meta = {
        ...choreData.meta,
        assignedTo: rotation[0],
        rotation: rotation,
        rotIdx: 0,
      };
    }
  }

  const { data, error } = await supabase
    .from('chores')
    .insert([
      {
        dorm_id: dormId,
        ...packChoreData(choreData),
      },
    ])
    .select()
    .single();

  if (error) throw new Error(formatErrorMessage(error.message));
  return parseChore(data);
}

export async function updateChore(
  choreId: string,
  updatedData: Partial<ChoreData>,
): Promise<Chore> {
  if (!choreId) throw new Error('Chore ID is required');
  if (updatedData.title !== undefined && updatedData.title.trim() === '') {
    throw new Error('Chore title cannot be empty');
  }

  const baseChore = await getChoreById(choreId);
  if (!baseChore) throw new Error('Chore not found');

  const mergedMeta = { ...baseChore.meta, ...updatedData.meta };

  const { data, error } = await supabase
    .from('chores')
    .update(
      packChoreData({
        ...baseChore,
        ...updatedData,
        meta: mergedMeta,
      }),
    )
    .eq('id', choreId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') throw new Error('Chore not found');
    throw new Error(formatErrorMessage(error.message));
  }
  return parseChore(data);
}

export async function deleteChore(choreId: string): Promise<void> {
  if (!choreId) throw new Error('Chore ID is required');

  const { error } = await supabase.from('chores').delete().eq('id', choreId);

  if (error) throw new Error(formatErrorMessage(error.message));
}

export async function markChoreComplete(choreId: string): Promise<Chore> {
  if (!choreId) throw new Error('Chore ID is required');

  const chore = await getChoreById(choreId);
  if (!chore) throw new Error('Chore not found');
  if (chore.status === 'completed') throw new Error('Chore is already completed');

  const completedChore = await updateChore(choreId, { status: 'completed' });

  if (chore.meta?.isRecurring && chore.meta?.rotation && chore.meta.rotation.length > 0) {
    const nextIdx = ((chore.meta.rotIdx || 0) + 1) % chore.meta.rotation.length;
    const nextAssignee = chore.meta.rotation[nextIdx];

    await createChore(chore.dorm_id, {
      title: chore.title,
      description: chore.description,
      status: 'assigned',
      meta: {
        ...chore.meta,
        assignedTo: nextAssignee,
        rotIdx: nextIdx,
      },
    });
  }

  return completedChore;
}
