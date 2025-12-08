import React from 'react';
import { Layout } from '../components';

const Dashboard: React.FC = () => {
    const stats = [
        { label: 'OPs em Andamento', value: '12', color: 'blue', icon: '🏭' },
        { label: 'Pedidos Pendentes', value: '8', color: 'yellow', icon: '📦' },
        { label: 'Estoque Crítico', value: '3', color: 'red', icon: '⚠️' },
        { label: 'Faturamento (Mês)', value: 'R$ 24.500', color: 'green', icon: '💰' },
    ];

    const opsRecentes = [
        { numero: 'OP-001', produto: 'Bata Odò - Henley M', status: 'Em Costura', prazo: '2025-12-10' },
        { numero: 'OP-002', produto: 'Bermuda Odò G', status: 'Em Corte', prazo: '2025-12-12' },
        { numero: 'OP-003', produto: 'Bata Odò - Henley P', status: 'Concluída', prazo: '2025-12-05' },
    ];

    return (
        <Layout pageTitle="Dashboard">
            <div className="space-y-6">
                {/* Welcome */}
                <div>
                    <h1 className="text-2xl font-semibold text-black mb-1">Bem-vindo!</h1>
                    <p className="text-sm text-gray-500">Sistema de Gestão de Produção de Moda</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-2xl">{stat.icon}</span>
                                <span className={`text-2xl font-bold ${stat.color === 'blue' ? 'text-blue-600' :
                                    stat.color === 'yellow' ? 'text-yellow-600' :
                                        stat.color === 'red' ? 'text-red-600' :
                                            'text-green-600'
                                    }`}>
                                    {stat.value}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Recent OPs */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-black mb-4">Ordens de Produção Recentes</h2>
                    <div className="space-y-3">
                        {opsRecentes.map((op, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-black">{op.numero}</p>
                                    <p className="text-sm text-gray-600">{op.produto}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${op.status === 'Concluída' ? 'bg-green-100 text-green-700' :
                                        op.status === 'Em Costura' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {op.status}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">Prazo: {new Date(op.prazo).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg p-6 hover:shadow-lg transition-all text-left">
                        <div className="text-2xl mb-2">➕</div>
                        <h3 className="font-semibold mb-1">Nova OP</h3>
                        <p className="text-sm text-green-100">Criar ordem de produção</p>
                    </button>
                    <button className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-6 hover:shadow-lg transition-all text-left">
                        <div className="text-2xl mb-2">📋</div>
                        <h3 className="font-semibold mb-1">Nova Ficha Técnica</h3>
                        <p className="text-sm text-blue-100">Criar especificação</p>
                    </button>
                    <button className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg p-6 hover:shadow-lg transition-all text-left">
                        <div className="text-2xl mb-2">🛒</div>
                        <h3 className="font-semibold mb-1">Novo Pedido</h3>
                        <p className="text-sm text-purple-100">Registrar venda</p>
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
