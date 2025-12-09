import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';

// Produção
import OrdensProducao from './pages/producao/OrdensProducao';
import FichasTecnicas from './pages/producao/FichasTecnicas';
import BOM from './pages/producao/BOM';
import Cronograma from './pages/producao/Cronograma';

// Compras
import PedidosCompra from './pages/compras/PedidosCompra';
import Recebimento from './pages/compras/Recebimento';
import Requisicoes from './pages/compras/Requisicoes';

// Produtos
import Produtos from './pages/cadastros/Produtos';
import VariantesSKUs from './pages/cadastros/VariantesSKUs';

// Placeholder
import PlaceholderPage from './pages/PlaceholderPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Produção */}
      <Route path="/producao/ordens" element={<ProtectedRoute><OrdensProducao /></ProtectedRoute>} />
      <Route path="/producao/fichas-tecnicas" element={<ProtectedRoute><FichasTecnicas /></ProtectedRoute>} />
      <Route path="/producao/bom" element={<ProtectedRoute><BOM /></ProtectedRoute>} />
      <Route path="/producao/cronograma" element={<ProtectedRoute><Cronograma /></ProtectedRoute>} />

      {/* Produtos */}
      <Route path="/produtos/lista" element={<ProtectedRoute><Produtos /></ProtectedRoute>} />
      <Route path="/produtos/variantes" element={<ProtectedRoute><VariantesSKUs /></ProtectedRoute>} />
      <Route path="/produtos/categorias" element={<ProtectedRoute><Produtos /></ProtectedRoute>} />

      {/* Compras */}
      <Route path="/compras/pedidos" element={<ProtectedRoute><PedidosCompra /></ProtectedRoute>} />
      <Route path="/compras/recebimento" element={<ProtectedRoute><Recebimento /></ProtectedRoute>} />
      <Route path="/compras/requisicoes" element={<ProtectedRoute><Requisicoes /></ProtectedRoute>} />

      {/* Estoque */}
      <Route path="/estoque/materiais" element={<ProtectedRoute><PlaceholderPage title="Materiais" description="Tecidos, aviamentos e embalagens" icon="🧵" /></ProtectedRoute>} />
      <Route path="/estoque/movimentacoes" element={<ProtectedRoute><PlaceholderPage title="Movimentações" description="Entradas e saídas de estoque" icon="📊" /></ProtectedRoute>} />
      <Route path="/estoque/inventario" element={<ProtectedRoute><PlaceholderPage title="Inventário" description="Contagem e ajustes" icon="📋" /></ProtectedRoute>} />
      <Route path="/estoque/localizacoes" element={<ProtectedRoute><PlaceholderPage title="Localizações" description="Organize seu estoque" icon="📍" /></ProtectedRoute>} />

      {/* Vendas */}
      <Route path="/vendas/pedidos" element={<ProtectedRoute><PlaceholderPage title="Pedidos" description="Gerencie vendas por canal" icon="🛍️" /></ProtectedRoute>} />
      <Route path="/vendas/canais" element={<ProtectedRoute><PlaceholderPage title="Canais de Venda" description="Instagram, Feira, Atacado" icon="📱" /></ProtectedRoute>} />
      <Route path="/vendas/entregas" element={<ProtectedRoute><PlaceholderPage title="Entregas" description="Rastreie suas entregas" icon="🚚" /></ProtectedRoute>} />

      {/* Financeiro */}
      <Route path="/financeiro/contas-pagar" element={<ProtectedRoute><PlaceholderPage title="Contas a Pagar" description="Gerencie suas despesas" icon="💸" /></ProtectedRoute>} />
      <Route path="/financeiro/contas-receber" element={<ProtectedRoute><PlaceholderPage title="Contas a Receber" description="Gerencie seus recebimentos" icon="💰" /></ProtectedRoute>} />
      <Route path="/financeiro/fluxo-caixa" element={<ProtectedRoute><PlaceholderPage title="Fluxo de Caixa" description="Controle financeiro" icon="📈" /></ProtectedRoute>} />
      <Route path="/financeiro/precificacao" element={<ProtectedRoute><PlaceholderPage title="Precificação" description="Calcule preços de venda" icon="🏷️" /></ProtectedRoute>} />

      {/* Cadastros */}
      <Route path="/cadastros/fornecedores" element={<ProtectedRoute><PlaceholderPage title="Fornecedores" description="Cadastro de fornecedores" icon="🏭" /></ProtectedRoute>} />
      <Route path="/cadastros/clientes" element={<ProtectedRoute><PlaceholderPage title="Clientes" description="Cadastro de clientes" icon="👥" /></ProtectedRoute>} />

      {/* Relatórios */}
      <Route path="/relatorios" element={<ProtectedRoute><PlaceholderPage title="Relatórios" description="Análises e relatórios" icon="📊" /></ProtectedRoute>} />

      {/* Configurações */}
      <Route path="/configuracoes/usuarios" element={<ProtectedRoute><PlaceholderPage title="Usuários" description="Gerencie usuários do sistema" icon="👤" /></ProtectedRoute>} />
      <Route path="/configuracoes/empresa" element={<ProtectedRoute><PlaceholderPage title="Empresa" description="Dados da empresa" icon="🏢" /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
