import React, { useState } from 'react';
import { Layout } from '../../components';

type TabType = 'lista' | 'novo' | 'variantes' | 'categorias';

interface Produto {
    id: string;
    codigo: string;
    nome: string;
    descricao: string;
    categoria: string;
    imagemPrincipal?: string;
    ativo: boolean;
    dataCriacao: string;
}

interface Variante {
    id: string;
    produtoId: string;
    sku: string;
    tamanho: 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XG';
    cor: string;
    precoVenda: number;
    custoProducao: number;
    estoque: number;
    ativo: boolean;
}

interface Categoria {
    id: string;
    nome: string;
    descricao: string;
}

const coresOdo = [
    { nome: 'Branco', hex: '#FFFFFF', codigo: 'BRA' },
    { nome: 'Verde Bandeira', hex: '#009739', codigo: 'VER' },
    { nome: 'Vermelho', hex: '#E8112D', codigo: 'VRM' },
    { nome: 'Azul Royal', hex: '#002776', codigo: 'AZU' },
    { nome: 'Amarelo', hex: '#FFDF00', codigo: 'AMA' },
    { nome: 'Preto', hex: '#000000', codigo: 'PRE' },
];

const tamanhos = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

const Produtos: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('lista');
    const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('todas');

    // Estados do formulário
    const [tamanhosSelecionados, setTamanhosSelecionados] = useState<string[]>(['M', 'G']);
    const [coresSelecionadas, setCoresSelecionadas] = useState<string[]>(['Verde Bandeira']);
    const [precoBase, setPrecoBase] = useState(0);
    const [margem, setMargem] = useState(150);

    // Estados de Categorias
    const [showCategoriaForm, setShowCategoriaForm] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

    const [produtos] = useState<Produto[]>([
        {
            id: '1',
            codigo: 'BAT-HEN',
            nome: 'Bata Odò - Henley',
            descricao: 'Bata confortável em linho, estilo henley com botões frontais',
            categoria: 'Batas',
            imagemPrincipal: '👕',
            ativo: true,
            dataCriacao: '2025-12-01'
        },
        {
            id: '2',
            codigo: 'BER',
            nome: 'Bermuda Odò',
            descricao: 'Bermuda casual em linho, perfeita para o verão',
            categoria: 'Bermudas',
            imagemPrincipal: '🩳',
            ativo: true,
            dataCriacao: '2025-12-01'
        },
        {
            id: '3',
            codigo: 'VES-MID',
            nome: 'Vestido Odò - Midi',
            descricao: 'Vestido midi elegante em cambraia',
            categoria: 'Vestidos',
            imagemPrincipal: '👗',
            ativo: true,
            dataCriacao: '2025-12-02'
        }
    ]);

    const [variantes] = useState<Variante[]>([
        { id: '1', produtoId: '1', sku: 'BAT-HEN-M-VER', tamanho: 'M', cor: 'Verde Bandeira', precoVenda: 189.90, custoProducao: 75.96, estoque: 12, ativo: true },
        { id: '2', produtoId: '1', sku: 'BAT-HEN-G-VER', tamanho: 'G', cor: 'Verde Bandeira', precoVenda: 189.90, custoProducao: 78.50, estoque: 8, ativo: true },
        { id: '3', produtoId: '2', sku: 'BER-M-AZU', tamanho: 'M', cor: 'Azul Royal', precoVenda: 149.90, custoProducao: 59.96, estoque: 15, ativo: true },
        { id: '4', produtoId: '2', sku: 'BER-G-AZU', tamanho: 'G', cor: 'Azul Royal', precoVenda: 149.90, custoProducao: 62.30, estoque: 10, ativo: true },
    ]);

    const [categorias] = useState<Categoria[]>([
        { id: '1', nome: 'Batas', descricao: 'Batas e camisas' },
        { id: '2', nome: 'Bermudas', descricao: 'Bermudas e shorts' },
        { id: '3', nome: 'Vestidos', descricao: 'Vestidos diversos' },
        { id: '4', nome: 'Acessórios', descricao: 'Bolsas, chapéus, etc' },
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEditingProduto(null);
        setActiveTab('lista');
    };

    const handleEditProduto = (produto: Produto) => {
        setEditingProduto(produto);
        setActiveTab('novo');
    };

    const produtosFiltrados = produtos.filter(p => {
        const matchSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.codigo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategoria = filtroCategoria === 'todas' || p.categoria === filtroCategoria;
        return matchSearch && matchCategoria;
    });

    const getVariantesPorProduto = (produtoId: string) => {
        return variantes.filter(v => v.produtoId === produtoId);
    };

    const calcularPrecoSugerido = () => {
        if (precoBase > 0) {
            return precoBase * (1 + margem / 100);
        }
        return 0;
    };

    const tabs = [
        { id: 'lista' as TabType, label: 'Lista de Produtos' },
        { id: 'novo' as TabType, label: 'Novo Produto' },
        { id: 'variantes' as TabType, label: 'Variantes / SKUs' },
        { id: 'categorias' as TabType, label: 'Categorias' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'lista':
                return (
                    <div className="space-y-4">
                        {/* Header com busca e filtros */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Buscar produtos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={filtroCategoria}
                                    onChange={(e) => setFiltroCategoria(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="todas">Todas Categorias</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => setActiveTab('novo')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
                                >
                                    + Novo Produto
                                </button>
                            </div>
                        </div>

                        {/* Tabela de produtos */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Código</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Nome</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Categoria</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Descrição</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Variantes</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {produtosFiltrados.map(produto => {
                                        const variantesProduto = getVariantesPorProduto(produto.id);
                                        return (
                                            <tr key={produto.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm font-medium text-black">{produto.codigo}</td>
                                                <td className="py-3 px-4 text-sm text-gray-900">{produto.nome}</td>
                                                <td className="py-3 px-4">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                                        {produto.categoria}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">{produto.descricao}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{variantesProduto.length} variante{variantesProduto.length !== 1 ? 's' : ''}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${produto.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {produto.ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditProduto(produto)}
                                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                            title="Editar"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => setActiveTab('variantes')}
                                                            className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                                            title="Ver Variantes"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
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

                        {produtosFiltrados.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Nenhum produto encontrado</p>
                            </div>
                        )}

                    </div>
                );

            case 'novo':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-black">
                                {editingProduto ? 'Editar Produto' : 'Novo Produto'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {editingProduto ? 'Atualize as informações do produto' : 'Cadastre um novo produto no catálogo'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Informações Básicas */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Informações Básicas</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Código do Produto</label>
                                        <input
                                            type="text"
                                            defaultValue={editingProduto?.codigo}
                                            placeholder="Ex: BAT-HEN"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                        <select
                                            defaultValue={editingProduto?.categoria}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            <option value="">Selecione...</option>
                                            {categorias.map(cat => (
                                                <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                                    <input
                                        type="text"
                                        defaultValue={editingProduto?.nome}
                                        placeholder="Ex: Bata Odò - Henley"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        rows={3}
                                        defaultValue={editingProduto?.descricao}
                                        placeholder="Descrição detalhada do produto..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Imagem */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Imagem do Produto</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-4xl">
                                        {editingProduto?.imagemPrincipal || '📷'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 mb-2">Selecione um emoji ou aguarde integração com upload de imagens</p>
                                        <input
                                            type="text"
                                            placeholder="Cole um emoji (ex: 👕)"
                                            maxLength={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Gerador de Variantes */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Gerador de Variantes</h3>

                                {/* Tamanhos */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tamanhos Disponíveis</label>
                                    <div className="flex flex-wrap gap-2">
                                        {tamanhos.map(tam => (
                                            <button
                                                key={tam}
                                                type="button"
                                                onClick={() => {
                                                    setTamanhosSelecionados(prev =>
                                                        prev.includes(tam) ? prev.filter(t => t !== tam) : [...prev, tam]
                                                    );
                                                }}
                                                className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${tamanhosSelecionados.includes(tam)
                                                    ? 'border-green-600 bg-green-50 text-green-700'
                                                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                                    }`}
                                            >
                                                {tam}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Cores */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cores Disponíveis</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {coresOdo.map(cor => (
                                            <button
                                                key={cor.codigo}
                                                type="button"
                                                onClick={() => {
                                                    setCoresSelecionadas(prev =>
                                                        prev.includes(cor.nome) ? prev.filter(c => c !== cor.nome) : [...prev, cor.nome]
                                                    );
                                                }}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${coresSelecionadas.includes(cor.nome)
                                                    ? 'border-green-600 bg-green-50'
                                                    : 'border-gray-300 bg-white hover:border-gray-400'
                                                    }`}
                                            >
                                                <div
                                                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                                                    style={{ backgroundColor: cor.hex }}
                                                />
                                                <span className="text-sm font-medium">{cor.nome}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Serão criadas {tamanhosSelecionados.length * coresSelecionadas.length} variantes:
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {tamanhosSelecionados.length} tamanhos × {coresSelecionadas.length} cores
                                    </p>
                                </div>
                            </div>

                            {/* Precificação */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Precificação</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Custo de Produção (R$)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={precoBase}
                                            onChange={(e) => setPrecoBase(parseFloat(e.target.value) || 0)}
                                            placeholder="0.00"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Baseado na Lista de Materiais</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Margem de Lucro (%)</label>
                                        <input
                                            type="number"
                                            value={margem}
                                            onChange={(e) => setMargem(parseFloat(e.target.value) || 0)}
                                            placeholder="150"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$)</label>
                                        <div className="w-full px-3 py-2 border-2 border-green-500 bg-green-50 rounded-lg font-semibold text-green-700">
                                            R$ {calcularPrecoSugerido().toFixed(2)}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Preço sugerido</p>
                                    </div>
                                </div>
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    {editingProduto ? 'Salvar Alterações' : 'Criar Produto'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingProduto(null);
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

            case 'variantes':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-black">Variantes / SKUs</h2>
                                <p className="text-sm text-gray-500">Gerencie todas as variantes de produtos</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">SKU</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Produto</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Tamanho</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Cor</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Custo</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Preço</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Margem</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Estoque</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {variantes.map(variante => {
                                        const produto = produtos.find(p => p.id === variante.produtoId);
                                        const margem = ((variante.precoVenda - variante.custoProducao) / variante.custoProducao * 100).toFixed(0);
                                        const cor = coresOdo.find(c => c.nome === variante.cor);

                                        return (
                                            <tr key={variante.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm font-mono text-gray-900">{variante.sku}</td>
                                                <td className="py-3 px-4 text-sm text-gray-900">{produto?.nome}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{variante.tamanho}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-4 h-4 rounded-full border border-gray-300"
                                                            style={{ backgroundColor: cor?.hex }}
                                                        />
                                                        <span className="text-sm text-gray-600">{variante.cor}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600 text-right">R$ {variante.custoProducao.toFixed(2)}</td>
                                                <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">R$ {variante.precoVenda.toFixed(2)}</td>
                                                <td className="py-3 px-4 text-sm text-green-600 text-right">{margem}%</td>
                                                <td className="py-3 px-4 text-sm text-gray-600 text-right">{variante.estoque}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variante.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {variante.ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'categorias':
                if (showCategoriaForm) {
                    return (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-black">
                                    {editingCategoria ? 'Editar Categoria' : 'Nova Categoria'}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {editingCategoria ? 'Atualize as informações da categoria' : 'Cadastre uma nova categoria'}
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowCategoriaForm(false); }}>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Informações da Categoria</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria</label>
                                        <input
                                            type="text"
                                            defaultValue={editingCategoria?.nome}
                                            placeholder="Ex: Batas"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                        <textarea
                                            rows={3}
                                            defaultValue={editingCategoria?.descricao}
                                            placeholder="Descrição da categoria..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                        {editingCategoria ? 'Salvar Alterações' : 'Criar Categoria'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoriaForm(false)}
                                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    );
                }

                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-black">Categorias</h2>
                                <p className="text-sm text-gray-500 mt-1">Gerencie todas as categorias de produtos</p>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingCategoria(null);
                                    setShowCategoriaForm(true);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                + Nova Categoria
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qtd Produtos</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorias.map(categoria => {
                                        const produtosCategoria = produtos.filter(p => p.categoria === categoria.nome);
                                        return (
                                            <tr key={categoria.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4 text-sm font-medium text-black">{categoria.nome}</td>
                                                <td className="py-4 px-4 text-sm text-gray-600">{categoria.descricao}</td>
                                                <td className="py-4 px-4 text-sm text-gray-600">
                                                    {produtosCategoria.length} produto{produtosCategoria.length !== 1 ? 's' : ''}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => {
                                                                setEditingCategoria(categoria);
                                                                setShowCategoriaForm(true);
                                                            }}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                            title="Editar"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Excluir">
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
                );
        }
    };

    return (
        <Layout pageTitle="Produtos">
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

export default Produtos;
