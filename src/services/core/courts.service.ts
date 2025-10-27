import { createClient } from '@/lib/supabase/client';
import type { Court, Schedule, CourtBlock } from '@/types/courts.types';
import type { CourtFormData, ScheduleFormData, CourtBlockFormData } from '@/lib/validations/court.schema';

const supabase = createClient();

// ============================================================
// COURTS (Quadras)
// ============================================================

export const courtsService = {
  // Listar todas as quadras
  async getAll(): Promise<Court[]> {
    const { data, error } = await supabase
      .from('quadras')
      .select('*')
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  // Buscar quadra por ID
  async getById(id: string): Promise<Court | null> {
    const { data, error } = await supabase
      .from('quadras')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Criar quadra
  async create(courtData: CourtFormData): Promise<Court> {
    const { data, error } = await supabase
      .from('quadras')
      .insert([courtData])
      .select()
      .single();

    if (error) {
      console.error('[courtsService] Erro ao criar quadra:', error);
      throw new Error(error.message || 'Erro ao criar quadra');
    }
    return data;
  },

  // Atualizar quadra
  async update(id: string, courtData: Partial<CourtFormData>): Promise<Court> {
    const { data, error } = await supabase
      .from('quadras')
      .update(courtData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[courtsService] Erro ao atualizar quadra:', error);
      throw new Error(error.message || 'Erro ao atualizar quadra');
    }
    return data;
  },

  // Deletar quadra
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('quadras')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Ativar/Desativar quadra
  async toggleActive(id: string, status: 'ativa' | 'inativa' | 'manutencao'): Promise<Court> {
    return this.update(id, { status } as Partial<CourtFormData>);
  },
};

// ============================================================
// SCHEDULES (Grade Horária)
// ============================================================

export const schedulesService = {
  // Listar horários de uma quadra
  async getByCourt(courtId: string): Promise<Schedule[]> {
    const { data, error } = await supabase
      .from('horarios')
      .select('*')
      .eq('quadra_id', courtId)
      .order('dia_semana')
      .order('hora_inicio');

    if (error) throw error;
    return data || [];
  },

  // Criar horário
  async create(scheduleData: ScheduleFormData): Promise<Schedule> {
    const { data, error } = await supabase
      .from('horarios')
      .insert([scheduleData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Atualizar horário
  async update(id: string, scheduleData: Partial<ScheduleFormData>): Promise<Schedule> {
    const { data, error } = await supabase
      .from('horarios')
      .update(scheduleData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Deletar horário
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('horarios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Ativar/Desativar horário
  async toggleActive(id: string, ativo: boolean): Promise<Schedule> {
    return this.update(id, { ativo });
  },
};

// ============================================================
// COURT_BLOCKS (Bloqueios)
// ============================================================

export const courtBlocksService = {
  // Listar TODOS os bloqueios
  async getAll(): Promise<CourtBlock[]> {
    const { data, error } = await supabase
      .from('court_blocks')
      .select('*')
      .order('data_inicio', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Listar bloqueios de uma quadra
  async getByCourt(courtId: string): Promise<CourtBlock[]> {
    const { data, error } = await supabase
      .from('court_blocks')
      .select('*')
      .eq('quadra_id', courtId)
      .order('data_inicio', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Criar bloqueio
  async create(blockData: CourtBlockFormData & { created_by?: string }): Promise<CourtBlock> {
    const { data, error } = await supabase
      .from('court_blocks')
      .insert([blockData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Atualizar bloqueio
  async update(id: string, blockData: Partial<CourtBlockFormData>): Promise<CourtBlock> {
    const { data, error } = await supabase
      .from('court_blocks')
      .update(blockData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Deletar bloqueio
  async delete(id: string): Promise<void> {
    const { error} = await supabase
      .from('court_blocks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
