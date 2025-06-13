export interface Insight {
  id: string;
  report_id: string;
  type: 'summary' | 'key_points' | 'recommendations' | 'trends' | 'anomalies';
  content: string | string[];
  confidence_score: number;
  created_at: string;
  metadata: {
    model: string;
    generated_at: string;
    processing_time?: number;
  };
}

export const mockInsights: Record<string, Insight[]> = {
  '1': [
    {
      id: '1-1',
      report_id: '1',
      type: 'summary',
      content: 'The Q4 2023 financial report shows strong revenue growth of 15% YoY, driven by increased market share in key segments. Operating margins improved to 22%, while R&D investments increased by 25% to support future growth initiatives.',
      confidence_score: 0.95,
      created_at: '2024-02-15T10:30:00Z',
      metadata: {
        model: 'gpt-4',
        generated_at: '2024-02-15T10:30:00Z',
        processing_time: 2.5
      }
    },
    {
      id: '1-2',
      report_id: '1',
      type: 'key_points',
      content: [
        'Revenue growth of 15% YoY exceeds market expectations',
        'Operating margin improved to 22% from 18% last quarter',
        'R&D investment increased by 25% to $50M',
        'New product line contributed 30% to total revenue',
        'Customer acquisition cost decreased by 12%'
      ],
      confidence_score: 0.92,
      created_at: '2024-02-15T10:30:00Z',
      metadata: {
        model: 'gpt-4',
        generated_at: '2024-02-15T10:30:00Z',
        processing_time: 1.8
      }
    },
    {
      id: '1-3',
      report_id: '1',
      type: 'recommendations',
      content: [
        'Increase investment in the successful new product line',
        'Optimize marketing spend based on lower CAC',
        'Maintain R&D investment levels to sustain innovation',
        'Explore expansion opportunities in emerging markets',
        'Consider strategic acquisitions in complementary sectors'
      ],
      confidence_score: 0.88,
      created_at: '2024-02-15T10:30:00Z',
      metadata: {
        model: 'gpt-4',
        generated_at: '2024-02-15T10:30:00Z',
        processing_time: 2.1
      }
    },
    {
      id: '1-4',
      report_id: '1',
      type: 'trends',
      content: [
        'Accelerating growth in cloud services segment',
        'Increasing adoption of AI-powered solutions',
        'Shift towards subscription-based revenue models',
        'Growing demand in emerging markets',
        'Rising importance of sustainability metrics'
      ],
      confidence_score: 0.90,
      created_at: '2024-02-15T10:30:00Z',
      metadata: {
        model: 'gpt-4',
        generated_at: '2024-02-15T10:30:00Z',
        processing_time: 1.9
      }
    },
    {
      id: '1-5',
      report_id: '1',
      type: 'anomalies',
      content: [
        'Unusual spike in R&D expenses in December',
        'Higher than expected customer churn in enterprise segment',
        'Supply chain delays affecting product delivery times',
        'Variance in regional performance metrics'
      ],
      confidence_score: 0.85,
      created_at: '2024-02-15T10:30:00Z',
      metadata: {
        model: 'gpt-4',
        generated_at: '2024-02-15T10:30:00Z',
        processing_time: 2.3
      }
    }
  ],
  '2': [
    {
      id: '2-1',
      report_id: '2',
      type: 'summary',
      content: 'The Sales Dashboard reveals strong performance across all regions, with a 20% increase in total sales. The EMEA region shows exceptional growth at 35%, while North America maintains steady growth at 15%. Product category A continues to be the top performer.',
      confidence_score: 0.93,
      created_at: '2024-02-14T15:00:00Z',
      metadata: {
        model: 'gpt-4',
        generated_at: '2024-02-14T15:00:00Z',
        processing_time: 2.2
      }
    },
    {
      id: '2-2',
      report_id: '2',
      type: 'key_points',
      content: [
        'Total sales increased by 20% YoY',
        'EMEA region growth at 35% leads all regions',
        'Product category A sales up 25%',
        'New customer acquisition increased by 40%',
        'Average deal size grew by 15%'
      ],
      confidence_score: 0.91,
      created_at: '2024-02-14T15:00:00Z',
      metadata: {
        model: 'gpt-4',
        generated_at: '2024-02-14T15:00:00Z',
        processing_time: 1.7
      }
    }
  ]
};

export const getInsightsByReportId = (reportId: string): Insight[] => {
  return mockInsights[reportId] || [];
};

export const getInsightById = (reportId: string, insightId: string): Insight | undefined => {
  return mockInsights[reportId]?.find(insight => insight.id === insightId);
};

export const getInsightsByType = (reportId: string, type: Insight['type']): Insight[] => {
  return mockInsights[reportId]?.filter(insight => insight.type === type) || [];
}; 