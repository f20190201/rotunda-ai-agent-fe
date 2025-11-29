// Mock API responses for email retrieval
// This file contains mock data for testing when the backend API is not ready

export const mockRetrieveEmailsResponse = {
  success: true,
  agentId: 'rotunda-frontend-agent',
  emails: [
    {
      id: 1,
      message_id: 'msg_001',
      from: 'john.smith@acmecorp.com',
      sender: 'John Smith <john.smith@acmecorp.com>',
      subject: 'Product not working as expected',
      body: 'I purchased your product last week and it has been malfunctioning since day one. The dashboard keeps crashing and I cannot access my data. This is extremely frustrating and I need a resolution immediately. Please refund my money or fix this issue.',
      snippet: 'I purchased your product last week and it has been malfunctioning...',
      timestamp: '2024-11-28T14:32:15Z',
      date: '2024-11-28 14:32:15',
      tone: '#Complaint',
      folder: 'INBOX',
      campaign: 'Q4 Enterprise'
    },
    {
      id: 2,
      message_id: 'msg_002',
      from: 'sarah.johnson@techstart.io',
      sender: 'Sarah Johnson <sarah.johnson@techstart.io>',
      subject: 'Thank you for the excellent service!',
      body: 'I wanted to reach out and express my gratitude for the outstanding customer support I received yesterday. Your team was incredibly helpful and resolved my issue within minutes. I am very impressed with the quality of service.',
      snippet: 'I wanted to reach out and express my gratitude for the outstanding...',
      timestamp: '2024-11-28T14:28:42Z',
      date: '2024-11-28 14:28:42',
      tone: '#Appreciation',
      folder: 'INBOX',
      campaign: 'SaaS Decision Makers'
    },
    {
      id: 3,
      message_id: 'msg_003',
      from: 'mike.chen@startup.com',
      sender: 'Mike Chen <mike.chen@startup.com>',
      subject: 'Feature request for dashboard',
      body: 'I have been using your platform for a few months now and would like to suggest adding a dark mode feature to the dashboard. This would greatly improve the user experience, especially for those who work late hours. What do you think?',
      snippet: 'I have been using your platform for a few months now and would like...',
      timestamp: '2024-11-28T14:15:08Z',
      date: '2024-11-28 14:15:08',
      tone: '#Feedback',
      folder: 'INBOX',
      campaign: 'Q4 Enterprise'
    },
    {
      id: 4,
      message_id: 'msg_004',
      from: 'david.wilson@company.com',
      sender: 'David Wilson <david.wilson@company.com>',
      subject: 'Re: Meeting follow-up',
      body: 'Following up on our conversation from last week regarding the integration project. I wanted to confirm the timeline and discuss the next steps. When would be a good time to schedule a follow-up call?',
      snippet: 'Following up on our conversation from last week regarding...',
      timestamp: '2024-11-28T13:30:11Z',
      date: '2024-11-28 13:30:11',
      tone: '#Generic',
      folder: 'INBOX',
      campaign: 'Startup Founders'
    },
    {
      id: 5,
      message_id: 'msg_005',
      from: 'lisa.anderson@business.com',
      sender: 'Lisa Anderson <lisa.anderson@business.com>',
      subject: 'Very disappointed with recent update',
      body: 'The latest update has completely broken my workflow. I cannot export my reports anymore and the new interface is confusing. I have been a loyal customer for 2 years, but this is unacceptable. I need this fixed immediately or I will cancel my subscription.',
      snippet: 'The latest update has completely broken my workflow. I cannot...',
      timestamp: '2024-11-28T13:22:45Z',
      date: '2024-11-28 13:22:45',
      tone: '#Complaint',
      folder: 'INBOX',
      campaign: 'FinTech C-Suite'
    },
    {
      id: 6,
      message_id: 'msg_006',
      from: 'emily.brown@enterprise.com',
      sender: 'Emily Brown <emily.brown@enterprise.com>',
      subject: 'Amazing customer support experience',
      body: 'I just wanted to share how impressed I am with your support team. They went above and beyond to help me set up the integration, and the documentation was crystal clear. Thank you for such a wonderful experience!',
      snippet: 'I just wanted to share how impressed I am with your support team...',
      timestamp: '2024-11-28T13:15:33Z',
      date: '2024-11-28 13:15:33',
      tone: '#Appreciation',
      folder: 'INBOX',
      campaign: 'SaaS Decision Makers'
    },
    {
      id: 7,
      message_id: 'msg_007',
      from: 'robert.taylor@corp.com',
      sender: 'Robert Taylor <robert.taylor@corp.com>',
      subject: 'Suggestion for improvement',
      body: 'I think it would be great if you could add a feature that allows bulk export of data. This would save a lot of time for users who need to process large datasets. Just a thought!',
      snippet: 'I think it would be great if you could add a feature that allows...',
      timestamp: '2024-11-28T12:58:19Z',
      date: '2024-11-28 12:58:19',
      tone: '#Feedback',
      folder: 'INBOX',
      campaign: 'Q4 Enterprise'
    },
    {
      id: 8,
      message_id: 'msg_008',
      from: 'jennifer.martinez@company.io',
      sender: 'Jennifer Martinez <jennifer.martinez@company.io>',
      subject: 'Question about pricing',
      body: 'I am interested in upgrading my plan and would like to know more about the enterprise pricing. Could you please send me a quote? Also, are there any discounts for annual subscriptions?',
      snippet: 'I am interested in upgrading my plan and would like to know...',
      timestamp: '2024-11-28T12:45:07Z',
      date: '2024-11-28 12:45:07',
      tone: '#Generic',
      folder: 'INBOX',
      campaign: 'Q4 Enterprise'
    },
    {
      id: 9,
      message_id: 'msg_009',
      from: 'thomas.lee@business.com',
      sender: 'Thomas Lee <thomas.lee@business.com>',
      subject: 'Billing issue - charged twice',
      body: 'I noticed that I was charged twice this month for my subscription. I have already paid on the 1st, but I see another charge on the 15th. This is a billing error and I need a refund for the duplicate charge immediately.',
      snippet: 'I noticed that I was charged twice this month for my subscription...',
      timestamp: '2024-11-28T12:30:00Z',
      date: '2024-11-28 12:30:00',
      tone: '#Complaint',
      folder: 'INBOX',
      campaign: 'Startup Founders'
    },
    {
      id: 10,
      message_id: 'msg_010',
      from: 'amanda.white@startup.io',
      sender: 'Amanda White <amanda.white@startup.io>',
      subject: 'Love the new features!',
      body: 'Just wanted to say how much I appreciate the recent updates. The new analytics dashboard is fantastic and the performance improvements are noticeable. Keep up the great work!',
      snippet: 'Just wanted to say how much I appreciate the recent updates...',
      timestamp: '2024-11-28T12:15:00Z',
      date: '2024-11-28 12:15:00',
      tone: '#Appreciation',
      folder: 'INBOX',
      campaign: 'Healthcare Push'
    },
    {
      id: 11,
      message_id: 'msg_011',
      from: 'chris.moore@techcorp.com',
      sender: 'Chris Moore <chris.moore@techcorp.com>',
      subject: 'System is down - urgent!',
      body: 'Your system has been down for the past 3 hours and I cannot access any of my data. This is affecting my business operations and I need immediate assistance. When will this be resolved?',
      snippet: 'Your system has been down for the past 3 hours and I cannot...',
      timestamp: '2024-11-28T11:45:00Z',
      date: '2024-11-28 11:45:00',
      tone: '#Complaint',
      folder: 'INBOX',
      campaign: 'Q4 Enterprise'
    },
    {
      id: 12,
      message_id: 'msg_012',
      from: 'jessica.davis@enterprise.io',
      sender: 'Jessica Davis <jessica.davis@enterprise.io>',
      subject: 'Thank you for the quick response',
      body: 'Thank you so much for resolving my issue so quickly yesterday. Your team\'s responsiveness and professionalism is outstanding. I will definitely recommend your service to others.',
      snippet: 'Thank you so much for resolving my issue so quickly yesterday...',
      timestamp: '2024-11-28T11:20:00Z',
      date: '2024-11-28 11:20:00',
      tone: '#Appreciation',
      folder: 'INBOX',
      campaign: 'SaaS Decision Makers'
    },
    {
      id: 13,
      message_id: 'msg_013',
      from: 'daniel.garcia@company.com',
      sender: 'Daniel Garcia <daniel.garcia@company.com>',
      subject: 'Feature recommendation',
      body: 'I would like to recommend adding a mobile app for iOS and Android. This would make it much easier to access the platform on the go. Many of our team members have requested this feature.',
      snippet: 'I would like to recommend adding a mobile app for iOS and Android...',
      timestamp: '2024-11-28T10:55:00Z',
      date: '2024-11-28 10:55:00',
      tone: '#Feedback',
      folder: 'INBOX',
      campaign: 'Q4 Enterprise'
    },
    {
      id: 14,
      message_id: 'msg_014',
      from: 'maria.rodriguez@business.io',
      sender: 'Maria Rodriguez <maria.rodriguez@business.io>',
      subject: 'Re: Project update',
      body: 'Hi, just checking in on the status of our integration project. Can you provide an update on the timeline? Looking forward to your response.',
      snippet: 'Hi, just checking in on the status of our integration project...',
      timestamp: '2024-11-28T10:30:00Z',
      date: '2024-11-28 10:30:00',
      tone: '#Generic',
      folder: 'INBOX',
      campaign: 'Startup Founders'
    },
    {
      id: 15,
      message_id: 'msg_015',
      from: 'james.wilson@corp.com',
      sender: 'James Wilson <james.wilson@corp.com>',
      subject: 'Extremely frustrated with service',
      body: 'I have been trying to contact support for 2 days with no response. My account is locked and I cannot access any of my work. This is completely unacceptable. I demand immediate action.',
      snippet: 'I have been trying to contact support for 2 days with no response...',
      timestamp: '2024-11-28T10:00:00Z',
      date: '2024-11-28 10:00:00',
      tone: '#Complaint',
      folder: 'INBOX',
      campaign: 'FinTech C-Suite'
    }
  ],
  total: 15,
  limit: 50,
  unread_only: true
};

/**
 * Mock function to simulate API delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise}
 */
export const mockDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Mock retrieveEmails function that simulates API call
 * @param {Object} config - Email configuration (not used in mock, but kept for API compatibility)
 * @returns {Promise} - Mock API response
 */
export const mockRetrieveEmails = async (config = {}) => {
  // Simulate API delay
  await mockDelay(800);
  
  // Return mock response
  return mockRetrieveEmailsResponse;
};

