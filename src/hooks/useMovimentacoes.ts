import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

const supabaseAny = supabase as any;

export interface Movimentacao {
  id: string;
  tipo: 'entrada' | 'saida';
  origem?: string | null;
  documento?: string | null;
  data: string;
  observacoes?: string | null;
  created_at: string;
  itens?: ItemMovimentacao[];
}

export interface ItemMovimentacao {
  id?: string;
  movimentacao_id?: string;
  material_id?: string | null;
  material_nome: string;
  quantidade: number;
  unidade: string;
  custo_unitario?: number;
  local_armazenamento?: string | null;
}

export interface MovimentacaoInput {
  tipo: 'entrada' | 'saida';
  origem?: string;
  documento?: string;
  data?: string;
  observacoes?: string;
}

export function useMovimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovimentacoes = async () => {
    setLoading(true);
    try {
      const { data: movs, error: movErr } = await supabaseAny
        .from('estoque_movimentacoes')
        .select('*')
        .order('data', { ascending: false })
        .order('created_at', { ascending: false });

      if (movErr) throw movErr;

      const { data: itens, error: itensErr } = await supabaseAny
        .from('estoque_itens_movimentacao')
        .select('*');

      if (itensErr) throw itensErr;

      const byMov = (movs || []).map((m: any) => ({
        ...m,
        itens: (itens || []).filter((i: any) => i.movimentacao_id === m.id)
      }));
      setMovimentacoes(byMov as Movimentacao[]);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar movimentações');
    } finally {
      setLoading(false);
    }
  };

  const createMovimentacaoComItens = async (mov: MovimentacaoInput, itens: ItemMovimentacao[]) => {
    try {
      const { data: movData, error: movErr } = await supabaseAny
        .from('estoque_movimentacoes')
        .insert({
          tipo: mov.tipo,
          origem: mov.origem || null,
          documento: mov.documento || null,
          data: mov.data || new Date().toISOString().split('T')[0],
          observacoes: mov.observacoes || null,
        })
        .select()
        .single();

      if (movErr) throw movErr;

      if (itens.length > 0) {
        const payload = itens.map(i => ({
          movimentacao_id: movData.id,
          material_id: i.material_id || null,
          material_nome: i.material_nome,
          quantidade: i.quantidade,
          unidade: i.unidade,
          custo_unitario: i.custo_unitario ?? 0,
          local_armazenamento: i.local_armazenamento || null,
        }));
        const { error: itensErr } = await supabaseAny
          .from('estoque_itens_movimentacao')
          .insert(payload);
        if (itensErr) throw itensErr;
      }

      toast.success('Movimentação registrada');
      await fetchMovimentacoes();
      return movData;
    } catch (e: any) {
      console.error(e);
      toast.error(`Erro ao registrar movimentação: ${e.message || e}`);
      return null;
    }
  };

  const deleteMovimentacao = async (id: string) => {
    try {
      const { error } = await supabaseAny
        .from('estoque_movimentacoes')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Movimentação excluída');
      await fetchMovimentacoes();
      return true;
    } catch (e) {
      console.error(e);
      toast.error('Erro ao excluir movimentação');
      return false;
    }
  };

  useEffect(() => {
    fetchMovimentacoes();
  }, []);

  return {
    movimentacoes,
    loading,
    fetchMovimentacoes,
    createMovimentacaoComItens,
    deleteMovimentacao,
  };
}

