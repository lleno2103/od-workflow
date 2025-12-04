import { cn } from "@/lib/utils";

type Status = "pendente" | "andamento" | "concluido" | "cancelado";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusLabels: Record<Status, string> = {
  pendente: "Pendente",
  andamento: "Em Andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      "status-badge",
      `status-${status}`,
      className
    )}>
      {statusLabels[status]}
    </span>
  );
}
