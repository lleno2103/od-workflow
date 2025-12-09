import React, { useState, useEffect } from 'react';
import { Layout } from '../../components';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';
import { useMateriais } from '../../hooks/useMateriais';

type TabType = 'lista' | 'novo';

interface Fornecedor {
    id: string;
    nome: string;
}

interface ItemPedido {
    id?: string;
    material_id?: string;
    material_nome: string;
    quantidade: number;
    unidade: string;
    valor_unitario: number;
    valor_total?: number;
}

interface PedidoCompra {
    id: string;
    numero: string;
    fornecedor_id: string;
    fornecedor?: Fornecedor; // Joined
    data_pedido: string;
    data_entrega: string;
    valor_total: number;
    status: 'pendente' | 'enviado' | 'confirmado' | 'recebido' | 'cancelado';
    itens: ItemPedido[];
    observacoes?: string;
}

const PedidosCompra: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('lista');
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('todos');
    const [editingPedido, setEditingPedido] = useState<PedidoCompra | null>(null);
    const [pedidos, setPedidos] = useState<PedidoCompra[]>([]);
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [loading, setLoading] = useState(false);
    const { materiais, fetchMateriais } = useMateriais();

    // Form data
    const [formData, setFormData] = useState<Partial<PedidoCompra>>({
        numero: '',
        fornecedor_id: '',
        data_pedido: new Date().toISOString().split('T')[0],
        data_entrega: '',
        observacoes: '',
        status: 'pendente'
    });
    const [formItens, setFormItens] = useState<ItemPedido[]>([]);

    useEffect(() => {
        fetchPedidos();
        fetchFornecedores();
        fetchMateriais();
    }, []);

    useEffect(() => {
        if (activeTab === 'novo' && !editingPedido) {
            setFormData({
                numero: `PC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                fornecedor_id: '',
                data_pedido: new Date().toISOString().split('T')[0],
                data_entrega: '',
                observacoes: '',
                status: 'pendente'
            });
            setFormItens([{ material_id: '', material_nome: '', quantidade: 0, unidade: 'un', valor_unitario: 0 }]);
        } else if (activeTab === 'novo' && editingPedido) {
            setFormData({
                numero: editingPedido.numero,
                fornecedor_id: editingPedido.fornecedor_id,
                data_pedido: editingPedido.data_pedido,
                data_entrega: editingPedido.data_entrega,
                observacoes: editingPedido.observacoes,
                status: editingPedido.status
            });
            setFormItens(editingPedido.itens.map(i => ({
                material_id: i.material_id,
                material_nome: i.material_nome,
                quantidade: i.quantidade,
                unidade: i.unidade,
                valor_unitario: i.valor_unitario
            })));
        }
    }, [activeTab, editingPedido]);

    const fetchFornecedores = async () => {
        const { data } = await supabase.from('compras_fornecedores').select('id, nome');
        if (data) setFornecedores(data);
    };

    const fetchPedidos = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('compras_pedidos')
                .select(`
                    *,
                    fornecedor:compras_fornecedores(nome),
                    itens:compras_itens_pedido(*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPedidos(data as unknown as PedidoCompra[]);
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            toast.error('Erro ao carregar pedidos');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (pedido: PedidoCompra) => {
        setEditingPedido(pedido);
        setActiveTab('novo');
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este pedido?')) return;
        try {
            const { error } = await supabase.from('compras_pedidos').delete().eq('id', id);
            if (error) throw error;
            toast.success('Pedido excluído');
            fetchPedidos();
        } catch (error) {
            console.error(error);
            toast.error('Erro ao excluir pedido');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let pedidoId = editingPedido?.id;
            const valorTotalPedido = formItens.reduce((acc, i) => acc + (i.quantidade * i.valor_unitario), 0);

            const pedidoData = {
                numero: formData.numero,
                fornecedor_id: formData.fornecedor_id,
                data_pedido: formData.data_pedido,
                data_entrega: formData.data_entrega || null,
                valor_total: valorTotalPedido,
                observacoes: formData.observacoes,
                status: formData.status || 'pendente'
            };

            if (editingPedido) {
                const { error } = await supabase.from('compras_pedidos').update(pedidoData).eq('id', pedidoId);
                if (error) throw error;
                await supabase.from('compras_itens_pedido').delete().eq('pedido_id', pedidoId);
            } else {
                const { data, error } = await supabase.from('compras_pedidos').insert([pedidoData]).select().single();
                if (error) throw error;
                pedidoId = data.id;
            }

            if (formItens.length > 0 && pedidoId) {
                const itensToInsert = formItens.map(item => ({
                    pedido_id: pedidoId,
                    material_id: item.material_id || null,
                    material_nome: item.material_nome,
                    quantidade: item.quantidade,
                    unidade: item.unidade,
                    valor_unitario: item.valor_unitario
                }));
                const { error: itemError } = await supabase.from('compras_itens_pedido').insert(itensToInsert);
                if (itemError) throw itemError;
            }

            toast.success(editingPedido ? 'Pedido atualizado' : 'Pedido criado');
            setEditingPedido(null);
            fetchPedidos();
            setActiveTab('lista');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao salvar pedido');
        } finally {
            setLoading(false);
        }
    };

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
            (p.fornecedor?.nome || '').toLowerCase().includes(searchTerm.toLowerCase());
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
                                    {loading ? (
                                        <tr><td colSpan={7} className="text-center py-4">Carregando...</td></tr>
                                    ) : pedidosFiltrados.map(pedido => (
                                        <tr key={pedido.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 text-sm font-medium text-black">{pedido.numero}</td>
                                            <td className="py-4 px-4 text-sm text-gray-900">{pedido.fornecedor?.nome || '-'}</td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {pedido.data_entrega ? new Date(pedido.data_entrega).toLocaleDateString('pt-BR') : '-'}
                                            </td>
                                            <td className="py-4 px-4 text-sm font-medium text-gray-900 text-right">
                                                R$ {pedido.valor_total.toFixed(2)}
                                            </td>
                                            <td className="py-4 px-4">
                                                {getStatusBadge(pedido.status)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleEdit(pedido)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Editar">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(pedido.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Cancelar">
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

                        {!loading && pedidosFiltrados.length === 0 && (
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
                            <h2 className="text-xl font-semibold text-black">{editingPedido ? 'Editar Pedido' : 'Novo Pedido de Compra'}</h2>
                            <p className="text-sm text-gray-500">Crie ou edite um pedido de compra</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Informações do Pedido */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Informações do Pedido</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Número do Pedido</label>
                                        <input
                                            type="text"
                                            value={formData.numero}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data do Pedido</label>
                                        <input
                                            type="date"
                                            value={formData.data_pedido}
                                            onChange={e => setFormData({ ...formData, data_pedido: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Entrega</label>
                                        <input
                                            type="date"
                                            value={formData.data_entrega}
                                            onChange={e => setFormData({ ...formData, data_entrega: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                                    <select
                                        value={formData.fornecedor_id}
                                        onChange={e => setFormData({ ...formData, fornecedor_id: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Selecione um fornecedor</option>
                                        {fornecedores.map(f => (
                                            <option key={f.id} value={f.id}>{f.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Itens do Pedido */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Itens do Pedido</h3>
                                    <button
                                        type="button"
                                        onClick={() => setFormItens([...formItens, { material_id: '', material_nome: '', quantidade: 1, unidade: 'un', valor_unitario: 0 }])}
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
                                                                    newItens[index].unidade = selectedMat.unidade_compra || selectedMat.unidade_medida;
                                                                    newItens[index].valor_unitario = selectedMat.preco_compra || selectedMat.custo_unitario;
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
                                                            type="number"
                                                            step="0.01"
                                                            value={item.valor_unitario}
                                                            onChange={e => {
                                                                const newItens = [...formItens];
                                                                newItens[index].valor_unitario = Number(e.target.value);
                                                                setFormItens(newItens);
                                                            }}
                                                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3 text-sm font-medium">
                                                        R$ {(item.quantidade * item.valor_unitario).toFixed(2)}
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
                                        <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                                            <tr>
                                                <td colSpan={4} className="py-2 px-3 text-sm font-semibold text-right">Valor Total:</td>
                                                <td className="py-2 px-3 text-sm font-semibold text-green-600">
                                                    R$ {formItens.reduce((acc, i) => acc + (i.quantidade * i.valor_unitario), 0).toFixed(2)}
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
                                    placeholder="Observações adicionais sobre o pedido..."
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
                                    {loading ? 'Salvando...' : (editingPedido ? 'Salvar Pedido' : 'Criar Pedido')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingPedido(null);
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
