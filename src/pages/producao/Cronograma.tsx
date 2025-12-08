import React, { useState } from 'react';
import { Layout } from '../../components';

type TabType = 'lista' | 'nova';

interface Semana {
    numero: number;
    titulo: string;
    tarefas: string[];
    status: 'concluida' | 'em-andamento' | 'aguardando';
    responsavel: string;
}

interface Colecao {
    id: string;
    nome: string;
    inicio: string;
    fim: string;
    semanas: Semana[];
}

const Cronograma: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('lista');
    const [semanas, setSemanas] = useState<Semana[]>([
        { numero: 1, titulo: '', tarefas: [''], status: 'aguardando', responsavel: '' }
    ]);

    const [colecoes] = useState<Colecao[]>([
        {
            id: '1',
            nome: 'Coleção Verão Odò 2026',
            inicio: '2025-12-01',
            fim: '2026-01-12',
            semanas: [
                { numero: 1, titulo: 'Desenvolvimento', tarefas: ['Moldes', 'Ficha técnica', 'Sampling 1'], status: 'concluida', responsavel: 'Design' },
                { numero: 2, titulo: 'Ajustes', tarefas: ['Provas de fit', 'Sampling 2'], status: 'concluida', responsavel: 'Design' },
                { numero: 3, titulo: 'Produção Piloto', tarefas: ['10 peças', 'Controle de qualidade'], status: 'em-andamento', responsavel: 'Produção' },
                { numero: 4, titulo: 'Produção Principal', tarefas: ['Lote inicial', 'Corte e costura'], status: 'aguardando', responsavel: 'Produção' },
                { numero: 5, titulo: 'Acabamento', tarefas: ['Acabamento', 'Embalagem', 'Fotos', 'Catálogo'], status: 'aguardando', responsavel: 'Produção/Marketing' },
                { numero: 6, titulo: 'Lançamento', tarefas: ['Instagram', 'TikTok', 'Distribuição'], status: 'aguardando', responsavel: 'Marketing' },
            ]
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'concluida': return 'bg-green-500';
            case 'em-andamento': return 'bg-blue-500';
            case 'aguardando': return 'bg-gray-300';
            default: return 'bg-gray-300';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'concluida': return 'Concluída';
            case 'em-andamento': return 'Em Andamento';
            case 'aguardando': return 'Aguardando';
            default: return 'Aguardando';
        }
    };

    const adicionarSemana = () => {
        setSemanas([...semanas, {
            numero: semanas.length + 1,
            titulo: '',
            tarefas: [''],
            status: 'aguardando',
            responsavel: ''
        }]);
    };

    const removerSemana = (index: number) => {
        if (semanas.length > 1) {
            setSemanas(semanas.filter((_, i) => i !== index));
        }
    };

    const atualizarSemana = (index: number, campo: keyof Semana, valor: any) => {
        const novasSemanas = [...semanas];
        novasSemanas[index] = { ...novasSemanas[index], [campo]: valor };
        setSemanas(novasSemanas);
    };

    const adicionarTarefa = (semanaIndex: number) => {
        const novasSemanas = [...semanas];
        novasSemanas[semanaIndex].tarefas.push('');
        setSemanas(novasSemanas);
    };

    const removerTarefa = (semanaIndex: number, tarefaIndex: number) => {
        const novasSemanas = [...semanas];
        if (novasSemanas[semanaIndex].tarefas.length > 1) {
            novasSemanas[semanaIndex].tarefas = novasSemanas[semanaIndex].tarefas.filter((_, i) => i !== tarefaIndex);
            setSemanas(novasSemanas);
        }
    };

    const atualizarTarefa = (semanaIndex: number, tarefaIndex: number, valor: string) => {
        const novasSemanas = [...semanas];
        novasSemanas[semanaIndex].tarefas[tarefaIndex] = valor;
        setSemanas(novasSemanas);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui você implementaria a lógica de salvar
        setActiveTab('lista');
        setSemanas([{ numero: 1, titulo: '', tarefas: [''], status: 'aguardando', responsavel: '' }]);
    };

    const tabs = [
        { id: 'lista' as TabType, label: 'Coleções' },
        { id: 'nova' as TabType, label: 'Nova Coleção' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'lista':
                return (
                    <div className="space-y-6">
                        {colecoes.map((colecao) => (
                            <div key={colecao.id}>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-black">{colecao.nome}</h2>
                                        <p className="text-sm text-gray-500">
                                            {new Date(colecao.inicio).toLocaleDateString('pt-BR')} - {new Date(colecao.fim).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('nova')}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                    >
                                        + Nova Coleção
                                    </button>
                                </div>

                                {/* Timeline */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <div className="space-y-6">
                                        {colecao.semanas.map((semana, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                {/* Timeline indicator */}
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-10 h-10 rounded-full ${getStatusColor(semana.status)} flex items-center justify-center text-white font-semibold text-sm`}>
                                                        {semana.numero}
                                                    </div>
                                                    {idx < colecao.semanas.length - 1 && (
                                                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 pb-8">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="font-semibold text-black">Semana {semana.numero}: {semana.titulo}</h3>
                                                            <p className="text-sm text-gray-500">Responsável: {semana.responsavel}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${semana.status === 'concluida' ? 'bg-green-100 text-green-700' :
                                                            semana.status === 'em-andamento' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {getStatusLabel(semana.status)}
                                                        </span>
                                                    </div>
                                                    <ul className="space-y-1 mt-2">
                                                        {semana.tarefas.map((tarefa, tidx) => (
                                                            <li key={tidx} className="text-sm text-gray-600 flex items-center gap-2">
                                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                                {tarefa}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'nova':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-black">Nova Coleção</h2>
                            <p className="text-sm text-gray-500">Planeje o cronograma de desenvolvimento da coleção</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Informações Básicas */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase">Informações da Coleção</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Coleção</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Coleção Inverno 2026"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Semanas */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase">Cronograma Semanal</h3>
                                    <button
                                        type="button"
                                        onClick={adicionarSemana}
                                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        + Adicionar Semana
                                    </button>
                                </div>

                                {semanas.map((semana, semanaIndex) => (
                                    <div key={semanaIndex} className="bg-white border border-gray-200 rounded-lg p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-semibold text-black">Semana {semana.numero}</h4>
                                            {semanas.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removerSemana(semanaIndex)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Título da Etapa</label>
                                                <input
                                                    type="text"
                                                    value={semana.titulo}
                                                    onChange={(e) => atualizarSemana(semanaIndex, 'titulo', e.target.value)}
                                                    placeholder="Ex: Desenvolvimento"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                                                <input
                                                    type="text"
                                                    value={semana.responsavel}
                                                    onChange={(e) => atualizarSemana(semanaIndex, 'responsavel', e.target.value)}
                                                    placeholder="Ex: Design"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-sm font-medium text-gray-700">Tarefas</label>
                                                <button
                                                    type="button"
                                                    onClick={() => adicionarTarefa(semanaIndex)}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    + Adicionar Tarefa
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {semana.tarefas.map((tarefa, tarefaIndex) => (
                                                    <div key={tarefaIndex} className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={tarefa}
                                                            onChange={(e) => atualizarTarefa(semanaIndex, tarefaIndex, e.target.value)}
                                                            placeholder="Descrição da tarefa"
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        />
                                                        {semana.tarefas.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removerTarefa(semanaIndex, tarefaIndex)}
                                                                className="px-2 text-red-600 hover:text-red-800"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    Criar Cronograma
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('lista')}
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
        <Layout pageTitle="Cronograma de Coleções">
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

export default Cronograma;
