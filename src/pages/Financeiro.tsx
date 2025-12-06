import { useState } from "react";
import { Plus, Search, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

interface Lancamento {
  id: string;
  data: string;
  tipo: "receita" | "despesa";
  descricao: string;
  categoria: string;
  valor: number;
  pago: boolean;
}

const initialData: Lancamento[] = [
  { id: "1", data: "2024-12-05", tipo: "receita", descricao: "Venda V-001", categoria: "Vendas", valor: 263, pago: true },
  { id: "2", data: "2024-12-04", tipo: "despesa", descricao: "Compra linho - Forn A", categoria: "Tecido", valor: 1200, pago: true },
  { id: "3", data: "2024-12-03", tipo: "despesa", descricao: "Costura - Maria", categoria: "Mão de obra", valor: 450, pago: false },
  { id: "4", data: "2024-12-02", tipo: "receita", descricao: "Venda V-002", categoria: "Vendas", valor: 416, pago: true },
  { id: "5", data: "2024-12-01", tipo: "despesa", descricao: "Embalagens", categoria: "Embalagem", valor: 85, pago: true },
];

export default function Financeiro() {
  const [data, setData] = useState<Lancamento[]>(initialData);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newLancamento, setNewLancamento] = useState({
    tipo: "despesa" as "receita" | "despesa",
    descricao: "",
    categoria: "",
    valor: "",
    pago: false,
  });

  const filteredData = data.filter(
    (item) =>
      item.descricao.toLowerCase().includes(search.toLowerCase()) ||
      item.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const totalReceitas = data.filter((l) => l.tipo === "receita").reduce((sum, l) => sum + l.valor, 0);
  const totalDespesas = data.filter((l) => l.tipo === "despesa").reduce((sum, l) => sum + l.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Lancamento = {
      id: String(data.length + 1),
      data: new Date().toISOString().split("T")[0],
      tipo: newLancamento.tipo,
      descricao: newLancamento.descricao,
      categoria: newLancamento.categoria,
      valor: parseFloat(newLancamento.valor),
      pago: newLancamento.pago,
    };
    setData([newEntry, ...data]);
    setNewLancamento({ tipo: "despesa", descricao: "", categoria: "", valor: "", pago: false });
    setDialogOpen(false);
    toast({ title: "Lançamento registrado", description: `${newEntry.descricao} - R$ ${newEntry.valor.toFixed(2)}` });
  };

  const columns = [
    { key: "data", label: "Data" },
    { 
      key: "tipo", 
      label: "Tipo",
      render: (item: Lancamento) => (
        <Badge variant={item.tipo === "receita" ? "default" : "destructive"} className="capitalize">
          {item.tipo === "receita" ? "Receita" : "Despesa"}
        </Badge>
      )
    },
    { key: "descricao", label: "Descrição" },
    { key: "categoria", label: "Categoria" },
    { 
      key: "valor", 
      label: "Valor",
      render: (item: Lancamento) => (
        <span className={item.tipo === "receita" ? "text-success" : "text-destructive"}>
          {item.tipo === "receita" ? "+" : "-"} R$ {item.valor.toFixed(2)}
        </span>
      )
    },
    { 
      key: "pago", 
      label: "Status",
      render: (item: Lancamento) => (
        <Badge variant={item.pago ? "secondary" : "outline"}>
          {item.pago ? "Pago" : "Pendente"}
        </Badge>
      )
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Controle Financeiro"
        subtitle="Gerencie receitas e despesas"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                Novo Lançamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Novo Lançamento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select value={newLancamento.tipo} onValueChange={(v) => setNewLancamento({ ...newLancamento, tipo: v as "receita" | "despesa" })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="receita">Receita</SelectItem>
                        <SelectItem value="despesa">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="valor">Valor (R$)</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      value={newLancamento.valor}
                      onChange={(e) => setNewLancamento({ ...newLancamento, valor: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={newLancamento.descricao}
                    onChange={(e) => setNewLancamento({ ...newLancamento, descricao: e.target.value })}
                    placeholder="Ex: Compra de tecido"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select value={newLancamento.categoria} onValueChange={(v) => setNewLancamento({ ...newLancamento, categoria: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vendas">Vendas</SelectItem>
                        <SelectItem value="Tecido">Tecido</SelectItem>
                        <SelectItem value="Aviamentos">Aviamentos</SelectItem>
                        <SelectItem value="Mão de obra">Mão de obra</SelectItem>
                        <SelectItem value="Embalagem">Embalagem</SelectItem>
                        <SelectItem value="Frete">Frete</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newLancamento.pago}
                        onChange={(e) => setNewLancamento({ ...newLancamento, pago: e.target.checked })}
                        className="rounded border-border"
                      />
                      <span className="text-sm">Já foi pago</span>
                    </label>
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
        <StatCard label="Receitas" value={`R$ ${totalReceitas.toFixed(2)}`} icon={TrendingUp} className="border-l-4 border-l-success" />
        <StatCard label="Despesas" value={`R$ ${totalDespesas.toFixed(2)}`} icon={TrendingDown} className="border-l-4 border-l-destructive" />
        <StatCard 
          label="Saldo" 
          value={`R$ ${saldo.toFixed(2)}`} 
          icon={DollarSign} 
          className={saldo >= 0 ? "border-l-4 border-l-success" : "border-l-4 border-l-destructive"}
        />
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="doc-card">
        <DataTable columns={columns} data={filteredData} emptyMessage="Nenhum lançamento encontrado." />
      </div>
    </AppLayout>
  );
}
