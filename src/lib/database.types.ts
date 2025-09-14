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
      bookings: {
        Row: {
          id: string
          package_id: string
          user_id: string
          travel_agent_id: string | null
          status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED'
          travelers: Json
          pricing: Json
          dates: Json
          special_requests: string[]
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          package_id: string
          user_id: string
          travel_agent_id?: string | null
          status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED'
          travelers?: Json
          pricing?: Json
          dates?: Json
          special_requests?: string[]
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          user_id?: string
          travel_agent_id?: string | null
          status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED'
          travelers?: Json
          pricing?: Json
          dates?: Json
          special_requests?: string[]
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_travel_agent_id_fkey"
            columns: ["travel_agent_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      destinations: {
        Row: {
          id: string
          name: string
          country: string
          city: string
          coordinates: Json
          highlights: string[]
          best_time_to_visit: string[]
          weather: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          country: string
          city: string
          coordinates?: Json
          highlights?: string[]
          best_time_to_visit?: string[]
          weather?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          country?: string
          city?: string
          coordinates?: Json
          highlights?: string[]
          best_time_to_visit?: string[]
          weather?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      package_images: {
        Row: {
          id: string
          package_id: string
          url: string
          alt: string
          caption: string | null
          is_primary: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          package_id: string
          url: string
          alt: string
          caption?: string | null
          is_primary?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          url?: string
          alt?: string
          caption?: string | null
          is_primary?: boolean
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_images_package_id_fkey"
            columns: ["package_id"]
            referencedRelation: "packages"
            referencedColumns: ["id"]
          }
        ]
      }
      packages: {
        Row: {
          id: string
          tour_operator_id: string
          title: string
          description: string
          type: 'ACTIVITY' | 'TRANSFERS' | 'LAND_PACKAGE' | 'CRUISE' | 'HOTEL' | 'FLIGHT' | 'COMBO' | 'CUSTOM'
          status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ARCHIVED'
          pricing: Json
          itinerary: Json
          inclusions: string[]
          exclusions: string[]
          terms_and_conditions: string[]
          cancellation_policy: Json
          images: string[]
          destinations: string[]
          duration: Json
          group_size: Json
          difficulty: 'EASY' | 'MODERATE' | 'CHALLENGING' | 'EXPERT'
          tags: string[]
          is_featured: boolean
          rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tour_operator_id: string
          title: string
          description: string
          type: 'ACTIVITY' | 'TRANSFERS' | 'LAND_PACKAGE' | 'CRUISE' | 'HOTEL' | 'FLIGHT' | 'COMBO' | 'CUSTOM'
          status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ARCHIVED'
          pricing?: Json
          itinerary?: Json
          inclusions?: string[]
          exclusions?: string[]
          terms_and_conditions?: string[]
          cancellation_policy?: Json
          images?: string[]
          destinations?: string[]
          duration?: Json
          group_size?: Json
          difficulty?: 'EASY' | 'MODERATE' | 'CHALLENGING' | 'EXPERT'
          tags?: string[]
          is_featured?: boolean
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tour_operator_id?: string
          title?: string
          description?: string
          type?: 'ACTIVITY' | 'TRANSFERS' | 'LAND_PACKAGE' | 'CRUISE' | 'HOTEL' | 'FLIGHT' | 'COMBO' | 'CUSTOM'
          status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ARCHIVED'
          pricing?: Json
          itinerary?: Json
          inclusions?: string[]
          exclusions?: string[]
          terms_and_conditions?: string[]
          cancellation_policy?: Json
          images?: string[]
          destinations?: string[]
          duration?: Json
          group_size?: Json
          difficulty?: 'EASY' | 'MODERATE' | 'CHALLENGING' | 'EXPERT'
          tags?: string[]
          is_featured?: boolean
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "packages_tour_operator_id_fkey"
            columns: ["tour_operator_id"]
            referencedRelation: "tour_operators"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          package_id: string
          user_id: string
          rating: number
          title: string
          comment: string
          pros: string[]
          cons: string[]
          images: string[]
          is_verified: boolean
          helpful: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          package_id: string
          user_id: string
          rating: number
          title: string
          comment: string
          pros?: string[]
          cons?: string[]
          images?: string[]
          is_verified?: boolean
          helpful?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          user_id?: string
          rating?: number
          title?: string
          comment?: string
          pros?: string[]
          cons?: string[]
          images?: string[]
          is_verified?: boolean
          helpful?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_package_id_fkey"
            columns: ["package_id"]
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tour_operators: {
        Row: {
          id: string
          user_id: string
          company_name: string
          company_details: Json
          commission_rates: Json
          licenses: Json
          certifications: Json
          is_verified: boolean
          rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          company_details?: Json
          commission_rates?: Json
          licenses?: Json
          certifications?: Json
          is_verified?: boolean
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          company_details?: Json
          commission_rates?: Json
          licenses?: Json
          certifications?: Json
          is_verified?: boolean
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_operators_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'SUPER_ADMIN' | 'ADMIN' | 'TOUR_OPERATOR' | 'TRAVEL_AGENT'
          profile: Json
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'SUPER_ADMIN' | 'ADMIN' | 'TOUR_OPERATOR' | 'TRAVEL_AGENT'
          profile?: Json
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'SUPER_ADMIN' | 'ADMIN' | 'TOUR_OPERATOR' | 'TRAVEL_AGENT'
          profile?: Json
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
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
