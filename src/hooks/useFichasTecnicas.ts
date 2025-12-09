import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface FichaTecnica {
  id: string;
  codigo: string;
  produto_id: string;
  variante: string;
  material: string | null;
  fornecedor: string | null;
  composicao: string | null;
  medidas: any;
  especificacoes_costura: any;
  observacoes: string | null;
  ativo: boolean;
  produto?: { nome: string } | null;
}

export interface FichaTecnicaInput {
  codigo: string;
  produto_id: string;
  variante: string;
  material?: string;
  fornecedor?: string;
  composicao?: string;
  medidas?: Record<string, any>;
  especificacoes_costura?: Record<string, any>;
  observacoes?: string;
  ativo?: boolean;
}

export function useFichasTecnicas() {
  const [fichas, setFichas] = useState<FichaTecnica[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFichas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('fichas_tecnicas')
      .select('*, produto:produtos(nome)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar fichas técnicas');
      console.error(error);
    } else {
      setFichas((data as FichaTecnica[]) || []);
    }
    setLoading(false);
  };

  const generateNextFtNumber = (fichasAtuais: FichaTecnica[]): string => {
    if (fichasAtuais.length === 0) {
      return 'FT-0001';
    }

    // Extrai os números das FTs existentes
    const numeros = fichasAtuais
      .map(ft => {
        const match = ft.codigo.match(/FT-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .sort((a, b) => b - a); // Ordena em ordem decrescente

    // Pega o maior número e adiciona 1
    const proximoNumero = numeros[0] + 1;
    return `FT-${String(proximoNumero).padStart(4, '0')}`;
  };

  const createFicha = async (ficha: FichaTecnicaInput) => {
    const { data, error } = await supabase
      .from('fichas_tecnicas')
      .insert(ficha)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar ficha técnica');
      console.error(error);
      return null;
    }
    
    toast.success('Ficha técnica criada com sucesso');
    await fetchFichas();
    return data;
  };

  const updateFicha = async (id: string, ficha: Partial<FichaTecnicaInput>) => {
    const { error } = await supabase
      .from('fichas_tecnicas')
      .update(ficha)
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar ficha técnica');
      console.error(error);
      return false;
    }
    
    toast.success('Ficha técnica atualizada');
    await fetchFichas();
    return true;
  };

  const deleteFicha = async (id: string) => {
    const { error } = await supabase
      .from('fichas_tecnicas')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir ficha técnica');
      console.error(error);
      return false;
    }
    
    toast.success('Ficha técnica excluída');
    await fetchFichas();
    return true;
  };

  useEffect(() => {
    fetchFichas();
  }, []);

  return {
    fichas,
    loading,
    fetchFichas,
    createFicha,
    updateFicha,
    deleteFicha,
    generateNextFtNumber,
  };
}
