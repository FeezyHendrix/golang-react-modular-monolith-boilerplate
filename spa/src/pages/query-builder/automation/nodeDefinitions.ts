
import { NodeDefinition } from "./types";

export const nodeDefinitions: NodeDefinition[] = [
  // Triggers
  {
    type: 'file-upload',
    category: 'trigger',
    label: 'File Upload Trigger',
    description: 'Triggers when a file is uploaded to the system',
    icon: 'file-up',
    inputsCount: 0,
    outputsCount: 1,
    configFields: [
      {
        name: 'fileTypes',
        label: 'File Types',
        type: 'select',
        required: true,
        options: [
          { value: 'all', label: 'All Files' },
          { value: 'csv', label: 'CSV Files' },
          { value: 'excel', label: 'Excel Files' },
          { value: 'pdf', label: 'PDF Files' },
          { value: 'image', label: 'Image Files' },
        ],
        default: 'all',
        hint: 'Select which file types will trigger this workflow'
      }
    ],
    examples: [
      'Trigger when a new CSV file is uploaded to process sales data',
      'Begin workflow when user uploads images for processing'
    ]
  },
  {
    type: 'schedule',
    category: 'trigger',
    label: 'Schedule',
    description: 'Triggers at scheduled times using cron expressions',
    icon: 'clock',
    inputsCount: 0,
    outputsCount: 1,
    configFields: [
      {
        name: 'cronExpression',
        label: 'Cron Expression',
        type: 'text',
        required: true,
        default: '0 0 * * *',
        placeholder: '0 0 * * *',
        hint: 'Cron expression format: minute hour day month weekday'
      },
      {
        name: 'timezone',
        label: 'Timezone',
        type: 'select',
        required: true,
        default: 'UTC',
        options: [
          { value: 'UTC', label: 'UTC' },
          { value: 'America/New_York', label: 'Eastern Time (ET)' },
          { value: 'America/Chicago', label: 'Central Time (CT)' },
          { value: 'America/Denver', label: 'Mountain Time (MT)' },
          { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
        ],
        hint: 'Select the timezone for the schedule'
      }
    ],
    examples: [
      'Run daily report generation at midnight',
      'Check for database updates every hour'
    ]
  },
  {
    type: 'data-update',
    category: 'trigger',
    label: 'Data Update',
    description: 'Triggers when data is updated in a specified source',
    icon: 'database-zap',
    inputsCount: 0,
    outputsCount: 1,
    configFields: [
      {
        name: 'dataSource',
        label: 'Data Source',
        type: 'select',
        required: true,
        options: [
          { value: 'database', label: 'Database' },
          { value: 'canvas', label: 'Canvas Result' },
          { value: 'api', label: 'API Endpoint' },
        ],
        hint: 'Select which data source to monitor'
      },
      {
        name: 'resourceId',
        label: 'Resource ID',
        type: 'text',
        required: true,
        placeholder: 'Table name or resource identifier',
        hint: 'Specify the table, query result, or resource to monitor'
      }
    ],
    examples: [
      'Trigger when customer data is updated',
      'Start workflow when SQL query results change'
    ]
  },
  
  // Actions
  {
    type: 'email',
    category: 'action',
    label: 'Send Email',
    description: 'Sends an email notification',
    icon: 'mail',
    inputsCount: 1,
    outputsCount: 1,
    configFields: [
      {
        name: 'to',
        label: 'To',
        type: 'text',
        required: true,
        placeholder: 'recipient@example.com',
        validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        hint: 'Email address of the recipient'
      },
      {
        name: 'subject',
        label: 'Subject',
        type: 'text',
        required: true,
        placeholder: 'Email subject',
        hint: 'Subject line of the email'
      },
      {
        name: 'body',
        label: 'Body',
        type: 'textarea',
        required: true,
        placeholder: 'Email content...',
        hint: 'Content of the email, supports variables with {{variable}}'
      }
    ],
    examples: [
      'Send report results via email',
      'Notify team when data processing completes'
    ]
  },
  {
    type: 'notification',
    category: 'action',
    label: 'Send Notification',
    description: 'Sends notifications to Slack, Teams, or other platforms',
    icon: 'bell',
    inputsCount: 1,
    outputsCount: 1,
    configFields: [
      {
        name: 'platform',
        label: 'Platform',
        type: 'select',
        required: true,
        options: [
          { value: 'slack', label: 'Slack' },
          { value: 'teams', label: 'Microsoft Teams' },
          { value: 'webhook', label: 'Generic Webhook' },
        ],
        hint: 'Select notification platform'
      },
      {
        name: 'webhookUrl',
        label: 'Webhook URL',
        type: 'text',
        required: true,
        placeholder: 'https://hooks.slack.com/services/...',
        hint: 'Enter the webhook URL for your notification platform'
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        placeholder: 'Notification message',
        hint: 'Message content, supports variables with {{variable}}'
      }
    ],
    examples: [
      'Send alert to Slack channel when threshold is exceeded',
      'Notify Teams when workflow completes processing'
    ]
  },
  {
    type: 'database',
    category: 'action',
    label: 'Save to Database',
    description: 'Saves data to a database table',
    icon: 'database',
    inputsCount: 1,
    outputsCount: 1,
    configFields: [
      {
        name: 'connection',
        label: 'Database Connection',
        type: 'select',
        required: true,
        options: [
          { value: 'default', label: 'Default Database' },
          { value: 'custom', label: 'Custom Connection' },
        ],
        hint: 'Select database connection to use'
      },
      {
        name: 'table',
        label: 'Table Name',
        type: 'text',
        required: true,
        placeholder: 'users',
        hint: 'Name of the table to save data to'
      },
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        required: true,
        options: [
          { value: 'insert', label: 'Insert' },
          { value: 'update', label: 'Update' },
          { value: 'upsert', label: 'Upsert' },
        ],
        default: 'insert',
        hint: 'Choose the database operation'
      }
    ],
    examples: [
      'Save processed data to customers table',
      'Update inventory records after processing'
    ]
  },
  {
    type: 'export',
    category: 'action',
    label: 'Export Data',
    description: 'Exports data to various formats like CSV, Excel, or PDF',
    icon: 'file-down',
    inputsCount: 1,
    outputsCount: 1,
    configFields: [
      {
        name: 'format',
        label: 'Export Format',
        type: 'select',
        required: true,
        options: [
          { value: 'csv', label: 'CSV' },
          { value: 'excel', label: 'Excel' },
          { value: 'pdf', label: 'PDF' },
          { value: 'json', label: 'JSON' },
        ],
        default: 'csv',
        hint: 'Select export file format'
      },
      {
        name: 'filename',
        label: 'Filename',
        type: 'text',
        required: true,
        placeholder: 'export-{{date}}',
        hint: 'Filename for the exported file, supports variables like {{date}}'
      },
      {
        name: 'destination',
        label: 'Destination',
        type: 'select',
        required: true,
        options: [
          { value: 'download', label: 'Download' },
          { value: 'email', label: 'Email' },
          { value: 'storage', label: 'Cloud Storage' },
        ],
        default: 'download',
        hint: 'Where to send the exported file'
      }
    ],
    examples: [
      'Export query results to Excel',
      'Generate PDF report from processed data'
    ]
  },
  
  // More node definitions for other categories
  {
    type: 'filter',
    category: 'data',
    label: 'Filter Data',
    description: 'Filters rows based on conditions',
    icon: 'filter',
    inputsCount: 1,
    outputsCount: 1,
    configFields: [
      {
        name: 'conditions',
        label: 'Filter Conditions',
        type: 'textarea',
        required: true,
        placeholder: 'column > 100 AND status = "active"',
        hint: 'Enter filter conditions using SQL-like syntax'
      }
    ],
    examples: [
      'Filter customers by region',
      'Show only products with inventory below threshold'
    ]
  },
  {
    type: 'join',
    category: 'data',
    label: 'Join Data',
    description: 'Joins two data sources together',
    icon: 'join',
    inputsCount: 2,
    outputsCount: 1,
    configFields: [
      {
        name: 'joinType',
        label: 'Join Type',
        type: 'select',
        required: true,
        options: [
          { value: 'inner', label: 'Inner Join' },
          { value: 'left', label: 'Left Join' },
          { value: 'right', label: 'Right Join' },
          { value: 'full', label: 'Full Join' },
        ],
        default: 'inner',
        hint: 'Select type of join operation'
      },
      {
        name: 'leftKey',
        label: 'Left Key',
        type: 'text',
        required: true,
        placeholder: 'id',
        hint: 'Key column from left input'
      },
      {
        name: 'rightKey',
        label: 'Right Key',
        type: 'text',
        required: true,
        placeholder: 'user_id',
        hint: 'Key column from right input'
      }
    ],
    examples: [
      'Join customer and order data',
      'Combine product data with inventory status'
    ]
  },
  
  // AI Operators
  {
    type: 'analyze',
    category: 'ai',
    label: 'Analyze Text',
    description: 'Analyzes text data for sentiment, entities, or summaries',
    icon: 'search',
    inputsCount: 1,
    outputsCount: 1,
    configFields: [
      {
        name: 'analysisType',
        label: 'Analysis Type',
        type: 'select',
        required: true,
        options: [
          { value: 'sentiment', label: 'Sentiment Analysis' },
          { value: 'entities', label: 'Entity Extraction' },
          { value: 'summary', label: 'Text Summarization' },
          { value: 'keywords', label: 'Keyword Extraction' },
        ],
        default: 'sentiment',
        hint: 'Select type of text analysis to perform'
      },
      {
        name: 'textColumn',
        label: 'Text Column',
        type: 'text',
        required: true,
        placeholder: 'content',
        hint: 'Column containing text to analyze'
      }
    ],
    examples: [
      'Analyze customer feedback sentiment',
      'Generate summaries of long documents'
    ]
  },
  
  // Conditions
  {
    type: 'if',
    category: 'condition',
    label: 'If Condition',
    description: 'Branches workflow based on a condition',
    icon: 'code',
    inputsCount: 1,
    outputsCount: 2,
    configFields: [
      {
        name: 'condition',
        label: 'Condition',
        type: 'textarea',
        required: true,
        placeholder: 'value > 100 || status === "approved"',
        hint: 'JavaScript-like condition expression'
      }
    ],
    examples: [
      'Route high-value orders to priority processing',
      'Send alerts only when metrics exceed thresholds'
    ]
  },
  
  // Utilities
  {
    type: 'delay',
    category: 'utility',
    label: 'Delay',
    description: 'Pauses workflow execution for a specified time',
    icon: 'clock',
    inputsCount: 1,
    outputsCount: 1,
    configFields: [
      {
        name: 'duration',
        label: 'Duration',
        type: 'number',
        required: true,
        default: 5,
        min: 1,
        max: 1440,
        hint: 'Delay duration in minutes'
      },
      {
        name: 'unit',
        label: 'Time Unit',
        type: 'select',
        required: true,
        options: [
          { value: 'seconds', label: 'Seconds' },
          { value: 'minutes', label: 'Minutes' },
          { value: 'hours', label: 'Hours' },
        ],
        default: 'minutes',
        hint: 'Unit of time for delay duration'
      }
    ],
    examples: [
      'Wait 5 minutes before sending follow-up email',
      'Add delay between API requests to avoid rate limiting'
    ]
  },
];
