import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface OrdemProducao {
  id: string;
  numero: string;
  data: string;
  produto_id: string;
  variante: string;
  cor: string;
  quantidade: number;
  metragem: number | null;
  tecido: string | null;
  status: string;
  responsavel: string | null;
  prazo: string | null;
  observacoes: string | null;
  produto?: { nome: string } | null;
}

export interface OrdemProducaoInput {
  numero: string;
  data: string;
  produto_id: string;
  variante: string;
  cor: string;
  quantidade: number;
  metragem?: number;
  tecido?: string;
  status?: string;
  responsavel?: string;
  prazo?: string;
  observacoes?: string;
}

export function useOrdensProducao() {
  const [ordens, setOrdens] = useState<OrdemProducao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrdens = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ordens_producao')
      .select('*, produto:produtos(nome)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar ordens de produção');
      console.error(error);
    } else {
      setOrdens((data as OrdemProducao[]) || []);
    }
    setLoading(false);
  };

  const generateNextOpNumber = (ordensAtuais: OrdemProducao[]): string => {
    if (ordensAtuais.length === 0) {
      return 'OP-0001';
    }

    // Extrai os números das OPs existentes
    const numeros = ordensAtuais
      .map(op => {
        const match = op.numero.match(/OP-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .sort((a, b) => b - a); // Ordena em ordem decrescente

    // Pega o maior número e adiciona 1
    const proximoNumero = numeros[0] + 1;
    return `OP-${String(proximoNumero).padStart(4, '0')}`;
  };

  const createOrdem = async (ordem: OrdemProducaoInput) => {
    const { data, error } = await supabase
      .from('ordens_producao')
      .insert(ordem)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar ordem de produção');
      console.error(error);
      return null;
    }
    
    toast.success('Ordem de produção criada com sucesso');
    await fetchOrdens();
    return data;
  };

  const updateOrdem = async (id: string, ordem: Partial<OrdemProducaoInput>) => {
    const { error } = await supabase
      .from('ordens_producao')
      .update(ordem)
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar ordem de produção');
      console.error(error);
      return false;
    }
    
    toast.success('Ordem de produção atualizada');
    await fetchOrdens();
    return true;
  };

  const deleteOrdem = async (id: string) => {
    const { error } = await supabase
      .from('ordens_producao')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir ordem de produção');
      console.error(error);
      return false;
    }
    
    toast.success('Ordem de produção excluída');
    await fetchOrdens();
    return true;
  };

  useEffect(() => {
    fetchOrdens();
  }, []);

  return {
    ordens,
    loading,
    fetchOrdens,
    createOrdem,
    updateOrdem,
    deleteOrdem,
    generateNextOpNumber,
  };
}
