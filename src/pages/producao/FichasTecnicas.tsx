import React, { useState } from 'react';
import { Layout } from '../../components';

type TabType = 'lista' | 'nova';

interface FichaTecnica {
    id: string;
    codigo: string;
    nome: string;
    variante: string;
    material: string;
    fornecedor: string;
    composicao: string;
}

const FichasTecnicas: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('lista');
    const [editingFicha, setEditingFicha] = useState<FichaTecnica | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const [fichas, setFichas] = useState<FichaTecnica[]>([
        {
            id: '1',
            codigo: 'FT-001',
            nome: 'Bata Odò - Henley',
            variante: 'M - Verde Bandeira',
            material: 'Linho 100%',
            fornecedor: 'Tecidos Brasil',
            composicao: '100% Linho'
        },
        {
            id: '2',
            codigo: 'FT-002',
            nome: 'Bermuda Odò',
            variante: 'G - Azul Royal',
            material: 'Linho + Viscose',
            fornecedor: 'Tecidos Brasil',
            composicao: '70% Linho, 30% Viscose'
        },
    ]);

    // Funções CRUD
    const handleEdit = (ficha: FichaTecnica) => {
        setEditingFicha(ficha);
        setActiveTab('nova');
    };

    const handleDelete = (id: string) => {
        setFichas(fichas.filter(f => f.id !== id));
        setDeleteConfirm(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setEditingFicha(null);
        setActiveTab('lista');
    };

    const handleCancel = () => {
        setEditingFicha(null);
        setActiveTab('lista');
    };

    const tabs = [
        { id: 'lista' as TabType, label: 'Fichas Técnicas' },
        { id: 'nova' as TabType, label: 'Nova Ficha' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'lista':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-black">Fichas Técnicas</h2>
                                <p className="text-sm text-gray-500">Gerencie as especificações técnicas dos produtos</p>
                            </div>
                            <button
                                onClick={() => setActiveTab('nova')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                + Nova Ficha
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fichas.map((ficha) => (
                                <div key={ficha.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-black">{ficha.codigo}</h3>
                                            <p className="text-sm text-gray-900 mt-1">{ficha.nome}</p>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            Ativa
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <p className="text-gray-600"><span className="font-medium">Variante:</span> {ficha.variante}</p>
                                        <p className="text-gray-600"><span className="font-medium">Material:</span> {ficha.material}</p>
                                        <p className="text-gray-600"><span className="font-medium">Composição:</span> {ficha.composicao}</p>
                                        <p className="text-gray-600"><span className="font-medium">Fornecedor:</span> {ficha.fornecedor}</p>
                                    </div>
                                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                                        <button
                                            onClick={() => handleEdit(ficha)}
                                            className="flex-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors font-medium"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(ficha.id)}
                                            className="flex-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors font-medium"
                                        >
                                            🗑️ Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'nova':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-black">
                                {editingFicha ? 'Editar Ficha Técnica' : 'Nova Ficha Técnica'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {editingFicha ? 'Atualize as especificações' : 'Preencha as especificações do produto'}
                            </p>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Informações Básicas */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Informações Básicas</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Código / SKU</label>
                                        <input
                                            type="text"
                                            placeholder="FT-003"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                                        <input
                                            type="text"
                                            placeholder="Bata Odò - Henley"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                            <option>PP</option>
                                            <option>P</option>
                                            <option>M</option>
                                            <option>G</option>
                                            <option>GG</option>
                                            <option>XG</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                            <option>Branco</option>
                                            <option>Verde Bandeira</option>
                                            <option>Vermelho</option>
                                            <option>Azul Royal</option>
                                            <option>Amarelo</option>
                                            <option>Preto</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Material */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Material</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Material Principal</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                            <option>Linho 100%</option>
                                            <option>Linho + Viscose</option>
                                            <option>Cambraia</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                                        <input
                                            type="text"
                                            placeholder="Nome do fornecedor"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Composição</label>
                                        <input
                                            type="text"
                                            placeholder="100% Linho"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Medidas */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Tabela de Medidas (cm)</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border border-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Referência</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">PP</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">P</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">M</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">G</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">GG</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">XG</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t border-gray-200">
                                                <td className="px-4 py-2 text-sm font-medium text-gray-700">Peito</td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="90" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="94" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="98" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="102" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="106" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="110" /></td>
                                            </tr>
                                            <tr className="border-t border-gray-200">
                                                <td className="px-4 py-2 text-sm font-medium text-gray-700">Comprimento</td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="65" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="67" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="69" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="71" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="73" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="75" /></td>
                                            </tr>
                                            <tr className="border-t border-gray-200">
                                                <td className="px-4 py-2 text-sm font-medium text-gray-700">Manga</td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="18" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="19" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="20" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="21" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="22" /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm" placeholder="23" /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Especificações de Costura */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Especificações de Costura</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Margem de Costura Padrão</label>
                                        <input
                                            type="text"
                                            placeholder="1,0 cm (corpo), 1,5 cm (bainha)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ponto</label>
                                        <input
                                            type="text"
                                            placeholder="Ponto reto 2.5-3 st/cm"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Instruções Especiais</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Reforço em ombro, como montar gola, etc."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Controle de Qualidade */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Controle de Qualidade</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Checklist QC</label>
                                    <textarea
                                        rows={2}
                                        placeholder="Medidas principais ± 1 cm; costura uniforme; botões alinhados; ausência de defeitos visíveis"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lavagem Recomendada</label>
                                    <input
                                        type="text"
                                        placeholder="Lavagem à mão ou ciclo suave, secar à sombra"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    {editingFicha ? 'Salvar Alterações' : 'Salvar Ficha Técnica'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
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
        <Layout pageTitle="Fichas Técnicas">
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

            {/* Modal de Confirmação de Exclusão */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-black mb-2">Confirmar Exclusão</h3>
                        <p className="text-gray-600 mb-6">
                            Tem certeza que deseja excluir a ficha {fichas.find(f => f.id === deleteConfirm)?.codigo}?
                            Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default FichasTecnicas;
