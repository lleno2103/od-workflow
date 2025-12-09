create table if not exists public.materiais (
  id uuid not null default gen_random_uuid (),
  nome text not null,
  tipo text not null,
  codigo text null,
  unidade_medida text not null,
  custo_unitario numeric not null default 0,
  estoque_atual numeric not null default 0,
  estoque_minimo numeric not null default 0,
  cor text null,
  foto text null,
  ativo boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint materiais_pkey primary key (id)
);

-- Enable RLS
alter table public.materiais enable row level security;

-- Policies
create policy "Enable all access for authenticated users" on public.materiais
    for all using (auth.role() = 'authenticated');
