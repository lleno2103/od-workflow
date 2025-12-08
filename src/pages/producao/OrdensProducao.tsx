import React, { useState } from 'react';
import { Layout } from '../../components';
import { useOrdensProducao, type OrdemProducaoInput } from '../../hooks/useOrdensProducao';
import { useProdutos } from '../../hooks/useProdutos';

type TabType = 'lista' | 'nova' | 'em-andamento' | 'concluidas';

const OrdensProducao: React.FC = () => {
    const { ordens, loading, createOrdem, updateOrdem, deleteOrdem } = useOrdensProducao();
    const { produtos } = useProdutos();
    const [activeTab, setActiveTab] = useState<TabType>('lista');
    const [editingOP, setEditingOP] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState<OrdemProducaoInput>({
        numero: '',
        data: new Date().toISOString().split('T')[0],
        produto_id: '',
        variante: 'M',
        cor: 'Verde Bandeira',
        quantidade: 0,
        metragem: 0,
        tecido: 'Linho 100%',
        status: 'aguardando',
        responsavel: '',
        prazo: '',
        observacoes: ''
    });

    const resetForm = () => {
        setFormData({
            numero: '',
            data: new Date().toISOString().split('T')[0],
            produto_id: produtos[0]?.id || '',
            variante: 'M',
            cor: 'Verde Bandeira',
            quantidade: 0,
            metragem: 0,
            tecido: 'Linho 100%',
            status: 'aguardando',
            responsavel: '',
            prazo: '',
            observacoes: ''
        });
        setEditingOP(null);
    };

    const handleEdit = (op: any) => {
        setEditingOP(op.id);
        setFormData({
            numero: op.numero,
            data: op.data,
            produto_id: op.produto_id,
            variante: op.variante,
            cor: op.cor,
            quantidade: op.quantidade,
            metragem: op.metragem || 0,
            tecido: op.tecido || '',
            status: op.status,
            responsavel: op.responsavel || '',
            prazo: op.prazo || '',
            observacoes: op.observacoes || ''
        });
        setActiveTab('nova');
    };

    const handleDelete = async (id: string) => {
        await deleteOrdem(id);
        setDeleteConfirm(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingOP) {
            await updateOrdem(editingOP, formData);
        } else {
            await createOrdem(formData);
        }
        
        resetForm();
        setActiveTab('lista');
    };

    const handleCancel = () => {
        resetForm();
        setActiveTab('lista');
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            aguardando: 'bg-gray-100 text-gray-700',
            corte: 'bg-yellow-100 text-yellow-700',
            costura: 'bg-blue-100 text-blue-700',
            acabamento: 'bg-purple-100 text-purple-700',
            embalagem: 'bg-orange-100 text-orange-700',
            concluida: 'bg-green-100 text-green-700'
        };

        const labels: Record<string, string> = {
            aguardando: 'Aguardando',
            corte: 'Em Corte',
            costura: 'Em Costura',
            acabamento: 'Acabamento',
            embalagem: 'Embalagem',
            concluida: 'Concluída'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status] || badges.aguardando}`}>
                {labels[status] || 'Aguardando'}
            </span>
        );
    };

    const tabs = [
        { id: 'lista' as TabType, label: 'Todas as OPs' },
        { id: 'nova' as TabType, label: editingOP ? 'Editar OP' : 'Nova OP' },
        { id: 'em-andamento' as TabType, label: 'Em Andamento' },
        { id: 'concluidas' as TabType, label: 'Concluídas' },
    ];

    const filteredOrdens = activeTab === 'em-andamento' 
        ? ordens.filter(op => ['corte', 'costura', 'acabamento', 'embalagem'].includes(op.status))
        : activeTab === 'concluidas'
        ? ordens.filter(op => op.status === 'concluida')
        : ordens;

    const renderTabContent = () => {
        if (activeTab === 'nova') {
            return (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-black">
                            {editingOP ? 'Editar Ordem de Produção' : 'Nova Ordem de Produção'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {editingOP ? 'Atualize os dados da OP' : 'Preencha os dados para criar uma nova OP'}
                        </p>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">OP Nº</label>
                                <input
                                    type="text"
                                    value={formData.numero}
                                    onChange={(e) => setFormData({...formData, numero: e.target.value})}
                                    placeholder="OP-004"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Emissão</label>
                                <input
                                    type="date"
                                    value={formData.data}
                                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                                <select 
                                    value={formData.produto_id}
                                    onChange={(e) => setFormData({...formData, produto_id: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Selecione um produto</option>
                                    {produtos.map(p => (
                                        <option key={p.id} value={p.id}>{p.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                                <select 
                                    value={formData.variante}
                                    onChange={(e) => setFormData({...formData, variante: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option>PP</option>
                                    <option>P</option>
                                    <option>M</option>
                                    <option>G</option>
                                    <option>GG</option>
                                    <option>XG</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                                <select 
                                    value={formData.cor}
                                    onChange={(e) => setFormData({...formData, cor: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option>Branco</option>
                                    <option>Verde Bandeira</option>
                                    <option>Vermelho</option>
                                    <option>Azul Royal</option>
                                    <option>Amarelo</option>
                                    <option>Preto</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                                <input
                                    type="number"
                                    value={formData.quantidade}
                                    onChange={(e) => setFormData({...formData, quantidade: parseInt(e.target.value) || 0})}
                                    placeholder="10"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Metragem Total (m)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.metragem}
                                    onChange={(e) => setFormData({...formData, metragem: parseFloat(e.target.value) || 0})}
                                    placeholder="26.0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tecido</label>
                                <select 
                                    value={formData.tecido}
                                    onChange={(e) => setFormData({...formData, tecido: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option>Linho 100%</option>
                                    <option>Linho + Viscose</option>
                                    <option>Cambraia</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                                <input
                                    type="text"
                                    value={formData.responsavel}
                                    onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                                    placeholder="Nome do responsável"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prazo de Entrega</label>
                                <input
                                    type="date"
                                    value={formData.prazo}
                                    onChange={(e) => setFormData({...formData, prazo: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select 
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="aguardando">Aguardando</option>
                                    <option value="corte">Em Corte</option>
                                    <option value="costura">Em Costura</option>
                                    <option value="acabamento">Acabamento</option>
                                    <option value="embalagem">Embalagem</option>
                                    <option value="concluida">Concluída</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                            <textarea
                                rows={3}
                                value={formData.observacoes}
                                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                                placeholder="Instruções especiais, tolerâncias, etc."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                {editingOP ? 'Atualizar OP' : 'Criar OP'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-black">
                            {activeTab === 'em-andamento' ? 'OPs Em Andamento' : 
                             activeTab === 'concluidas' ? 'OPs Concluídas' : 'Ordens de Produção'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {filteredOrdens.length} ordem(ns) encontrada(s)
                        </p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setActiveTab('nova'); }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                        + Nova OP
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Carregando...</p>
                    </div>
                ) : filteredOrdens.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Nenhuma ordem de produção encontrada</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">OP Nº</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Data</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Produto</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Variante</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Qtd</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Responsável</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Prazo</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrdens.map((op) => (
                                    <tr key={op.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm font-medium text-black">{op.numero}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{new Date(op.data).toLocaleDateString('pt-BR')}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900">{op.produto?.nome || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{op.variante} - {op.cor}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{op.quantidade} un</td>
                                        <td className="py-3 px-4">{getStatusBadge(op.status)}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{op.responsavel || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{op.prazo ? new Date(op.prazo).toLocaleDateString('pt-BR') : '-'}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(op)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Editar"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(op.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Excluir"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Layout pageTitle="Ordens de Produção">
            <div className="space-y-6">
                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { if (tab.id !== 'nova') resetForm(); setActiveTab(tab.id); }}
                            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                                activeTab === tab.id
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    {renderTabContent()}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-2">Confirmar exclusão</h3>
                        <p className="text-gray-600 mb-4">Tem certeza que deseja excluir esta ordem de produção?</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default OrdensProducao;
