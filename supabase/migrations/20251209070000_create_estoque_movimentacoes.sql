-- Tabelas de Movimentações de Estoque
CREATE TABLE IF NOT EXISTS public.estoque_movimentacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada','saida')),
  origem TEXT, -- compra, producao, inventario, ajuste, transferencia
  documento TEXT, -- número/identificador opcional
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.estoque_itens_movimentacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movimentacao_id UUID NOT NULL REFERENCES public.estoque_movimentacoes(id) ON DELETE CASCADE,
  material_id UUID REFERENCES public.materiais(id),
  material_nome TEXT NOT NULL,
  quantidade NUMERIC NOT NULL DEFAULT 0,
  unidade TEXT NOT NULL,
  custo_unitario NUMERIC NOT NULL DEFAULT 0,
  local_armazenamento TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.estoque_movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque_itens_movimentacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all on estoque_movimentacoes" ON public.estoque_movimentacoes FOR ALL USING (true);
CREATE POLICY "Allow public all on estoque_itens_movimentacao" ON public.estoque_itens_movimentacao FOR ALL USING (true);

-- Função e triggers para atualizar estoque de materiais
CREATE OR REPLACE FUNCTION public.fn_aplicar_movimentacao_estoque()
RETURNS TRIGGER AS $$
DECLARE
  v_tipo TEXT;
  v_delta NUMERIC;
BEGIN
  SELECT tipo INTO v_tipo FROM public.estoque_movimentacoes WHERE id = NEW.movimentacao_id;
  IF v_tipo = 'entrada' THEN
    v_delta := NEW.quantidade;
  ELSE
    v_delta := -NEW.quantidade;
  END IF;

  IF NEW.material_id IS NOT NULL THEN
    UPDATE public.materiais
    SET estoque_atual = COALESCE(estoque_atual,0) + v_delta,
        updated_at = now()
    WHERE id = NEW.material_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_mov_item_after_insert ON public.estoque_itens_movimentacao;
CREATE TRIGGER trg_mov_item_after_insert
AFTER INSERT ON public.estoque_itens_movimentacao
FOR EACH ROW EXECUTE FUNCTION public.fn_aplicar_movimentacao_estoque();

-- Índices
CREATE INDEX IF NOT EXISTS idx_movimentacoes_data ON public.estoque_movimentacoes(data);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_tipo ON public.estoque_movimentacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_mov_items_mov ON public.estoque_itens_movimentacao(movimentacao_id);
CREATE INDEX IF NOT EXISTS idx_mov_items_material ON public.estoque_itens_movimentacao(material_id);

