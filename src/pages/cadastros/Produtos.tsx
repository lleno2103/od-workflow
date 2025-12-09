import React, { useState, useEffect } from 'react';
import { Layout } from '../../components';
import { useProdutos, type Produto, type Categoria, type Variante } from '../../hooks/useProdutos';

const coresOdo = [
    { nome: 'Branco', hex: '#FFFFFF', codigo: 'BRA' },
    { nome: 'Verde Bandeira', hex: '#009739', codigo: 'VER' },
    { nome: 'Vermelho', hex: '#E8112D', codigo: 'VRM' },
    { nome: 'Azul Royal', hex: '#002776', codigo: 'AZU' },
    { nome: 'Amarelo', hex: '#FFDF00', codigo: 'AMA' },
    { nome: 'Preto', hex: '#000000', codigo: 'PRE' },
];

const tamanhos = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

type TabType = 'lista' | 'novo' | 'variantes' | 'novo-variante' | 'categorias';

const Produtos: React.FC = () => {
    const { produtos, categorias, variantes, loading, createProduto, updateProduto, deleteProduto, createCategoria, updateCategoria, deleteCategoria, createVariante, deleteVariante, fetchAll } = useProdutos();
    const [activeTab, setActiveTab] = useState<TabType>('lista');
    const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('todas');

    // Estados do formulário de produto
    const [codigo, setCodigo] = useState('');
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [imagemPrincipal, setImagemPrincipal] = useState('');
    const [imagemArquivo, setImagemArquivo] = useState<File | null>(null);
    const [imagemPreview, setImagemPreview] = useState<string>('');
    
    const [tamanhosSelecionados, setTamanhosSelecionados] = useState<string[]>(['M', 'G']);
    const [coresSelecionadas, setCoresSelecionadas] = useState<string[]>(['Verde Bandeira']);
    const [precoBase, setPrecoBase] = useState(0);
    const [margem, setMargem] = useState(150);

    // Estados de Categorias
    const [showCategoriaForm, setShowCategoriaForm] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
    const [categoriaNome, setCategoriaNome] = useState('');
    const [categoriaDescricao, setCategoriaDescricao] = useState('');

    // Estados de Variantes
    const [varianteProdutoId, setVarianteProdutoId] = useState('');
    const [varianteTamanho, setVarianteTamanho] = useState('M');
    const [varianteCor, setVarianteCor] = useState('Verde Bandeira');
    const [varianteTipoTecido, setVarianteTipoTecido] = useState('Tricoline');
    const [vaianteComprimento, setVarianteComprimento] = useState('');
    const [vaianteModelagem, setVarianteModelagem] = useState('Tradicional');
    const [varianteBordado, setVarianteBordado] = useState('Sem bordado');
    const [vaianteCorLinha, setVarianteCorLinha] = useState('Branco');
    const [variantePeso, setVariantePeso] = useState(0);
    const [vaianteConsumo, setVarianteConsumo] = useState(0);
    const [varianteCustoTotal, setVarianteCustoTotal] = useState(0);
    const [vaiantePreco, setVariantePreco] = useState(0);
    const [varianteFotos, setVarianteFotos] = useState('');
    const [vaianteStatus, setVarianteStatus] = useState('Em estoque');
    const [vaianteObservacoes, setVarianteObservacoes] = useState('');
    const [vaianteEstoque, setVarianteEstoque] = useState(0);

    useEffect(() => {
        fetchAll();
    }, []);

    // Gerar código automaticamente quando categoria muda
    const gerarCodigoProduto = (catId: string) => {
        if (!catId) return '';
        
        const categoria = categorias.find(c => c.id === catId);
        if (!categoria) return '';
        
        const prefixo = categoria.nome.substring(0, 2).toUpperCase();
        const ano = new Date().getFullYear();
        
        // Contar produtos com o mesmo prefixo
        const produtosCategoria = produtos.filter(p => p.codigo.startsWith(prefixo));
        const proximo = String(produtosCategoria.length + 1).padStart(4, '0');
        
        return `${prefixo}-${ano}${proximo}`;
    };

    const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagemArquivo(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagemPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCatId = e.target.value;
        setCategoriaId(newCatId);
        if (!editingProduto) {
            setCodigo(gerarCodigoProduto(newCatId));
        }
    };

    useEffect(() => {
        if (editingProduto) {
            setCodigo(editingProduto.codigo);
            setNome(editingProduto.nome);
            setDescricao(editingProduto.descricao || '');
            setCategoriaId(editingProduto.categoria_id || '');
            setImagemPrincipal(editingProduto.imagem_principal || '');
            setImagemArquivo(null);
            setImagemPreview(editingProduto.imagem_principal || '');
        } else {
            setCodigo('');
            setNome('');
            setDescricao('');
            setCategoriaId('');
            setImagemPrincipal('');
            setImagemArquivo(null);
            setImagemPreview('');
        }
    }, [editingProduto]);

    const handleSubmitProduto = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Usar a imagem preview se arquivo foi selecionado, senão manter a imagem existente
        const imagemFinal = imagemPreview || imagemPrincipal;
        
        if (editingProduto) {
            const result = await updateProduto(editingProduto.id, {
                codigo,
                nome,
                descricao,
                categoria_id: categoriaId || undefined,
                imagem_principal: imagemFinal,
                ativo: true,
            });
            if (result) {
                await fetchAll();
            }
        } else {
            const novoProduto = await createProduto({
                codigo,
                nome,
                descricao,
                categoria_id: categoriaId || undefined,
                imagem_principal: imagemFinal,
                ativo: true,
            });
            
            // Criar variantes se foi novo produto
            if (novoProduto) {
                for (const tamanho of tamanhosSelecionados) {
                    for (const corNome of coresSelecionadas) {
                        const corObj = coresOdo.find(c => c.nome === corNome);
                        const sku = `${codigo}-${tamanho}-${corObj?.codigo}`;
                        const precoVenda = calcularPrecoSugerido();
                        
                        await createVariante({
                            produto_id: novoProduto.id,
                            sku,
                            tamanho,
                            cor: corNome,
                            tipo_tecido: 'Tricoline',
                            modelagem: 'Tradicional',
                            bordado: 'Sem bordado',
                            cor_linha: 'Branco',
                            peso_variante: 0,
                            consumo_tecido: 0,
                            custo_total: precoBase,
                            preco_venda: precoVenda,
                            custo_producao: precoBase,
                            status_estoque: 'Em estoque',
                            estoque: 0,
                            ativo: true,
                        });
                    }
                }
                await fetchAll();
            }
        }
        
        resetFormProduto();
        setActiveTab('lista');
    };

    const resetFormProduto = () => {
        setCodigo('');
        setNome('');
        setDescricao('');
        setCategoriaId('');
        setImagemPrincipal('');
        setImagemArquivo(null);
        setImagemPreview('');
        setEditingProduto(null);
        setTamanhosSelecionados(['M', 'G']);
        setCoresSelecionadas(['Verde Bandeira']);
        setPrecoBase(0);
        setMargem(150);
    };

    const handleEditProduto = (produto: Produto) => {
        setEditingProduto(produto);
        setActiveTab('novo');
    };

    const handleDeleteProduto = async (id: string) => {
        if (confirm('Tem certeza que deseja deletar este produto?')) {
            const result = await deleteProduto(id);
            if (result) {
                await fetchAll();
            }
        }
    };

    const handleDeleteVariante = async (id: string) => {
        if (confirm('Tem certeza que deseja deletar esta variante?')) {
            const result = await deleteVariante(id);
            if (result) {
                await fetchAll();
            }
        }
    };

    const handleSaveCategoria = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingCategoria) {
            const result = await updateCategoria(editingCategoria.id, categoriaNome, categoriaDescricao);
            if (result) {
                await fetchAll();
            }
        } else {
            const result = await createCategoria(categoriaNome, categoriaDescricao);
            if (result) {
                await fetchAll();
            }
        }
        
        setCategoriaNome('');
        setCategoriaDescricao('');
        setShowCategoriaForm(false);
        setEditingCategoria(null);
    };

    const handleDeleteCategoria = async (id: string) => {
        if (confirm('Tem certeza que deseja deletar esta categoria?')) {
            const result = await deleteCategoria(id);
            if (result) {
                await fetchAll();
            }
        }
    };

    const gerarSKUVariante = (produto: Produto): string => {
        if (!produto) return '';
        const corObj = coresOdo.find(c => c.nome === varianteCor);
        const tecidoAbrev = varianteTipoTecido.substring(0, 3).toUpperCase();
        const bordadoAbrev = varianteBordado.substring(0, 1).toUpperCase();
        return `ODO-${produto.codigo}-${varianteTamanho}-${corObj?.codigo || 'XXX'}-${tecidoAbrev}-${bordadoAbrev}`;
    };

    const resetFormVariante = () => {
        setVarianteProdutoId('');
        setVarianteTamanho('M');
        setVarianteCor('Verde Bandeira');
        setVarianteTipoTecido('Tricoline');
        setVarianteComprimento('');
        setVarianteModelagem('Tradicional');
        setVarianteBordado('Sem bordado');
        setVarianteCorLinha('Branco');
        setVariantePeso(0);
        setVarianteConsumo(0);
        setVarianteCustoTotal(0);
        setVariantePreco(0);
        setVarianteFotos('');
        setVarianteStatus('Em estoque');
        setVarianteObservacoes('');
        setVarianteEstoque(0);
    };

    const handleSubmitVariante = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!varianteProdutoId) {
            alert('Selecione um produto');
            return;
        }

        const produto = produtos.find(p => p.id === varianteProdutoId);
        if (!produto) return;

        const sku = gerarSKUVariante(produto);

        const result = await createVariante({
            produto_id: varianteProdutoId,
            sku,
            tamanho: varianteTamanho,
            cor: varianteCor,
            tipo_tecido: varianteTipoTecido,
            comprimento: vaianteComprimento,
            modelagem: vaianteModelagem,
            bordado: varianteBordado,
            cor_linha: vaianteCorLinha,
            peso_variante: variantePeso,
            consumo_tecido: vaianteConsumo,
            custo_total: varianteCustoTotal,
            preco_venda: vaiantePreco,
            custo_producao: varianteCustoTotal,
            fotos_variante: varianteFotos,
            status_estoque: vaianteStatus,
            observacoes_tecnicas: vaianteObservacoes,
            estoque: vaianteEstoque,
            ativo: true,
        });
        if (result) {
            await fetchAll();
            resetFormVariante();
            setActiveTab('variantes');
        }
    };

    const calcularPrecoSugerido = () => {
        if (precoBase > 0) {
            return precoBase * (1 + margem / 100);
        }
        return 0;
    };

    const produtosFiltrados = produtos.filter(produto => {
        const matchSearch = produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchCategoria = filtroCategoria === 'todas' || 
            produto.categoria_id === filtroCategoria ||
            (filtroCategoria === 'sem-categoria' && !produto.categoria_id);
        
        return matchSearch && matchCategoria;
    });

    const getVariantesPorProduto = (produtoId: string): Variante[] => {
        return variantes.filter(v => v.produto_id === produtoId);
    };

    const contarProdutosPorCategoria = (categoriaId: string): number => {
        return produtos.filter(p => p.categoria_id === categoriaId).length;
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
                                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => {
                                        resetFormProduto();
                                        setActiveTab('novo');
                                    }}
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
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Imagem</th>
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
                                        const categoriaInfo = categorias.find(c => c.id === produto.categoria_id);
                                        return (
                                            <tr key={produto.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm font-medium text-black">{produto.codigo}</td>
                                                <td className="py-3 px-4 text-sm text-gray-900 font-medium">{produto.nome}</td>
                                                <td className="py-3 px-4 text-sm text-center text-2xl">{produto.imagem_principal || '📷'}</td>
                                                <td className="py-3 px-4">
                                                    {categoriaInfo ? (
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                                            {categoriaInfo.nome}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-500">Sem categoria</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">{produto.descricao || '-'}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600 font-medium">{variantesProduto.length} variante{variantesProduto.length !== 1 ? 's' : ''}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${produto.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
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
                                                            onClick={() => handleDeleteProduto(produto.id)}
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Deletar"
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

                        <form onSubmit={handleSubmitProduto} className="space-y-6">
                            {/* Informações Básicas */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Informações Básicas</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Código do Produto *</label>
                                        <input
                                            type="text"
                                            value={codigo}
                                            onChange={(e) => setCodigo(e.target.value)}
                                            placeholder="Ex: BAT-20250001"
                                            required
                                            disabled={!editingProduto}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600"
                                        />
                                        {!editingProduto && <p className="text-xs text-gray-500 mt-1">Gerado automaticamente</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                                        <select
                                            value={categoriaId}
                                            onChange={handleCategoriaChange}
                                            required
                                            disabled={editingProduto ? true : false}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                                        >
                                            <option value="">Selecione uma categoria...</option>
                                            {categorias.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto *</label>
                                    <input
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        placeholder="Ex: Bata Odò - Henley"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        rows={3}
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                        placeholder="Descrição detalhada do produto..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            {/* Imagem */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Imagem do Produto</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300 overflow-hidden">
                                        {imagemPreview ? (
                                            <img src={imagemPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400">Sem imagem</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 mb-3">Faça upload de uma imagem para o produto</p>
                                        <label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 cursor-pointer transition-colors">
                                            <div className="text-center">
                                                <svg className="w-5 h-5 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-600">Clique para fazer upload</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImagemChange}
                                                className="hidden"
                                            />
                                        </label>
                                        {imagemArquivo && (
                                            <p className="text-xs text-gray-500 mt-2">Arquivo: {imagemArquivo.name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!editingProduto && (
                                <>
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
                                        <h3 className="text-sm font-semibold text-gray-900 uppercase">Precificação Base</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Custo de Produção (R$) *</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={precoBase}
                                                    onChange={(e) => setPrecoBase(parseFloat(e.target.value) || 0)}
                                                    placeholder="0.00"
                                                    required
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
                                </>
                            )}

                            {/* Botões */}
                            <div className="flex gap-3 border-t border-gray-200 pt-4">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    {editingProduto ? 'Salvar Alterações' : 'Criar Produto'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetFormProduto();
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
                                <p className="text-sm text-gray-500">Gerencie todas as variantes de produtos do banco de dados</p>
                            </div>
                            <button
                                onClick={() => setActiveTab('novo-variante')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                + Nova Variante
                            </button>
                        </div>

                        {variantes.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Nenhuma variante cadastrada ainda</p>
                            </div>
                        ) : (
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
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variantes.map(variante => {
                                            const produto = produtos.find(p => p.id === variante.produto_id);
                                            const margem = variante.custo_producao > 0 
                                                ? ((variante.preco_venda - variante.custo_producao) / variante.custo_producao * 100).toFixed(0)
                                                : '0';
                                            const cor = coresOdo.find(c => c.nome === variante.cor);

                                            return (
                                                <tr key={variante.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm font-mono text-gray-900 font-medium">{variante.sku}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{produto?.nome || 'Produto não encontrado'}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600 font-medium">{variante.tamanho}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                                style={{ backgroundColor: cor?.hex || '#999' }}
                                                            />
                                                            <span className="text-sm text-gray-600">{variante.cor}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600 text-right">R$ {variante.custo_producao.toFixed(2)}</td>
                                                    <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">R$ {variante.preco_venda.toFixed(2)}</td>
                                                    <td className="py-3 px-4 text-sm text-green-600 text-right font-medium">{margem}%</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600 text-right font-medium">{variante.estoque}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${variante.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                            {variante.ativo ? 'Ativo' : 'Inativo'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <button
                                                            onClick={() => handleDeleteVariante(variante.id)}
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Deletar variante"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
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

                            <form className="space-y-6" onSubmit={handleSaveCategoria}>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Informações da Categoria</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria *</label>
                                        <input
                                            type="text"
                                            value={categoriaNome}
                                            onChange={(e) => setCategoriaNome(e.target.value)}
                                            placeholder="Ex: Batas"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                        <textarea
                                            rows={3}
                                            value={categoriaDescricao}
                                            onChange={(e) => setCategoriaDescricao(e.target.value)}
                                            placeholder="Descrição da categoria..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 border-t border-gray-200 pt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                        {editingCategoria ? 'Salvar Alterações' : 'Criar Categoria'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCategoriaForm(false);
                                            setEditingCategoria(null);
                                            setCategoriaNome('');
                                            setCategoriaDescricao('');
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
                                    setCategoriaNome('');
                                    setCategoriaDescricao('');
                                    setShowCategoriaForm(true);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                + Nova Categoria
                            </button>
                        </div>

                        {categorias.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Nenhuma categoria cadastrada ainda</p>
                            </div>
                        ) : (
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
                                            const qtdProdutos = contarProdutosPorCategoria(categoria.id);
                                            return (
                                                <tr key={categoria.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-4 text-sm font-medium text-black">{categoria.nome}</td>
                                                    <td className="py-4 px-4 text-sm text-gray-600">{categoria.descricao || '-'}</td>
                                                    <td className="py-4 px-4">
                                                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            {qtdProdutos} produto{qtdProdutos !== 1 ? 's' : ''}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex gap-2 justify-end">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingCategoria(categoria);
                                                                    setCategoriaNome(categoria.nome);
                                                                    setCategoriaDescricao(categoria.descricao || '');
                                                                    setShowCategoriaForm(true);
                                                                }}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                                title="Editar"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteCategoria(categoria.id)}
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
                );

            case 'novo-variante':
                return (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Nova Variante</h2>
                            <button
                                onClick={() => {
                                    resetFormVariante();
                                    setActiveTab('variantes');
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmitVariante} className="space-y-6">
                            {/* Seção 1: Produto e Identificação */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Produto e Identificação</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Produto *</label>
                                        <select
                                            value={varianteProdutoId}
                                            onChange={(e) => setVarianteProdutoId(e.target.value)}
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
                                            value={varianteProdutoId ? gerarSKUVariante(produtos.find(p => p.id === varianteProdutoId)!) : ''}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho *</label>
                                        <select
                                            value={varianteTamanho}
                                            onChange={(e) => setVarianteTamanho(e.target.value)}
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
                                            value={varianteCor}
                                            onChange={(e) => setVarianteCor(e.target.value)}
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
                                            value={varianteTipoTecido}
                                            onChange={(e) => setVarianteTipoTecido(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            <option value="Tricoline">Tricoline</option>
                                            <option value="Oxford">Oxford</option>
                                            <option value="Viscolinho">Viscolinho</option>
                                            <option value="Algodão">Algodão</option>
                                            <option value="Sarja leve">Sarja leve</option>
                                            <option value="Linho misto">Linho misto</option>
                                            <option value="Viscose">Viscose</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cor da Linha *</label>
                                        <select
                                            value={vaianteCorLinha}
                                            onChange={(e) => setVarianteCorLinha(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            <option value="Branco">Branco</option>
                                            <option value="Preto">Preto</option>
                                            <option value="Cinza">Cinza</option>
                                            <option value="Marrom">Marrom</option>
                                            <option value="Verde">Verde</option>
                                            <option value="Vermelho">Vermelho</option>
                                            <option value="Azul">Azul</option>
                                            <option value="Amarelo">Amarelo</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Comprimento</label>
                                        <input
                                            type="text"
                                            value={vaianteComprimento}
                                            onChange={(e) => setVarianteComprimento(e.target.value)}
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
                                            value={vaianteModelagem}
                                            onChange={(e) => setVarianteModelagem(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            <option value="Tradicional">Tradicional</option>
                                            <option value="Over">Over</option>
                                            <option value="Slim">Slim</option>
                                            <option value="Reto">Reto</option>
                                            <option value="Amplo">Amplo</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bordado *</label>
                                        <select
                                            value={varianteBordado}
                                            onChange={(e) => setVarianteBordado(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            <option value="Sem bordado">Sem bordado</option>
                                            <option value="Leve">Leve</option>
                                            <option value="Médio">Médio</option>
                                            <option value="Cheio">Cheio</option>
                                            <option value="Personalizado">Personalizado</option>
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
                                            value={variantePeso}
                                            onChange={(e) => setVariantePeso(parseFloat(e.target.value) || 0)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Consumo de Tecido (m) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={vaianteConsumo}
                                            onChange={(e) => setVarianteConsumo(parseFloat(e.target.value) || 0)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Atual (un)</label>
                                        <input
                                            type="number"
                                            value={vaianteEstoque}
                                            onChange={(e) => setVarianteEstoque(parseInt(e.target.value) || 0)}
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
                                            value={varianteCustoTotal}
                                            onChange={(e) => setVarianteCustoTotal(parseFloat(e.target.value) || 0)}
                                            placeholder="0.00"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={vaiantePreco}
                                            onChange={(e) => setVariantePreco(parseFloat(e.target.value) || 0)}
                                            placeholder="0.00"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Markup (%)</label>
                                        <div className="w-full px-3 py-2 border-2 border-green-500 bg-green-50 rounded-lg font-semibold text-green-700">
                                            {varianteCustoTotal > 0 ? (((vaiantePreco - varianteCustoTotal) / varianteCustoTotal) * 100).toFixed(2) : '0'}%
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
                                            value={vaianteStatus}
                                            onChange={(e) => setVarianteStatus(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            <option value="Em estoque">Em estoque</option>
                                            <option value="Produção">Produção</option>
                                            <option value="Sob encomenda">Sob encomenda</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fotos da Variante</label>
                                        <input
                                            type="text"
                                            value={varianteFotos}
                                            onChange={(e) => setVarianteFotos(e.target.value)}
                                            placeholder="URL da imagem ou caminho"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações Técnicas</label>
                                    <textarea
                                        value={vaianteObservacoes}
                                        onChange={(e) => setVarianteObservacoes(e.target.value)}
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
                                    Criar Variante
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetFormVariante();
                                        setActiveTab('variantes');
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
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Carregando dados...</p>
                            </div>
                        </div>
                    ) : (
                        renderTabContent()
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Produtos;
