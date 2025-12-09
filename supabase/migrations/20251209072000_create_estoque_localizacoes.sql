CREATE TABLE IF NOT EXISTS public.estoque_localizacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.estoque_localizacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all on estoque_localizacoes" ON public.estoque_localizacoes FOR ALL USING (true);

CREATE INDEX IF NOT EXISTS idx_localizacoes_nome ON public.estoque_localizacoes(nome);

