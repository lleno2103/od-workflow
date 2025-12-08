import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface Semana {
  id: string;
  cronograma_id: string;
  numero: number;
  titulo: string;
  tarefas: string[];
  status: string;
  responsavel: string | null;
}

export interface Cronograma {
  id: string;
  nome: string;
  data_inicio: string;
  data_fim: string;
  semanas: Semana[];
}

export interface CronogramaInput {
  nome: string;
  data_inicio: string;
  data_fim: string;
}

export interface SemanaInput {
  cronograma_id: string;
  numero: number;
  titulo: string;
  tarefas: string[];
  status?: string;
  responsavel?: string;
}

export function useCronogramas() {
  const [cronogramas, setCronogramas] = useState<Cronograma[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCronogramas = async () => {
    setLoading(true);
    
    const { data: cronogramasData, error: cronogramasError } = await supabase
      .from('cronogramas')
      .select('*')
      .order('created_at', { ascending: false });

    if (cronogramasError) {
      toast.error('Erro ao carregar cronogramas');
      console.error(cronogramasError);
      setLoading(false);
      return;
    }

    const { data: semanasData, error: semanasError } = await supabase
      .from('cronograma_semanas')
      .select('*')
      .order('numero');

    if (semanasError) {
      console.error(semanasError);
    }

    const cronogramasWithSemanas = (cronogramasData || []).map((cronograma: any) => ({
      ...cronograma,
      semanas: (semanasData || []).filter((semana: any) => semana.cronograma_id === cronograma.id)
    }));

    setCronogramas(cronogramasWithSemanas as Cronograma[]);
    setLoading(false);
  };

  const createCronograma = async (cronograma: CronogramaInput, semanas: Omit<SemanaInput, 'cronograma_id'>[]) => {
    const { data: cronogramaData, error: cronogramaError } = await supabase
      .from('cronogramas')
      .insert(cronograma)
      .select()
      .single();

    if (cronogramaError) {
      toast.error('Erro ao criar cronograma');
      console.error(cronogramaError);
      return null;
    }

    if (semanas.length > 0) {
      const semanasWithId = semanas.map(semana => ({
        ...semana,
        cronograma_id: cronogramaData.id
      }));

      const { error: semanasError } = await supabase
        .from('cronograma_semanas')
        .insert(semanasWithId);

      if (semanasError) {
        toast.error('Erro ao criar semanas do cronograma');
        console.error(semanasError);
      }
    }
    
    toast.success('Cronograma criado com sucesso');
    await fetchCronogramas();
    return cronogramaData;
  };

  const updateSemanaStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('cronograma_semanas')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar status');
      console.error(error);
      return false;
    }
    
    toast.success('Status atualizado');
    await fetchCronogramas();
    return true;
  };

  const deleteCronograma = async (id: string) => {
    const { error } = await supabase
      .from('cronogramas')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir cronograma');
      console.error(error);
      return false;
    }
    
    toast.success('Cronograma excluído');
    await fetchCronogramas();
    return true;
  };

  useEffect(() => {
    fetchCronogramas();
  }, []);

  return {
    cronogramas,
    loading,
    fetchCronogramas,
    createCronograma,
    updateSemanaStatus,
    deleteCronograma,
  };
}
