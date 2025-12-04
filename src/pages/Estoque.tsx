import { useState } from "react";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface ItemEstoque {
  id: string;
  codigo: string;
  tipo: "tecido" | "aviamento" | "produto";
  nome: string;
  cor: string;
  lote: string;
  quantidade: number;
  unidade: string;
  pontoReposicao: number;
  localizacao: string;
}

const initialData: ItemEstoque[] = [
  { id: "1", codigo: "F-001", tipo: "tecido", nome: "Linho 100% cru", cor: "Cru", lote: "LOTE123", quantidade: 120, unidade: "m", pontoReposicao: 20, localizacao: "Prat. 1" },
  { id: "2", codigo: "F-002", tipo: "tecido", nome: "Linho verde bandeira", cor: "Verde", lote: "LOTE124", quantidade: 85, unidade: "m", pontoReposicao: 15, localizacao: "Prat. 1" },
  { id: "3", codigo: "A-001", tipo: "aviamento", nome: "Botão madeira 12mm", cor: "Marrom", lote: "LOTE45", quantidade: 80, unidade: "un", pontoReposicao: 100, localizacao: "Caixa B" },
  { id: "4", codigo: "A-002", tipo: "aviamento", nome: "Elástico 2cm", cor: "Branco", lote: "LOTE46", quantidade: 250, unidade: "m", pontoReposicao: 50, localizacao: "Caixa C" },
  { id: "5", codigo: "P-001", tipo: "produto", nome: "Bata Odò Henley M", cor: "Verde", lote: "PROD01", quantidade: 12, unidade: "un", pontoReposicao: 5, localizacao: "Arm. 1" },
  { id: "6", codigo: "F-003", tipo: "tecido", nome: "Cambraia branca", cor: "Branco", lote: "LOTE125", quantidade: 15, unidade: "m", pontoReposicao: 20, localizacao: "Prat. 2" },
];

export default function Estoque() {
  const [data, setData] = useState<ItemEstoque[]>(initialData);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    tipo: "tecido" as "tecido" | "aviamento" | "produto",
    nome: "",
    cor: "",
    quantidade: "",
    unidade: "m",
    pontoReposicao: "",
    localizacao: "",
  });

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.nome.toLowerCase().includes(search.toLowerCase()) ||
      item.codigo.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "todos" || item.tipo === activeTab;
    return matchesSearch && matchesTab;
  });

  const lowStockItems = data.filter((item) => item.quantidade <= item.pontoReposicao);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = newItem.tipo === "tecido" ? "F" : newItem.tipo === "aviamento" ? "A" : "P";
    const count = data.filter((d) => d.tipo === newItem.tipo).length + 1;
    const newEntry: ItemEstoque = {
      id: String(data.length + 1),
      codigo: `${prefix}-${String(count).padStart(3, "0")}`,
      tipo: newItem.tipo,
      nome: newItem.nome,
      cor: newItem.cor,
      lote: `LOTE${Date.now().toString().slice(-6)}`,
      quantidade: parseInt(newItem.quantidade),
      unidade: newItem.unidade,
      pontoReposicao: parseInt(newItem.pontoReposicao),
      localizacao: newItem.localizacao,
    };
    setData([newEntry, ...data]);
    setNewItem({ tipo: "tecido", nome: "", cor: "", quantidade: "", unidade: "m", pontoReposicao: "", localizacao: "" });
    setDialogOpen(false);
    toast({ title: "Item adicionado", description: `${newEntry.codigo} - ${newEntry.nome}` });
  };

  const columns = [
    { key: "codigo", label: "Código" },
    { 
      key: "tipo", 
      label: "Tipo",
      render: (item: ItemEstoque) => (
        <Badge variant="secondary" className="capitalize">{item.tipo}</Badge>
      )
    },
    { key: "nome", label: "Nome" },
    { key: "cor", label: "Cor" },
    { 
      key: "quantidade", 
      label: "Qtd",
      render: (item: ItemEstoque) => (
        <span className={item.quantidade <= item.pontoReposicao ? "text-destructive font-medium" : ""}>
          {item.quantidade} {item.unidade}
        </span>
      )
    },
    { key: "pontoReposicao", label: "Mín", render: (item: ItemEstoque) => `${item.pontoReposicao} ${item.unidade}` },
    { key: "localizacao", label: "Local" },
    { key: "lote", label: "Lote" },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Controle de Estoque"
        subtitle="Gerencie materiais e produtos acabados"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                Novo Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Adicionar Item ao Estoque</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select value={newItem.tipo} onValueChange={(v) => setNewItem({ ...newItem, tipo: v as "tecido" | "aviamento" | "produto" })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tecido">Tecido</SelectItem>
                        <SelectItem value="aviamento">Aviamento</SelectItem>
                        <SelectItem value="produto">Produto Acabado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={newItem.nome}
                      onChange={(e) => setNewItem({ ...newItem, nome: e.target.value })}
                      placeholder="Ex: Linho 100%"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cor">Cor</Label>
                    <Input
                      id="cor"
                      value={newItem.cor}
                      onChange={(e) => setNewItem({ ...newItem, cor: e.target.value })}
                      placeholder="Ex: Cru"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      value={newItem.quantidade}
                      onChange={(e) => setNewItem({ ...newItem, quantidade: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="unidade">Unidade</Label>
                    <Select value={newItem.unidade} onValueChange={(v) => setNewItem({ ...newItem, unidade: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="m">Metros</SelectItem>
                        <SelectItem value="un">Unidades</SelectItem>
                        <SelectItem value="kg">Quilos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pontoReposicao">Ponto de Reposição</Label>
                    <Input
                      id="pontoReposicao"
                      type="number"
                      value={newItem.pontoReposicao}
                      onChange={(e) => setNewItem({ ...newItem, pontoReposicao: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="localizacao">Localização</Label>
                    <Input
                      id="localizacao"
                      value={newItem.localizacao}
                      onChange={(e) => setNewItem({ ...newItem, localizacao: e.target.value })}
                      placeholder="Ex: Prat. 1"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Adicionar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-lg flex items-start gap-3">
          <AlertTriangle size={20} className="text-warning mt-0.5" />
          <div>
            <p className="font-medium text-sm">Atenção: {lowStockItems.length} item(s) abaixo do ponto de reposição</p>
            <p className="text-xs text-muted-foreground mt-1">
              {lowStockItems.map((item) => item.nome).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="tecido">Tecidos</TabsTrigger>
            <TabsTrigger value="aviamento">Aviamentos</TabsTrigger>
            <TabsTrigger value="produto">Produtos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <div className="doc-card">
        <DataTable columns={columns} data={filteredData} emptyMessage="Nenhum item encontrado." />
      </div>
    </AppLayout>
  );
}
