export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'pdf' | 'excel' | 'bi';
  thumbnail_url: string;
  fields: TemplateField[];
  is_premium: boolean;
}

export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'file';
  required: boolean;
  options?: string[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export const supportedFileTypes = {
  pdf: {
    extensions: ['.pdf'],
    maxSize: 10 * 1024 * 1024, // 10MB
    mimeTypes: ['application/pdf']
  },
  excel: {
    extensions: ['.xlsx', '.xls'],
    maxSize: 5 * 1024 * 1024, // 5MB
    mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
  },
  bi: {
    platforms: ['powerbi', 'tableau', 'looker', 'metabase'],
    connectionTypes: ['direct', 'api', 'file']
  }
};

export const mockTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Financial Report',
    description: 'Standard template for financial reports with key metrics and analysis',
    type: 'pdf',
    thumbnail_url: 'https://example.com/templates/financial.png',
    is_premium: false,
    fields: [
      {
        id: 'title',
        name: 'Report Title',
        type: 'text',
        required: true,
        placeholder: 'Enter report title'
      },
      {
        id: 'period',
        name: 'Reporting Period',
        type: 'select',
        required: true,
        options: ['Q1', 'Q2', 'Q3', 'Q4', 'Annual']
      },
      {
        id: 'year',
        name: 'Year',
        type: 'number',
        required: true,
        validation: {
          min: 2000,
          max: new Date().getFullYear()
        }
      },
      {
        id: 'file',
        name: 'Financial Data',
        type: 'file',
        required: true
      }
    ]
  },
  {
    id: '2',
    name: 'Sales Dashboard',
    description: 'Interactive dashboard for sales performance analysis',
    type: 'bi',
    thumbnail_url: 'https://example.com/templates/sales.png',
    is_premium: true,
    fields: [
      {
        id: 'title',
        name: 'Dashboard Title',
        type: 'text',
        required: true,
        placeholder: 'Enter dashboard title'
      },
      {
        id: 'platform',
        name: 'BI Platform',
        type: 'select',
        required: true,
        options: supportedFileTypes.bi.platforms
      },
      {
        id: 'connection',
        name: 'Connection Type',
        type: 'select',
        required: true,
        options: supportedFileTypes.bi.connectionTypes
      },
      {
        id: 'metrics',
        name: 'Key Metrics',
        type: 'multiselect',
        required: true,
        options: ['Revenue', 'Units Sold', 'Average Order Value', 'Customer Acquisition Cost', 'Conversion Rate']
      }
    ]
  },
  {
    id: '3',
    name: 'Marketing Analytics',
    description: 'Comprehensive marketing performance report with campaign analysis',
    type: 'excel',
    thumbnail_url: 'https://example.com/templates/marketing.png',
    is_premium: false,
    fields: [
      {
        id: 'title',
        name: 'Report Title',
        type: 'text',
        required: true,
        placeholder: 'Enter report title'
      },
      {
        id: 'campaigns',
        name: 'Campaigns',
        type: 'multiselect',
        required: true,
        options: ['Social Media', 'Email', 'PPC', 'Content Marketing', 'SEO']
      },
      {
        id: 'date_range',
        name: 'Date Range',
        type: 'date',
        required: true
      },
      {
        id: 'file',
        name: 'Marketing Data',
        type: 'file',
        required: true
      }
    ]
  }
];

export const getTemplateById = (id: string): ReportTemplate | undefined => {
  return mockTemplates.find(template => template.id === id);
};

export const getTemplatesByType = (type: ReportTemplate['type']): ReportTemplate[] => {
  return mockTemplates.filter(template => template.type === type);
};

export const getPremiumTemplates = (): ReportTemplate[] => {
  return mockTemplates.filter(template => template.is_premium);
}; 