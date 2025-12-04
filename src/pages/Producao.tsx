import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface OrdemProducao {
  id: string;
  numero: string;
  produto: string;
  variante: string;
  quantidade: number;
  tecido: string;
  status: "pendente" | "andamento" | "concluido" | "cancelado";
  dataEmissao: string;
}

const initialData: OrdemProducao[] = [
  { id: "1", numero: "OP-001", produto: "Bata Odò Henley", variante: "M / Verde Bandeira", quantidade: 50, tecido: "Linho 100%", status: "andamento", dataEmissao: "2024-12-01" },
  { id: "2", numero: "OP-002", produto: "Bermuda Linho", variante: "G / Cru", quantidade: 30, tecido: "Linho+Viscose", status: "pendente", dataEmissao: "2024-12-02" },
  { id: "3", numero: "OP-003", produto: "Camisa Cambraia", variante: "P / Branco", quantidade: 25, tecido: "Cambraia", status: "concluido", dataEmissao: "2024-11-28" },
  { id: "4", numero: "OP-004", produto: "Bata Odò Henley", variante: "GG / Azul Royal", quantidade: 20, tecido: "Linho 100%", status: "pendente", dataEmissao: "2024-12-03" },
];

export default function Producao() {
  const [data, setData] = useState<OrdemProducao[]>(initialData);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newOP, setNewOP] = useState({
    produto: "",
    variante: "",
    quantidade: "",
    tecido: "",
    observacoes: "",
  });

  const filteredData = data.filter(
    (item) =>
      item.produto.toLowerCase().includes(search.toLowerCase()) ||
      item.numero.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: OrdemProducao = {
      id: String(data.length + 1),
      numero: `OP-${String(data.length + 1).padStart(3, "0")}`,
      produto: newOP.produto,
      variante: newOP.variante,
      quantidade: parseInt(newOP.quantidade),
      tecido: newOP.tecido,
      status: "pendente",
      dataEmissao: new Date().toISOString().split("T")[0],
    };
    setData([newItem, ...data]);
    setNewOP({ produto: "", variante: "", quantidade: "", tecido: "", observacoes: "" });
    setDialogOpen(false);
    toast({ title: "Ordem criada", description: `${newItem.numero} criada com sucesso.` });
  };

  const columns = [
    { key: "numero", label: "Nº OP" },
    { key: "produto", label: "Produto" },
    { key: "variante", label: "Variante" },
    { key: "quantidade", label: "Qtd", render: (item: OrdemProducao) => `${item.quantidade} un` },
    { key: "tecido", label: "Tecido" },
    { key: "status", label: "Status", render: (item: OrdemProducao) => <StatusBadge status={item.status} /> },
    { key: "dataEmissao", label: "Data" },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Ordens de Produção"
        subtitle="Gerencie as ordens de produção"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                Nova OP
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Nova Ordem de Produção</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="produto">Produto</Label>
                    <Input
                      id="produto"
                      value={newOP.produto}
                      onChange={(e) => setNewOP({ ...newOP, produto: e.target.value })}
                      placeholder="Ex: Bata Odò"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="variante">Variante / Tamanho</Label>
                    <Input
                      id="variante"
                      value={newOP.variante}
                      onChange={(e) => setNewOP({ ...newOP, variante: e.target.value })}
                      placeholder="Ex: M / Verde"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      value={newOP.quantidade}
                      onChange={(e) => setNewOP({ ...newOP, quantidade: e.target.value })}
                      placeholder="50"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tecido">Tecido</Label>
                    <Select value={newOP.tecido} onValueChange={(v) => setNewOP({ ...newOP, tecido: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Linho 100%">Linho 100%</SelectItem>
                        <SelectItem value="Linho+Viscose">Linho + Viscose</SelectItem>
                        <SelectItem value="Cambraia">Cambraia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={newOP.observacoes}
                    onChange={(e) => setNewOP({ ...newOP, observacoes: e.target.value })}
                    placeholder="Instruções especiais..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Criar OP</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por produto ou número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="doc-card">
        <DataTable columns={columns} data={filteredData} emptyMessage="Nenhuma ordem de produção encontrada." />
      </div>
    </AppLayout>
  );
}
