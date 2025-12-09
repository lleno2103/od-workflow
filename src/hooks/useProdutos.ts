import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  categoria_id: string | null;
  imagem_principal: string | null;
  ativo: boolean;
  created_at: string;
  categoria?: { nome: string } | null;
}

export interface ProdutoInput {
  codigo: string;
  nome: string;
  descricao?: string;
  categoria_id?: string;
  imagem_principal?: string;
  ativo?: boolean;
}

export interface Categoria {
  id: string;
  nome: string;
  descricao: string | null;
}

// Interface that matches the actual database schema
export interface Variante {
  id: string;
  produto_id: string;
  sku: string;
  tamanho: string;
  cor: string;
  custo_producao: number;
  preco_venda: number;
  estoque: number;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VarianteInput {
  produto_id: string;
  sku: string;
  tamanho: string;
  cor: string;
  custo_producao?: number;
  preco_venda?: number;
  estoque?: number;
  ativo?: boolean;
}

export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [variantes, setVariantes] = useState<Variante[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = async () => {
    const { data, error } = await supabase
      .from('produtos')
      .select('*, categoria:categorias(nome)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar produtos');
      console.error(error);
    } else {
      setProdutos((data as Produto[]) || []);
    }
  };

  const fetchCategorias = async () => {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nome');

    if (error) {
      console.error(error);
    } else {
      setCategorias((data as Categoria[]) || []);
    }
  };

  const fetchVariantes = async () => {
    const { data, error } = await supabase
      .from('variantes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setVariantes((data as Variante[]) || []);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchProdutos(), fetchCategorias(), fetchVariantes()]);
    setLoading(false);
  };

  const createProduto = async (produto: ProdutoInput) => {
    const { data, error } = await supabase
      .from('produtos')
      .insert(produto)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar produto');
      console.error(error);
      return null;
    }
    
    toast.success('Produto criado com sucesso');
    await fetchProdutos();
    return data;
  };

  const updateProduto = async (id: string, produto: Partial<ProdutoInput>) => {
    const { error } = await supabase
      .from('produtos')
      .update(produto)
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar produto');
      console.error(error);
      return false;
    }
    
    toast.success('Produto atualizado');
    await fetchProdutos();
    return true;
  };

  const deleteProduto = async (id: string) => {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir produto');
      console.error(error);
      return false;
    }
    
    toast.success('Produto excluído');
    await fetchProdutos();
    return true;
  };

  const createCategoria = async (nome: string, descricao?: string) => {
    const { data, error } = await supabase
      .from('categorias')
      .insert({ nome, descricao })
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar categoria');
      console.error(error);
      return null;
    }
    
    toast.success('Categoria criada');
    await fetchCategorias();
    return data;
  };

  const updateCategoria = async (id: string, nome: string, descricao?: string) => {
    const { data, error } = await supabase
      .from('categorias')
      .update({ nome, descricao })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao atualizar categoria');
      console.error(error);
      return null;
    }
    
    toast.success('Categoria atualizada');
    await fetchCategorias();
    return data;
  };

  const deleteCategoria = async (id: string) => {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir categoria');
      console.error(error);
      return false;
    }
    
    toast.success('Categoria excluída');
    await fetchCategorias();
    return true;
  };

  const createVariante = async (variante: VarianteInput) => {
    const { data, error } = await supabase
      .from('variantes')
      .insert(variante)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar variante');
      console.error(error);
      return null;
    }
    
    toast.success('Variante criada');
    await fetchVariantes();
    return data;
  };

  const updateVariante = async (id: string, variante: Partial<VarianteInput>) => {
    const { data, error } = await supabase
      .from('variantes')
      .update(variante)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Erro ao atualizar variante');
      console.error(error);
      return null;
    }
    
    toast.success('Variante atualizada');
    await fetchVariantes();
    return data;
  };

  const deleteVariante = async (id: string) => {
    const { error } = await supabase
      .from('variantes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir variante');
      console.error(error);
      return false;
    }
    
    toast.success('Variante excluída');
    await fetchVariantes();
    return true;
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    produtos,
    categorias,
    variantes,
    loading,
    fetchAll,
    fetchProdutos,
    fetchCategorias,
    fetchVariantes,
    createProduto,
    updateProduto,
    deleteProduto,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    createVariante,
    updateVariante,
    deleteVariante,
  };
}
