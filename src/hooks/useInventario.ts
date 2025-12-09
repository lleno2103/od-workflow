import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

const supabaseAny = supabase as any;

export interface Inventario {
  id: string;
  numero: string;
  data: string;
  status: 'rascunho' | 'finalizado';
  observacoes?: string | null;
  itens?: ItemInventario[];
}

export interface ItemInventario {
  id?: string;
  inventario_id?: string;
  material_id?: string | null;
  material_nome: string;
  unidade: string;
  quantidade_sistema: number;
  quantidade_contada: number;
  diferenca?: number;
}

export interface InventarioInput {
  numero: string;
  data?: string;
  observacoes?: string;
}

export function useInventario() {
  const [inventarios, setInventarios] = useState<Inventario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventarios = async () => {
    setLoading(true);
    try {
      const { data: invs, error: invErr } = await supabaseAny
        .from('estoque_inventarios')
        .select('*')
        .order('data', { ascending: false })
        .order('created_at', { ascending: false });

      if (invErr) throw invErr;

      const { data: itens, error: itensErr } = await supabaseAny
        .from('estoque_itens_inventario')
        .select('*');
      if (itensErr) throw itensErr;

      const joined = (invs || []).map((inv: any) => ({
        ...inv,
        itens: (itens || []).filter((i: any) => i.inventario_id === inv.id)
      }));
      setInventarios(joined as Inventario[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createInventarioComItens = async (inv: InventarioInput, itens: ItemInventario[]) => {
    try {
      const { data: invData, error: invErr } = await supabaseAny
        .from('estoque_inventarios')
        .insert({
          numero: inv.numero,
          data: inv.data || new Date().toISOString().split('T')[0],
          status: 'rascunho',
          observacoes: inv.observacoes || null,
        })
        .select()
        .single();
      if (invErr) throw invErr;

      if (itens.length > 0) {
        const payload = itens.map(i => ({
          inventario_id: invData.id,
          material_id: i.material_id || null,
          material_nome: i.material_nome,
          unidade: i.unidade,
          quantidade_sistema: i.quantidade_sistema,
          quantidade_contada: i.quantidade_contada,
          diferenca: (i.quantidade_contada - i.quantidade_sistema),
        }));
        const { error: itensErr } = await supabaseAny
          .from('estoque_itens_inventario')
          .insert(payload);
        if (itensErr) throw itensErr;
      }

      toast.success('Inventário criado');
      await fetchInventarios();
      return invData;
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Erro ao criar inventário');
      return null;
    }
  };

  const finalizarInventario = async (id: string) => {
    try {
      const { data: itens, error } = await supabaseAny
        .from('estoque_itens_inventario')
        .select('*')
        .eq('inventario_id', id);
      if (error) throw error;

      for (const item of itens || []) {
        if (item.material_id) {
          await supabaseAny
            .from('materiais')
            .update({ estoque_atual: item.quantidade_contada })
            .eq('id', item.material_id);
        }
      }

      await supabaseAny
        .from('estoque_inventarios')
        .update({ status: 'finalizado' })
        .eq('id', id);

      toast.success('Inventário finalizado');
      await fetchInventarios();
      return true;
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Erro ao finalizar inventário');
      return false;
    }
  };

  const deleteInventario = async (id: string) => {
    try {
      const { error } = await supabaseAny
        .from('estoque_inventarios')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Inventário excluído');
      await fetchInventarios();
      return true;
    } catch (e) {
      console.error(e);
      toast.error('Erro ao excluir inventário');
      return false;
    }
  };

  useEffect(() => {
    fetchInventarios();
  }, []);

  return {
    inventarios,
    loading,
    fetchInventarios,
    createInventarioComItens,
    finalizarInventario,
    deleteInventario,
  };
}

