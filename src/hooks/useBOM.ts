import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface BOMItem {
  id: string;
  bom_id: string;
  tipo: string;
  nome: string;
  quantidade: number;
  unidade: string;
  custo: number;
}

export interface BOM {
  id: string;
  produto_id: string;
  variante: string | null;
  produto?: { nome: string } | null;
  items: BOMItem[];
}

export interface BOMInput {
  produto_id: string;
  variante?: string;
}

export interface BOMItemInput {
  bom_id: string;
  tipo: string;
  nome: string;
  quantidade: number;
  unidade: string;
  custo: number;
}

export function useBOM() {
  const [boms, setBoms] = useState<BOM[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBOMs = async () => {
    setLoading(true);
    
    const { data: bomsData, error: bomsError } = await supabase
      .from('bom')
      .select('*, produto:produtos(nome)')
      .order('created_at', { ascending: false });

    if (bomsError) {
      toast.error('Erro ao carregar lista de materiais');
      console.error(bomsError);
      setLoading(false);
      return;
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('bom_items')
      .select('*');

    if (itemsError) {
      console.error(itemsError);
    }

    const bomsWithItems = (bomsData || []).map((bom: any) => ({
      ...bom,
      items: (itemsData || []).filter((item: any) => item.bom_id === bom.id)
    }));

    setBoms(bomsWithItems as BOM[]);
    setLoading(false);
  };

  const createBOM = async (bom: BOMInput) => {
    const { data, error } = await supabase
      .from('bom')
      .insert(bom)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar lista de materiais');
      console.error(error);
      return null;
    }
    
    toast.success('Lista de materiais criada');
    await fetchBOMs();
    return data;
  };

  const deleteBOM = async (id: string) => {
    const { error } = await supabase
      .from('bom')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir lista de materiais');
      console.error(error);
      return false;
    }
    
    toast.success('Lista de materiais excluída');
    await fetchBOMs();
    return true;
  };

  const addBOMItem = async (item: BOMItemInput) => {
    const { data, error } = await supabase
      .from('bom_items')
      .insert(item)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao adicionar item');
      console.error(error);
      return null;
    }
    
    toast.success('Item adicionado');
    await fetchBOMs();
    return data;
  };

  const updateBOMItem = async (id: string, item: Partial<BOMItemInput>) => {
    const { error } = await supabase
      .from('bom_items')
      .update(item)
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar item');
      console.error(error);
      return false;
    }
    
    toast.success('Item atualizado');
    await fetchBOMs();
    return true;
  };

  const deleteBOMItem = async (id: string) => {
    const { error } = await supabase
      .from('bom_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir item');
      console.error(error);
      return false;
    }
    
    toast.success('Item excluído');
    await fetchBOMs();
    return true;
  };

  useEffect(() => {
    fetchBOMs();
  }, []);

  return {
    boms,
    loading,
    fetchBOMs,
    createBOM,
    deleteBOM,
    addBOMItem,
    updateBOMItem,
    deleteBOMItem,
  };
}
