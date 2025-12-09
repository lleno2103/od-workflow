import React, { useState, useEffect } from 'react';
import { Layout } from '../../components';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

type TabType = 'lista' | 'novo';

interface ItemRecebimento {
    id?: string;
    material_nome: string;
    quantidade_pedida: number;
    quantidade_recebida: number;
    unidade: string;
    valor_unitario: number;
}

interface Recebimento {
    id: string;
    numero: string;
    pedido_id: string; // Foreign key
    pedido?: { numero: string; fornecedor?: { nome: string } }; // Join info
    nota_fiscal: string;
    data_recebimento: string;
    valor_total: number;
    status: 'pendente' | 'conferido' | 'finalizado';
    itens: ItemRecebimento[];
    observacoes?: string;
}

interface PedidoSimples {
    id: string;
    numero: string;
    fornecedor?: { nome: string };
}

const Recebimento: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('lista');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingRecebimento, setEditingRecebimento] = useState<Recebimento | null>(null);
    const [recebimentos, setRecebimentos] = useState<Recebimento[]>([]);
    const [pedidosDisponiveis, setPedidosDisponiveis] = useState<PedidoSimples[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<Partial<Recebimento>>({
        numero: '',
        pedido_id: '',
        data_recebimento: new Date().toISOString().split('T')[0],
        nota_fiscal: '',
        observacoes: ''
    });
    const [itensRecebimento, setItensRecebimento] = useState<ItemRecebimento[]>([]);

    useEffect(() => {
        fetchRecebimentos();
        fetchPedidosParaRecebimento();
    }, []);

    useEffect(() => {
        if (activeTab === 'novo' && !editingRecebimento) {
            setFormData({
                numero: `REC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                pedido_id: '',
                data_recebimento: new Date().toISOString().split('T')[0],
                nota_fiscal: '',
                observacoes: ''
            });
            setItensRecebimento([]);
        } else if (activeTab === 'novo' && editingRecebimento) {
            setFormData({
                numero: editingRecebimento.numero,
                pedido_id: editingRecebimento.pedido_id,
                data_recebimento: editingRecebimento.data_recebimento,
                nota_fiscal: editingRecebimento.nota_fiscal,
                observacoes: editingRecebimento.observacoes
            });
            setItensRecebimento(editingRecebimento.itens.map(i => ({
                material_nome: i.material_nome,
                quantidade_pedida: i.quantidade_pedida,
                quantidade_recebida: i.quantidade_recebida,
                unidade: i.unidade,
                valor_unitario: i.valor_unitario
            })));
        }
    }, [activeTab, editingRecebimento]);

    const fetchRecebimentos = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('compras_recebimentos')
                .select(`
                    *,
                    pedido:compras_pedidos(numero, fornecedor:compras_fornecedores(nome)),
                    itens:compras_itens_recebimento(*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRecebimentos(data as unknown as Recebimento[]);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao buscar recebimentos');
        } finally {
            setLoading(false);
        }
    };

    const fetchPedidosParaRecebimento = async () => {
        // Fetch orders that are NOT cancelled
        const { data, error } = await supabase
            .from('compras_pedidos')
            .select('id, numero, fornecedor:compras_fornecedores(nome)')
            .neq('status', 'cancelado')
            .neq('status', 'recebido') // Ideally exclude fully received ones
            .order('created_at', { ascending: false });

        if (data) setPedidosDisponiveis(data as unknown as PedidoSimples[]);
    };

    const handlePedidoChange = async (pedidoId: string) => {
        setFormData({ ...formData, pedido_id: pedidoId });
        if (!pedidoId) {
            setItensRecebimento([]);
            return;
        }

        // Load items from the order
        const { data, error } = await supabase
            .from('compras_itens_pedido')
            .select('*')
            .eq('pedido_id', pedidoId);

        if (data) {
            const itensParaReceber = data.map(item => ({
                material_nome: item.material_nome,
                quantidade_pedida: item.quantidade,
                quantidade_recebida: item.quantidade, // Default to full receipt
                unidade: item.unidade,
                valor_unitario: item.valor_unitario
            }));
            setItensRecebimento(itensParaReceber);
        }
    };

    const handleEdit = (recebimento: Recebimento) => {
        setEditingRecebimento(recebimento);
        setActiveTab('novo');
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este recebimento?')) return;
        try {
            const { error } = await supabase.from('compras_recebimentos').delete().eq('id', id);
            if (error) throw error;
            toast.success('Recebimento excluído');
            fetchRecebimentos();
        } catch (error) {
            console.error(error);
            toast.error('Erro ao excluir recebimento');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let recebimentoId = editingRecebimento?.id;
            const valorTotalRec = itensRecebimento.reduce((acc, i) => acc + (i.quantidade_recebida * i.valor_unitario), 0);

            const recData = {
                numero: formData.numero,
                pedido_id: formData.pedido_id,
                nota_fiscal: formData.nota_fiscal,
                data_recebimento: formData.data_recebimento,
                valor_total: valorTotalRec,
                observacoes: formData.observacoes,
                status: editingRecebimento ? editingRecebimento.status : 'pendente'
            };

            if (editingRecebimento) {
                const { error } = await supabase.from('compras_recebimentos').update(recData).eq('id', recebimentoId);
                if (error) throw error;
                await supabase.from('compras_itens_recebimento').delete().eq('recebimento_id', recebimentoId);
            } else {
                const { data, error } = await supabase.from('compras_recebimentos').insert([recData]).select().single();
                if (error) throw error;
                recebimentoId = data.id;
            }

            if (itensRecebimento.length > 0 && recebimentoId) {
                const itensToInsert = itensRecebimento.map(item => ({
                    recebimento_id: recebimentoId,
                    material_nome: item.material_nome,
                    quantidade_pedida: item.quantidade_pedida,
                    quantidade_recebida: item.quantidade_recebida,
                    unidade: item.unidade,
                    valor_unitario: item.valor_unitario
                }));
                const { error: itemError } = await supabase.from('compras_itens_recebimento').insert(itensToInsert);
                if (itemError) throw itemError;
            }

            // If finalizing, maybe update order status? Keeping simple for now.

            toast.success(editingRecebimento ? 'Recebimento atualizado' : 'Recebimento registrado');
            setEditingRecebimento(null);
            fetchRecebimentos();
            setActiveTab('lista');

        } catch (error) {
            console.error(error);
            toast.error('Erro ao salvar recebimento');
        } finally {
            setLoading(false);
        }
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
        (r.pedido?.numero || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.pedido?.fornecedor?.nome || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                                    {loading ? (
                                        <tr><td colSpan={8} className="text-center py-4">Carregando...</td></tr>
                                    ) : recebimentosFiltrados.map(rec => (
                                        <tr key={rec.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 text-sm font-medium text-black">{rec.numero}</td>
                                            <td className="py-4 px-4 text-sm text-gray-900">{rec.pedido?.numero || '-'}</td>
                                            <td className="py-4 px-4 text-sm text-gray-900">{rec.pedido?.fornecedor?.nome || '-'}</td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {new Date(rec.data_recebimento).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">{rec.nota_fiscal}</td>
                                            <td className="py-4 px-4 text-sm font-medium text-gray-900 text-right">
                                                R$ {rec.valor_total.toFixed(2)}
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

                        {!loading && recebimentosFiltrados.length === 0 && (
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
                                            value={formData.numero}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Recebimento</label>
                                        <input
                                            type="date"
                                            value={formData.data_recebimento}
                                            onChange={e => setFormData({ ...formData, data_recebimento: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pedido de Compra</label>
                                        <select
                                            value={formData.pedido_id}
                                            onChange={e => handlePedidoChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            <option value="">Selecione um pedido</option>
                                            {pedidosDisponiveis.map(p => (
                                                <option key={p.id} value={p.id}>{p.numero} - {p.fornecedor?.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nota Fiscal</label>
                                        <input
                                            type="text"
                                            value={formData.nota_fiscal}
                                            onChange={e => setFormData({ ...formData, nota_fiscal: e.target.value })}
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
                                        onClick={() => setItensRecebimento([...itensRecebimento, { material_nome: '', quantidade_pedida: 0, quantidade_recebida: 0, unidade: 'un', valor_unitario: 0 }])}
                                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        + Adicionar Item
                                    </button>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Importante:</strong> Ao finalizar o recebimento, os itens serão automaticamente contabilizados.
                                    </p>
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
                                                            value={item.material_nome}
                                                            onChange={e => {
                                                                const newItens = [...itensRecebimento];
                                                                newItens[index].material_nome = e.target.value;
                                                                setItensRecebimento(newItens);
                                                            }}
                                                            placeholder="Nome do material"
                                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <input
                                                            type="number"
                                                            value={item.quantidade_pedida}
                                                            readOnly
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <input
                                                            type="number"
                                                            value={item.quantidade_recebida}
                                                            onChange={e => {
                                                                const newItens = [...itensRecebimento];
                                                                newItens[index].quantidade_recebida = Number(e.target.value);
                                                                setItensRecebimento(newItens);
                                                            }}
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <select
                                                            value={item.unidade}
                                                            onChange={e => {
                                                                const newItens = [...itensRecebimento];
                                                                newItens[index].unidade = e.target.value;
                                                                setItensRecebimento(newItens);
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
                                                            type="number"
                                                            step="0.01"
                                                            value={item.valor_unitario}
                                                            onChange={e => {
                                                                const newItens = [...itensRecebimento];
                                                                newItens[index].valor_unitario = Number(e.target.value);
                                                                setItensRecebimento(newItens);
                                                            }}
                                                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3 text-sm font-medium">
                                                        R$ {(item.quantidade_recebida * item.valor_unitario).toFixed(2)}
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setItensRecebimento(itensRecebimento.filter((_, i) => i !== index))}
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
                                                    R$ {itensRecebimento.reduce((acc, i) => acc + (i.quantidade_recebida * i.valor_unitario), 0).toFixed(2)}
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
                                    value={formData.observacoes}
                                    onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
                                    placeholder="Observações sobre o recebimento (divergências, avarias, etc)..."
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
                                    {loading ? 'Salvando...' : (editingRecebimento ? 'Salvar Alterações' : 'Finalizar Recebimento')}
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
