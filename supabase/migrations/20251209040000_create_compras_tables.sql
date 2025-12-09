-- Tabela de Fornecedores
CREATE TABLE IF NOT EXISTS public.compras_fornecedores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    cnpj TEXT,
    endereco TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Requisições de Compra
CREATE TABLE IF NOT EXISTS public.compras_requisicoes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    numero TEXT NOT NULL, -- REQ-001 (Unique constraint added later or handled by app/trigger, keeping loose for now or unique index)
    solicitante TEXT NOT NULL,
    departamento TEXT NOT NULL,
    data_solicitacao DATE DEFAULT CURRENT_DATE,
    data_necessidade DATE,
    status TEXT CHECK (status IN ('pendente', 'aprovada', 'rejeitada', 'convertida')) DEFAULT 'pendente',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Itens da Requisição
CREATE TABLE IF NOT EXISTS public.compras_itens_requisicao (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    requisicao_id UUID NOT NULL REFERENCES public.compras_requisicoes(id) ON DELETE CASCADE,
    material_id UUID REFERENCES public.materiais(id), -- Optional link to materials
    material_nome TEXT NOT NULL, -- Fallback or explicit name
    quantidade DECIMAL(10,2) NOT NULL DEFAULT 0,
    unidade TEXT NOT NULL,
    justificativa TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Pedidos de Compra
CREATE TABLE IF NOT EXISTS public.compras_pedidos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    numero TEXT NOT NULL, -- PC-001
    fornecedor_id UUID REFERENCES public.compras_fornecedores(id),
    data_pedido DATE DEFAULT CURRENT_DATE,
    data_entrega DATE,
    valor_total DECIMAL(10,2) DEFAULT 0,
    status TEXT CHECK (status IN ('pendente', 'enviado', 'confirmado', 'recebido', 'cancelado')) DEFAULT 'pendente',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS public.compras_itens_pedido (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    pedido_id UUID NOT NULL REFERENCES public.compras_pedidos(id) ON DELETE CASCADE,
    material_id UUID REFERENCES public.materiais(id),
    material_nome TEXT NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL DEFAULT 0,
    unidade TEXT NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL DEFAULT 0,
    valor_total DECIMAL(10,2) GENERATED ALWAYS AS (quantidade * valor_unitario) STORED,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Recebimento de Mercadorias
CREATE TABLE IF NOT EXISTS public.compras_recebimentos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    numero TEXT NOT NULL, -- REC-001
    pedido_id UUID REFERENCES public.compras_pedidos(id),
    nota_fiscal TEXT,
    data_recebimento DATE DEFAULT CURRENT_DATE,
    valor_total DECIMAL(10,2) DEFAULT 0,
    status TEXT CHECK (status IN ('pendente', 'conferido', 'finalizado')) DEFAULT 'pendente',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Itens do Recebimento (pode ser linkado ao item do pedido para controle de saldo, mas simples por enquanto)
CREATE TABLE IF NOT EXISTS public.compras_itens_recebimento (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    recebimento_id UUID NOT NULL REFERENCES public.compras_recebimentos(id) ON DELETE CASCADE,
    material_id UUID REFERENCES public.materiais(id),
    material_nome TEXT NOT NULL,
    quantidade_pedida DECIMAL(10,2) NOT NULL DEFAULT 0,
    quantidade_recebida DECIMAL(10,2) NOT NULL DEFAULT 0,
    unidade TEXT NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.compras_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras_requisicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras_itens_requisicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras_pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras_itens_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras_recebimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras_itens_recebimento ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public access for now as per pattern)
CREATE POLICY "Allow public all on compras_fornecedores" ON public.compras_fornecedores FOR ALL USING (true);
CREATE POLICY "Allow public all on compras_requisicoes" ON public.compras_requisicoes FOR ALL USING (true);
CREATE POLICY "Allow public all on compras_itens_requisicao" ON public.compras_itens_requisicao FOR ALL USING (true);
CREATE POLICY "Allow public all on compras_pedidos" ON public.compras_pedidos FOR ALL USING (true);
CREATE POLICY "Allow public all on compras_itens_pedido" ON public.compras_itens_pedido FOR ALL USING (true);
CREATE POLICY "Allow public all on compras_recebimentos" ON public.compras_recebimentos FOR ALL USING (true);
CREATE POLICY "Allow public all on compras_itens_recebimento" ON public.compras_itens_recebimento FOR ALL USING (true);

-- Indexes
CREATE INDEX idx_compras_requisicoes_status ON public.compras_requisicoes(status);
CREATE INDEX idx_compras_pedidos_fornecedor ON public.compras_pedidos(fornecedor_id);
CREATE INDEX idx_compras_pedidos_status ON public.compras_pedidos(status);
CREATE INDEX idx_compras_recebimentos_pedido ON public.compras_recebimentos(pedido_id);

-- Triggers for updated_at
CREATE TRIGGER update_compras_fornecedores_updated_at BEFORE UPDATE ON public.compras_fornecedores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compras_requisicoes_updated_at BEFORE UPDATE ON public.compras_requisicoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compras_pedidos_updated_at BEFORE UPDATE ON public.compras_pedidos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compras_recebimentos_updated_at BEFORE UPDATE ON public.compras_recebimentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data for Fornecedores (Optional but helpful)
INSERT INTO public.compras_fornecedores (nome, email, telefone) VALUES 
('Tecidos Ltda', 'vendas@tecidos.com', '(11) 9999-9999'),
('Aviamentos Silva', 'contato@aviamentos.com', '(11) 8888-8888'),
('Embalagens Premium', 'comercial@embalagens.com', '(11) 7777-7777')
ON CONFLICT DO NOTHING;
