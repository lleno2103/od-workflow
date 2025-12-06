import { useState } from "react";
import { Plus, Calendar, CheckCircle2, Clock, Circle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Etapa {
  id: string;
  nome: string;
  responsavel: string;
  status: "pendente" | "andamento" | "concluido";
  semana: number;
}

interface Colecao {
  id: string;
  nome: string;
  dataInicio: string;
  dataFim: string;
  etapas: Etapa[];
}

const initialColecoes: Colecao[] = [
  {
    id: "1",
    nome: "Verão Odò 2025",
    dataInicio: "2024-12-01",
    dataFim: "2025-01-12",
    etapas: [
      { id: "1", nome: "Desenvolvimento (moldes + ficha)", responsavel: "Design", status: "concluido", semana: 1 },
      { id: "2", nome: "Ajustes de provas (fit)", responsavel: "Pilotagem", status: "concluido", semana: 2 },
      { id: "3", nome: "Produção piloto (10 peças)", responsavel: "Produção", status: "andamento", semana: 3 },
      { id: "4", nome: "Produção principal", responsavel: "Produção", status: "pendente", semana: 4 },
      { id: "5", nome: "Acabamento e embalagem", responsavel: "QC", status: "pendente", semana: 5 },
      { id: "6", nome: "Lançamento e distribuição", responsavel: "Marketing", status: "pendente", semana: 6 },
    ],
  },
  {
    id: "2",
    nome: "Cápsula Linho Puro",
    dataInicio: "2025-01-15",
    dataFim: "2025-02-26",
    etapas: [
      { id: "1", nome: "Desenvolvimento (moldes + ficha)", responsavel: "Design", status: "pendente", semana: 1 },
      { id: "2", nome: "Ajustes de provas (fit)", responsavel: "Pilotagem", status: "pendente", semana: 2 },
      { id: "3", nome: "Produção piloto", responsavel: "Produção", status: "pendente", semana: 3 },
      { id: "4", nome: "Produção principal", responsavel: "Produção", status: "pendente", semana: 4 },
      { id: "5", nome: "Acabamento e embalagem", responsavel: "QC", status: "pendente", semana: 5 },
      { id: "6", nome: "Lançamento", responsavel: "Marketing", status: "pendente", semana: 6 },
    ],
  },
];

const statusIcons = {
  pendente: Circle,
  andamento: Clock,
  concluido: CheckCircle2,
};

const statusColors = {
  pendente: "text-muted-foreground",
  andamento: "text-accent",
  concluido: "text-success",
};

export default function Cronograma() {
  const [colecoes, setColecoes] = useState<Colecao[]>(initialColecoes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newColecao, setNewColecao] = useState({
    nome: "",
    dataInicio: "",
    semanas: "6",
  });

  const calcularProgresso = (etapas: Etapa[]) => {
    const concluidas = etapas.filter((e) => e.status === "concluido").length;
    return Math.round((concluidas / etapas.length) * 100);
  };

  const toggleEtapaStatus = (colecaoId: string, etapaId: string) => {
    setColecoes(
      colecoes.map((col) => {
        if (col.id !== colecaoId) return col;
        return {
          ...col,
          etapas: col.etapas.map((etapa) => {
            if (etapa.id !== etapaId) return etapa;
            const nextStatus =
              etapa.status === "pendente"
                ? "andamento"
                : etapa.status === "andamento"
                ? "concluido"
                : "pendente";
            return { ...etapa, status: nextStatus };
          }),
        };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numSemanas = parseInt(newColecao.semanas);
    const startDate = new Date(newColecao.dataInicio);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + numSemanas * 7);

    const defaultEtapas: Etapa[] = [
      { id: "1", nome: "Desenvolvimento (moldes + ficha)", responsavel: "Design", status: "pendente", semana: 1 },
      { id: "2", nome: "Ajustes de provas (fit)", responsavel: "Pilotagem", status: "pendente", semana: 2 },
      { id: "3", nome: "Produção piloto", responsavel: "Produção", status: "pendente", semana: 3 },
      { id: "4", nome: "Produção principal", responsavel: "Produção", status: "pendente", semana: 4 },
      { id: "5", nome: "Acabamento e embalagem", responsavel: "QC", status: "pendente", semana: 5 },
      { id: "6", nome: "Lançamento", responsavel: "Marketing", status: "pendente", semana: 6 },
    ];

    const newEntry: Colecao = {
      id: String(colecoes.length + 1),
      nome: newColecao.nome,
      dataInicio: newColecao.dataInicio,
      dataFim: endDate.toISOString().split("T")[0],
      etapas: defaultEtapas.slice(0, numSemanas),
    };
    setColecoes([newEntry, ...colecoes]);
    setNewColecao({ nome: "", dataInicio: "", semanas: "6" });
    setDialogOpen(false);
    toast({ title: "Cronograma criado", description: newEntry.nome });
  };

  return (
    <AppLayout>
      <PageHeader
        title="Cronograma de Coleção"
        subtitle="Acompanhe o desenvolvimento das coleções"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} className="mr-2" />
                Nova Coleção
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Coleção</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="nome">Nome da Coleção</Label>
                  <Input
                    id="nome"
                    value={newColecao.nome}
                    onChange={(e) => setNewColecao({ ...newColecao, nome: e.target.value })}
                    placeholder="Ex: Verão Odò 2025"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataInicio">Data de Início</Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={newColecao.dataInicio}
                      onChange={(e) => setNewColecao({ ...newColecao, dataInicio: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="semanas">Duração (semanas)</Label>
                    <Input
                      id="semanas"
                      type="number"
                      min="4"
                      max="12"
                      value={newColecao.semanas}
                      onChange={(e) => setNewColecao({ ...newColecao, semanas: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Criar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Timeline */}
      <div className="space-y-6">
        {colecoes.map((colecao) => {
          const progresso = calcularProgresso(colecao.etapas);
          return (
            <div key={colecao.id} className="doc-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold">{colecao.nome}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar size={12} />
                    {colecao.dataInicio} → {colecao.dataFim}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{progresso}%</span>
                  <Progress value={progresso} className="w-32 h-2" />
                </div>
              </div>

              <div className="grid gap-2">
                {colecao.etapas.map((etapa) => {
                  const StatusIcon = statusIcons[etapa.status];
                  return (
                    <button
                      key={etapa.id}
                      onClick={() => toggleEtapaStatus(colecao.id, etapa.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-md text-left transition-colors",
                        etapa.status === "concluido" && "bg-success/10",
                        etapa.status === "andamento" && "bg-accent/10",
                        etapa.status === "pendente" && "bg-muted/50 hover:bg-muted"
                      )}
                    >
                      <StatusIcon size={18} className={statusColors[etapa.status]} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{etapa.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          Semana {etapa.semana} • {etapa.responsavel}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
