export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          company_headquarters: string | null
          created_at: string | null
          id: string
          market_segment_focus: string[] | null
          operating_countries: string | null
          services: string[] | null
          technologies_used: string[] | null
          type_of_business: string[] | null
          user_id: string | null
          years_in_business: number | null
        }
        Insert: {
          company_headquarters?: string | null
          created_at?: string | null
          id?: string
          market_segment_focus?: string[] | null
          operating_countries?: string | null
          services?: string[] | null
          technologies_used?: string[] | null
          type_of_business?: string[] | null
          user_id?: string | null
          years_in_business?: number | null
        }
        Update: {
          company_headquarters?: string | null
          created_at?: string | null
          id?: string
          market_segment_focus?: string[] | null
          operating_countries?: string | null
          services?: string[] | null
          technologies_used?: string[] | null
          type_of_business?: string[] | null
          user_id?: string | null
          years_in_business?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
