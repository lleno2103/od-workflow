import React, { useState } from 'react';
import { Layout } from '../../components';

type TabType = 'lista' | 'novo';

interface BOMItem {
    tipo: string;
    nome: string;
    quantidade: number;
    unidade: string;
    custo: number;
}

interface BOM {
    id: string;
    produto: string;
    items: BOMItem[];
}

const BOM: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('lista');
    const [items, setItems] = useState<BOMItem[]>([
        { tipo: 'Tecido', nome: '', quantidade: 0, unidade: 'm', custo: 0 }
    ]);
    const [editingBOM, setEditingBOM] = useState<BOM | null>(null);
    const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

    const [boms, setBoms] = useState<BOM[]>([
        {
            id: '1',
            produto: 'Bata Odò - Henley M',
            items: [
                { tipo: 'Tecido', nome: 'Linho 100% 1,40m', quantidade: 2.6, unidade: 'm', custo: 120.00 },
                { tipo: 'Aviamento', nome: 'Botão madeira 12mm', quantidade: 3, unidade: 'un', custo: 0.50 },
                { tipo: 'Aviamento', nome: 'Linha', quantidade: 1, unidade: 'un', custo: 2.00 },
                { tipo: 'Embalagem', nome: 'Etiqueta bordada', quantidade: 1, unidade: 'un', custo: 2.00 },
            ]
        }
    ]);

    const calcularCustoTotal = (items: BOMItem[]) => {
        return items.reduce((total, item) => total + (item.quantidade * item.custo), 0);
    };

    const adicionarItem = () => {
        setItems([...items, { tipo: 'Tecido', nome: '', quantidade: 0, unidade: 'm', custo: 0 }]);
    };

    const removerItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const atualizarItem = (index: number, campo: keyof BOMItem, valor: any) => {
        const novosItems = [...items];
        novosItems[index] = { ...novosItems[index], [campo]: valor };
        setItems(novosItems);
    };

    const handleEditItem = (bomId: string, itemIndex: number) => {
        const bom = boms.find(b => b.id === bomId);
        if (bom) {
            setEditingBOM(bom);
            setEditingItemIndex(itemIndex);
            // Carregar os dados do item para edição
            const itemToEdit = bom.items[itemIndex];
            setItems([itemToEdit]);
            setActiveTab('novo');
        }
    };

    const handleDeleteItem = (bomId: string, itemIndex: number) => {
        if (window.confirm('Tem certeza que deseja excluir este item?')) {
            setBoms(prevBoms => prevBoms.map(bom => {
                if (bom.id === bomId) {
                    return {
                        ...bom,
                        items: bom.items.filter((_, idx) => idx !== itemIndex)
                    };
                }
                return bom;
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui você implementaria a lógica de salvar
        setEditingBOM(null);
        setEditingItemIndex(null);
        setActiveTab('lista');
        setItems([{ tipo: 'Tecido', nome: '', quantidade: 0, unidade: 'm', custo: 0 }]);
    };

    const tabs = [
        { id: 'lista' as TabType, label: 'Lista de Materiais' },
        { id: 'novo' as TabType, label: 'Nova Lista' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'lista':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-black">Lista de Materiais</h2>
                                <p className="text-sm text-gray-500">Gerencie os materiais necessários para cada produto</p>
                            </div>
                            <button
                                onClick={() => setActiveTab('novo')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                + Nova Lista
                            </button>
                        </div>

                        {boms.map((bom) => (
                            <div key={bom.id} className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="font-semibold text-black mb-4">{bom.produto}</h3>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Nome</th>
                                                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Qtd</th>
                                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Un</th>
                                                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Custo Unit.</th>
                                                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Custo Total</th>
                                                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bom.items.map((item, idx) => (
                                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm text-gray-600">{item.tipo}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-900">{item.nome}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600 text-right">{item.quantidade}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{item.unidade}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600 text-right">R$ {item.custo.toFixed(2)}</td>
                                                    <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                                                        R$ {(item.quantidade * item.custo).toFixed(2)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex gap-2 justify-end">
                                                            <button
                                                                onClick={() => handleEditItem(bom.id, idx)}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                                title="Editar"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteItem(bom.id, idx)}
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
                                            <tr className="bg-gray-50 font-semibold">
                                                <td colSpan={5} className="py-3 px-4 text-sm text-right">Custo Total por Peça:</td>
                                                <td className="py-3 px-4 text-sm text-right text-green-600">
                                                    R$ {calcularCustoTotal(bom.items).toFixed(2)}
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'novo':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-black">
                                {editingBOM && editingItemIndex !== null ? 'Editar Item' : 'Nova Lista'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {editingBOM && editingItemIndex !== null
                                    ? `Editando item da lista de materiais: ${editingBOM.produto}`
                                    : 'Defina a lista de materiais para um produto'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Produto */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                    <option>Selecione um produto</option>
                                    <option>Bata Odò - Henley P</option>
                                    <option>Bata Odò - Henley M</option>
                                    <option>Bata Odò - Henley G</option>
                                    <option>Bermuda Odò P</option>
                                    <option>Bermuda Odò M</option>
                                    <option>Bermuda Odò G</option>
                                </select>
                            </div>

                            {/* Lista de Itens */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Itens do BOM</h3>
                                    <button
                                        type="button"
                                        onClick={adicionarItem}
                                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        + Adicionar Item
                                    </button>
                                </div>

                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Tipo</th>
                                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Nome do Material</th>
                                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Qtd</th>
                                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Un</th>
                                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Custo (R$)</th>
                                                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Total</th>
                                                    <th className="w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item, index) => (
                                                    <tr key={index} className="border-t border-gray-200">
                                                        <td className="py-2 px-3">
                                                            <select
                                                                value={item.tipo}
                                                                onChange={(e) => atualizarItem(index, 'tipo', e.target.value)}
                                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                            >
                                                                <option>Tecido</option>
                                                                <option>Aviamento</option>
                                                                <option>Embalagem</option>
                                                                <option>Outro</option>
                                                            </select>
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <input
                                                                type="text"
                                                                value={item.nome}
                                                                onChange={(e) => atualizarItem(index, 'nome', e.target.value)}
                                                                placeholder="Ex: Linho 100%"
                                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={item.quantidade}
                                                                onChange={(e) => atualizarItem(index, 'quantidade', parseFloat(e.target.value) || 0)}
                                                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <select
                                                                value={item.unidade}
                                                                onChange={(e) => atualizarItem(index, 'unidade', e.target.value)}
                                                                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                                            >
                                                                <option>m</option>
                                                                <option>un</option>
                                                                <option>kg</option>
                                                                <option>g</option>
                                                            </select>
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={item.custo}
                                                                onChange={(e) => atualizarItem(index, 'custo', parseFloat(e.target.value) || 0)}
                                                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-3 text-sm font-medium">
                                                            R$ {(item.quantidade * item.custo).toFixed(2)}
                                                        </td>
                                                        <td className="py-2 px-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => removerItem(index)}
                                                                className="text-red-600 hover:text-red-800"
                                                                disabled={items.length === 1}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                                                    <td colSpan={5} className="py-2 px-3 text-sm text-right">Custo Total por Peça:</td>
                                                    <td className="py-2 px-3 text-sm text-green-600">
                                                        R$ {calcularCustoTotal(items).toFixed(2)}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    Salvar Lista
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
        <Layout pageTitle="Lista de Materiais">
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

export default BOM;
