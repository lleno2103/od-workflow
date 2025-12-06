import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";

function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao Odò - Sistema de Gestão de Produção</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Ordens em Produção</p>
            <p className="text-2xl font-bold mt-1">12</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Fichas Técnicas</p>
            <p className="text-2xl font-bold mt-1">45</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Itens em Estoque</p>
            <p className="text-2xl font-bold mt-1">234</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Vendas do Mês</p>
            <p className="text-2xl font-bold mt-1">R$ 45.000</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SimplePage({ title }: { title: string }) {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">Módulo em desenvolvimento</p>
      </div>
    </AppLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/producao/*" element={<SimplePage title="Produção" />} />
        <Route path="/fichas/*" element={<SimplePage title="Fichas Técnicas" />} />
        <Route path="/estoque/*" element={<SimplePage title="Estoque" />} />
        <Route path="/vendas/*" element={<SimplePage title="Vendas" />} />
        <Route path="/financeiro/*" element={<SimplePage title="Financeiro" />} />
        <Route path="/cronograma/*" element={<SimplePage title="Cronograma" />} />
        <Route path="/cadastros/*" element={<SimplePage title="Cadastros" />} />
        <Route path="/compras/*" element={<SimplePage title="Compras" />} />
        <Route path="/produtos/*" element={<SimplePage title="Produtos" />} />
        <Route path="*" element={<SimplePage title="Página não encontrada" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
