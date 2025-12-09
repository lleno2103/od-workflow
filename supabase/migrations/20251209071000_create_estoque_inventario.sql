CREATE TABLE IF NOT EXISTS public.estoque_inventarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT NOT NULL,
  data DATE DEFAULT CURRENT_DATE,
  status TEXT CHECK (status IN ('rascunho','finalizado')) DEFAULT 'rascunho',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.estoque_itens_inventario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inventario_id UUID NOT NULL REFERENCES public.estoque_inventarios(id) ON DELETE CASCADE,
  material_id UUID REFERENCES public.materiais(id),
  material_nome TEXT NOT NULL,
  unidade TEXT NOT NULL,
  quantidade_sistema NUMERIC NOT NULL DEFAULT 0,
  quantidade_contada NUMERIC NOT NULL DEFAULT 0,
  diferenca NUMERIC GENERATED ALWAYS AS (quantidade_contada - quantidade_sistema) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.estoque_inventarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque_itens_inventario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all on estoque_inventarios" ON public.estoque_inventarios FOR ALL USING (true);
CREATE POLICY "Allow public all on estoque_itens_inventario" ON public.estoque_itens_inventario FOR ALL USING (true);

CREATE INDEX IF NOT EXISTS idx_inv_data ON public.estoque_inventarios(data);
CREATE INDEX IF NOT EXISTS idx_inv_status ON public.estoque_inventarios(status);
CREATE INDEX IF NOT EXISTS idx_inv_itens_inv ON public.estoque_itens_inventario(inventario_id);
CREATE INDEX IF NOT EXISTS idx_inv_itens_mat ON public.estoque_itens_inventario(material_id);

