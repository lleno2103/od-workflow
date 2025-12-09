export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bom: {
        Row: {
          created_at: string
          id: string
          produto_id: string
          updated_at: string
          variante: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          produto_id: string
          updated_at?: string
          variante?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          produto_id?: string
          updated_at?: string
          variante?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bom_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      bom_items: {
        Row: {
          bom_id: string
          created_at: string
          custo: number
          id: string
          nome: string
          quantidade: number
          tipo: string
          unidade: string
        }
        Insert: {
          bom_id: string
          created_at?: string
          custo?: number
          id?: string
          nome: string
          quantidade?: number
          tipo: string
          unidade?: string
        }
        Update: {
          bom_id?: string
          created_at?: string
          custo?: number
          id?: string
          nome?: string
          quantidade?: number
          tipo?: string
          unidade?: string
        }
        Relationships: [
          {
            foreignKeyName: "bom_items_bom_id_fkey"
            columns: ["bom_id"]
            isOneToOne: false
            referencedRelation: "bom"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      cronograma_semanas: {
        Row: {
          created_at: string
          cronograma_id: string
          id: string
          numero: number
          responsavel: string | null
          status: string
          tarefas: string[]
          titulo: string
        }
        Insert: {
          created_at?: string
          cronograma_id: string
          id?: string
          numero: number
          responsavel?: string | null
          status?: string
          tarefas?: string[]
          titulo: string
        }
        Update: {
          created_at?: string
          cronograma_id?: string
          id?: string
          numero?: number
          responsavel?: string | null
          status?: string
          tarefas?: string[]
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "cronograma_semanas_cronograma_id_fkey"
            columns: ["cronograma_id"]
            isOneToOne: false
            referencedRelation: "cronogramas"
            referencedColumns: ["id"]
          },
        ]
      }
      cronogramas: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_fim: string
          data_inicio: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      fichas_tecnicas: {
        Row: {
          ativo: boolean
          codigo: string
          composicao: string | null
          created_at: string
          especificacoes_costura: Json | null
          fornecedor: string | null
          id: string
          material: string | null
          medidas: Json | null
          observacoes: string | null
          produto_id: string
          updated_at: string
          variante: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          composicao?: string | null
          created_at?: string
          especificacoes_costura?: Json | null
          fornecedor?: string | null
          id?: string
          material?: string | null
          medidas?: Json | null
          observacoes?: string | null
          produto_id: string
          updated_at?: string
          variante: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          composicao?: string | null
          created_at?: string
          especificacoes_costura?: Json | null
          fornecedor?: string | null
          id?: string
          material?: string | null
          medidas?: Json | null
          observacoes?: string | null
          produto_id?: string
          updated_at?: string
          variante?: string
        }
        Relationships: [
          {
            foreignKeyName: "fichas_tecnicas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_producao: {
        Row: {
          cor: string
          created_at: string
          data: string
          id: string
          metragem: number | null
          numero: string
          observacoes: string | null
          prazo: string | null
          produto_id: string
          quantidade: number
          responsavel: string | null
          status: string
          tecido: string | null
          updated_at: string
          variante: string
        }
        Insert: {
          cor: string
          created_at?: string
          data?: string
          id?: string
          metragem?: number | null
          numero: string
          observacoes?: string | null
          prazo?: string | null
          produto_id: string
          quantidade: number
          responsavel?: string | null
          status?: string
          tecido?: string | null
          updated_at?: string
          variante: string
        }
        Update: {
          cor?: string
          created_at?: string
          data?: string
          id?: string
          metragem?: number | null
          numero?: string
          observacoes?: string | null
          prazo?: string | null
          produto_id?: string
          quantidade?: number
          responsavel?: string | null
          status?: string
          tecido?: string | null
          updated_at?: string
          variante?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordens_producao_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      compras_fornecedores: {
        Row: {
          id: string
          nome: string
          email: string | null
          telefone: string | null
          cnpj: string | null
          endereco: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email?: string | null
          telefone?: string | null
          cnpj?: string | null
          endereco?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string | null
          telefone?: string | null
          cnpj?: string | null
          endereco?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      compras_pedidos: {
        Row: {
          id: string
          numero: string
          fornecedor_id: string | null
          data_pedido: string | null
          data_entrega: string | null
          valor_total: number | null
          status: "pendente" | "enviado" | "confirmado" | "recebido" | "cancelado" | null
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero: string
          fornecedor_id?: string | null
          data_pedido?: string | null
          data_entrega?: string | null
          valor_total?: number | null
          status?: "pendente" | "enviado" | "confirmado" | "recebido" | "cancelado" | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero?: string
          fornecedor_id?: string | null
          data_pedido?: string | null
          data_entrega?: string | null
          valor_total?: number | null
          status?: "pendente" | "enviado" | "confirmado" | "recebido" | "cancelado" | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compras_pedidos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            referencedRelation: "compras_fornecedores"
            referencedColumns: ["id"]
          }
        ]
      }
      compras_itens_pedido: {
        Row: {
          id: string
          pedido_id: string
          material_id: string | null
          material_nome: string
          quantidade: number
          unidade: string
          valor_unitario: number
          valor_total: number | null
          created_at: string
        }
        Insert: {
          id?: string
          pedido_id: string
          material_id?: string | null
          material_nome: string
          quantidade: number
          unidade: string
          valor_unitario: number
          created_at?: string
        }
        Update: {
          id?: string
          pedido_id?: string
          material_id?: string | null
          material_nome?: string
          quantidade?: number
          unidade?: string
          valor_unitario?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compras_itens_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            referencedRelation: "compras_pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_itens_pedido_material_id_fkey"
            columns: ["material_id"]
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          }
        ]
      }
      compras_requisicoes: {
        Row: {
          id: string
          numero: string
          solicitante: string
          departamento: string
          data_solicitacao: string | null
          data_necessidade: string | null
          status: "pendente" | "aprovada" | "rejeitada" | "convertida" | null
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero: string
          solicitante: string
          departamento: string
          data_solicitacao?: string | null
          data_necessidade?: string | null
          status?: "pendente" | "aprovada" | "rejeitada" | "convertida" | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero?: string
          solicitante?: string
          departamento?: string
          data_solicitacao?: string | null
          data_necessidade?: string | null
          status?: "pendente" | "aprovada" | "rejeitada" | "convertida" | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      compras_itens_requisicao: {
        Row: {
          id: string
          requisicao_id: string
          material_id: string | null
          material_nome: string
          quantidade: number
          unidade: string
          justificativa: string | null
          created_at: string
        }
        Insert: {
          id?: string
          requisicao_id: string
          material_id?: string | null
          material_nome: string
          quantidade: number
          unidade: string
          justificativa?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          requisicao_id?: string
          material_id?: string | null
          material_nome?: string
          quantidade?: number
          unidade?: string
          justificativa?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compras_itens_requisicao_requisicao_id_fkey"
            columns: ["requisicao_id"]
            referencedRelation: "compras_requisicoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_itens_requisicao_material_id_fkey"
            columns: ["material_id"]
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          }
        ]
      }
      compras_recebimentos: {
        Row: {
          id: string
          numero: string
          pedido_id: string | null
          nota_fiscal: string | null
          data_recebimento: string | null
          valor_total: number | null
          status: "pendente" | "conferido" | "finalizado" | null
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero: string
          pedido_id?: string | null
          nota_fiscal?: string | null
          data_recebimento?: string | null
          valor_total?: number | null
          status?: "pendente" | "conferido" | "finalizado" | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero?: string
          pedido_id?: string | null
          nota_fiscal?: string | null
          data_recebimento?: string | null
          valor_total?: number | null
          status?: "pendente" | "conferido" | "finalizado" | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compras_recebimentos_pedido_id_fkey"
            columns: ["pedido_id"]
            referencedRelation: "compras_pedidos"
            referencedColumns: ["id"]
          }
        ]
      }
      compras_itens_recebimento: {
        Row: {
          id: string
          recebimento_id: string
          material_id: string | null
          material_nome: string
          quantidade_pedida: number
          quantidade_recebida: number
          unidade: string
          valor_unitario: number
          created_at: string
        }
        Insert: {
          id?: string
          recebimento_id: string
          material_id?: string | null
          material_nome: string
          quantidade_pedida: number
          quantidade_recebida: number
          unidade: string
          valor_unitario: number
          created_at?: string
        }
        Update: {
          id?: string
          recebimento_id: string
          material_id?: string | null
          material_nome?: string
          quantidade_pedida?: number
          quantidade_recebida?: number
          unidade?: string
          valor_unitario?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compras_itens_recebimento_recebimento_id_fkey"
            columns: ["recebimento_id"]
            referencedRelation: "compras_recebimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_itens_recebimento_material_id_fkey"
            columns: ["material_id"]
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          }
        ]
      }
      materiais: {
        Row: {
          id: string
          nome: string
          tipo: string
          codigo: string | null
          unidade_medida: string
          custo_unitario: number
          estoque_atual: number
          estoque_minimo: number
          cor: string | null
          foto: string | null
          ativo: boolean
          created_at: string
          updated_at: string
          descricao_curta: string | null
          detalhes: Json | null
          unidade_compra: string | null
          preco_compra: number | null
          qtd_por_unidade_compra: number | null
          local_armazenamento: string | null
          fornecedor_nome: string | null
          fornecedor_cnpj: string | null
          fornecedor_contato: string | null
          fornecedor_link: string | null
          fornecedor_prazo: string | null
          fornecedor_pagamento: string | null
          observacoes_uso: string | null
          rendimento_medio: string | null
          perdas_estimadas: number | null
        }
        Insert: {
          id?: string
          nome: string
          tipo: string
          codigo?: string | null
          unidade_medida: string
          custo_unitario?: number
          estoque_atual?: number
          estoque_minimo?: number
          cor?: string | null
          foto?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
          descricao_curta?: string | null
          detalhes?: Json | null
          unidade_compra?: string | null
          preco_compra?: number | null
          qtd_por_unidade_compra?: number | null
          local_armazenamento?: string | null
          fornecedor_nome?: string | null
          fornecedor_cnpj?: string | null
          fornecedor_contato?: string | null
          fornecedor_link?: string | null
          fornecedor_prazo?: string | null
          fornecedor_pagamento?: string | null
          observacoes_uso?: string | null
          rendimento_medio?: string | null
          perdas_estimadas?: number | null
        }
        Update: {
          id?: string
          nome?: string
          tipo?: string
          codigo?: string | null
          unidade_medida?: string
          custo_unitario?: number
          estoque_atual?: number
          estoque_minimo?: number
          cor?: string | null
          foto?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
          descricao_curta?: string | null
          detalhes?: Json | null
          unidade_compra?: string | null
          preco_compra?: number | null
          qtd_por_unidade_compra?: number | null
          local_armazenamento?: string | null
          fornecedor_nome?: string | null
          fornecedor_cnpj?: string | null
          fornecedor_contato?: string | null
          fornecedor_link?: string | null
          fornecedor_prazo?: string | null
          fornecedor_pagamento?: string | null
          observacoes_uso?: string | null
          rendimento_medio?: string | null
          perdas_estimadas?: number | null
        }
        Relationships: []
      }
      produtos: {
        Row: {
          ativo: boolean
          categoria_id: string | null
          codigo: string
          created_at: string
          descricao: string | null
          id: string
          imagem_principal: string | null
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria_id?: string | null
          codigo: string
          created_at?: string
          descricao?: string | null
          id?: string
          imagem_principal?: string | null
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria_id?: string | null
          codigo?: string
          created_at?: string
          descricao?: string | null
          id?: string
          imagem_principal?: string | null
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      variantes: {
        Row: {
          ativo: boolean
          cor: string
          created_at: string
          custo_producao: number
          estoque: number
          id: string
          preco_venda: number
          produto_id: string
          sku: string
          tamanho: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cor: string
          created_at?: string
          custo_producao?: number
          estoque?: number
          id?: string
          preco_venda?: number
          produto_id: string
          sku: string
          tamanho: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cor?: string
          created_at?: string
          custo_producao?: number
          estoque?: number
          id?: string
          preco_venda?: number
          produto_id?: string
          sku?: string
          tamanho?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "variantes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
