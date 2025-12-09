import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

// Cast supabase to any to generic support tables not in type definition yet
const supabaseAny = supabase as any;

export interface Material {
    id: string;
    nome: string;
    tipo: string;
    codigo: string;
    unidade_medida: string;
    custo_unitario: number;
    estoque_atual: number;
    estoque_minimo: number;
    cor?: string;
    foto?: string;
    ativo: boolean;
    // New fields
    descricao_curta?: string;
    detalhes?: Record<string, any>;
    unidade_compra?: string;
    preco_compra?: number;
    qtd_por_unidade_compra?: number;
    local_armazenamento?: string;
    fornecedor_nome?: string;
    fornecedor_cnpj?: string;
    fornecedor_contato?: string;
    fornecedor_link?: string;
    fornecedor_prazo?: string;
    fornecedor_pagamento?: string;
    observacoes_uso?: string;
    rendimento_medio?: string;
    perdas_estimadas?: number;
    created_at?: string;
    updated_at?: string;
}

export interface MaterialInput {
    nome: string;
    tipo: string;
    codigo?: string;
    unidade_medida: string;
    custo_unitario: number;
    estoque_atual: number;
    estoque_minimo: number;
    cor?: string;
    foto?: string;
    ativo?: boolean;
    // New fields
    descricao_curta?: string;
    detalhes?: Record<string, any>;
    unidade_compra?: string;
    preco_compra?: number;
    qtd_por_unidade_compra?: number;
    local_armazenamento?: string;
    fornecedor_nome?: string;
    fornecedor_cnpj?: string;
    fornecedor_contato?: string;
    fornecedor_link?: string;
    fornecedor_prazo?: string;
    fornecedor_pagamento?: string;
    observacoes_uso?: string;
    rendimento_medio?: string;
    perdas_estimadas?: number;
}

export function useMateriais() {
    const [materiais, setMateriais] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMateriais = async () => {
        setLoading(true);
        const { data, error } = await supabaseAny
            .from('materiais')
            .select('*')
            .order('nome');

        if (error) {
            console.error('Erro ao carregar materiais:', error);
        } else {
            setMateriais((data as unknown as Material[]) || []);
        }
        setLoading(false);
    };

    const createMaterial = async (material: MaterialInput) => {
        const { data, error } = await supabaseAny
            .from('materiais')
            .insert(material)
            .select()
            .single();

        if (error) {
            toast.error(`Erro ao criar material: ${error.message}`);
            console.error('Erro detalhado:', error);
            return null;
        }

        toast.success('Material criado com sucesso');
        await fetchMateriais();
        return data;
    };

    const updateMaterial = async (id: string, material: Partial<MaterialInput>) => {
        const { data, error } = await supabaseAny
            .from('materiais')
            .update(material)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            toast.error('Erro ao atualizar material');
            console.error(error);
            return null;
        }

        toast.success('Material atualizado');
        await fetchMateriais();
        return data;
    };

    const deleteMaterial = async (id: string) => {
        const { error } = await supabaseAny
            .from('materiais')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error('Erro ao excluir material');
            console.error(error);
            return false;
        }

        toast.success('Material excluído');
        await fetchMateriais();
        return true;
    };

    useEffect(() => {
        fetchMateriais();
    }, []);

    return {
        materiais,
        loading,
        fetchMateriais,
        createMaterial,
        updateMaterial,
        deleteMaterial,
    };
}
