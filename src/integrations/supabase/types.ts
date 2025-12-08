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
