// API Service Layer for Rotunda AI Backend Integration

// Base URL for all API calls
// In development, requests are proxied through React dev server (see package.json "proxy")
// In production, set REACT_APP_API_URL environment variable
const BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'http://64.227.128.101:8000' : '');

// Default agent ID (can be made dynamic based on user session)
const DEFAULT_AGENT_ID = 'rotunda-frontend-agent';

/**
 * Generic API call handler with error handling
 */
async function apiCall(endpoint, options = {}) {
  try {
    console.log(`API Call [${endpoint}]:`, options.body ? JSON.parse(options.body) : 'GET');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Required for ngrok tunnels
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      // Handle both FastAPI (detail) and standard (message) error formats
      const errorMessage = data.detail || data.message || data.error || `API Error: ${response.status}`;
      console.error(`API Error [${endpoint}]:`, data);
      throw new Error(errorMessage);
    }

    console.log(`API Response [${endpoint}]:`, data);
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Health Check - Check if backend is running
 */
export async function healthCheck() {
  return apiCall('/health');
}

/**
 * Config Check - Verify API keys are configured
 */
export async function configCheck() {
  return apiCall('/config-check');
}

/**
 * Chat with AI Agent
 * Supports: Lead Enrichment, Sales Forecasting, Marketing Analysis, RAG, Stripe, Slack
 */
export async function chat(message, options = {}) {
  const {
    agentId = DEFAULT_AGENT_ID,
    stripeEnabled = false,
    slackEnabled = false,
    calEnabled = false,
    calUrl = null,
  } = options;

  return apiCall('/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      agentId,
      StripeEnabled: stripeEnabled,
      SlackEnabled: slackEnabled,
      CalEnabled: calEnabled,
      CalUrl: calUrl,
    }),
  });
}

/**
 * Lead Enrichment - Enrich lead data with company info, technographics, intent signals
 */
export async function enrichLead(leadData, agentId = DEFAULT_AGENT_ID) {
  return apiCall('/enrich-lead', {
    method: 'POST',
    body: JSON.stringify({
      lead_data: leadData,
      agentId,
    }),
  });
}

/**
 * Sales Forecasting - Get AI-powered sales predictions
 */
export async function salesForecast(query, historicalData = null, agentId = DEFAULT_AGENT_ID) {
  const payload = {
    query,
    agentId,
  };

  if (historicalData) {
    payload.historical_data = historicalData;
  }

  return apiCall('/sales-forecast', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Marketing Analysis - Analyze campaign performance
 */
export async function marketingAnalysis(query, campaignData = null, agentId = DEFAULT_AGENT_ID) {
  const payload = {
    query,
    agentId,
  };

  if (campaignData) {
    payload.campaign_data = campaignData;
  }

  return apiCall('/marketing-analysis', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Process File - Upload and process documents for RAG
 */
export async function processFile(url, filename, agentId = DEFAULT_AGENT_ID) {
  return apiCall('/process-file', {
    method: 'POST',
    body: JSON.stringify({
      url,
      filename,
      agentId,
    }),
  });
}

/**
 * Generate Email Schema - AI-powered email campaign generation
 * @deprecated Use generateHtmlEmail instead
 */
export async function generateEmailSchema(prompt) {
  return apiCall('/generate-email-schema', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
}

/**
 * Generate HTML Email - AI-powered HTML email generation
 * @param {string} emailContent - The email content/prompt describing what email to generate
 * @param {Object} customerInfo - Optional customer information
 * @param {string} agentId - Agent ID (defaults to DEFAULT_AGENT_ID)
 */
export async function generateHtmlEmail(emailContent, customerInfo = {}, agentId = DEFAULT_AGENT_ID) {
  return apiCall('/generate-html-email', {
    method: 'POST',
    body: JSON.stringify({
      email_content: emailContent,
      customer_info: customerInfo,
      agentId,
    }),
  });
}

/**
 * Resolve Email Complaint - AI-powered complaint response generation
 */
export async function resolveEmailComplaint(emailContent, customerInfo = {}, agentId = DEFAULT_AGENT_ID) {
  return apiCall('/resolve-email-complaint', {
    method: 'POST',
    body: JSON.stringify({
      email_content: emailContent,
      customer_info: customerInfo,
      agentId,
    }),
  });
}

/**
 * Retrieve Emails - Fetch emails from IMAP server or Gmail API
 * @param {Object} options - Email retrieval options
 * @param {string} options.email_address - Email address to retrieve emails from
 * @param {string} options.password - Email password or app password
 * @param {string} [options.imap_server='imap.gmail.com'] - IMAP server address
 * @param {number} [options.imap_port=993] - IMAP server port
 * @param {string} [options.folder='INBOX'] - Email folder to retrieve from
 * @param {number} [options.limit=10] - Maximum number of emails to retrieve
 * @param {boolean} [options.unread_only=true] - Only retrieve unread emails
 * @param {string} [options.agentId] - Agent ID (defaults to DEFAULT_AGENT_ID)
 * @param {boolean} [options.use_gmail_api=false] - Use Gmail API instead of IMAP
 * @param {string} [options.gmail_credentials_path] - Path to Gmail API credentials file
 * @param {string} [options.gmail_token_path] - Path to Gmail API token file
 */
export async function retrieveEmails(options = {}) {
  const {
    email_address,
    password,
    imap_server = 'imap.gmail.com',
    imap_port = 993,
    folder = 'INBOX',
    limit = 10,
    unread_only = true,
    agentId = DEFAULT_AGENT_ID,
    use_gmail_api = false,
    gmail_credentials_path,
    gmail_token_path,
  } = options;

  // Validate required fields
  if (!email_address) {
    throw new Error('email_address is required');
  }
  if (!password && !use_gmail_api) {
    throw new Error('password is required when not using Gmail API');
  }

  const payload = {
    email_address,
    imap_server,
    imap_port,
    folder,
    limit,
    unread_only,
    agentId,
    use_gmail_api,
  };

  // Only include password if not using Gmail API
  if (!use_gmail_api && password) {
    payload.password = password;
  }

  // Include Gmail API paths if provided
  if (gmail_credentials_path) {
    payload.gmail_credentials_path = gmail_credentials_path;
  }
  if (gmail_token_path) {
    payload.gmail_token_path = gmail_token_path;
  }

  return apiCall('/retrieve-emails', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Export all functions
const api = {
  healthCheck,
  configCheck,
  chat,
  enrichLead,
  salesForecast,
  marketingAnalysis,
  processFile,
  generateEmailSchema,
  generateHtmlEmail,
  resolveEmailComplaint,
  retrieveEmails,
  BASE_URL,
};

export default api;

