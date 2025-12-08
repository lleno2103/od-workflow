import React, { useState } from 'react';
import { Layout } from '../../components';

type TabType = 'lista' | 'novo';

interface PedidoCompra {
    id: string;
    numero: string;
    fornecedor: string;
    data: string;
    dataEntrega: string;
    valorTotal: number;
    status: 'pendente' | 'enviado' | 'confirmado' | 'recebido' | 'cancelado';
    itens: ItemPedido[];
}

interface ItemPedido {
    material: string;
    quantidade: number;
    unidade: string;
    valorUnitario: number;
    valorTotal: number;
}

const PedidosCompra: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('lista');
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('todos');

    const [pedidos] = useState<PedidoCompra[]>([
        {
            id: '1',
            numero: 'PC-001',
            fornecedor: 'Tecidos Ltda',
            data: '2025-11-28',
            dataEntrega: '2025-12-05',
            valorTotal: 2400.00,
            status: 'confirmado',
            itens: [
                { material: 'Linho 100% 1,40m', quantidade: 40, unidade: 'm', valorUnitario: 60.00, valorTotal: 2400.00 }
            ]
        },
        {
            id: '2',
            numero: 'PC-002',
            fornecedor: 'Aviamentos Silva',
            data: '2025-11-30',
            dataEntrega: '2025-12-07',
            valorTotal: 150.00,
            status: 'enviado',
            itens: [
                { material: 'Botão madeira 12mm', quantidade: 100, unidade: 'un', valorUnitario: 0.50, valorTotal: 50.00 },
                { material: 'Linha poliéster', quantidade: 50, unidade: 'un', valorUnitario: 2.00, valorTotal: 100.00 }
            ]
        },
        {
            id: '3',
            numero: 'PC-003',
            fornecedor: 'Embalagens Premium',
            data: '2025-12-01',
            dataEntrega: '2025-12-10',
            valorTotal: 200.00,
            status: 'pendente',
            itens: [
                { material: 'Etiqueta bordada', quantidade: 100, unidade: 'un', valorUnitario: 2.00, valorTotal: 200.00 }
            ]
        }
    ]);

    const getStatusBadge = (status: PedidoCompra['status']) => {
        const badges = {
            pendente: 'bg-yellow-100 text-yellow-700',
            enviado: 'bg-blue-100 text-blue-700',
            confirmado: 'bg-green-100 text-green-700',
            recebido: 'bg-gray-100 text-gray-700',
            cancelado: 'bg-red-100 text-red-700'
        };
        const labels = {
            pendente: 'Pendente',
            enviado: 'Enviado',
            confirmado: 'Confirmado',
            recebido: 'Recebido',
            cancelado: 'Cancelado'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const pedidosFiltrados = pedidos.filter(p => {
        const matchSearch = p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus;
        return matchSearch && matchStatus;
    });

    const tabs = [
        { id: 'lista' as TabType, label: 'Pedidos de Compra' },
        { id: 'novo' as TabType, label: 'Novo Pedido' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'lista':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-black">Pedidos de Compra</h2>
                                <p className="text-sm text-gray-500 mt-1">Gerencie todos os pedidos de compra</p>
                            </div>
                            <button
                                onClick={() => setActiveTab('novo')}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                + Novo Pedido
                            </button>
                        </div>

                        {/* Filtros */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Buscar por número ou fornecedor..."
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
                                <option value="enviado">Enviado</option>
                                <option value="confirmado">Confirmado</option>
                                <option value="recebido">Recebido</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>

                        {/* Tabela */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Número</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fornecedor</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entrega</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor Total</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidosFiltrados.map(pedido => (
                                        <tr key={pedido.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 text-sm font-medium text-black">{pedido.numero}</td>
                                            <td className="py-4 px-4 text-sm text-gray-900">{pedido.fornecedor}</td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {new Date(pedido.data).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {new Date(pedido.dataEntrega).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="py-4 px-4 text-sm font-medium text-gray-900 text-right">
                                                R$ {pedido.valorTotal.toFixed(2)}
                                            </td>
                                            <td className="py-4 px-4">
                                                {getStatusBadge(pedido.status)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2 justify-end">
                                                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Visualizar">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                    <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors" title="Editar">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Cancelar">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {pedidosFiltrados.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Nenhum pedido encontrado</p>
                            </div>
                        )}
                    </div>
                );

            case 'novo':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-black">Novo Pedido de Compra</h2>
                            <p className="text-sm text-gray-500">Crie um novo pedido de compra</p>
                        </div>

                        <form className="space-y-6">
                            {/* Informações do Pedido */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Informações do Pedido</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Número do Pedido</label>
                                        <input
                                            type="text"
                                            defaultValue="PC-004"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data do Pedido</label>
                                        <input
                                            type="date"
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Entrega</label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                        <option>Selecione um fornecedor</option>
                                        <option>Tecidos Ltda</option>
                                        <option>Aviamentos Silva</option>
                                        <option>Embalagens Premium</option>
                                    </select>
                                </div>
                            </div>

                            {/* Itens do Pedido */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Itens do Pedido</h3>
                                    <button
                                        type="button"
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
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Qtd</th>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Un</th>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Valor Unit. (R$)</th>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Total</th>
                                                <th className="w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t border-gray-200">
                                                <td className="py-2 px-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Nome do material"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                    />
                                                </td>
                                                <td className="py-2 px-3">
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                    />
                                                </td>
                                                <td className="py-2 px-3">
                                                    <select className="w-16 px-2 py-1 border border-gray-300 rounded text-sm">
                                                        <option>m</option>
                                                        <option>un</option>
                                                        <option>kg</option>
                                                    </select>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                                                    />
                                                </td>
                                                <td className="py-2 px-3 text-sm font-medium">R$ 0.00</td>
                                                <td className="py-2 px-3">
                                                    <button type="button" className="text-red-600 hover:text-red-800">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                                            <tr>
                                                <td colSpan={4} className="py-2 px-3 text-sm font-semibold text-right">Valor Total:</td>
                                                <td className="py-2 px-3 text-sm font-semibold text-green-600">R$ 0.00</td>
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
                                    placeholder="Observações adicionais sobre o pedido..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    Criar Pedido
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('lista')}
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
        <Layout pageTitle="Pedidos de Compra">
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

export default PedidosCompra;
