import React, { useEffect, useState } from 'react';
import { Layout } from '../../components';
import { useMovimentacoes, type MovimentacaoInput, type ItemMovimentacao } from '../../hooks/useMovimentacoes';
import { useMateriais } from '../../hooks/useMateriais';

type TabType = 'lista' | 'nova';

const Movimentacoes: React.FC = () => {
  const { movimentacoes, loading, createMovimentacaoComItens, deleteMovimentacao, fetchMovimentacoes } = useMovimentacoes();
  const { materiais, fetchMateriais } = useMateriais();
  const [activeTab, setActiveTab] = useState<TabType>('lista');

  const [formData, setFormData] = useState<MovimentacaoInput>({ tipo: 'entrada', origem: '', documento: '', data: new Date().toISOString().split('T')[0], observacoes: '' });
  const [itens, setItens] = useState<ItemMovimentacao[]>([{ material_id: '', material_nome: '', quantidade: 0, unidade: 'un', custo_unitario: 0 }]);

  useEffect(() => {
    fetchMovimentacoes();
    fetchMateriais();
  }, []);

  const addItem = () => setItens(prev => [...prev, { material_id: '', material_nome: '', quantidade: 0, unidade: 'un', custo_unitario: 0 }]);
  const removeItem = (idx: number) => setItens(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof ItemMovimentacao, value: any) => setItens(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it));

  const handleMaterialChange = (idx: number, id: string) => {
    const mat = materiais.find(m => m.id === id);
    updateItem(idx, 'material_id', id);
    updateItem(idx, 'material_nome', mat ? mat.nome : '');
    updateItem(idx, 'unidade', mat ? mat.unidade_medida : 'un');
    updateItem(idx, 'custo_unitario', mat ? mat.custo_unitario : 0);
  };

  const resetForm = () => {
    setFormData({ tipo: 'entrada', origem: '', documento: '', data: new Date().toISOString().split('T')[0], observacoes: '' });
    setItens([{ material_id: '', material_nome: '', quantidade: 0, unidade: 'un', custo_unitario: 0 }]);
    setActiveTab('lista');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanItens = itens.filter(i => (i.material_nome || '').trim() && i.quantidade > 0);
    const ok = await createMovimentacaoComItens(formData, cleanItens);
    if (ok) resetForm();
  };

  const tabs = [
    { id: 'lista' as TabType, label: 'Movimentações' },
    { id: 'nova' as TabType, label: 'Nova Movimentação' },
  ];

  return (
    <Layout pageTitle="Estoque - Movimentações">
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
                  <h2 className="text-xl font-bold text-gray-900">Movimentações de Estoque</h2>
                  <p className="text-sm text-gray-500">Entradas e saídas registradas</p>
                </div>
                <button onClick={() => setActiveTab('nova')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">+ Nova Movimentação</button>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-500">Carregando...</div>
              ) : movimentacoes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Nenhuma movimentação encontrada</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Origem</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documento</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Itens</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movimentacoes.map(m => (
                        <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-sm text-gray-700">{new Date(m.data).toLocaleDateString('pt-BR')}</td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{m.tipo === 'entrada' ? 'Entrada' : 'Saída'}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{m.origem || '-'}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{m.documento || '-'}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{(m.itens || []).map(i => `${i.material_nome} (${i.quantidade} ${i.unidade})`).join(', ')}</td>
                          <td className="py-3 px-4 text-right">
                            <button onClick={() => deleteMovimentacao(m.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Excluir">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase">Dados da Movimentação</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value as MovimentacaoInput['tipo'] })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="entrada">Entrada</option>
                      <option value="saida">Saída</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Origem</label>
                    <input type="text" value={formData.origem} onChange={e => setFormData({ ...formData, origem: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Ex.: Compra, Produção" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                    <input type="text" value={formData.documento} onChange={e => setFormData({ ...formData, documento: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Ex.: PC-0001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input type="date" value={formData.data} onChange={e => setFormData({ ...formData, data: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <input type="text" value={formData.observacoes} onChange={e => setFormData({ ...formData, observacoes: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase">Itens</h3>
                  <button type="button" onClick={addItem} className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">+ Adicionar Item</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Material</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Quantidade</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Unidade</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Custo (R$)</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {itens.map((item, idx) => (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="py-2 px-3">
                            <select value={item.material_id as string} onChange={e => handleMaterialChange(idx, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                              <option value="">Selecione um material</option>
                              {materiais.map(m => (
                                <option key={m.id} value={m.id}>{m.nome}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input type="number" min={0} value={item.quantidade} onChange={e => updateItem(idx, 'quantidade', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                          </td>
                          <td className="py-2 px-3">
                            <input type="text" value={item.unidade} onChange={e => updateItem(idx, 'unidade', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                          </td>
                          <td className="py-2 px-3">
                            <input type="number" min={0} value={item.custo_unitario || 0} onChange={e => updateItem(idx, 'custo_unitario', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button type="button" onClick={() => removeItem(idx)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Remover">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium">Registrar Movimentação</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Movimentacoes;

