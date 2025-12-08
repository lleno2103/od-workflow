import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavItem {
    id: string;
    label: string;
    path?: string;
    icon?: React.ReactNode;
    children?: NavItem[];
}

const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [activeId, setActiveId] = useState('dashboard');
    const location = useLocation();

    const { logout } = useAuth();

    // Find which parent should be expanded based on current path
    useEffect(() => {
        const path = location.pathname;
        const newExpandedItems: string[] = [];

        navItems.forEach(item => {
            if (item.children) {
                const hasActiveChild = item.children.some(child => child.path === path);
                if (hasActiveChild) {
                    newExpandedItems.push(item.id);
                    const activeChild = item.children.find(child => child.path === path);
                    if (activeChild) {
                        setActiveId(activeChild.id);
                    }
                }
            } else if (item.path === path) {
                setActiveId(item.id);
            }
        });

        if (newExpandedItems.length > 0) {
            setExpandedItems(newExpandedItems);
        }
    }, [location.pathname]);

    useEffect(() => {
        const collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        setIsCollapsed(collapsed);
    }, []);


    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', String(newState));
        if (newState) {
            setExpandedItems([]);
        }
    };

    const handleItemClick = (id: string, hasChildren: boolean = false, parentId?: string) => {
        // If it's a leaf node (no children), set it as active
        if (!hasChildren) {
            setActiveId(id);
            // Keep parent expanded when clicking child
            if (parentId && !expandedItems.includes(parentId)) {
                setExpandedItems(prev => [...prev, parentId]);
            }
        }

        // Toggle expansion for items with children
        if (hasChildren) {
            if (isCollapsed) {
                setIsCollapsed(false);
                localStorage.setItem('sidebarCollapsed', 'false');
                setExpandedItems([id]);
            } else {
                setExpandedItems(prev =>
                    prev.includes(id)
                        ? prev.filter(item => item !== id)
                        : [...prev, id]
                );
            }
        }
    };

    const navItems: NavItem[] = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            path: '/home',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            id: 'producao',
            label: 'Produção',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            children: [
                { id: 'ordens-producao', label: 'Ordens de Produção', path: '/producao/ordens' },
                { id: 'fichas-tecnicas', label: 'Fichas Técnicas', path: '/producao/fichas-tecnicas' },
                { id: 'bom', label: 'Lista de Materiais', path: '/producao/bom' },
                { id: 'cronograma', label: 'Cronograma', path: '/producao/cronograma' },
            ]
        },
        {
            id: 'produtos',
            label: 'Produtos',
            path: '/produtos/lista',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
        },
        {
            id: 'compras',
            label: 'Compras',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            children: [
                { id: 'pedidos-compra', label: 'Pedidos de Compra', path: '/compras/pedidos' },
                { id: 'recebimento', label: 'Recebimento', path: '/compras/recebimento' },
                { id: 'requisicoes', label: 'Requisições', path: '/compras/requisicoes' },
            ]
        },
        {
            id: 'estoque',
            label: 'Estoque',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            children: [
                { id: 'materiais', label: 'Materiais', path: '/estoque/materiais' },
                { id: 'movimentacoes', label: 'Movimentações', path: '/estoque/movimentacoes' },
                { id: 'inventario', label: 'Inventário', path: '/estoque/inventario' },
                { id: 'localizacoes', label: 'Localizações', path: '/estoque/localizacoes' },
            ]
        },
        {
            id: 'vendas',
            label: 'Vendas',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            children: [
                { id: 'pedidos-venda', label: 'Pedidos', path: '/vendas/pedidos' },
                { id: 'canais', label: 'Canais de Venda', path: '/vendas/canais' },
                { id: 'entregas', label: 'Entregas', path: '/vendas/entregas' },
            ]
        },
        {
            id: 'financeiro',
            label: 'Financeiro',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            children: [
                { id: 'contas-pagar', label: 'Contas a Pagar', path: '/financeiro/contas-pagar' },
                { id: 'contas-receber', label: 'Contas a Receber', path: '/financeiro/contas-receber' },
                { id: 'fluxo-caixa', label: 'Fluxo de Caixa', path: '/financeiro/fluxo-caixa' },
                { id: 'precificacao', label: 'Precificação', path: '/financeiro/precificacao' },
            ]
        },
        {
            id: 'cadastros',
            label: 'Cadastros',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            children: [
                { id: 'fornecedores', label: 'Fornecedores', path: '/cadastros/fornecedores' },
                { id: 'clientes', label: 'Clientes', path: '/cadastros/clientes' },
            ]
        },
        {
            id: 'relatorios',
            label: 'Relatórios',
            path: '/relatorios',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            id: 'settings',
            label: 'Configurações',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            children: [
                { id: 'usuarios', label: 'Usuários', path: '/configuracoes/usuarios' },
                { id: 'empresa', label: 'Empresa', path: '/configuracoes/empresa' },
            ]
        },
    ];

    const renderNavItem = (item: NavItem, level: number = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.includes(item.id);
        const isActive = activeId === item.id;

        // Indentation based on level
        const paddingLeft = level === 0 ? '0.75rem' : level === 1 ? '1.75rem' : '2.5rem';

        return (
            <div key={item.id} className="mb-0.5">
                {hasChildren ? (
                    // Parent Item
                    <button
                        onClick={() => handleItemClick(item.id, true)}
                        style={{ paddingLeft: isCollapsed ? '0.75rem' : paddingLeft }}
                        className={`w-full flex items-center gap-3 pr-3 py-2.5 rounded text-sm font-normal transition-all ${isActive
                            ? 'bg-black text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100'
                            } ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                        {!isCollapsed && (
                            <>
                                <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                                <svg
                                    className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </>
                        )}
                    </button>
                ) : (
                    // Leaf Item
                    <Link
                        to={item.path || '#'}
                        onClick={() => handleItemClick(item.id, false)}
                        style={{ paddingLeft: isCollapsed ? '0.75rem' : paddingLeft }}
                        className={`flex items-center gap-3 pr-3 py-2.5 rounded text-sm font-normal transition-all ${isActive
                            ? 'bg-black text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100'
                            } ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                        {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                    </Link>
                )}

                {/* Recursive Children Rendering */}
                {!isCollapsed && hasChildren && isExpanded && (
                    <div className="mt-0.5">
                        {item.children!.map(child => renderNavItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-200 z-50 ${isCollapsed ? 'w-14' : 'w-64'
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 h-14">
                <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-lg font-semibold whitespace-nowrap tracking-wide">Odò</span>
                </div>
                <button
                    onClick={toggleCollapse}
                    className="hidden md:flex items-center justify-center w-6 h-6 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                >
                    <svg className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                {navItems.map(item => renderNavItem(item))}
            </nav>

            {/* Footer */}
            <div className="p-2 border-t border-gray-200">
                <button
                    onClick={logout}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-normal text-gray-700 hover:bg-gray-100 transition-all w-full ${isCollapsed ? 'justify-center' : ''
                        }`}
                >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {!isCollapsed && <span className="whitespace-nowrap">Sair</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
