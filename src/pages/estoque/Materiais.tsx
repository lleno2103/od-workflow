import React, { useState, useEffect } from 'react';
import { Layout } from '../../components';
import { useMateriais, type Material } from '../../hooks/useMateriais';

const tiposMaterial = [
    'Tecido',
    'Aviamento',
    'Embalagem',
    'Papelaria',
    'Outros'
];

const unidadesMedida = [
    { value: 'm', label: 'Metros (m)' },
    { value: 'kg', label: 'Quilogramas (kg)' },
    { value: 'un', label: 'Unidade (un)' },
    { value: 'par', label: 'Par' },
    { value: 'cx', label: 'Caixa (cx)' },
    { value: 'rl', label: 'Rolo (rl)' },
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
    const [unidade, setUnidade] = useState('m');
    const [custo, setCusto] = useState('0');
    const [estoque, setEstoque] = useState('0');
    const [minimo, setMinimo] = useState('0');
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
        setUnidade('m');
        setCusto('0');
        setEstoque('0');
        setMinimo('0');
        setCor('');
        setActiveTab('lista');
    };

    // Edit Handler
    const handleEdit = (material: Material) => {
        setEditingId(material.id);
        setNome(material.nome);
        setCodigo(material.codigo || '');
        setTipo(material.tipo);
        setUnidade(material.unidade_medida);
        setCusto(material.custo_unitario.toString());
        setEstoque(material.estoque_atual.toString());
        setMinimo(material.estoque_minimo.toString());
        setCor(material.cor || '');
        setActiveTab('novo');
    };

    // Delete Handler
    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este material?')) {
            await deleteMaterial(id);
        }
    };

    // Generate Code automatically
    const generateCodigo = (currentTipo: string) => {
        if (editingId) return; // Don't change if editing

        const prefixMap: Record<string, string> = {
            'Tecido': 'TEC',
            'Aviamento': 'AVI',
            'Embalagem': 'EMB',
            'Papelaria': 'PAP',
            'Outros': 'OUT'
        };

        const prefix = prefixMap[currentTipo] || 'MAT';
        const year = new Date().getFullYear();

        // Count existing items of same type to sequential number
        // Note: This is a client-side approximation. Ideal is DB sequence.
        // We filter by code prefix to approximate the next number
        const existingCodes = materiais.filter(m => m.codigo && m.codigo.startsWith(`${prefix}-${year}`));
        const nextNum = existingCodes.length + 1;
        const sequence = String(nextNum).padStart(4, '0');

        setCodigo(`${prefix}-${year}${sequence}`);
    };

    // Update code when Type changes
    useEffect(() => {
        if (!editingId) {
            generateCodigo(tipo);
        }
    }, [tipo, materiais]);

    // Save Handler
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Sanitize numeric inputs (replace comma with dot)
        const sanitizeNumber = (val: string) => Number(val.replace(',', '.'));

        const materialData = {
            nome,
            codigo,
            tipo,
            unidade_medida: unidade,
            custo_unitario: sanitizeNumber(custo),
            estoque_atual: sanitizeNumber(estoque),
            estoque_minimo: sanitizeNumber(minimo),
            cor,
            ativo: true
        };

        if (editingId) {
            const result = await updateMaterial(editingId, materialData);
            if (result) resetForm();
        } else {
            const result = await createMaterial(materialData);
            if (result) resetForm();
        }
    };

    // Filter Logic
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

    const renderTabContent = () => {
        switch (activeTab) {
            case 'lista':
                return (
                    <div className="space-y-6">
                        {/* Header Section inside Card */}
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
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Novo Material
                            </button>
                        </div>

                        {/* Search and Filters Row */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar por nome ou código..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pl-10"
                                    />
                                    <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
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

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Material</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cor/Var.</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Unidade</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Estoque</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Custo Unit.</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredMateriais.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                Nenhum material encontrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredMateriais.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">{item.nome}</span>
                                                        {item.codigo && <span className="text-xs text-gray-500 font-mono">{item.codigo}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    <span className="px-2 py-1 rounded-full bg-gray-100 text-xs font-medium">
                                                        {item.tipo}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {item.cor || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm text-gray-600">
                                                    {item.unidade_medida}
                                                </td>
                                                <td className={`px-6 py-4 text-right text-sm font-medium ${item.estoque_atual <= item.estoque_minimo ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {item.estoque_atual}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                    R$ {item.custo_unitario.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="text-blue-600 hover:text-blue-800 p-1"
                                                            title="Editar"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="text-red-600 hover:text-red-800 p-1"
                                                            title="Excluir"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'novo':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-black">
                                {editingId ? 'Editar Material' : 'Novo Material'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {editingId ? 'Atualize as informações do material' : 'Cadastre um novo material no inventário'}
                            </p>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Informações Principais</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Material *</label>
                                            <input
                                                type="text"
                                                required
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                placeholder="Ex: Linho Puro Branco"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Código (SKU/Ref)</label>
                                            <input
                                                type="text"
                                                value={codigo}
                                                readOnly
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all cursor-not-allowed"
                                                placeholder="Gerado automaticamente"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Material</label>
                                            <select
                                                value={tipo}
                                                onChange={(e) => setTipo(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            >
                                                {tiposMaterial.map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cor / Variação</label>
                                            <input
                                                type="text"
                                                value={cor}
                                                onChange={(e) => setCor(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                placeholder="Ex: Branco, Preto, Natural..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                                                <select
                                                    value={unidade}
                                                    onChange={(e) => setUnidade(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                >
                                                    {unidadesMedida.map(u => (
                                                        <option key={u.value} value={u.value}>{u.value} ({u.label})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Custo Unit. (R$)</label>
                                                <input
                                                    type="text"
                                                    value={custo}
                                                    onChange={(e) => setCusto(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Atual</label>
                                                <input
                                                    type="text"
                                                    value={estoque}
                                                    onChange={(e) => setEstoque(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</label>
                                                <input
                                                    type="text"
                                                    value={minimo}
                                                    onChange={(e) => setMinimo(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        resetForm();
                                        setActiveTab('lista');
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                                >
                                    {editingId ? 'Atualizar Material' : 'Salvar Material'}
                                </button>
                            </div>
                        </form>
                    </div>
                );
        }
    };

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

                {/* Tab Content */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
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

export default Materiais;
