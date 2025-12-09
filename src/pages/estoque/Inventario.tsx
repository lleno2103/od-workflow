import React, { useEffect, useState } from 'react';
import { Layout } from '../../components';
import { useInventario, type InventarioInput, type ItemInventario } from '../../hooks/useInventario';
import { useMateriais } from '../../hooks/useMateriais';
import { toast } from 'sonner';

type TabType = 'lista' | 'novo';

const Inventario: React.FC = () => {
  const { inventarios, loading, createInventarioComItens, finalizarInventario, deleteInventario, fetchInventarios } = useInventario();
  const { materiais, fetchMateriais } = useMateriais();
  const [activeTab, setActiveTab] = useState<TabType>('lista');

  const [formData, setFormData] = useState<InventarioInput>({ numero: `INV-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`, data: new Date().toISOString().split('T')[0], observacoes: '' });
  const [itens, setItens] = useState<ItemInventario[]>([]);

  useEffect(() => {
    fetchInventarios();
    fetchMateriais();
  }, []);

  const addItem = () => setItens(prev => [...prev, { material_id: '', material_nome: '', unidade: 'un', quantidade_sistema: 0, quantidade_contada: 0 }]);
  const removeItem = (idx: number) => setItens(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof ItemInventario, value: any) => setItens(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it));

  const handleMaterialChange = (idx: number, id: string) => {
    const mat = materiais.find(m => m.id === id);
    updateItem(idx, 'material_id', id);
    updateItem(idx, 'material_nome', mat ? mat.nome : '');
    updateItem(idx, 'unidade', mat ? mat.unidade_medida : 'un');
    updateItem(idx, 'quantidade_sistema', mat ? Number(mat.estoque_atual || 0) : 0);
  };

  const resetForm = () => {
    setFormData({ numero: `INV-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`, data: new Date().toISOString().split('T')[0], observacoes: '' });
    setItens([]);
    setActiveTab('lista');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itens.length === 0) {
      toast.error('Adicione pelo menos um item');
      return;
    }
    const payload = itens.map(i => ({
      ...i,
      quantidade_sistema: Number(i.quantidade_sistema),
      quantidade_contada: Number(i.quantidade_contada),
    }));
    const created = await createInventarioComItens(formData, payload);
    if (created) resetForm();
  };

  const tabs = [
    { id: 'lista' as TabType, label: 'Inventários' },
    { id: 'novo' as TabType, label: 'Novo Inventário' },
  ];

  return (
    <Layout pageTitle="Estoque - Inventário">
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
                  <h2 className="text-xl font-bold text-gray-900">Inventários</h2>
                  <p className="text-sm text-gray-500">Contagens e ajustes de estoque</p>
                </div>
                <button onClick={() => setActiveTab('novo')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">+ Novo Inventário</button>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-500">Carregando...</div>
              ) : inventarios.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Nenhum inventário encontrado</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Número</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Itens</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventarios.map(inv => (
                        <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{inv.numero}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{new Date(inv.data).toLocaleDateString('pt-BR')}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{inv.status === 'finalizado' ? 'Finalizado' : 'Rascunho'}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{(inv.itens || []).length}</td>
                          <td className="py-3 px-4 text-right">
                            {inv.status !== 'finalizado' && (
                              <button onClick={() => finalizarInventario(inv.id)} className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs mr-2">Finalizar</button>
                            )}
                            <button onClick={() => deleteInventario(inv.id)} className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs">Excluir</button>
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
                <h3 className="text-sm font-semibold text-gray-900 uppercase">Dados do Inventário</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                    <input type="text" value={formData.numero} onChange={e => setFormData({ ...formData, numero: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input type="date" value={formData.data} onChange={e => setFormData({ ...formData, data: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <input type="text" value={formData.observacoes} onChange={e => setFormData({ ...formData, observacoes: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  </div>
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
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Unidade</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Sistema</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Contado</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Diferença</th>
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
                            <input type="text" value={item.unidade} onChange={e => updateItem(idx, 'unidade', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                          </td>
                          <td className="py-2 px-3">
                            <input type="number" value={item.quantidade_sistema} onChange={e => updateItem(idx, 'quantidade_sistema', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                          </td>
                          <td className="py-2 px-3">
                            <input type="number" value={item.quantidade_contada} onChange={e => updateItem(idx, 'quantidade_contada', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                          </td>
                          <td className="py-2 px-3 text-sm text-gray-900">
                            {(Number(item.quantidade_contada) - Number(item.quantidade_sistema)).toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button type="button" onClick={() => removeItem(idx)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
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
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium">Salvar Inventário</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Inventario;

