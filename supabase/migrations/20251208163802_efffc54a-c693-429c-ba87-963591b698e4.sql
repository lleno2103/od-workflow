
-- Tabela de Categorias
CREATE TABLE public.categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Produtos
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria_id UUID REFERENCES public.categorias(id),
  imagem_principal TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Variantes (SKUs)
CREATE TABLE public.variantes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  tamanho TEXT NOT NULL,
  cor TEXT NOT NULL,
  preco_venda DECIMAL(10,2) NOT NULL DEFAULT 0,
  custo_producao DECIMAL(10,2) NOT NULL DEFAULT 0,
  estoque INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Ordens de Produção
CREATE TABLE public.ordens_producao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT NOT NULL UNIQUE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  produto_id UUID NOT NULL REFERENCES public.produtos(id),
  variante TEXT NOT NULL,
  cor TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  metragem DECIMAL(10,2),
  tecido TEXT,
  status TEXT NOT NULL DEFAULT 'aguardando' CHECK (status IN ('aguardando', 'corte', 'costura', 'acabamento', 'embalagem', 'concluida')),
  responsavel TEXT,
  prazo DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Fichas Técnicas
CREATE TABLE public.fichas_tecnicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  produto_id UUID NOT NULL REFERENCES public.produtos(id),
  variante TEXT NOT NULL,
  material TEXT,
  fornecedor TEXT,
  composicao TEXT,
  medidas JSONB,
  especificacoes_costura JSONB,
  observacoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de BOM (Bill of Materials)
CREATE TABLE public.bom (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  variante TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Itens do BOM
CREATE TABLE public.bom_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bom_id UUID NOT NULL REFERENCES public.bom(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  nome TEXT NOT NULL,
  quantidade DECIMAL(10,2) NOT NULL DEFAULT 0,
  unidade TEXT NOT NULL DEFAULT 'un',
  custo DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Cronogramas (Coleções)
CREATE TABLE public.cronogramas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Semanas do Cronograma
CREATE TABLE public.cronograma_semanas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cronograma_id UUID NOT NULL REFERENCES public.cronogramas(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL,
  titulo TEXT NOT NULL,
  tarefas TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'aguardando' CHECK (status IN ('concluida', 'em-andamento', 'aguardando')),
  responsavel TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordens_producao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fichas_tecnicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bom_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cronogramas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cronograma_semanas ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de leitura (para MVP sem auth)
CREATE POLICY "Allow public read on categorias" ON public.categorias FOR SELECT USING (true);
CREATE POLICY "Allow public insert on categorias" ON public.categorias FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on categorias" ON public.categorias FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on categorias" ON public.categorias FOR DELETE USING (true);

CREATE POLICY "Allow public read on produtos" ON public.produtos FOR SELECT USING (true);
CREATE POLICY "Allow public insert on produtos" ON public.produtos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on produtos" ON public.produtos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on produtos" ON public.produtos FOR DELETE USING (true);

CREATE POLICY "Allow public read on variantes" ON public.variantes FOR SELECT USING (true);
CREATE POLICY "Allow public insert on variantes" ON public.variantes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on variantes" ON public.variantes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on variantes" ON public.variantes FOR DELETE USING (true);

CREATE POLICY "Allow public read on ordens_producao" ON public.ordens_producao FOR SELECT USING (true);
CREATE POLICY "Allow public insert on ordens_producao" ON public.ordens_producao FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on ordens_producao" ON public.ordens_producao FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on ordens_producao" ON public.ordens_producao FOR DELETE USING (true);

CREATE POLICY "Allow public read on fichas_tecnicas" ON public.fichas_tecnicas FOR SELECT USING (true);
CREATE POLICY "Allow public insert on fichas_tecnicas" ON public.fichas_tecnicas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on fichas_tecnicas" ON public.fichas_tecnicas FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on fichas_tecnicas" ON public.fichas_tecnicas FOR DELETE USING (true);

CREATE POLICY "Allow public read on bom" ON public.bom FOR SELECT USING (true);
CREATE POLICY "Allow public insert on bom" ON public.bom FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on bom" ON public.bom FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on bom" ON public.bom FOR DELETE USING (true);

CREATE POLICY "Allow public read on bom_items" ON public.bom_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert on bom_items" ON public.bom_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on bom_items" ON public.bom_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on bom_items" ON public.bom_items FOR DELETE USING (true);

CREATE POLICY "Allow public read on cronogramas" ON public.cronogramas FOR SELECT USING (true);
CREATE POLICY "Allow public insert on cronogramas" ON public.cronogramas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on cronogramas" ON public.cronogramas FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on cronogramas" ON public.cronogramas FOR DELETE USING (true);

CREATE POLICY "Allow public read on cronograma_semanas" ON public.cronograma_semanas FOR SELECT USING (true);
CREATE POLICY "Allow public insert on cronograma_semanas" ON public.cronograma_semanas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on cronograma_semanas" ON public.cronograma_semanas FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on cronograma_semanas" ON public.cronograma_semanas FOR DELETE USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_variantes_updated_at BEFORE UPDATE ON public.variantes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ordens_producao_updated_at BEFORE UPDATE ON public.ordens_producao FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_fichas_tecnicas_updated_at BEFORE UPDATE ON public.fichas_tecnicas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bom_updated_at BEFORE UPDATE ON public.bom FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cronogramas_updated_at BEFORE UPDATE ON public.cronogramas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_produtos_categoria ON public.produtos(categoria_id);
CREATE INDEX idx_variantes_produto ON public.variantes(produto_id);
CREATE INDEX idx_ordens_producao_status ON public.ordens_producao(status);
CREATE INDEX idx_ordens_producao_produto ON public.ordens_producao(produto_id);
CREATE INDEX idx_fichas_tecnicas_produto ON public.fichas_tecnicas(produto_id);
CREATE INDEX idx_bom_produto ON public.bom(produto_id);
CREATE INDEX idx_bom_items_bom ON public.bom_items(bom_id);
CREATE INDEX idx_cronograma_semanas_cronograma ON public.cronograma_semanas(cronograma_id);
