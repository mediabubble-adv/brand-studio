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
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          industry: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          industry?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          industry?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      brand_profiles: {
        Row: {
          id: string
          brand_id: string
          primary_color: string | null
          secondary_color: string | null
          accent_color: string | null
          bg_color: string | null
          font_header: string | null
          font_body: string | null
          font_accent: string | null
          languages: string[]
          dialects: string[]
          tone_keywords: string[]
          grid_strategy: 'row-theme' | 'alternating' | 'checkerboard' | 'color-block' | null
          post_cadence: Json
          instagram_handle: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          primary_color?: string | null
          secondary_color?: string | null
          accent_color?: string | null
          bg_color?: string | null
          font_header?: string | null
          font_body?: string | null
          font_accent?: string | null
          languages?: string[]
          dialects?: string[]
          tone_keywords?: string[]
          grid_strategy?: 'row-theme' | 'alternating' | 'checkerboard' | 'color-block' | null
          post_cadence?: Json
          instagram_handle?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          primary_color?: string | null
          secondary_color?: string | null
          accent_color?: string | null
          bg_color?: string | null
          font_header?: string | null
          font_body?: string | null
          font_accent?: string | null
          languages?: string[]
          dialects?: string[]
          tone_keywords?: string[]
          grid_strategy?: 'row-theme' | 'alternating' | 'checkerboard' | 'color-block' | null
          post_cadence?: Json
          instagram_handle?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      brand_assets: {
        Row: {
          id: string
          brand_id: string
          name: string
          type: 'logo' | 'logo_white' | 'logo_dark' | 'frame' | 'watermark' | 'pattern' | 'background'
          url: string
          format: string | null
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          name: string
          type: 'logo' | 'logo_white' | 'logo_dark' | 'frame' | 'watermark' | 'pattern' | 'background'
          url: string
          format?: string | null
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          name?: string
          type?: 'logo' | 'logo_white' | 'logo_dark' | 'frame' | 'watermark' | 'pattern' | 'background'
          url?: string
          format?: string | null
          is_primary?: boolean
          created_at?: string
        }
      }
      client_domains: {
        Row: {
          id: string
          brand_id: string
          domain: string
          created_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          domain: string
          created_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          domain?: string
          created_at?: string
        }
      }
      brand_memberships: {
        Row: {
          id: string
          user_id: string
          brand_id: string
          role: 'mb_owner' | 'mb_pm' | 'mb_designer' | 'mb_copywriter' | 'client_admin' | 'client_approver' | 'client_member'
          invited_by: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          user_id: string
          brand_id: string
          role: 'mb_owner' | 'mb_pm' | 'mb_designer' | 'mb_copywriter' | 'client_admin' | 'client_approver' | 'client_member'
          invited_by?: string | null
          joined_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          brand_id?: string
          role?: 'mb_owner' | 'mb_pm' | 'mb_designer' | 'mb_copywriter' | 'client_admin' | 'client_approver' | 'client_member'
          invited_by?: string | null
          joined_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          brand_id: string
          caption_ar: string | null
          caption_en: string | null
          hashtags_ar: string[]
          hashtags_en: string[]
          hooks_ar: string[]
          hooks_en: string[]
          image_prompt: string | null
          raw_image_url: string | null
          final_image_url: string | null
          grid_slot: number | null
          canvas_config: Json
          format: string
          status: 'draft' | 'composing' | 'approved' | 'scheduled' | 'published'
          publish_at: string | null
          assigned_to: string | null
          created_at: string
          approved_at: string | null
          published_at: string | null
        }
        Insert: {
          id?: string
          brand_id: string
          caption_ar?: string | null
          caption_en?: string | null
          hashtags_ar?: string[]
          hashtags_en?: string[]
          hooks_ar?: string[]
          hooks_en?: string[]
          image_prompt?: string | null
          raw_image_url?: string | null
          final_image_url?: string | null
          grid_slot?: number | null
          canvas_config?: Json
          format?: string
          status?: 'draft' | 'composing' | 'approved' | 'scheduled' | 'published'
          publish_at?: string | null
          assigned_to?: string | null
          created_at?: string
          approved_at?: string | null
          published_at?: string | null
        }
        Update: {
          id?: string
          brand_id?: string
          caption_ar?: string | null
          caption_en?: string | null
          hashtags_ar?: string[]
          hashtags_en?: string[]
          hooks_ar?: string[]
          hooks_en?: string[]
          image_prompt?: string | null
          raw_image_url?: string | null
          final_image_url?: string | null
          grid_slot?: number | null
          canvas_config?: Json
          format?: string
          status?: 'draft' | 'composing' | 'approved' | 'scheduled' | 'published'
          publish_at?: string | null
          assigned_to?: string | null
          created_at?: string
          approved_at?: string | null
          published_at?: string | null
        }
      }
      grid_plans: {
        Row: {
          id: string
          brand_id: string
          name: string
          theme: string | null
          slots: string[]
          created_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          name: string
          theme?: string | null
          slots?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          name?: string
          theme?: string | null
          slots?: string[]
          created_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          brand_id: string
          name: string
          goal: string | null
          start_date: string | null
          end_date: string | null
          status: 'active' | 'paused' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          name: string
          goal?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: 'active' | 'paused' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          name?: string
          goal?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: 'active' | 'paused' | 'completed'
          created_at?: string
        }
      }
      briefs: {
        Row: {
          id: string
          campaign_id: string
          brand_id: string
          scheduled_date: string | null
          channel: 'instagram_feed' | 'instagram_story' | 'instagram_reel' | 'facebook_post' | 'facebook_story' | 'meta_ad' | 'google_display' | 'tiktok' | 'linkedin'
          type: 'announcement' | 'offer' | 'event' | 'product_launch' | 'engagement_question' | 'testimonial' | 'educational' | null
          topic: string | null
          tone_tags: string[]
          caption_ar: string | null
          caption_en: string | null
          hooks_ar: string[]
          hooks_en: string[]
          image_prompt: string | null
          format: string | null
          assigned_to: string | null
          post_id: string | null
          status: 'brief_draft' | 'brief_reviewed' | 'assets_generating' | 'assets_ready' | 'composing' | 'design_approved' | 'scheduled' | 'published'
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          brand_id: string
          scheduled_date?: string | null
          channel: 'instagram_feed' | 'instagram_story' | 'instagram_reel' | 'facebook_post' | 'facebook_story' | 'meta_ad' | 'google_display' | 'tiktok' | 'linkedin'
          type?: 'announcement' | 'offer' | 'event' | 'product_launch' | 'engagement_question' | 'testimonial' | 'educational' | null
          topic?: string | null
          tone_tags?: string[]
          caption_ar?: string | null
          caption_en?: string | null
          hooks_ar?: string[]
          hooks_en?: string[]
          image_prompt?: string | null
          format?: string | null
          assigned_to?: string | null
          post_id?: string | null
          status?: 'brief_draft' | 'brief_reviewed' | 'assets_generating' | 'assets_ready' | 'composing' | 'design_approved' | 'scheduled' | 'published'
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          brand_id?: string
          scheduled_date?: string | null
          channel?: 'instagram_feed' | 'instagram_story' | 'instagram_reel' | 'facebook_post' | 'facebook_story' | 'meta_ad' | 'google_display' | 'tiktok' | 'linkedin'
          type?: 'announcement' | 'offer' | 'event' | 'product_launch' | 'engagement_question' | 'testimonial' | 'educational' | null
          topic?: string | null
          tone_tags?: string[]
          caption_ar?: string | null
          caption_en?: string | null
          hooks_ar?: string[]
          hooks_en?: string[]
          image_prompt?: string | null
          format?: string | null
          assigned_to?: string | null
          post_id?: string | null
          status?: 'brief_draft' | 'brief_reviewed' | 'assets_generating' | 'assets_ready' | 'composing' | 'design_approved' | 'scheduled' | 'published'
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          brand_id: string
          month: number
          year: number
          metrics_snapshot: Json
          pm_notes: string | null
          status: 'generating' | 'ready' | 'approved' | 'sent'
          approved_by: string | null
          approved_at: string | null
          sent_at: string | null
          client_email: string | null
          report_pdf_url: string | null
          shareable_token: string | null
          created_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          month: number
          year: number
          metrics_snapshot?: Json
          pm_notes?: string | null
          status?: 'generating' | 'ready' | 'approved' | 'sent'
          approved_by?: string | null
          approved_at?: string | null
          sent_at?: string | null
          client_email?: string | null
          report_pdf_url?: string | null
          shareable_token?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          month?: number
          year?: number
          metrics_snapshot?: Json
          pm_notes?: string | null
          status?: 'generating' | 'ready' | 'approved' | 'sent'
          approved_by?: string | null
          approved_at?: string | null
          sent_at?: string | null
          client_email?: string | null
          report_pdf_url?: string | null
          shareable_token?: string | null
          created_at?: string
        }
      }
    }
  }
}
