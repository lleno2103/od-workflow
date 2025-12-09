import React, { useState, useEffect } from 'react';
import { Layout } from '../../components';
import { useProdutos, type Produto, type Variante } from '../../hooks/useProdutos';

const tiposTecido = ['Tricoline', 'Oxford', 'Viscolinho', 'Algodão', 'Sarja leve', 'Linho misto', 'Viscose'];
const modelagens = ['Tradicional', 'Over', 'Slim', 'Reto', 'Amplo'];
const bordados = ['Sem bordado', 'Leve', 'Médio', 'Cheio', 'Personalizado'];
const coresLinhas = ['Branco', 'Preto', 'Cinza', 'Marrom', 'Verde', 'Vermelho', 'Azul', 'Amarelo'];
const tamanhos = ['PP', 'P', 'M', 'G', 'GG', 'XG'];
const statusEstoque = ['Em estoque', 'Produção', 'Sob encomenda'];

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
    const [tipoTecido, setTipoTecido] = useState('Tricoline');
    const [comprimento, setComprimento] = useState('');
    const [modelagem, setModelagem] = useState('Tradicional');
    const [bordado, setBordado] = useState('Sem bordado');
    const [corLinha, setCorLinha] = useState('Branco');
    const [pesoVariante, setPesoVariante] = useState(0);
    const [consumoTecido, setConsumoTecido] = useState(0);
    const [custoTotal, setCustoTotal] = useState(0);
    const [precoVenda, setPrecoVenda] = useState(0);
    const [fotosVariante, setFotosVariante] = useState('');
    const [statusEstoqueVar, setStatusEstoqueVar] = useState('Em estoque');
    const [observacoes, setObservacoes] = useState('');
    const [estoque, setEstoque] = useState(0);

    useEffect(() => {
        fetchAll();
    }, []);

    const gerarSKU = (produto: Produto): string => {
        if (!produto || !editingVariante && !tamanho) return '';
        
        const corObj = coresOdo.find(c => c.nome === cor);
        const tecidoAbrev = tipoTecido.substring(0, 3).toUpperCase();
        const bordadoAbrev = bordado.substring(0, 1).toUpperCase();
        
        return `ODO-${produto.codigo}-${tamanho}-${corObj?.codigo || 'XXX'}-${tecidoAbrev}-${bordadoAbrev}`;
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
                tipo_tecido: tipoTecido,
                comprimento,
                modelagem,
                bordado,
                cor_linha: corLinha,
                peso_variante: pesoVariante,
                consumo_tecido: consumoTecido,
                custo_total: custoTotal,
                preco_venda: precoVenda,
                fotos_variante: fotosVariante,
                status_estoque: statusEstoqueVar,
                observacoes_tecnicas: observacoes,
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
                tipo_tecido: tipoTecido,
                comprimento,
                modelagem,
                bordado,
                cor_linha: corLinha,
                peso_variante: pesoVariante,
                consumo_tecido: consumoTecido,
                custo_total: custoTotal,
                preco_venda: precoVenda,
                custo_producao: custoTotal,
                fotos_variante: fotosVariante,
                status_estoque: statusEstoqueVar,
                observacoes_tecnicas: observacoes,
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
        setTipoTecido('Tricoline');
        setComprimento('');
        setModelagem('Tradicional');
        setBordado('Sem bordado');
        setCorLinha('Branco');
        setPesoVariante(0);
        setConsumoTecido(0);
        setCustoTotal(0);
        setPrecoVenda(0);
        setFotosVariante('');
        setStatusEstoqueVar('Em estoque');
        setObservacoes('');
        setEstoque(0);
        setShowForm(false);
    };

    const handleEdit = (variante: Variante) => {
        setEditingVariante(variante);
        setProdutoId(variante.produto_id);
        setTamanho(variante.tamanho);
        setCor(variante.cor);
        setTipoTecido(variante.tipo_tecido);
        setComprimento(variante.comprimento || '');
        setModelagem(variante.modelagem);
        setBordado(variante.bordado);
        setCorLinha(variante.cor_linha);
        setPesoVariante(variante.peso_variante);
        setConsumoTecido(variante.consumo_tecido);
        setCustoTotal(variante.custo_total);
        setPrecoVenda(variante.preco_venda);
        setFotosVariante(variante.fotos_variante || '');
        setStatusEstoqueVar(variante.status_estoque);
        setObservacoes(variante.observacoes_tecnicas || '');
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
        if (custoTotal > 0) {
            return (((precoVenda - custoTotal) / custoTotal) * 100).toFixed(2);
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
                                <p className="text-gray-600 mt-1">Gestão completa de variantes de produtos com controle de estoque e produção</p>
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

                                {/* Seção 2: Cores e Tecidos */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Cores e Tecidos</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cor do Tecido *</label>
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

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Tecido *</label>
                                            <select
                                                value={tipoTecido}
                                                onChange={(e) => setTipoTecido(e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            >
                                                {tiposTecido.map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cor da Linha *</label>
                                            <select
                                                value={corLinha}
                                                onChange={(e) => setCorLinha(e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            >
                                                {coresLinhas.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Comprimento</label>
                                            <input
                                                type="text"
                                                value={comprimento}
                                                onChange={(e) => setComprimento(e.target.value)}
                                                placeholder="Ex: 72cm"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Seção 3: Detalhes de Modelagem */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Detalhes de Modelagem</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Modelagem *</label>
                                            <select
                                                value={modelagem}
                                                onChange={(e) => setModelagem(e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            >
                                                {modelagens.map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bordado *</label>
                                            <select
                                                value={bordado}
                                                onChange={(e) => setBordado(e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            >
                                                {bordados.map(b => (
                                                    <option key={b} value={b}>{b}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Seção 4: Especificações Técnicas */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Especificações Técnicas</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Peso da Variante (g) *</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={pesoVariante}
                                                onChange={(e) => setPesoVariante(parseFloat(e.target.value) || 0)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Consumo de Tecido (m) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={consumoTecido}
                                                onChange={(e) => setConsumoTecido(parseFloat(e.target.value) || 0)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Atual (un)</label>
                                            <input
                                                type="number"
                                                value={estoque}
                                                onChange={(e) => setEstoque(parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Seção 5: Custos e Preços */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Custos e Preços</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Custo Total (R$) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={custoTotal}
                                                onChange={(e) => setCustoTotal(parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Tecido + aviamentos + bordado + mão de obra + perdas</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={precoVenda}
                                                onChange={(e) => setPrecoVenda(parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Markup (%)</label>
                                            <div className="w-full px-3 py-2 border-2 border-green-500 bg-green-50 rounded-lg font-semibold text-green-700">
                                                {calcularMarkup()}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Seção 6: Estoque e Observações */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Status e Observações</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status de Estoque *</label>
                                            <select
                                                value={statusEstoqueVar}
                                                onChange={(e) => setStatusEstoqueVar(e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            >
                                                {statusEstoque.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Fotos da Variante</label>
                                            <input
                                                type="text"
                                                value={fotosVariante}
                                                onChange={(e) => setFotosVariante(e.target.value)}
                                                placeholder="URL da imagem ou caminho"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Observações Técnicas</label>
                                        <textarea
                                            value={observacoes}
                                            onChange={(e) => setObservacoes(e.target.value)}
                                            placeholder="Notas especiais, detalhes de produção, cuidados..."
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Botões */}
                                <div className="flex gap-3 border-t border-gray-200 pt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                        {editingVariante ? 'Salvar Alterações' : 'Criar Variante'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => resetForm()}
                                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Filtros */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Produto</label>
                                <select
                                    value={filtroProducto}
                                    onChange={(e) => setFiltroProducto(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Todos os produtos</option>
                                    {produtos.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.codigo} - {p.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar SKU</label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="SKU, tamanho, cor..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-end">
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700">
                                    <strong>{variantesFiltradas.length}</strong> variante(s) encontrada(s)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabela de Variantes */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Carregando variantes...</div>
                        ) : variantesFiltradas.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                Nenhuma variante encontrada
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">SKU</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Produto</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Tamanho</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Cor / Tecido</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Modelagem</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Bordado</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900 uppercase">Consumo (m)</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900 uppercase">Custo (R$)</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900 uppercase">Venda (R$)</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase">Margin %</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase">Estoque</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase">Status</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variantesFiltradas.map((variante) => {
                                            const produto = produtos.find(p => p.id === variante.produto_id);
                                            const margin = variante.custo_total > 0 
                                                ? (((variante.preco_venda - variante.custo_total) / variante.custo_total) * 100).toFixed(1)
                                                : '0';
                                            
                                            return (
                                                <tr key={variante.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 text-sm font-mono font-semibold text-gray-900">{variante.sku}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{produto?.codigo}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{variante.tamanho}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                                style={{ 
                                                                    backgroundColor: coresOdo.find(c => c.nome === variante.cor)?.hex || '#CCC'
                                                                }}
                                                            />
                                                            <span>{variante.cor.substring(0, 3)}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">{variante.tipo_tecido.substring(0, 8)}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{variante.modelagem.substring(0, 4)}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{variante.bordado}</td>
                                                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-700">{variante.consumo_tecido.toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-700">R$ {variante.custo_total.toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-right text-sm font-medium text-green-600">R$ {variante.preco_venda.toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-center text-sm font-semibold text-green-600">{margin}%</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            variante.estoque > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {variante.estoque}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            variante.status_estoque === 'Em estoque' ? 'bg-green-100 text-green-800' :
                                                            variante.status_estoque === 'Produção' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {variante.status_estoque}
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
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default VariantesSKUs;
