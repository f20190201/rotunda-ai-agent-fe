// Mock API responses for alerts/notifications
// This file contains mock data for testing when the backend API is not ready

/**
 * Mock function to simulate API delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise}
 */
export const mockDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Mock alerts data
 * This simulates the response from /alerts or /notifications API
 */
export const mockAlertsResponse = {
  success: true,
  agentId: 'rotunda-frontend-agent',
  alerts: [
    {
      id: 'alert_1',
      type: 'complaint_emails',
      severity: 'high',
      title: 'Complaint Emails Detected',
      message: 'You have 4 complaint emails that require attention',
      count: 4,
      threshold: 1,
      timestamp: '2024-11-29T10:30:00Z',
      actionable: true,
      actionUrl: '/respond'
    },
    {
      id: 'alert_2',
      type: 'conversion_rate',
      severity: 'medium',
      title: 'Low Conversion Rate',
      message: 'Current conversion rate is 18.5%, below the 30% threshold',
      value: 18.5,
      threshold: 30,
      timestamp: '2024-11-29T10:25:00Z',
      actionable: true,
      actionUrl: '/dashboard'
    },
    {
      id: 'alert_3',
      type: 'revenue_delta',
      severity: 'high',
      title: 'Revenue Decline Detected',
      message: 'Revenue has decreased by 25% compared to last period',
      value: -25,
      threshold: -20,
      timestamp: '2024-11-29T10:20:00Z',
      actionable: true,
      actionUrl: '/dashboard'
    }
  ],
  timestamp: '2024-11-29T10:30:00Z'
};

/**
 * Mock function to get alerts
 * This simulates the /alerts API endpoint
 * @returns {Promise} - Mock alerts response
 */
export const mockGetAlerts = async () => {
  // Simulate API delay
  await mockDelay(300);
  
  // Return mock response
  return mockAlertsResponse;
};

