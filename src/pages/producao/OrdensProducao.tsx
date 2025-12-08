import React, { useState } from 'react';
import { Layout } from '../../components';

type TabType = 'lista' | 'nova' | 'em-andamento' | 'concluidas';

interface OrdemProducao {
    id: string;
    numero: string;
    data: string;
    produto: string;
    variante: string;
    cor: string;
    quantidade: number;
    metragem: number;
    tecido: string;
    status: 'aguardando' | 'corte' | 'costura' | 'acabamento' | 'embalagem' | 'concluida';
    responsavel: string;
    prazo: string;
}

const OrdensProducao: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('lista');
    const [editingOP, setEditingOP] = useState<OrdemProducao | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Dados de exemplo (usando useState para permitir edição/exclusão)
    const [ordens, setOrdens] = useState<OrdemProducao[]>([
        {
            id: '1',
            numero: 'OP-001',
            data: '2025-12-01',
            produto: 'Bata Odò - Henley',
            variante: 'M',
            cor: 'Verde Bandeira',
            quantidade: 10,
            metragem: 26.0,
            tecido: 'Linho 100%',
            status: 'costura',
            responsavel: 'Maria Silva',
            prazo: '2025-12-10'
        },
        {
            id: '2',
            numero: 'OP-002',
            data: '2025-12-02',
            produto: 'Bermuda Odò',
            variante: 'G',
            cor: 'Azul Royal',
            quantidade: 15,
            metragem: 18.0,
            tecido: 'Linho + Viscose',
            status: 'corte',
            responsavel: 'João Santos',
            prazo: '2025-12-12'
        },
        {
            id: '3',
            numero: 'OP-003',
            data: '2025-11-28',
            produto: 'Bata Odò - Henley',
            variante: 'P',
            cor: 'Branco',
            quantidade: 8,
            metragem: 20.8,
            tecido: 'Cambraia',
            status: 'concluida',
            responsavel: 'Ana Costa',
            prazo: '2025-12-05'
        },
    ]);

    // Funções CRUD
    const handleEdit = (op: OrdemProducao) => {
        setEditingOP(op);
        setActiveTab('nova');
    };

    const handleDelete = (id: string) => {
        setOrdens(ordens.filter(op => op.id !== id));
        setDeleteConfirm(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui você implementaria a lógica de salvar
        // Por enquanto, apenas volta para a lista
        setEditingOP(null);
        setActiveTab('lista');
    };

    const handleCancel = () => {
        setEditingOP(null);
        setActiveTab('lista');
    };

    const getStatusBadge = (status: OrdemProducao['status']) => {
        const badges = {
            aguardando: 'bg-gray-100 text-gray-700',
            corte: 'bg-yellow-100 text-yellow-700',
            costura: 'bg-blue-100 text-blue-700',
            acabamento: 'bg-purple-100 text-purple-700',
            embalagem: 'bg-orange-100 text-orange-700',
            concluida: 'bg-green-100 text-green-700'
        };

        const labels = {
            aguardando: 'Aguardando',
            corte: 'Em Corte',
            costura: 'Em Costura',
            acabamento: 'Acabamento',
            embalagem: 'Embalagem',
            concluida: 'Concluída'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const tabs = [
        { id: 'lista' as TabType, label: 'Todas as OPs' },
        { id: 'nova' as TabType, label: 'Nova OP' },
        { id: 'em-andamento' as TabType, label: 'Em Andamento' },
        { id: 'concluidas' as TabType, label: 'Concluídas' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'lista':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-black">Ordens de Produção</h2>
                                <p className="text-sm text-gray-500">Gerencie todas as ordens de produção</p>
                            </div>
                            <button
                                onClick={() => setActiveTab('nova')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                + Nova OP
                            </button>
                        </div>

                        {/* Tabela de OPs */}
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
                                    {ordens.map((op) => (
                                        <tr key={op.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-medium text-black">{op.numero}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{new Date(op.data).toLocaleDateString('pt-BR')}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900">{op.produto}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{op.variante} - {op.cor}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{op.quantidade} un</td>
                                            <td className="py-3 px-4">{getStatusBadge(op.status)}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{op.responsavel}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{new Date(op.prazo).toLocaleDateString('pt-BR')}</td>
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
                    </div>
                );

            case 'nova':
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
                            {/* Informações Básicas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">OP Nº</label>
                                    <input
                                        type="text"
                                        placeholder="OP-004"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Emissão</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Produto */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                        <option>Bata Odò - Henley</option>
                                        <option>Bermuda Odò</option>
                                        <option>Vestido Odò</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
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
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                        <option>Branco</option>
                                        <option>Verde Bandeira</option>
                                        <option>Vermelho</option>
                                        <option>Azul Royal</option>
                                        <option>Amarelo</option>
                                        <option>Preto</option>
                                    </select>
                                </div>
                            </div>

                            {/* Quantidade e Material */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                                    <input
                                        type="number"
                                        placeholder="10"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Metragem Total (m)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="26.0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tecido</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                        <option>Linho 100%</option>
                                        <option>Linho + Viscose</option>
                                        <option>Cambraia</option>
                                    </select>
                                </div>
                            </div>

                            {/* Responsável e Prazo */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                                    <input
                                        type="text"
                                        placeholder="Nome do responsável"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prazo de Entrega</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Observações */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                                <textarea
                                    rows={3}
                                    placeholder="Instruções especiais, tolerâncias, etc."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    {editingOP ? 'Salvar Alterações' : 'Criar OP'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                );

            case 'em-andamento':
                const emAndamento = ordens.filter(op => op.status !== 'concluida');
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-black">OPs em Andamento</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {emAndamento.map((op) => (
                                <div key={op.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-black">{op.numero}</h3>
                                            <p className="text-sm text-gray-600">{op.produto}</p>
                                        </div>
                                        {getStatusBadge(op.status)}
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <p className="text-gray-600"><span className="font-medium">Variante:</span> {op.variante} - {op.cor}</p>
                                        <p className="text-gray-600"><span className="font-medium">Quantidade:</span> {op.quantidade} un</p>
                                        <p className="text-gray-600"><span className="font-medium">Responsável:</span> {op.responsavel}</p>
                                        <p className="text-gray-600"><span className="font-medium">Prazo:</span> {new Date(op.prazo).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'concluidas':
                const concluidas = ordens.filter(op => op.status === 'concluida');
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-black">OPs Concluídas</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">OP Nº</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Produto</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Quantidade</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Data Conclusão</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {concluidas.map((op) => (
                                        <tr key={op.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-medium text-black">{op.numero}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900">{op.produto} - {op.variante}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{op.quantidade} un</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{new Date(op.prazo).toLocaleDateString('pt-BR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Layout pageTitle="Ordens de Produção">
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

            {/* Modal de Confirmação de Exclusão */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-black mb-2">Confirmar Exclusão</h3>
                        <p className="text-gray-600 mb-6">
                            Tem certeza que deseja excluir a OP {ordens.find(op => op.id === deleteConfirm)?.numero}?
                            Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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
