// Types para o sistema de análise de IA e métricas

export interface AdsConnection {
  id: string;
  user_id: string;
  platform: 'meta' | 'tiktok' | 'google' | 'linkedin';
  account_name: string;
  credentials: {
    // Meta Ads
    accessToken?: string;
    adAccountId?: string;
    appId?: string;
    appSecret?: string;
    // TikTok Ads
    advertiser_id?: string;
    access_token?: string;
    // Google Ads
    client_id?: string;
    client_secret?: string;
    refresh_token?: string;
    developer_token?: string;
    customer_id?: string;
    // LinkedIn Ads
    client_id_linkedin?: string;
    client_secret_linkedin?: string;
    access_token_linkedin?: string;
  };
  is_active: boolean;
  last_sync: string | null;
  created_at: string;
  updated_at: string;
}

export interface FunnelAnalysis {
  id: string;
  user_id: string;
  funnel_url: string;
  funnel_name: string;
  analysis_data: {
    score: number; // 0-100
    priority_level: 'low' | 'medium' | 'high' | 'critical';
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    conversion_potential: number;
    traffic_quality_score: number;
    design_score: number;
    copy_score: number;
    technical_score: number;
  };
  gemini_response: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface BusinessDiagnosis {
  id: string;
  user_id: string;
  ads_connection_id: string;
  analysis_period: string; // '7d', '30d', '90d'
  diagnosis_data: {
    overall_score: number; // 0-100
    performance_grade: 'A' | 'B' | 'C' | 'D' | 'F';
    key_metrics: {
      cpm: number;
      cpc: number;
      ctr: number;
      conversion_rate: number;
      roas: number;
      cost_per_conversion: number;
    };
    insights: {
      category: 'targeting' | 'creative' | 'budget' | 'timing' | 'landing_page';
      title: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
      action_required: boolean;
    }[];
    recommendations: {
      priority: 'urgent' | 'high' | 'medium' | 'low';
      category: string;
      title: string;
      description: string;
      expected_impact: string;
      implementation_difficulty: 'easy' | 'medium' | 'hard';
    }[];
  };
  gemini_response: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface LeadScore {
  id: string;
  user_id: string;
  lead_email: string;
  lead_name?: string;
  lead_phone?: string;
  funnel_url?: string;
  score_data: {
    overall_score: number; // 0-100
    priority_level: 'low' | 'medium' | 'high' | 'critical';
    engagement_score: number;
    intent_score: number;
    fit_score: number;
    timing_score: number;
    factors: {
      factor: string;
      weight: number;
      score: number;
      reasoning: string;
    }[];
    next_actions: string[];
    follow_up_priority: number; // 1-5
  };
  gemini_response: string;
  created_at: string;
  updated_at: string;
}

// Tipos para formulários
export interface CreateAdsConnectionData {
  platform: 'meta' | 'tiktok' | 'google' | 'linkedin';
  account_name: string;
  credentials: AdsConnection['credentials'];
}

export interface AnalyzeFunnelRequest {
  funnel_url: string;
  funnel_name: string;
}

export interface GenerateBusinessDiagnosisRequest {
  ads_connection_id: string;
  analysis_period: '7d' | '30d' | '90d';
}

export interface ScoreLeadRequest {
  lead_email: string;
  lead_name?: string;
  lead_phone?: string;
  funnel_url?: string;
  additional_context?: string;
}

// Constantes
export const ADS_PLATFORMS = {
  meta: {
    name: 'Meta Ads (Facebook/Instagram)',
    icon: '📘',
    fields: ['accessToken', 'adAccountId', 'appId', 'appSecret']
  },
  tiktok: {
    name: 'TikTok Ads',
    icon: '🎵',
    fields: ['advertiser_id', 'access_token']
  },
  google: {
    name: 'Google Ads',
    icon: '🔍',
    fields: ['client_id', 'client_secret', 'refresh_token', 'developer_token', 'customer_id']
  },
  linkedin: {
    name: 'LinkedIn Ads',
    icon: '💼',
    fields: ['client_id_linkedin', 'client_secret_linkedin', 'access_token_linkedin']
  }
} as const;

export const ANALYSIS_PERIODS = {
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
  '90d': 'Últimos 90 dias'
} as const;

export const PRIORITY_LEVELS = {
  low: { label: 'Baixa', color: 'bg-green-100 text-green-800', icon: '🟢' },
  medium: { label: 'Média', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
  high: { label: 'Alta', color: 'bg-orange-100 text-orange-800', icon: '🟠' },
  critical: { label: 'Crítica', color: 'bg-red-100 text-red-800', icon: '🔴' }
} as const;

export const PERFORMANCE_GRADES = {
  A: { label: 'Excelente', color: 'bg-green-100 text-green-800', description: 'Performance excepcional' },
  B: { label: 'Bom', color: 'bg-blue-100 text-blue-800', description: 'Performance acima da média' },
  C: { label: 'Regular', color: 'bg-yellow-100 text-yellow-800', description: 'Performance na média' },
  D: { label: 'Ruim', color: 'bg-orange-100 text-orange-800', description: 'Performance abaixo da média' },
  F: { label: 'Crítico', color: 'bg-red-100 text-red-800', description: 'Performance muito baixa' }
} as const;