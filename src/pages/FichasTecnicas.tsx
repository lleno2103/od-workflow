import { useState } from "react";
import { Plus, Search, Eye } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
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

interface FichaTecnica {
  id: string;
  codigo: string;
  nome: string;
  variante: string;
  material: string;
  composicao: string;
  custoTotal: number;
}

const initialData: FichaTecnica[] = [
  { id: "1", codigo: "FT-001", nome: "Bata Odò Henley", variante: "M / Verde Bandeira", material: "Linho 100%", composicao: "100% linho", custoTotal: 159.50 },
  { id: "2", codigo: "FT-002", nome: "Bermuda Linho", variante: "G / Cru", material: "Linho+Viscose", composicao: "70% linho, 30% viscose", custoTotal: 98.00 },
  { id: "3", codigo: "FT-003", nome: "Camisa Cambraia", variante: "P / Branco", material: "Cambraia", composicao: "100% algodão", custoTotal: 75.50 },
];

export default function FichasTecnicas() {
  const [data, setData] = useState<FichaTecnica[]>(initialData);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newFicha, setNewFicha] = useState({
    nome: "",
    variante: "",
    material: "",
    composicao: "",
    custoTotal: "",
  });

  const filteredData = data.filter(
    (item) =>
      item.nome.toLowerCase().includes(search.toLowerCase()) ||
      item.codigo.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: FichaTecnica = {
      id: String(data.length + 1),
      codigo: `FT-${String(data.length + 1).padStart(3, "0")}`,
      nome: newFicha.nome,
      variante: newFicha.variante,
      material: newFicha.material,
      composicao: newFicha.composicao,
      custoTotal: parseFloat(newFicha.custoTotal),
    };
    setData([newItem, ...data]);
    setNewFicha({ nome: "", variante: "", material: "", composicao: "", custoTotal: "" });
    setDialogOpen(false);
    toast({ title: "Ficha criada", description: `${newItem.codigo} criada com sucesso.` });
  };

  const columns = [
    { key: "codigo", label: "Código" },
    { key: "nome", label: "Produto" },
    { key: "variante", label: "Variante" },
    { key: "material", label: "Material" },
    { key: "composicao", label: "Composição" },
    { 
      key: "custoTotal", 
      label: "Custo", 
      render: (item: FichaTecnica) => `R$ ${item.custoTotal.toFixed(2)}` 
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <Button variant="ghost" size="sm">
          <Eye size={16} />
        </Button>
      ),
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Fichas Técnicas"
        subtitle="Especificações técnicas dos produtos"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                Nova Ficha
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Nova Ficha Técnica</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome do Produto</Label>
                    <Input
                      id="nome"
                      value={newFicha.nome}
                      onChange={(e) => setNewFicha({ ...newFicha, nome: e.target.value })}
                      placeholder="Ex: Bata Odò"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="variante">Variante</Label>
                    <Input
                      id="variante"
                      value={newFicha.variante}
                      onChange={(e) => setNewFicha({ ...newFicha, variante: e.target.value })}
                      placeholder="Ex: M / Verde"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="material">Material Principal</Label>
                    <Select value={newFicha.material} onValueChange={(v) => setNewFicha({ ...newFicha, material: v })}>
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
                  <div>
                    <Label htmlFor="custoTotal">Custo Total (R$)</Label>
                    <Input
                      id="custoTotal"
                      type="number"
                      step="0.01"
                      value={newFicha.custoTotal}
                      onChange={(e) => setNewFicha({ ...newFicha, custoTotal: e.target.value })}
                      placeholder="159.50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="composicao">Composição</Label>
                  <Input
                    id="composicao"
                    value={newFicha.composicao}
                    onChange={(e) => setNewFicha({ ...newFicha, composicao: e.target.value })}
                    placeholder="Ex: 100% linho"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Criar Ficha</Button>
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
            placeholder="Buscar por nome ou código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="doc-card">
        <DataTable columns={columns} data={filteredData} emptyMessage="Nenhuma ficha técnica encontrada." />
      </div>
    </AppLayout>
  );
}
