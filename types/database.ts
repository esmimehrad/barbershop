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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointment: {
        Row: {
          addons_snapshot: number
          amount_due: number
          client_id: string
          completed_at: string | null
          created_at: string
          credit_applied: number
          ends_at: string
          external_event_id: string | null
          id: string
          price_snapshot: number
          promotion_id: string | null
          service_id: string
          staff_id: string
          starts_at: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
        }
        Insert: {
          addons_snapshot?: number
          amount_due: number
          client_id: string
          completed_at?: string | null
          created_at?: string
          credit_applied?: number
          ends_at: string
          external_event_id?: string | null
          id?: string
          price_snapshot: number
          promotion_id?: string | null
          service_id: string
          staff_id: string
          starts_at: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Update: {
          addons_snapshot?: number
          amount_due?: number
          client_id?: string
          completed_at?: string | null
          created_at?: string
          credit_applied?: number
          ends_at?: string
          external_event_id?: string | null
          id?: string
          price_snapshot?: number
          promotion_id?: string | null
          service_id?: string
          staff_id?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_addon: {
        Row: {
          appointment_id: string
          id: string
          price_snapshot: number
          service_id: string
        }
        Insert: {
          appointment_id: string
          id?: string
          price_snapshot: number
          service_id: string
        }
        Update: {
          appointment_id?: string
          id?: string
          price_snapshot?: number
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_addon_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_addon_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
        ]
      }
      client: {
        Row: {
          birthday: string | null
          created_at: string
          credit_balance: number
          id: string
          name: string
          phone: string
          preferences: string | null
          preferred_channel: Database["public"]["Enums"]["preferred_channel"]
          referral_code: string
          referred_by_id: string | null
          rfm_segment_id: string | null
          updated_at: string
          user_id: string | null
          usual_provider_id: string | null
        }
        Insert: {
          birthday?: string | null
          created_at?: string
          credit_balance?: number
          id?: string
          name: string
          phone: string
          preferences?: string | null
          preferred_channel?: Database["public"]["Enums"]["preferred_channel"]
          referral_code: string
          referred_by_id?: string | null
          rfm_segment_id?: string | null
          updated_at?: string
          user_id?: string | null
          usual_provider_id?: string | null
        }
        Update: {
          birthday?: string | null
          created_at?: string
          credit_balance?: number
          id?: string
          name?: string
          phone?: string
          preferences?: string | null
          preferred_channel?: Database["public"]["Enums"]["preferred_channel"]
          referral_code?: string
          referred_by_id?: string | null
          rfm_segment_id?: string | null
          updated_at?: string
          user_id?: string | null
          usual_provider_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_referred_by_id_fkey"
            columns: ["referred_by_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_rfm_segment_id_fkey"
            columns: ["rfm_segment_id"]
            isOneToOne: false
            referencedRelation: "customer_segment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_usual_provider_id_fkey"
            columns: ["usual_provider_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_policy: {
        Row: {
          credit_expiry_days: number | null
          default_cashback_rate: number
          id: string
          redemption_cap_pct: number
          referral_fixed_amount: number
        }
        Insert: {
          credit_expiry_days?: number | null
          default_cashback_rate?: number
          id?: string
          redemption_cap_pct?: number
          referral_fixed_amount?: number
        }
        Update: {
          credit_expiry_days?: number | null
          default_cashback_rate?: number
          id?: string
          redemption_cap_pct?: number
          referral_fixed_amount?: number
        }
        Relationships: []
      }
      credit_transaction: {
        Row: {
          amount: number
          appointment_id: string | null
          client_id: string
          created_at: string
          expires_at: string | null
          id: string
          reason: Database["public"]["Enums"]["credit_reason"]
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          client_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          reason: Database["public"]["Enums"]["credit_reason"]
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          client_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          reason?: Database["public"]["Enums"]["credit_reason"]
        }
        Relationships: [
          {
            foreignKeyName: "credit_transaction_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_transaction_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_segment: {
        Row: {
          cashback_rate: number
          id: string
          name: string
          rank: number
        }
        Insert: {
          cashback_rate: number
          id?: string
          name: string
          rank: number
        }
        Update: {
          cashback_rate?: number
          id?: string
          name?: string
          rank?: number
        }
        Relationships: []
      }
      external_busy_block: {
        Row: {
          busy_end: string
          busy_start: string
          external_event_id: string | null
          id: string
          source: Database["public"]["Enums"]["busy_source"]
          staff_id: string
          synced_at: string
        }
        Insert: {
          busy_end: string
          busy_start: string
          external_event_id?: string | null
          id?: string
          source: Database["public"]["Enums"]["busy_source"]
          staff_id: string
          synced_at?: string
        }
        Update: {
          busy_end?: string
          busy_start?: string
          external_event_id?: string | null
          id?: string
          source?: Database["public"]["Enums"]["busy_source"]
          staff_id?: string
          synced_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_busy_block_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          appointment_id: string
          client_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number | null
        }
        Insert: {
          appointment_id: string
          client_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
        }
        Update: {
          appointment_id?: string
          client_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
        ]
      }
      holiday_closure: {
        Row: {
          date: string
          id: string
          reason: string | null
          staff_id: string | null
        }
        Insert: {
          date: string
          id?: string
          reason?: string | null
          staff_id?: string | null
        }
        Update: {
          date?: string
          id?: string
          reason?: string | null
          staff_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "holiday_closure_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      notification: {
        Row: {
          appointment_id: string | null
          channel: Database["public"]["Enums"]["notification_channel"]
          client_id: string
          id: string
          provider_message_id: string | null
          scheduled_for: string
          sent_at: string | null
          status: Database["public"]["Enums"]["notification_status"]
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          appointment_id?: string | null
          channel: Database["public"]["Enums"]["notification_channel"]
          client_id: string
          id?: string
          provider_message_id?: string | null
          scheduled_for: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          appointment_id?: string | null
          channel?: Database["public"]["Enums"]["notification_channel"]
          client_id?: string
          id?: string
          provider_message_id?: string | null
          scheduled_for?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notification_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
        ]
      }
      package_item: {
        Row: {
          child_service_id: string
          id: string
          package_id: string
        }
        Insert: {
          child_service_id: string
          id?: string
          package_id: string
        }
        Update: {
          child_service_id?: string
          id?: string
          package_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_item_child_service_id_fkey"
            columns: ["child_service_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_item_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion: {
        Row: {
          expires_at: string | null
          id: string
          is_active: boolean
          is_featured_on_landing: boolean
          name: string
          reward_amount: number | null
          reward_service_id: string | null
          reward_type: Database["public"]["Enums"]["reward_type"]
          trigger_service_id: string | null
          trigger_type: Database["public"]["Enums"]["promotion_trigger"]
        }
        Insert: {
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_featured_on_landing?: boolean
          name: string
          reward_amount?: number | null
          reward_service_id?: string | null
          reward_type: Database["public"]["Enums"]["reward_type"]
          trigger_service_id?: string | null
          trigger_type: Database["public"]["Enums"]["promotion_trigger"]
        }
        Update: {
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_featured_on_landing?: boolean
          name?: string
          reward_amount?: number | null
          reward_service_id?: string | null
          reward_type?: Database["public"]["Enums"]["reward_type"]
          trigger_service_id?: string | null
          trigger_type?: Database["public"]["Enums"]["promotion_trigger"]
        }
        Relationships: [
          {
            foreignKeyName: "promotion_reward_service_id_fkey"
            columns: ["reward_service_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_trigger_service_id_fkey"
            columns: ["trigger_service_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
        ]
      }
      promotion_grant: {
        Row: {
          client_id: string
          earned_appointment_id: string
          expires_at: string | null
          id: string
          promotion_id: string
          redeemed_appointment_id: string | null
          status: Database["public"]["Enums"]["promotion_grant_status"]
        }
        Insert: {
          client_id: string
          earned_appointment_id: string
          expires_at?: string | null
          id?: string
          promotion_id: string
          redeemed_appointment_id?: string | null
          status?: Database["public"]["Enums"]["promotion_grant_status"]
        }
        Update: {
          client_id?: string
          earned_appointment_id?: string
          expires_at?: string | null
          id?: string
          promotion_id?: string
          redeemed_appointment_id?: string | null
          status?: Database["public"]["Enums"]["promotion_grant_status"]
        }
        Relationships: [
          {
            foreignKeyName: "promotion_grant_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_grant_earned_appointment_id_fkey"
            columns: ["earned_appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_grant_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_grant_redeemed_appointment_id_fkey"
            columns: ["redeemed_appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment"
            referencedColumns: ["id"]
          },
        ]
      }
      referral: {
        Row: {
          credited_at: string | null
          id: string
          qualifying_appointment_id: string | null
          referred_id: string
          referrer_id: string
          status: Database["public"]["Enums"]["referral_status"]
        }
        Insert: {
          credited_at?: string | null
          id?: string
          qualifying_appointment_id?: string | null
          referred_id: string
          referrer_id: string
          status?: Database["public"]["Enums"]["referral_status"]
        }
        Update: {
          credited_at?: string | null
          id?: string
          qualifying_appointment_id?: string | null
          referred_id?: string
          referrer_id?: string
          status?: Database["public"]["Enums"]["referral_status"]
        }
        Relationships: [
          {
            foreignKeyName: "referral_qualifying_appointment_id_fkey"
            columns: ["qualifying_appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
        ]
      }
      service: {
        Row: {
          allowed_role: Database["public"]["Enums"]["staff_role"]
          cashback_rate: number | null
          created_at: string
          duration_minutes: number
          id: string
          is_active: boolean
          is_addon: boolean
          is_featured_on_landing: boolean
          is_package: boolean
          landing_display_order: number | null
          name: string
          price: number
          type: Database["public"]["Enums"]["service_type"]
          updated_at: string
        }
        Insert: {
          allowed_role: Database["public"]["Enums"]["staff_role"]
          cashback_rate?: number | null
          created_at?: string
          duration_minutes: number
          id?: string
          is_active?: boolean
          is_addon?: boolean
          is_featured_on_landing?: boolean
          is_package?: boolean
          landing_display_order?: number | null
          name: string
          price: number
          type: Database["public"]["Enums"]["service_type"]
          updated_at?: string
        }
        Update: {
          allowed_role?: Database["public"]["Enums"]["staff_role"]
          cashback_rate?: number | null
          created_at?: string
          duration_minutes?: number
          id?: string
          is_active?: boolean
          is_addon?: boolean
          is_featured_on_landing?: boolean
          is_package?: boolean
          landing_display_order?: number | null
          name?: string
          price?: number
          type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"]
          bio: string | null
          calendar_id: string | null
          calendar_provider:
            | Database["public"]["Enums"]["calendar_provider"]
            | null
          created_at: string
          first_name: string | null
          id: string
          is_active: boolean
          landing_display_order: number | null
          last_name: string | null
          name: string
          portrait_url: string | null
          role: Database["public"]["Enums"]["staff_role"]
          specialty: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"]
          bio?: string | null
          calendar_id?: string | null
          calendar_provider?:
            | Database["public"]["Enums"]["calendar_provider"]
            | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          landing_display_order?: number | null
          last_name?: string | null
          name: string
          portrait_url?: string | null
          role: Database["public"]["Enums"]["staff_role"]
          specialty?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"]
          bio?: string | null
          calendar_id?: string | null
          calendar_provider?:
            | Database["public"]["Enums"]["calendar_provider"]
            | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          landing_display_order?: number | null
          last_name?: string | null
          name?: string
          portrait_url?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          specialty?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      staff_availability: {
        Row: {
          day_of_week: number
          effective_from: string | null
          effective_to: string | null
          end_time: string
          id: string
          staff_id: string
          start_time: string
        }
        Insert: {
          day_of_week: number
          effective_from?: string | null
          effective_to?: string | null
          end_time: string
          id?: string
          staff_id: string
          start_time: string
        }
        Update: {
          day_of_week?: number
          effective_from?: string | null
          effective_to?: string | null
          end_time?: string
          id?: string
          staff_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_availability_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_calendar_token: {
        Row: {
          calendar_id: string
          created_at: string
          id: string
          provider: Database["public"]["Enums"]["calendar_provider"]
          refresh_token: string
          staff_id: string
          updated_at: string
        }
        Insert: {
          calendar_id: string
          created_at?: string
          id?: string
          provider: Database["public"]["Enums"]["calendar_provider"]
          refresh_token: string
          staff_id: string
          updated_at?: string
        }
        Update: {
          calendar_id?: string
          created_at?: string
          id?: string
          provider?: Database["public"]["Enums"]["calendar_provider"]
          refresh_token?: string
          staff_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_calendar_token_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_contact: {
        Row: {
          created_at: string
          email: string | null
          phone: string | null
          staff_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          phone?: string | null
          staff_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          phone?: string | null
          staff_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_contact_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: true
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_gallery_image: {
        Row: {
          alt_text: string
          created_at: string
          display_order: number
          id: string
          image_group: Database["public"]["Enums"]["gallery_group"]
          staff_id: string | null
          url: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          display_order?: number
          id?: string
          image_group: Database["public"]["Enums"]["gallery_group"]
          staff_id?: string | null
          url: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          display_order?: number
          id?: string
          image_group?: Database["public"]["Enums"]["gallery_group"]
          staff_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_gallery_image_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_service: {
        Row: {
          id: string
          service_id: string
          staff_id: string
        }
        Insert: {
          id?: string
          service_id: string
          staff_id: string
        }
        Update: {
          id?: string
          service_id?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_service_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_service_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_client_id: { Args: never; Returns: string }
      current_staff_access_level: {
        Args: never
        Returns: Database["public"]["Enums"]["access_level"]
      }
      current_staff_id: { Args: never; Returns: string }
    }
    Enums: {
      access_level: "owner" | "manager" | "staff"
      appointment_status:
        | "booked"
        | "completed"
        | "no_show"
        | "late_released"
        | "cancelled"
      busy_source: "google" | "microsoft"
      calendar_provider: "google" | "microsoft"
      credit_reason:
        | "referral"
        | "cashback"
        | "redemption"
        | "manual"
        | "expiry"
      gallery_group: "work" | "space"
      notification_channel: "sms" | "whatsapp"
      notification_status: "queued" | "sent" | "failed"
      notification_type:
        | "24h"
        | "1h"
        | "no_show_followup"
        | "birthday"
        | "feedback_request"
        | "promotion"
      preferred_channel: "sms" | "whatsapp"
      promotion_grant_status: "granted" | "redeemed" | "expired"
      promotion_trigger: "first_completed_service" | "nth_visit" | "manual"
      referral_status: "pending" | "credited" | "void"
      reward_type: "free_addon" | "fixed_credit" | "percent_off"
      service_type: "haircut" | "eyelash"
      staff_role: "barber" | "lash_specialist"
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
    Enums: {
      access_level: ["owner", "manager", "staff"],
      appointment_status: [
        "booked",
        "completed",
        "no_show",
        "late_released",
        "cancelled",
      ],
      busy_source: ["google", "microsoft"],
      calendar_provider: ["google", "microsoft"],
      credit_reason: ["referral", "cashback", "redemption", "manual", "expiry"],
      gallery_group: ["work", "space"],
      notification_channel: ["sms", "whatsapp"],
      notification_status: ["queued", "sent", "failed"],
      notification_type: [
        "24h",
        "1h",
        "no_show_followup",
        "birthday",
        "feedback_request",
        "promotion",
      ],
      preferred_channel: ["sms", "whatsapp"],
      promotion_grant_status: ["granted", "redeemed", "expired"],
      promotion_trigger: ["first_completed_service", "nth_visit", "manual"],
      referral_status: ["pending", "credited", "void"],
      reward_type: ["free_addon", "fixed_credit", "percent_off"],
      service_type: ["haircut", "eyelash"],
      staff_role: ["barber", "lash_specialist"],
    },
  },
} as const
