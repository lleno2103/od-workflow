import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

const supabaseAny = supabase as any;

export interface Localizacao {
  id?: string;
  nome: string;
  descricao?: string | null;
  contagem?: number;
}

export function useLocalizacoes() {
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [usaTabela, setUsaTabela] = useState<boolean>(true);

  const fetchLocalizacoes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseAny
        .from('estoque_localizacoes')
        .select('*')
        .order('nome');
      if (error) throw error;
      setUsaTabela(true);
      setLocalizacoes((data || []) as Localizacao[]);
    } catch {
      setUsaTabela(false);
      const { data: mats } = await supabaseAny
        .from('materiais')
        .select('local_armazenamento');
      const nomes: string[] = Array.from(new Set((mats || []).map((m: any) => m.local_armazenamento).filter((n: string | null) => n && n.trim()))) as string[];
      const contagens: Record<string, number> = {};
      (mats || []).forEach((m: any) => {
        const n = m.local_armazenamento;
        if (n && n.trim()) contagens[n] = (contagens[n] || 0) + 1;
      });
      setLocalizacoes(nomes.map((n: string) => ({ nome: n, contagem: contagens[n] })));
    } finally {
      setLoading(false);
    }
  };

  const createLocalizacao = async (nome: string, descricao?: string) => {
    if (!usaTabela) {
      toast.info('Criar localizações dedicadas requer migração. Use atribuição em materiais.');
      return null;
    }
    const { data, error } = await supabaseAny
      .from('estoque_localizacoes')
      .insert({ nome, descricao: descricao || null })
      .select()
      .single();
    if (error) {
      toast.error('Erro ao criar localização');
      return null;
    }
    await fetchLocalizacoes();
    return data as Localizacao;
  };

  const renameLocalizacaoTexto = async (antigo: string, novo: string) => {
    const { error } = await supabaseAny
      .from('materiais')
      .update({ local_armazenamento: novo })
      .eq('local_armazenamento', antigo);
    if (error) {
      toast.error('Erro ao renomear localização');
      return false;
    }
    await fetchLocalizacoes();
    toast.success('Localização renomeada');
    return true;
  };

  const assignMaterial = async (materialId: string, nome: string) => {
    const { error } = await supabaseAny
      .from('materiais')
      .update({ local_armazenamento: nome })
      .eq('id', materialId);
    if (error) {
      toast.error('Erro ao atribuir material');
      return false;
    }
    await fetchLocalizacoes();
    return true;
  };

  useEffect(() => {
    fetchLocalizacoes();
  }, []);

  return {
    localizacoes,
    loading,
    usaTabela,
    fetchLocalizacoes,
    createLocalizacao,
    renameLocalizacaoTexto,
    assignMaterial,
  };
}

