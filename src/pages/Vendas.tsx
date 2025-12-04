import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, TrendingUp, Package } from "lucide-react";

interface Venda {
  id: string;
  pedido: string;
  data: string;
  cliente: string;
  canal: string;
  itens: string;
  quantidade: number;
  total: number;
  status: "pendente" | "andamento" | "concluido" | "cancelado";
}

const initialData: Venda[] = [
  { id: "1", pedido: "V-001", data: "2024-12-05", cliente: "João Silva", canal: "Instagram", itens: "Bata Odò M Verde", quantidade: 1, total: 263, status: "concluido" },
  { id: "2", pedido: "V-002", data: "2024-12-04", cliente: "Maria Santos", canal: "WhatsApp", itens: "Bermuda Linho G", quantidade: 2, total: 416, status: "andamento" },
  { id: "3", pedido: "V-003", data: "2024-12-03", cliente: "Loja Centro", canal: "Atacado", itens: "Camisa Cambraia P", quantidade: 10, total: 1200, status: "pendente" },
  { id: "4", pedido: "V-004", data: "2024-12-02", cliente: "Ana Costa", canal: "Feira", itens: "Bata Odò GG Azul", quantidade: 1, total: 248, status: "concluido" },
];

export default function Vendas() {
  const [data, setData] = useState<Venda[]>(initialData);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newVenda, setNewVenda] = useState({
    cliente: "",
    canal: "",
    itens: "",
    quantidade: "",
    precoUnitario: "",
    frete: "",
  });

  const filteredData = data.filter(
    (item) =>
      item.cliente.toLowerCase().includes(search.toLowerCase()) ||
      item.pedido.toLowerCase().includes(search.toLowerCase())
  );

  const totalVendas = data.reduce((sum, v) => sum + v.total, 0);
  const vendasConcluidas = data.filter((v) => v.status === "concluido").length;
  const pecasVendidas = data.reduce((sum, v) => sum + v.quantidade, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preco = parseFloat(newVenda.precoUnitario);
    const qtd = parseInt(newVenda.quantidade);
    const frete = parseFloat(newVenda.frete) || 0;
    const total = preco * qtd + frete;

    const newEntry: Venda = {
      id: String(data.length + 1),
      pedido: `V-${String(data.length + 1).padStart(3, "0")}`,
      data: new Date().toISOString().split("T")[0],
      cliente: newVenda.cliente,
      canal: newVenda.canal,
      itens: newVenda.itens,
      quantidade: qtd,
      total: total,
      status: "pendente",
    };
    setData([newEntry, ...data]);
    setNewVenda({ cliente: "", canal: "", itens: "", quantidade: "", precoUnitario: "", frete: "" });
    setDialogOpen(false);
    toast({ title: "Venda registrada", description: `${newEntry.pedido} - R$ ${total.toFixed(2)}` });
  };

  const columns = [
    { key: "pedido", label: "Pedido" },
    { key: "data", label: "Data" },
    { key: "cliente", label: "Cliente" },
    { key: "canal", label: "Canal" },
    { key: "itens", label: "Itens" },
    { key: "quantidade", label: "Qtd", render: (item: Venda) => `${item.quantidade} un` },
    { key: "total", label: "Total", render: (item: Venda) => `R$ ${item.total.toFixed(2)}` },
    { key: "status", label: "Status", render: (item: Venda) => <StatusBadge status={item.status} /> },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Controle de Vendas"
        subtitle="Registre e acompanhe suas vendas"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                Nova Venda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Registrar Venda</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cliente">Cliente</Label>
                    <Input
                      id="cliente"
                      value={newVenda.cliente}
                      onChange={(e) => setNewVenda({ ...newVenda, cliente: e.target.value })}
                      placeholder="Nome do cliente"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="canal">Canal</Label>
                    <Select value={newVenda.canal} onValueChange={(v) => setNewVenda({ ...newVenda, canal: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        <SelectItem value="Feira">Feira</SelectItem>
                        <SelectItem value="Atacado">Atacado</SelectItem>
                        <SelectItem value="Loja">Loja Física</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="itens">Item / SKU</Label>
                  <Input
                    id="itens"
                    value={newVenda.itens}
                    onChange={(e) => setNewVenda({ ...newVenda, itens: e.target.value })}
                    placeholder="Ex: Bata Odò M Verde"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      value={newVenda.quantidade}
                      onChange={(e) => setNewVenda({ ...newVenda, quantidade: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="precoUnitario">Preço Unit. (R$)</Label>
                    <Input
                      id="precoUnitario"
                      type="number"
                      step="0.01"
                      value={newVenda.precoUnitario}
                      onChange={(e) => setNewVenda({ ...newVenda, precoUnitario: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="frete">Frete (R$)</Label>
                    <Input
                      id="frete"
                      type="number"
                      step="0.01"
                      value={newVenda.frete}
                      onChange={(e) => setNewVenda({ ...newVenda, frete: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Registrar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Vendas" value={`R$ ${totalVendas.toFixed(2)}`} icon={TrendingUp} />
        <StatCard label="Vendas Concluídas" value={vendasConcluidas} icon={ShoppingCart} />
        <StatCard label="Peças Vendidas" value={pecasVendidas} icon={Package} />
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente ou pedido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="doc-card">
        <DataTable columns={columns} data={filteredData} emptyMessage="Nenhuma venda encontrada." />
      </div>
    </AppLayout>
  );
}
