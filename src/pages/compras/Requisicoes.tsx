import React, { useState, useEffect } from 'react';
import { Layout } from '../../components';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

const supabaseAny = supabase as any;
import { useMateriais } from '../../hooks/useMateriais';

type TabType = 'lista' | 'nova';

interface ItemRequisicao {
    id?: string;
    material_id?: string;
    material_nome: string;
    quantidade: number;
    unidade: string;
    justificativa: string;
}

interface Requisicao {
    id: string;
    numero: string;
    solicitante: string;
    departamento: string;
    data_solicitacao: string;
    data_necessidade: string;
    status: 'pendente' | 'aprovada' | 'rejeitada' | 'convertida';
    itens: ItemRequisicao[];
    observacoes?: string;
}

const Requisicoes: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('lista');
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('todos');
    const [editingRequisicao, setEditingRequisicao] = useState<Requisicao | null>(null);
    const [requisicoes, setRequisicoes] = useState<Requisicao[]>([]);
    const [loading, setLoading] = useState(false);
    const { materiais, fetchMateriais } = useMateriais();

    // Form state
    const [formData, setFormData] = useState<Partial<Requisicao>>({
        numero: '',
        solicitante: '',
        departamento: '',
        data_necessidade: '',
        observacoes: '',
        status: 'pendente'
    });
    const [formItens, setFormItens] = useState<ItemRequisicao[]>([]);

    useEffect(() => {
        fetchRequisicoes();
        fetchMateriais();
    }, []);

    useEffect(() => {
        if (activeTab === 'nova' && !editingRequisicao) {
            // New requisition
            setFormData({
                numero: `REQ-${Date.now()}`, // Simple auto-gen
                solicitante: '',
                departamento: '',
                data_necessidade: new Date().toISOString().split('T')[0],
                observacoes: '',
                status: 'pendente'
            });
            setFormItens([{ material_id: '', material_nome: '', quantidade: 0, unidade: 'un', justificativa: '' }]);
        } else if (activeTab === 'nova' && editingRequisicao) {
            // Edit existing
            setFormData({
                numero: editingRequisicao.numero,
                solicitante: editingRequisicao.solicitante,
                departamento: editingRequisicao.departamento,
                data_necessidade: editingRequisicao.data_necessidade,
                observacoes: editingRequisicao.observacoes,
                status: editingRequisicao.status
            });
            setFormItens(editingRequisicao.itens.map(i => ({
                material_id: i.material_id,
                material_nome: i.material_nome,
                quantidade: i.quantidade,
                unidade: i.unidade,
                justificativa: i.justificativa
            })));
        }
    }, [activeTab, editingRequisicao]);

    const fetchRequisicoes = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabaseAny
                .from('compras_requisicoes')
                .select(`
                    *,
                    itens:compras_itens_requisicao(*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequisicoes(data as unknown as Requisicao[]);
        } catch (error) {
            console.error('Erro ao buscar requisições:', error);
            toast.error('Erro ao carregar requisições');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (requisicao: Requisicao) => {
        setEditingRequisicao(requisicao);
        setActiveTab('nova');
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir esta requisição?')) return;

        try {
            const { error } = await supabaseAny
                .from('compras_requisicoes')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Requisição excluída com sucesso');
            fetchRequisicoes();
        } catch (error) {
            console.error('Erro ao excluir:', error);
            toast.error('Erro ao excluir requisição');
        }
    };

    const handleStatusChange = async (id: string, newStatus: Requisicao['status']) => {
        try {
            const { error } = await supabaseAny
                .from('compras_requisicoes')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            toast.success(`Status atualizado para ${newStatus}`);
            fetchRequisicoes();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            toast.error('Erro ao atualizar status');
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let reqId = editingRequisicao?.id;

            const requisicaoData = {
                numero: formData.numero,
                solicitante: formData.solicitante,
                departamento: formData.departamento,
                data_necessidade: formData.data_necessidade,
                observacoes: formData.observacoes,
                status: formData.status || 'pendente'
            };

            if (editingRequisicao) {
                const { error } = await supabaseAny
                    .from('compras_requisicoes')
                    .update(requisicaoData)
                    .eq('id', reqId!);
                if (error) throw error;

                await supabaseAny.from('compras_itens_requisicao').delete().eq('requisicao_id', reqId!);
            } else {
                const { data, error } = await supabaseAny
                    .from('compras_requisicoes')
                    .insert([requisicaoData])
                    .select()
                    .single();

                if (error) throw error;
                reqId = data.id;
            }

            if (formItens.length > 0 && reqId) {
                const itensToInsert = formItens.map(item => ({
                    requisicao_id: reqId,
                    material_id: item.material_id || null,
                    material_nome: item.material_nome,
                    quantidade: item.quantidade,
                    unidade: item.unidade,
                    justificativa: item.justificativa
                }));

                const { error: errorItens } = await supabaseAny
                    .from('compras_itens_requisicao')
                    .insert(itensToInsert);

                if (errorItens) throw errorItens;
            }

            toast.success(editingRequisicao ? 'Requisição atualizada!' : 'Requisição criada!');
            setEditingRequisicao(null);
            fetchRequisicoes();
            setActiveTab('lista');

        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast.error('Erro ao salvar requisição');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: Requisicao['status']) => {
        const badges = {
            pendente: 'bg-yellow-100 text-yellow-700',
            aprovada: 'bg-green-100 text-green-700',
            rejeitada: 'bg-red-100 text-red-700',
            convertida: 'bg-blue-100 text-blue-700'
        };
        const labels = {
            pendente: 'Pendente',
            aprovada: 'Aprovada',
            rejeitada: 'Rejeitada',
            convertida: 'Convertida'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const requisicoesFiltradas = requisicoes.filter(r => {
        const matchSearch = r.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.solicitante.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filtroStatus === 'todos' || r.status === filtroStatus;
        return matchSearch && matchStatus;
    });

    const tabs = [
        { id: 'lista' as TabType, label: 'Requisições de Compra' },
        { id: 'nova' as TabType, label: 'Nova Requisição' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'lista':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-black">Requisições de Compra</h2>
                                <p className="text-sm text-gray-500 mt-1">Gerencie as solicitações de compra</p>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingRequisicao(null);
                                    setActiveTab('nova');
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                + Nova Requisição
                            </button>
                        </div>

                        {/* Filtros */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Buscar por número ou solicitante..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="todos">Todos Status</option>
                                <option value="pendente">Pendente</option>
                                <option value="aprovada">Aprovada</option>
                                <option value="rejeitada">Rejeitada</option>
                                <option value="convertida">Convertida</option>
                            </select>
                        </div>

                        {/* Tabela */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Número</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Solicitante</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Departamento</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Necessidade</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Itens</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={8} className="text-center py-4">Carregando...</td></tr>
                                    ) : requisicoesFiltradas.map(req => (
                                        <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 text-sm font-medium text-black">{req.numero}</td>
                                            <td className="py-4 px-4 text-sm text-gray-900">{req.solicitante}</td>
                                            <td className="py-4 px-4 text-sm text-gray-600">{req.departamento}</td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {/* Use created_at as data_solicitacao fallback or actual field */}
                                                {new Date(req.data_solicitacao || new Date()).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {req.data_necessidade ? new Date(req.data_necessidade).toLocaleDateString('pt-BR') : '-'}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">{req.itens?.length || 0} item(ns)</td>
                                            <td className="py-4 px-4">
                                                {getStatusBadge(req.status)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleEdit(req)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Editar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(req.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                    {req.status === 'pendente' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusChange(req.id, 'aprovada')}
                                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Aprovar">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(req.id, 'rejeitada')}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Rejeitar">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    )}
                                                    {req.status === 'aprovada' && (
                                                        <button
                                                            onClick={() => handleStatusChange(req.id, 'convertida')}
                                                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors" title="Converter em Pedido">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {!loading && requisicoesFiltradas.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Nenhuma requisição encontrada</p>
                            </div>
                        )}
                    </div>
                );

            case 'nova':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-black">
                                {editingRequisicao ? 'Editar Requisição' : 'Nova Requisição de Compra'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {editingRequisicao
                                    ? `Editando requisição: ${editingRequisicao.numero}`
                                    : 'Solicite a compra de materiais necessários'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Informações da Requisição */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Informações da Requisição</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                        <input
                                            type="text"
                                            value={formData.numero}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Necessidade</label>
                                        <input
                                            type="date"
                                            value={formData.data_necessidade}
                                            onChange={e => setFormData({ ...formData, data_necessidade: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Solicitante</label>
                                        <input
                                            type="text"
                                            value={formData.solicitante}
                                            onChange={e => setFormData({ ...formData, solicitante: e.target.value })}
                                            placeholder="Nome do solicitante"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                                        <select
                                            value={formData.departamento}
                                            onChange={e => setFormData({ ...formData, departamento: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Selecione</option>
                                            <option value="Produção">Produção</option>
                                            <option value="Embalagem">Embalagem</option>
                                            <option value="Estoque">Estoque</option>
                                            <option value="Administrativo">Administrativo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Itens Solicitados */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Itens Solicitados</h3>
                                    <button
                                        type="button"
                                        onClick={() => setFormItens([...formItens, { material_id: '', material_nome: '', quantidade: 0, unidade: 'un', justificativa: '' }])}
                                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        + Adicionar Item
                                    </button>
                                </div>

                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Material</th>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Quantidade</th>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Unidade</th>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Justificativa</th>
                                                <th className="w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formItens.map((item, index) => (
                                                <tr key={index} className="border-t border-gray-200">
                                                    <td className="py-2 px-3">
                                                        <select
                                                            value={item.material_id || ''}
                                                            onChange={e => {
                                                                const selectedMat = materiais.find(m => m.id === e.target.value);
                                                                const newItens = [...formItens];
                                                                newItens[index].material_id = e.target.value;
                                                                newItens[index].material_nome = selectedMat ? selectedMat.nome : '';
                                                                if (selectedMat) {
                                                                    newItens[index].unidade = selectedMat.unidade_medida; // Requisitions usually use consumption unit
                                                                }
                                                                setFormItens(newItens);
                                                            }}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                        >
                                                            <option value="">Selecione um material</option>
                                                            {materiais.map(m => (
                                                                <option key={m.id} value={m.id}>{m.nome} ({m.unidade_medida})</option>
                                                            ))}
                                                        </select>
                                                        {(!item.material_id) && (
                                                            <input
                                                                type="text"
                                                                value={item.material_nome}
                                                                onChange={e => {
                                                                    const newItens = [...formItens];
                                                                    newItens[index].material_nome = e.target.value;
                                                                    setFormItens(newItens);
                                                                }}
                                                                placeholder="Ou digite o nome..."
                                                                className="w-full px-2 py-1 mt-1 border border-gray-300 rounded text-sm bg-gray-50"
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <input
                                                            type="number"
                                                            value={item.quantidade}
                                                            onChange={e => {
                                                                const newItens = [...formItens];
                                                                newItens[index].quantidade = Number(e.target.value);
                                                                setFormItens(newItens);
                                                            }}
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <select
                                                            value={item.unidade}
                                                            onChange={e => {
                                                                const newItens = [...formItens];
                                                                newItens[index].unidade = e.target.value;
                                                                setFormItens(newItens);
                                                            }}
                                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        >
                                                            <option value="m">m</option>
                                                            <option value="un">un</option>
                                                            <option value="kg">kg</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <input
                                                            type="text"
                                                            value={item.justificativa}
                                                            onChange={e => {
                                                                const newItens = [...formItens];
                                                                newItens[index].justificativa = e.target.value;
                                                                setFormItens(newItens);
                                                            }}
                                                            placeholder="Motivo da solicitação"
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormItens(formItens.filter((_, i) => i !== index))}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Observações */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                                <textarea
                                    rows={3}
                                    value={formData.observacoes}
                                    onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
                                    placeholder="Informações adicionais sobre a requisição..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                                >
                                    {loading ? 'Salvando...' : (editingRequisicao ? 'Salvar Alterações' : 'Enviar Requisição')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingRequisicao(null);
                                        setActiveTab('lista');
                                    }}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                );
        }
    };

    return (
        <Layout pageTitle="Requisições de Compra">
            <div className="space-y-6">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    {renderTabContent()}
                </div>
            </div>
        </Layout>
    );
};

export default Requisicoes;
