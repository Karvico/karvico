// Serviço para integração com Gemini API para análise de negócios
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  private async makeRequest(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Erro na requisição para Gemini API:', error);
      throw error;
    }
  }

  async analyzeFunnel(funnelUrl: string, funnelName: string): Promise<{
    score: number;
    priority_level: 'low' | 'medium' | 'high' | 'critical';
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    conversion_potential: number;
    traffic_quality_score: number;
    design_score: number;
    copy_score: number;
    technical_score: number;
    rawResponse: string;
  }> {
    const prompt = `
Analise o funil de vendas "${funnelName}" na URL: ${funnelUrl}

Como especialista em conversão e marketing digital, forneça uma análise detalhada seguindo EXATAMENTE este formato JSON:

{
  "score": [número de 0-100],
  "priority_level": "[low/medium/high/critical]",
  "strengths": ["força 1", "força 2", "força 3"],
  "weaknesses": ["fraqueza 1", "fraqueza 2", "fraqueza 3"],
  "recommendations": ["recomendação 1", "recomendação 2", "recomendação 3"],
  "conversion_potential": [número de 0-100],
  "traffic_quality_score": [número de 0-100],
  "design_score": [número de 0-100],
  "copy_score": [número de 0-100],
  "technical_score": [número de 0-100]
}

Critérios de análise:
- Score geral: baseado na probabilidade de conversão
- Priority level: critical (0-25), high (26-50), medium (51-75), low (76-100)
- Strengths: pontos fortes identificados
- Weaknesses: pontos fracos que prejudicam conversão
- Recommendations: ações específicas para melhorar
- Conversion potential: potencial de conversão baseado no design/copy
- Traffic quality score: qualidade esperada do tráfego
- Design score: qualidade visual e UX
- Copy score: qualidade do texto e persuasão
- Technical score: aspectos técnicos (velocidade, mobile, etc.)

Responda APENAS com o JSON válido, sem texto adicional.
`;

    try {
      const response = await this.makeRequest(prompt);
      
      // Tentar extrair JSON da resposta
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Resposta da IA não contém JSON válido');
      }

      const analysisData = JSON.parse(jsonMatch[0]);
      
      return {
        ...analysisData,
        rawResponse: response
      };
    } catch (error) {
      console.error('Erro ao analisar funil:', error);
      throw error;
    }
  }

  async generateBusinessDiagnosis(adsData: any, period: string): Promise<{
    overall_score: number;
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
    rawResponse: string;
  }> {
    const prompt = `
Analise os dados de anúncios dos últimos ${period} e forneça um diagnóstico completo do negócio.

Dados dos anúncios:
${JSON.stringify(adsData, null, 2)}

Como especialista em performance de anúncios, forneça uma análise seguindo EXATAMENTE este formato JSON:

{
  "overall_score": [número de 0-100],
  "performance_grade": "[A/B/C/D/F]",
  "key_metrics": {
    "cpm": [número],
    "cpc": [número],
    "ctr": [número],
    "conversion_rate": [número],
    "roas": [número],
    "cost_per_conversion": [número]
  },
  "insights": [
    {
      "category": "[targeting/creative/budget/timing/landing_page]",
      "title": "Título do insight",
      "description": "Descrição detalhada",
      "impact": "[high/medium/low]",
      "action_required": [true/false]
    }
  ],
  "recommendations": [
    {
      "priority": "[urgent/high/medium/low]",
      "category": "Categoria",
      "title": "Título da recomendação",
      "description": "Descrição detalhada",
      "expected_impact": "Impacto esperado",
      "implementation_difficulty": "[easy/medium/hard]"
    }
  ]
}

Critérios:
- Overall score: performance geral (0-100)
- Performance grade: A (90-100), B (80-89), C (70-79), D (60-69), F (0-59)
- Key metrics: métricas principais calculadas
- Insights: descobertas importantes sobre a performance
- Recommendations: ações prioritárias para melhorar

Responda APENAS com o JSON válido, sem texto adicional.
`;

    try {
      const response = await this.makeRequest(prompt);
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Resposta da IA não contém JSON válido');
      }

      const diagnosisData = JSON.parse(jsonMatch[0]);
      
      return {
        ...diagnosisData,
        rawResponse: response
      };
    } catch (error) {
      console.error('Erro ao gerar diagnóstico:', error);
      throw error;
    }
  }

  async scoreLeadPriority(leadData: {
    email: string;
    name?: string;
    phone?: string;
    funnelUrl?: string;
    additionalContext?: string;
  }): Promise<{
    overall_score: number;
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
    follow_up_priority: number;
    rawResponse: string;
  }> {
    const prompt = `
Analise este lead e forneça um score de prioridade para vendas:

Dados do Lead:
- Email: ${leadData.email}
- Nome: ${leadData.name || 'Não informado'}
- Telefone: ${leadData.phone || 'Não informado'}
- Funil de origem: ${leadData.funnelUrl || 'Não informado'}
- Contexto adicional: ${leadData.additionalContext || 'Nenhum'}

Como especialista em qualificação de leads, forneça uma análise seguindo EXATAMENTE este formato JSON:

{
  "overall_score": [número de 0-100],
  "priority_level": "[low/medium/high/critical]",
  "engagement_score": [número de 0-100],
  "intent_score": [número de 0-100],
  "fit_score": [número de 0-100],
  "timing_score": [número de 0-100],
  "factors": [
    {
      "factor": "Nome do fator",
      "weight": [número de 0-1],
      "score": [número de 0-100],
      "reasoning": "Explicação do score"
    }
  ],
  "next_actions": ["ação 1", "ação 2", "ação 3"],
  "follow_up_priority": [número de 1-5]
}

Critérios:
- Overall score: score geral de prioridade (0-100)
- Priority level: critical (90-100), high (70-89), medium (40-69), low (0-39)
- Engagement score: nível de engajamento demonstrado
- Intent score: intenção de compra identificada
- Fit score: adequação ao perfil de cliente ideal
- Timing score: momento ideal para abordagem
- Factors: fatores que influenciaram o score
- Next actions: próximas ações recomendadas
- Follow up priority: prioridade de follow-up (1=baixa, 5=urgente)

Responda APENAS com o JSON válido, sem texto adicional.
`;

    try {
      const response = await this.makeRequest(prompt);
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Resposta da IA não contém JSON válido');
      }

      const scoreData = JSON.parse(jsonMatch[0]);
      
      return {
        ...scoreData,
        rawResponse: response
      };
    } catch (error) {
      console.error('Erro ao pontuar lead:', error);
      throw error;
    }
  }
}

export default GeminiService;