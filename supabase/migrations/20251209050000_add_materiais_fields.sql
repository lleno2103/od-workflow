-- Add new columns to materiais table to support advanced form fields
ALTER TABLE public.materiais
ADD COLUMN IF NOT EXISTS descricao_curta TEXT,
ADD COLUMN IF NOT EXISTS detalhes JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS unidade_compra TEXT,
ADD COLUMN IF NOT EXISTS preco_compra NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS qtd_por_unidade_compra NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS local_armazenamento TEXT,
ADD COLUMN IF NOT EXISTS fornecedor_nome TEXT,
ADD COLUMN IF NOT EXISTS fornecedor_cnpj TEXT,
ADD COLUMN IF NOT EXISTS fornecedor_contato TEXT,
ADD COLUMN IF NOT EXISTS fornecedor_link TEXT,
ADD COLUMN IF NOT EXISTS fornecedor_prazo TEXT,
ADD COLUMN IF NOT EXISTS fornecedor_pagamento TEXT,
ADD COLUMN IF NOT EXISTS observacoes_uso TEXT,
ADD COLUMN IF NOT EXISTS rendimento_medio TEXT,
ADD COLUMN IF NOT EXISTS perdas_estimadas NUMERIC DEFAULT 0;
