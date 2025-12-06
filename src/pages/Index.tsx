import { Link } from "react-router-dom";
import { 
  FileText, 
  ClipboardList, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Calendar,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";

const recentOrders = [
  { id: "OP-001", produto: "Bata Odò Henley", quantidade: 50, status: "andamento" as const },
  { id: "OP-002", produto: "Bermuda Linho", quantidade: 30, status: "pendente" as const },
  { id: "OP-003", produto: "Camisa Cambraia", quantidade: 25, status: "concluido" as const },
];

const quickActions = [
  { label: "Nova OP", icon: FileText, path: "/producao" },
  { label: "Nova Ficha", icon: ClipboardList, path: "/fichas" },
  { label: "Registrar Venda", icon: ShoppingCart, path: "/vendas" },
  { label: "Novo Lançamento", icon: DollarSign, path: "/financeiro" },
];

const lowStockItems = [
  { nome: "Linho 100% cru", atual: 15, minimo: 20, unidade: "m" },
  { nome: "Botão madeira 12mm", atual: 80, minimo: 100, unidade: "un" },
];

export default function Index() {
  return (
    <AppLayout>
      <PageHeader title="Dashboard" subtitle="Visão geral das operações" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="OPs Ativas" value={12} icon={FileText} trend={{ value: 8, label: "vs. mês anterior" }} />
        <StatCard label="Vendas do Mês" value="R$ 15.420" icon={TrendingUp} trend={{ value: 12, label: "vs. mês anterior" }} />
        <StatCard label="Itens em Estoque" value={248} icon={Package} />
        <StatCard label="Peças Concluídas" value={156} icon={Calendar} trend={{ value: 5, label: "esta semana" }} />
      </div>

      <section className="mb-8">
        <h2 className="font-display text-lg font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.path} to={action.path}>
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-secondary">
                <action.icon size={24} className="text-primary" />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="doc-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Ordens Recentes</h2>
            <Link to="/producao"><Button variant="ghost" size="sm">Ver todas</Button></Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                <div>
                  <p className="font-medium text-sm">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.produto} • {order.quantidade} un</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="doc-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-warning" />
            <h2 className="font-display text-lg font-semibold">Estoque Baixo</h2>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-md">
                <div>
                  <p className="font-medium text-sm">{item.nome}</p>
                  <p className="text-xs text-muted-foreground">{item.atual} {item.unidade} (mín: {item.minimo})</p>
                </div>
                <Link to="/estoque"><Button variant="outline" size="sm">Repor</Button></Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
