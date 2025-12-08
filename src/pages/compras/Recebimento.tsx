import React, { useState } from 'react';
import { Layout } from '../../components';

type TabType = 'lista' | 'novo';

interface Recebimento {
    id: string;
    numero: string;
    pedidoCompra: string;
    fornecedor: string;
    dataRecebimento: string;
    notaFiscal: string;
    valorTotal: number;
    status: 'pendente' | 'conferido' | 'finalizado';
    itens: ItemRecebimento[];
}

interface ItemRecebimento {
    material: string;
    quantidadePedida: number;
    quantidadeRecebida: number;
    unidade: string;
    valorUnitario: number;
}

const Recebimento: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('lista');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingRecebimento, setEditingRecebimento] = useState<Recebimento | null>(null);
    const [itensRecebimento, setItensRecebimento] = useState<ItemRecebimento[]>([
        { material: 'Botão madeira 12mm', quantidadePedida: 100, quantidadeRecebida: 100, unidade: 'un', valorUnitario: 0.50 },
        { material: 'Linha poliéster', quantidadePedida: 50, quantidadeRecebida: 50, unidade: 'un', valorUnitario: 2.00 }
    ]);

    const [recebimentos, setRecebimentos] = useState<Recebimento[]>([
        {
            id: '1',
            numero: 'REC-001',
            pedidoCompra: 'PC-001',
            fornecedor: 'Tecidos Ltda',
            dataRecebimento: '2025-12-05',
            notaFiscal: 'NF-12345',
            valorTotal: 2400.00,
            status: 'finalizado',
            itens: [
                { material: 'Linho 100% 1,40m', quantidadePedida: 40, quantidadeRecebida: 40, unidade: 'm', valorUnitario: 60.00 }
            ]
        }
    ]);

    const adicionarItem = () => {
        setItensRecebimento([...itensRecebimento, {
            material: '',
            quantidadePedida: 0,
            quantidadeRecebida: 0,
            unidade: 'un',
            valorUnitario: 0
        }]);
    };

    const removerItem = (index: number) => {
        if (itensRecebimento.length > 1) {
            setItensRecebimento(itensRecebimento.filter((_, i) => i !== index));
        }
    };

    const handleEdit = (recebimento: Recebimento) => {
        setEditingRecebimento(recebimento);
        setItensRecebimento(recebimento.itens);
        setActiveTab('novo');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este recebimento?')) {
            setRecebimentos(prev => prev.filter(r => r.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEditingRecebimento(null);
        setItensRecebimento([
            { material: 'Botão madeira 12mm', quantidadePedida: 100, quantidadeRecebida: 100, unidade: 'un', valorUnitario: 0.50 },
            { material: 'Linha poliéster', quantidadePedida: 50, quantidadeRecebida: 50, unidade: 'un', valorUnitario: 2.00 }
        ]);
        setActiveTab('lista');
    };

    const getStatusBadge = (status: Recebimento['status']) => {
        const badges = {
            pendente: 'bg-yellow-100 text-yellow-700',
            conferido: 'bg-blue-100 text-blue-700',
            finalizado: 'bg-green-100 text-green-700'
        };
        const labels = {
            pendente: 'Pendente',
            conferido: 'Conferido',
            finalizado: 'Finalizado'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const recebimentosFiltrados = recebimentos.filter(r =>
        r.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.pedidoCompra.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabs = [
        { id: 'lista' as TabType, label: 'Recebimentos' },
        { id: 'novo' as TabType, label: 'Novo Recebimento' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'lista':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-black">Recebimento de Mercadorias</h2>
                                <p className="text-sm text-gray-500 mt-1">Registre a entrada de materiais comprados</p>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingRecebimento(null);
                                    setActiveTab('novo');
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                + Novo Recebimento
                            </button>
                        </div>

                        {/* Busca */}
                        <div>
                            <input
                                type="text"
                                placeholder="Buscar por número, pedido ou fornecedor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Tabela */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Número</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pedido</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fornecedor</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">NF</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recebimentosFiltrados.map(rec => (
                                        <tr key={rec.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 text-sm font-medium text-black">{rec.numero}</td>
                                            <td className="py-4 px-4 text-sm text-gray-900">{rec.pedidoCompra}</td>
                                            <td className="py-4 px-4 text-sm text-gray-900">{rec.fornecedor}</td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {new Date(rec.dataRecebimento).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">{rec.notaFiscal}</td>
                                            <td className="py-4 px-4 text-sm font-medium text-gray-900 text-right">
                                                R$ {rec.valorTotal.toFixed(2)}
                                            </td>
                                            <td className="py-4 px-4">
                                                {getStatusBadge(rec.status)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleEdit(rec)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Editar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(rec.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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

                        {recebimentosFiltrados.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Nenhum recebimento encontrado</p>
                            </div>
                        )}
                    </div>
                );

            case 'novo':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-black">
                                {editingRecebimento ? 'Editar Recebimento' : 'Novo Recebimento'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {editingRecebimento
                                    ? `Editando recebimento: ${editingRecebimento.numero}`
                                    : 'Registre a entrada de mercadorias'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Informações do Recebimento */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Informações do Recebimento</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Número do Recebimento</label>
                                        <input
                                            type="text"
                                            defaultValue={editingRecebimento?.numero || "REC-002"}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Recebimento</label>
                                        <input
                                            type="date"
                                            defaultValue={editingRecebimento?.dataRecebimento || new Date().toISOString().split('T')[0]}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pedido de Compra</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                            <option>Selecione um pedido</option>
                                            <option>PC-002 - Aviamentos Silva</option>
                                            <option>PC-003 - Embalagens Premium</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nota Fiscal</label>
                                        <input
                                            type="text"
                                            defaultValue={editingRecebimento?.notaFiscal}
                                            placeholder="Número da NF"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Itens Recebidos */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Itens Recebidos</h3>
                                    <button
                                        type="button"
                                        onClick={adicionarItem}
                                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        + Adicionar Item
                                    </button>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Importante:</strong> Ao finalizar o recebimento, os itens serão automaticamente:
                                    </p>
                                    <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
                                        <li>Adicionados ao estoque</li>
                                        <li>Vinculados a uma conta a pagar no financeiro</li>
                                    </ul>
                                </div>

                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Material</th>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Qtd Pedida</th>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Qtd Recebida</th>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Un</th>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Valor Unit.</th>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Total</th>
                                                <th className="w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {itensRecebimento.map((item, index) => (
                                                <tr key={index} className="border-t border-gray-200">
                                                    <td className="py-2 px-3">
                                                        <input
                                                            type="text"
                                                            value={item.material}
                                                            onChange={(e) => {
                                                                const novosItens = [...itensRecebimento];
                                                                novosItens[index].material = e.target.value;
                                                                setItensRecebimento(novosItens);
                                                            }}
                                                            placeholder="Nome do material"
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <input
                                                            type="number"
                                                            value={item.quantidadePedida}
                                                            onChange={(e) => {
                                                                const novosItens = [...itensRecebimento];
                                                                novosItens[index].quantidadePedida = Number(e.target.value);
                                                                setItensRecebimento(novosItens);
                                                            }}
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <input
                                                            type="number"
                                                            value={item.quantidadeRecebida}
                                                            onChange={(e) => {
                                                                const novosItens = [...itensRecebimento];
                                                                novosItens[index].quantidadeRecebida = Number(e.target.value);
                                                                setItensRecebimento(novosItens);
                                                            }}
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <select
                                                            value={item.unidade}
                                                            onChange={(e) => {
                                                                const novosItens = [...itensRecebimento];
                                                                novosItens[index].unidade = e.target.value;
                                                                setItensRecebimento(novosItens);
                                                            }}
                                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        >
                                                            <option>m</option>
                                                            <option>un</option>
                                                            <option>kg</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={item.valorUnitario}
                                                            onChange={(e) => {
                                                                const novosItens = [...itensRecebimento];
                                                                novosItens[index].valorUnitario = Number(e.target.value);
                                                                setItensRecebimento(novosItens);
                                                            }}
                                                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3 text-sm font-medium">
                                                        R$ {(item.quantidadeRecebida * item.valorUnitario).toFixed(2)}
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => removerItem(index)}
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
                                        <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                                            <tr>
                                                <td colSpan={5} className="py-2 px-3 text-sm font-semibold text-right">Valor Total:</td>
                                                <td className="py-2 px-3 text-sm font-semibold text-green-600">
                                                    R$ {itensRecebimento.reduce((total, item) => total + (item.quantidadeRecebida * item.valorUnitario), 0).toFixed(2)}
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Observações */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                                <textarea
                                    rows={3}
                                    placeholder="Observações sobre o recebimento (divergências, avarias, etc)..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    {editingRecebimento ? 'Salvar Alterações' : 'Finalizar Recebimento'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingRecebimento(null);
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
        <Layout pageTitle="Recebimento de Mercadorias">
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

export default Recebimento;
