import React, { useState, useEffect } from 'react';
import { Layout } from '../../components';
import { useProdutos, type Produto, type Variante } from '../../hooks/useProdutos';

const tamanhos = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

const coresOdo = [
    { nome: 'Branco', hex: '#FFFFFF', codigo: 'BRA' },
    { nome: 'Verde Bandeira', hex: '#009739', codigo: 'VER' },
    { nome: 'Vermelho', hex: '#E8112D', codigo: 'VRM' },
    { nome: 'Azul Royal', hex: '#002776', codigo: 'AZU' },
    { nome: 'Amarelo', hex: '#FFDF00', codigo: 'AMA' },
    { nome: 'Preto', hex: '#000000', codigo: 'PRE' },
];

const VariantesSKUs: React.FC = () => {
    const { produtos, variantes, loading, createVariante, updateVariante, deleteVariante, fetchAll } = useProdutos();
    const [editingVariante, setEditingVariante] = useState<Variante | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [filtroProducto, setFiltroProducto] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Estados do formulário
    const [produtoId, setProdutoId] = useState('');
    const [tamanho, setTamanho] = useState('M');
    const [cor, setCor] = useState('Branco');
    const [custoProducao, setCustoProducao] = useState(0);
    const [precoVenda, setPrecoVenda] = useState(0);
    const [estoque, setEstoque] = useState(0);

    useEffect(() => {
        fetchAll();
    }, []);

    const gerarSKU = (produto: Produto): string => {
        if (!produto) return '';
        
        const corObj = coresOdo.find(c => c.nome === cor);
        return `ODO-${produto.codigo}-${tamanho}-${corObj?.codigo || 'XXX'}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!produtoId) {
            alert('Selecione um produto');
            return;
        }

        const produto = produtos.find(p => p.id === produtoId);
        if (!produto) return;

        const sku = gerarSKU(produto);

        if (editingVariante) {
            const result = await updateVariante(editingVariante.id, {
                produto_id: produtoId,
                sku,
                tamanho,
                cor,
                custo_producao: custoProducao,
                preco_venda: precoVenda,
                estoque,
                ativo: true,
            });
            if (result) {
                await fetchAll();
                resetForm();
            }
        } else {
            const result = await createVariante({
                produto_id: produtoId,
                sku,
                tamanho,
                cor,
                custo_producao: custoProducao,
                preco_venda: precoVenda,
                estoque,
                ativo: true,
            });
            if (result) {
                await fetchAll();
                resetForm();
            }
        }
    };

    const resetForm = () => {
        setEditingVariante(null);
        setProdutoId('');
        setTamanho('M');
        setCor('Branco');
        setCustoProducao(0);
        setPrecoVenda(0);
        setEstoque(0);
        setShowForm(false);
    };

    const handleEdit = (variante: Variante) => {
        setEditingVariante(variante);
        setProdutoId(variante.produto_id);
        setTamanho(variante.tamanho);
        setCor(variante.cor);
        setCustoProducao(variante.custo_producao);
        setPrecoVenda(variante.preco_venda);
        setEstoque(variante.estoque);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja deletar esta variante?')) {
            const result = await deleteVariante(id);
            if (result) {
                await fetchAll();
            }
        }
    };

    const variantesFiltradas = variantes.filter(v => {
        const produtoMatch = !filtroProducto || v.produto_id === filtroProducto;
        const searchMatch = !searchTerm || 
            v.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.tamanho.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.cor.toLowerCase().includes(searchTerm.toLowerCase());
        return produtoMatch && searchMatch;
    });

    const calcularMarkup = () => {
        if (custoProducao > 0) {
            return (((precoVenda - custoProducao) / custoProducao) * 100).toFixed(2);
        }
        return '0';
    };

    return (
        <Layout pageTitle="Variantes / SKUs">
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Variantes / SKUs</h1>
                                <p className="text-gray-600 mt-1">Gestão completa de variantes de produtos com controle de estoque</p>
                            </div>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowForm(true);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                + Nova Variante
                            </button>
                        </div>
                    </div>

                    {/* Formulário */}
                    {showForm && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-green-600">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {editingVariante ? 'Editar Variante' : 'Nova Variante'}
                                </h2>
                                <button
                                    onClick={() => resetForm()}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Seção 1: Produto e Identificação */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Produto e Identificação</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Produto *</label>
                                            <select
                                                value={produtoId}
                                                onChange={(e) => setProdutoId(e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            >
                                                <option value="">Selecione um produto...</option>
                                                {produtos.map(p => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.codigo} - {p.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Gerado)</label>
                                            <input
                                                type="text"
                                                value={produtoId ? gerarSKU(produtos.find(p => p.id === produtoId)!) : ''}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho *</label>
                                            <select
                                                value={tamanho}
                                                onChange={(e) => setTamanho(e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            >
                                                {tamanhos.map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Seção 2: Cor */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Cor</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cor *</label>
                                            <select
                                                value={cor}
                                                onChange={(e) => setCor(e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            >
                                                {coresOdo.map(c => (
                                                    <option key={c.nome} value={c.nome}>{c.nome}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-2 pt-6">
                                            <div
                                                className="w-8 h-8 rounded-full border border-gray-300"
                                                style={{ backgroundColor: coresOdo.find(c => c.nome === cor)?.hex || '#CCC' }}
                                            />
                                            <span className="text-sm text-gray-600">{cor}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Seção 3: Preços e Estoque */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Preços e Estoque</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Custo Produção (R$)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={custoProducao}
                                                onChange={(e) => setCustoProducao(parseFloat(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço Venda (R$)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={precoVenda}
                                                onChange={(e) => setPrecoVenda(parseFloat(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Markup (%)</label>
                                            <input
                                                type="text"
                                                value={calcularMarkup()}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                                            <input
                                                type="number"
                                                value={estoque}
                                                onChange={(e) => setEstoque(parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Botões */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                        {editingVariante ? 'Salvar Alterações' : 'Criar Variante'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Filtros */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Buscar por SKU, tamanho ou cor..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={filtroProducto}
                                onChange={(e) => setFiltroProducto(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="">Todos os produtos</option>
                                {produtos.map(p => (
                                    <option key={p.id} value={p.id}>{p.codigo} - {p.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tabela */}
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Carregando...</div>
                    ) : variantesFiltradas.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            Nenhuma variante encontrada
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">SKU</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Produto</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase">Tamanho</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Cor</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900 uppercase">Custo (R$)</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900 uppercase">Venda (R$)</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase">Margin %</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase">Estoque</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variantesFiltradas.map((variante) => {
                                            const produto = produtos.find(p => p.id === variante.produto_id);
                                            const margin = variante.custo_producao > 0 
                                                ? (((variante.preco_venda - variante.custo_producao) / variante.custo_producao) * 100).toFixed(1)
                                                : '0';
                                            
                                            return (
                                                <tr key={variante.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 text-sm font-mono font-semibold text-gray-900">{variante.sku}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{produto?.nome}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-700 text-center">{variante.tamanho}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                                style={{ 
                                                                    backgroundColor: coresOdo.find(c => c.nome === variante.cor)?.hex || '#CCC'
                                                                }}
                                                            />
                                                            <span>{variante.cor}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-700">R$ {variante.custo_producao.toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-right text-sm font-medium text-green-600">R$ {variante.preco_venda.toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-center text-sm font-semibold text-green-600">{margin}%</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            variante.estoque > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {variante.estoque}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-2 justify-center">
                                                            <button
                                                                onClick={() => handleEdit(variante)}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                                title="Editar"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(variante.id)}
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
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default VariantesSKUs;
