import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '../../components';
import { useLocalizacoes } from '../../hooks/useLocalizacoes';
import { useMateriais } from '../../hooks/useMateriais';
import { toast } from 'sonner';

type TabType = 'lista' | 'nova';

const Localizacoes: React.FC = () => {
  const { localizacoes, loading, usaTabela, createLocalizacao, renameLocalizacaoTexto, assignMaterial, fetchLocalizacoes } = useLocalizacoes();
  const { materiais, fetchMateriais } = useMateriais();
  const [activeTab, setActiveTab] = useState<TabType>('lista');

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [selectedLoc, setSelectedLoc] = useState('');
  const [novoNome, setNovoNome] = useState('');

  useEffect(() => {
    fetchLocalizacoes();
    fetchMateriais();
  }, []);

  const locaisOrdenados = useMemo(() => localizacoes.slice().sort((a, b) => a.nome.localeCompare(b.nome)), [localizacoes]);

  const handleCriar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error('Informe um nome');
      return;
    }
    if (usaTabela) {
      const created = await createLocalizacao(nome.trim(), descricao.trim() || undefined);
      if (created) {
        setNome('');
        setDescricao('');
        setActiveTab('lista');
      }
    } else {
      toast.info('Localização criada como rótulo. Atribua materiais abaixo.');
      setActiveTab('lista');
    }
  };

  const handleAtribuir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialId || !selectedLoc) return;
    const ok = await assignMaterial(materialId, selectedLoc);
    if (ok) {
      setMaterialId('');
      setSelectedLoc('');
    }
  };

  const handleRenomear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoc || !novoNome.trim()) return;
    const ok = await renameLocalizacaoTexto(selectedLoc, novoNome.trim());
    if (ok) {
      setSelectedLoc('');
      setNovoNome('');
    }
  };

  const tabs = [
    { id: 'lista' as TabType, label: 'Localizações' },
    { id: 'nova' as TabType, label: 'Nova Localização' },
  ];

  return (
    <Layout pageTitle="Estoque - Localizações">
      <div className="space-y-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === t.id ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{t.label}</button>
            ))}
          </nav>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          {activeTab === 'lista' ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Localizações de Estoque</h2>
                  <p className="text-sm text-gray-500">Organize seu estoque por prateleira, caixa, setor</p>
                </div>
                <button onClick={() => setActiveTab('nova')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">+ Nova Localização</button>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-500">Carregando...</div>
              ) : locaisOrdenados.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Nenhuma localização encontrada</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Materiais</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locaisOrdenados.map(l => (
                        <tr key={l.id || l.nome} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{l.nome}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{l.contagem ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase">Atribuir Material</h3>
                  <form onSubmit={handleAtribuir} className="space-y-3">
                    <select value={materialId} onChange={e => setMaterialId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Selecione um material</option>
                      {materiais.map(m => (
                        <option key={m.id} value={m.id}>{m.nome}</option>
                      ))}
                    </select>
                    <select value={selectedLoc} onChange={e => setSelectedLoc(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Selecione a localização</option>
                      {locaisOrdenados.map(l => (
                        <option key={l.nome} value={l.nome}>{l.nome}</option>
                      ))}
                    </select>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium">Atribuir</button>
                  </form>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase">Renomear Localização</h3>
                  <form onSubmit={handleRenomear} className="space-y-3">
                    <select value={selectedLoc} onChange={e => setSelectedLoc(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Selecione a localização</option>
                      {locaisOrdenados.map(l => (
                        <option key={l.nome} value={l.nome}>{l.nome}</option>
                      ))}
                    </select>
                    <input type="text" value={novoNome} onChange={e => setNovoNome(e.target.value)} placeholder="Novo nome" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">Renomear</button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCriar} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase">Nova Localização</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium">Salvar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Localizacoes;

