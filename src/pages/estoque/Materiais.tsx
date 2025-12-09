import React, { useState, useEffect } from 'react';
import { Layout } from '../../components';
import { useMateriais, type Material } from '../../hooks/useMateriais';
import { toast } from 'sonner';

const tiposMaterial = [
    'Tecido',
    'Linha',
    'Etiqueta',
    'Botão',
    'Zíper',
    'Elástico',
    'Entretela',
    'Embalagem',
    'Aviamentos diversos',
    'Outros'
];

const unidadesMedida = [
    { value: 'm', label: 'Metros (m)' },
    { value: 'kg', label: 'Quilogramas (kg)' },
    { value: 'un', label: 'Unidade (un)' },
    { value: 'par', label: 'Par' },
    { value: 'cx', label: 'Caixa (cx)' },
    { value: 'rl', label: 'Rolo (rl)' },
    { value: 'pc', label: 'Pacote (pc)' },
    { value: 'cone', label: 'Cone' },
];

type TabType = 'lista' | 'novo';

const Materiais: React.FC = () => {
    const { materiais, loading, createMaterial, updateMaterial, deleteMaterial, fetchMateriais } = useMateriais();
    const [activeTab, setActiveTab] = useState<TabType>('lista');
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('todos');

    // Form States
    const [editingId, setEditingId] = useState<string | null>(null);
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState('');
    const [tipo, setTipo] = useState('Tecido');
    const [descricaoCurta, setDescricaoCurta] = useState('');

    // Detalhes Técnicos (JSONB)
    const [detalhes, setDetalhes] = useState<Record<string, any>>({});

    // Unidade & Preços
    const [unidade, setUnidade] = useState('m');
    const [unidadeCompra, setUnidadeCompra] = useState('');
    const [precoCompra, setPrecoCompra] = useState('0');
    const [qtdPorUnidadeCompra, setQtdPorUnidadeCompra] = useState('0');
    const [custo, setCusto] = useState('0'); // Calculated

    // Estoque
    const [estoque, setEstoque] = useState('0');
    const [minimo, setMinimo] = useState('0');
    const [localArmazenamento, setLocalArmazenamento] = useState('');

    // Fornecedor
    const [fornecedorNome, setFornecedorNome] = useState('');
    const [fornecedorCnpj, setFornecedorCnpj] = useState('');
    const [fornecedorContato, setFornecedorContato] = useState('');
    const [fornecedorLink, setFornecedorLink] = useState('');
    const [fornecedorPrazo, setFornecedorPrazo] = useState('');
    const [fornecedorPagamento, setFornecedorPagamento] = useState('');

    // Observações
    const [observacoes, setObservacoes] = useState('');
    const [rendimento, setRendimento] = useState('');
    const [perdas, setPerdas] = useState('0');

    // Legacy/Shared
    const [cor, setCor] = useState('');

    useEffect(() => {
        fetchMateriais();
    }, []);

    // Reset Form
    const resetForm = () => {
        setEditingId(null);
        setNome('');
        setCodigo('');
        setTipo('Tecido');
        setDescricaoCurta('');
        setDetalhes({});
        setUnidade('m');
        setUnidadeCompra('');
        setPrecoCompra('0');
        setQtdPorUnidadeCompra('0');
        setCusto('0');
        setEstoque('0');
        setMinimo('0');
        setLocalArmazenamento('');
        setFornecedorNome('');
        setFornecedorCnpj('');
        setFornecedorContato('');
        setFornecedorLink('');
        setFornecedorPrazo('');
        setFornecedorPagamento('');
        setObservacoes('');
        setRendimento('');
        setPerdas('0');
        setCor('');
        setActiveTab('lista');
    };

    // Edit Handler
    const handleEdit = (material: Material) => {
        setEditingId(material.id);
        setNome(material.nome);
        setCodigo(material.codigo || '');
        setTipo(material.tipo);
        setDescricaoCurta(material.descricao_curta || '');
        setDetalhes(material.detalhes || {});

        setUnidade(material.unidade_medida);
        setUnidadeCompra(material.unidade_compra || '');
        setPrecoCompra(material.preco_compra?.toString() || '0');
        setQtdPorUnidadeCompra(material.qtd_por_unidade_compra?.toString() || '0');
        setCusto(material.custo_unitario.toString());

        setEstoque(material.estoque_atual.toString());
        setMinimo(material.estoque_minimo.toString());
        setLocalArmazenamento(material.local_armazenamento || '');

        setFornecedorNome(material.fornecedor_nome || '');
        setFornecedorCnpj(material.fornecedor_cnpj || '');
        setFornecedorContato(material.fornecedor_contato || '');
        setFornecedorLink(material.fornecedor_link || '');
        setFornecedorPrazo(material.fornecedor_prazo || '');
        setFornecedorPagamento(material.fornecedor_pagamento || '');

        setObservacoes(material.observacoes_uso || '');
        setRendimento(material.rendimento_medio || '');
        setPerdas(material.perdas_estimadas?.toString() || '0');

        setCor(material.cor || '');
        setActiveTab('novo');
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este material?')) {
            await deleteMaterial(id);
        }
    };

    // Auto-calculate cost per unit
    useEffect(() => {
        const pc = Number(precoCompra.replace(',', '.'));
        const qpu = Number(qtdPorUnidadeCompra.replace(',', '.'));
        if (pc > 0 && qpu > 0) {
            setCusto((pc / qpu).toFixed(4));
        }
    }, [precoCompra, qtdPorUnidadeCompra]);

    // Handle Detalhes Change
    const updateDetalhe = (key: string, value: any) => {
        setDetalhes(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const sanitizeNumber = (val: string) => Number(val.replace(',', '.'));

        const materialData = {
            nome,
            codigo,
            tipo,
            unidade_medida: unidade,
            custo_unitario: sanitizeNumber(custo),
            estoque_atual: sanitizeNumber(estoque),
            estoque_minimo: sanitizeNumber(minimo),
            cor, // Legacy field kept for compatibility
            ativo: true,
            // New fields
            descricao_curta: descricaoCurta,
            detalhes,
            unidade_compra: unidadeCompra,
            preco_compra: sanitizeNumber(precoCompra),
            qtd_por_unidade_compra: sanitizeNumber(qtdPorUnidadeCompra),
            local_armazenamento: localArmazenamento,
            fornecedor_nome: fornecedorNome,
            fornecedor_cnpj: fornecedorCnpj,
            fornecedor_contato: fornecedorContato,
            fornecedor_link: fornecedorLink,
            fornecedor_prazo: fornecedorPrazo,
            fornecedor_pagamento: fornecedorPagamento,
            observacoes_uso: observacoes,
            rendimento_medio: rendimento,
            perdas_estimadas: sanitizeNumber(perdas)
        };

        if (editingId) {
            const result = await updateMaterial(editingId, materialData);
            if (result) resetForm();
        } else {
            const result = await createMaterial(materialData);
            if (result) resetForm();
        }
    };

    // Render Logic for Technical Details
    const renderDetalhesTecnicos = () => {
        const commonInputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent";
        const commonLabelClass = "block text-sm font-medium text-gray-700 mb-1";

        switch (tipo) {
            case 'Tecido':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className={commonLabelClass}>Tipo de Tecido</label>
                            <input type="text" placeholder="Ex: Tricoline, Linho..." className={commonInputClass}
                                value={detalhes.tipo_tecido || ''} onChange={e => updateDetalhe('tipo_tecido', e.target.value)} />
                        </div>
                        <div>
                            <label className={commonLabelClass}>Composição</label>
                            <input type="text" placeholder="Ex: 100% Algodão" className={commonInputClass}
                                value={detalhes.composicao || ''} onChange={e => updateDetalhe('composicao', e.target.value)} />
                        </div>
                        <div>
                            <label className={commonLabelClass}>Gramatura (g/m²)</label>
                            <input type="number" className={commonInputClass}
                                value={detalhes.gramatura || ''} onChange={e => updateDetalhe('gramatura', e.target.value)} />
                        </div>
                        <div>
                            <label className={commonLabelClass}>Largura Útil (cm)</label>
                            <input type="number" className={commonInputClass}
                                value={detalhes.largura || ''} onChange={e => updateDetalhe('largura', e.target.value)} />
                        </div>
                        <div>
                            <label className={commonLabelClass}>Cor / Tonalidade</label>
                            <input type="text" className={commonInputClass}
                                value={detalhes.cor_tonalidade || ''} onChange={e => updateDetalhe('cor_tonalidade', e.target.value)} />
                        </div>
                    </div>
                );
            case 'Linha':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className={commonLabelClass}>Tipo (Poliéster/Algodão)</label>
                            <input type="text" className={commonInputClass}
                                value={detalhes.tipo_linha || ''} onChange={e => updateDetalhe('tipo_linha', e.target.value)} />
                        </div>
                        <div>
                            <label className={commonLabelClass}>Espessura / Titulação</label>
                            <input type="text" className={commonInputClass}
                                value={detalhes.espessura || ''} onChange={e => updateDetalhe('espessura', e.target.value)} />
                        </div>
                        <div>
                            <label className={commonLabelClass}>Cor</label>
                            <input type="text" className={commonInputClass}
                                value={detalhes.cor || ''} onChange={e => updateDetalhe('cor', e.target.value)} />
                        </div>
                        <div>
                            <label className={commonLabelClass}>Marca</label>
                            <input type="text" className={commonInputClass}
                                value={detalhes.marca || ''} onChange={e => updateDetalhe('marca', e.target.value)} />
                        </div>
                    </div>
                );
            case 'Botão':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={commonLabelClass}>Material</label>
                            <input type="text" placeholder="Madeira, Plástico..." className={commonInputClass}
                                value={detalhes.material || ''} onChange={e => updateDetalhe('material', e.target.value)} />
                        </div>
                        <div>
                            <label className={commonLabelClass}>Tamanho (mm)</label>
                            <input type="text" className={commonInputClass}
                                value={detalhes.tamanho || ''} onChange={e => updateDetalhe('tamanho', e.target.value)} />
                        </div>
                        <div>
                            <label className={commonLabelClass}>Cor</label>
                            <input type="text" className={commonInputClass}
                                value={detalhes.cor || ''} onChange={e => updateDetalhe('cor', e.target.value)} />
                        </div>
                    </div>
                );
            case 'Zíper':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={commonLabelClass}>Tipo</label>
                            <select className={commonInputClass}
                                value={detalhes.tipo_ziper || ''} onChange={e => updateDetalhe('tipo_ziper', e.target.value)}>
                                <option value="">Selecione</option>
                                <option value="Invisível">Invisível</option>
                                <option value="Comum">Comum</option>
                                <option value="Metálico">Metálico</option>
                            </select>
                        </div>
                        <div>
                            <label className={commonLabelClass}>Tamanho (cm)</label>
                            <input type="text" className={commonInputClass}
                                value={detalhes.tamanho || ''} onChange={e => updateDetalhe('tamanho', e.target.value)} />
                        </div>
                        <div>
                            <label className={commonLabelClass}>Cor</label>
                            <input type="text" className={commonInputClass}
                                value={detalhes.cor || ''} onChange={e => updateDetalhe('cor', e.target.value)} />
                        </div>
                    </div>
                );
            case 'Elástico':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={commonLabelClass}>Largura (mm/cm)</label>
                            <input type="text" className={commonInputClass}
                                value={detalhes.largura || ''} onChange={e => updateDetalhe('largura', e.target.value)} />
                        </div>
                        <div>
                            <label className={commonLabelClass}>Tipo</label>
                            <select className={commonInputClass}
                                value={detalhes.tipo_elastico || ''} onChange={e => updateDetalhe('tipo_elastico', e.target.value)}>
                                <option value="">Selecione</option>
                                <option value="Chato">Chato</option>
                                <option value="Roliço">Roliço</option>
                            </select>
                        </div>
                    </div>
                );
            case 'Etiqueta':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={commonLabelClass}>Finalidade</label>
                            <input type="text" placeholder="Tamanho, Composição..." className={commonInputClass}
                                value={detalhes.finalidade || ''} onChange={e => updateDetalhe('finalidade', e.target.value)} />
                        </div>
                        <div>
                            <label className={commonLabelClass}>Material</label>
                            <input type="text" placeholder="Cetim, Nylon..." className={commonInputClass}
                                value={detalhes.material || ''} onChange={e => updateDetalhe('material', e.target.value)} />
                        </div>
                        <div>
                            <label className={commonLabelClass}>Formato/Medidas</label>
                            <input type="text" className={commonInputClass}
                                value={detalhes.medidas || ''} onChange={e => updateDetalhe('medidas', e.target.value)} />
                        </div>
                    </div>
                );
            default: // Embalagem, Aviamentos diversos, Outros
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={commonLabelClass}>Descrição / Específicações</label>
                            <input type="text" className={commonInputClass}
                                value={detalhes.especificacoes || ''} onChange={e => updateDetalhe('especificacoes', e.target.value)} />
                        </div>
                    </div>
                );
        }
    };

    const filteredMateriais = materiais.filter(m => {
        const matchesSearch = m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (m.codigo && m.codigo.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesType = filtroTipo === 'todos' || m.tipo === filtroTipo;
        return matchesSearch && matchesType;
    });

    const tabs = [
        { id: 'lista' as TabType, label: 'Lista de Materiais' },
        { id: 'novo' as TabType, label: 'Novo Material' },
    ];

    return (
        <Layout pageTitle="Estoque - Materiais">
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

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    {activeTab === 'lista' ? (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Estoque de Materiais</h2>
                                    <p className="text-sm text-gray-500">Gerencie tecidos, aviamentos e outros insumos</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingId(null);
                                        resetForm();
                                        setActiveTab('novo');
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
                                >
                                    + Novo Material
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Buscar por nome ou código..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="w-full md:w-56">
                                    <select
                                        value={filtroTipo}
                                        onChange={(e) => setFiltroTipo(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="todos">Todos os Tipos</option>
                                        {tiposMaterial.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Material</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Unidade</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Estoque</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Custo Unit.</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredMateriais.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">{item.nome}</span>
                                                        <span className="text-xs text-gray-500">{item.codigo}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{item.tipo}</td>
                                                <td className="px-6 py-4 text-center text-sm text-gray-600">{item.unidade_medida}</td>
                                                <td className={`px-6 py-4 text-right text-sm font-medium ${item.estoque_atual <= item.estoque_minimo ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {item.estoque_atual}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                    R$ {item.custo_unitario.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 p-1">Editar</button>
                                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 p-1">Excluir</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Editar Material' : 'Novo Material'}</h2>
                                <p className="text-sm text-gray-500">Preencha todos os dados técnicos e de estoque</p>
                            </div>

                            <form onSubmit={handleSave} className="space-y-8">
                                {/* 1. Identificação */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase border-b pb-2 mb-4">1. Identificação do Material</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Material</label>
                                            <input type="text" required value={nome} onChange={e => setNome(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria (Tipo)</label>
                                            <select value={tipo} onChange={e => setTipo(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                                {tiposMaterial.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
                                            <input type="text" placeholder="Cor, textura, acabamento..." value={descricaoCurta} onChange={e => setDescricaoCurta(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Detalhes Técnicos */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase border-b pb-2 mb-4">2. Detalhes Técnicos</h3>
                                    {renderDetalhesTecnicos()}
                                </div>

                                {/* 3. Unidade de Medida */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase border-b pb-2 mb-4">3. Unidade de Medida</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Unidade Principal (Uso)</label>
                                            <select value={unidade} onChange={e => setUnidade(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                                {unidadesMedida.map(u => <option key={u.value} value={u.value}>{u.value} ({u.label})</option>)}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 flex items-center">
                                            <p className="text-xs text-gray-500">
                                                A unidade principal é como o material é consumido na produção (ex: metros, unidades).
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Preços */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase border-b pb-2 mb-4">4. Preços e Conversão</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Compra (R$)</label>
                                            <input type="text" value={precoCompra} onChange={e => setPrecoCompra(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Compra</label>
                                            <input type="text" placeholder="Ex: Rolo, Pacote" value={unidadeCompra} onChange={e => setUnidadeCompra(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Qtd por Unidade Compra</label>
                                            <input type="text" placeholder="Ex: 50 (se 50m/rolo)" value={qtdPorUnidadeCompra} onChange={e => setQtdPorUnidadeCompra(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-green-700 mb-1">Custo Real ({unidade})</label>
                                            <input type="text" readOnly value={custo}
                                                className="w-full px-3 py-2 border-green-300 bg-green-50 text-green-800 font-bold rounded-lg" />
                                        </div>
                                    </div>
                                </div>

                                {/* 5. Estoque */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase border-b pb-2 mb-4">5. Controle de Estoque</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Atual ({unidade})</label>
                                            <input type="number" value={estoque} onChange={e => setEstoque(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mínimo (Alerta)</label>
                                            <input type="number" value={minimo} onChange={e => setMinimo(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Local de Armazenamento</label>
                                            <input type="text" placeholder="Ex: Prateleira B3" value={localArmazenamento} onChange={e => setLocalArmazenamento(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                    </div>
                                </div>

                                {/* 6. Fornecedor */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase border-b pb-2 mb-4">6. Fornecedor Principal</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                            <input type="text" value={fornecedorNome} onChange={e => setFornecedorNome(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Contato (Tel/Email)</label>
                                            <input type="text" value={fornecedorContato} onChange={e => setFornecedorContato(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Prazo de Entrega</label>
                                            <input type="text" value={fornecedorPrazo} onChange={e => setFornecedorPrazo(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Catálogo / Site</label>
                                            <input type="text" value={fornecedorLink} onChange={e => setFornecedorLink(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                    </div>
                                </div>

                                {/* 7. Observações */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase border-b pb-2 mb-4">7. Dados de Produção</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Peças em que é usado</label>
                                            <input type="text" placeholder="Ex: Camisas, Vestidos" value={observacoes} onChange={e => setObservacoes(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Rendimento Médio</label>
                                            <input type="text" placeholder="Ex: 1.5m por peça" value={rendimento} onChange={e => setRendimento(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Perdas Estimadas (%)</label>
                                            <input type="number" value={perdas} onChange={e => setPerdas(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null);
                                            resetForm();
                                        }}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm"
                                    >
                                        {editingId ? 'Salvar Alterações' : 'Cadastrar Material'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Materiais;
