import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Megaphone, 
  Bot, 
  FileText,
  Bell,
  Sparkles,
  LogOut,
  Settings,
  HelpCircle,
  Mail,
  Reply,
  AlertCircle,
  TrendingDown,
  Target,
  X,
  ChevronRight
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Campaigns from './components/Campaigns';
import AgentSettings from './components/AgentSettings';
import LogsBilling from './components/LogsBilling';
import EmailGenerator from './components/EmailGenerator';
import RespondToEmails from './components/RespondToEmails';
import Chatbot from './components/Chatbot';
import api from './services/api';
import { mockGetAlerts } from './mocks/alertMocks';
import './App.css';

// Flag to switch between mock and real API
const USE_MOCK_API = true;

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alerts, setAlerts] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const notificationRef = useRef(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'emails', label: 'Send AI Marketing Emails', icon: Mail },
    { id: 'respond', label: 'Respond to Emails', icon: Reply },
    { id: 'settings', label: 'Agent Settings', icon: Bot },
    { id: 'logs', label: 'Logs & Billing', icon: FileText },
  ];

  // Fetch alerts from API
  const fetchAlerts = async () => {
    setLoadingAlerts(true);
    try {
      let response;
      if (USE_MOCK_API) {
        response = await mockGetAlerts();
      } else {
        response = await api.getAlerts();
      }
      
      const alertsList = response.alerts || response.data || [];
      setAlerts(alertsList);
      
      // Calculate active alerts based on criteria
      const active = alertsList.filter(alert => {
        if (alert.type === 'complaint_emails') {
          return alert.count >= 1;
        } else if (alert.type === 'conversion_rate') {
          return alert.value < 30;
        } else if (alert.type === 'revenue_delta') {
          return alert.value < -20;
        }
        return false;
      });
      
      setActiveAlerts(active);
      setAlertCount(active.length);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
      setActiveAlerts([]);
      setAlertCount(0);
    } finally {
      setLoadingAlerts(false);
    }
  };

  // Fetch alerts on mount and set up polling
  useEffect(() => {
    fetchAlerts();
    // Poll for alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    if (!showNotificationDropdown) {
      fetchAlerts(); // Refresh alerts when opening
    }
  };

  const handleAlertClick = (alert) => {
    if (alert.actionUrl) {
      // Navigate to the relevant tab
      const urlMap = {
        '/respond': 'respond',
        '/campaigns': 'campaigns',
        '/dashboard': 'dashboard'
      };
      const tabId = urlMap[alert.actionUrl] || 'dashboard';
      setActiveTab(tabId);
      setShowNotificationDropdown(false);
      window.scrollTo(0, 0);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'complaint_emails':
        return AlertCircle;
      case 'conversion_rate':
        return Target;
      case 'revenue_delta':
        return TrendingDown;
      default:
        return AlertCircle;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#06b6d4';
      default:
        return '#64748b';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'campaigns':
        return <Campaigns />;
      case 'emails':
        return <EmailGenerator />;
      case 'respond':
        return <RespondToEmails />;
      case 'settings':
        return <AgentSettings />;
      case 'logs':
        return <LogsBilling />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <Sparkles size={20} />
            </div>
            <div className="logo-text-container">
              <div className="logo-text">Rotunda AI</div>
              <div className="logo-subtitle">Sales Agent</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-menu">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => {window.scrollTo(0, 0); setActiveTab(tab.id)}}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="sidebar-footer">
          
          <div className="sidebar-divider" />
          <div className="user-card">
            <div className="avatar">SP</div>
            <div className="user-info">
              <div className="user-name">Subham Patel</div>
              <div className="user-email">subham@rotunda.ai</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">
              {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="topbar-right" style={{ position: 'relative' }} ref={notificationRef}>
            <button 
              className="notification-btn"
              onClick={handleNotificationClick}
            >
              <Bell size={20} />
              {alertCount > 0 && (
                <span className="notification-badge">{alertCount}</span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotificationDropdown && (
              <div className="notification-dropdown">
                <div className="notification-dropdown-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bell size={18} />
                    <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Alerts & Notifications</span>
                  </div>
                  <button
                    onClick={() => setShowNotificationDropdown(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="notification-dropdown-content">
                  {loadingAlerts ? (
                    <div style={{ 
                      padding: '2rem', 
                      textAlign: 'center', 
                      color: '#64748b',
                      fontSize: '0.875rem'
                    }}>
                      Loading alerts...
                    </div>
                  ) : activeAlerts.length === 0 ? (
                    <div style={{ 
                      padding: '2rem', 
                      textAlign: 'center', 
                      color: '#64748b',
                      fontSize: '0.875rem'
                    }}>
                      <Bell size={32} style={{ opacity: 0.3, marginBottom: '0.5rem', display: 'block', margin: '0 auto 0.5rem' }} />
                      No active alerts
                    </div>
                  ) : (
                    activeAlerts.map((alert) => {
                      const Icon = getAlertIcon(alert.type);
                      const color = getAlertColor(alert.severity);
                      
                      return (
                        <div
                          key={alert.id}
                          className="notification-item"
                          onClick={() => handleAlertClick(alert)}
                          style={{
                            cursor: alert.actionable ? 'pointer' : 'default'
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: '0.75rem',
                            flex: 1
                          }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              background: `${color}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <Icon size={18} style={{ color }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ 
                                fontWeight: '600', 
                                fontSize: '0.875rem',
                                color: '#f8fafc',
                                marginBottom: '0.25rem'
                              }}>
                                {alert.title}
                              </div>
                              <div style={{ 
                                fontSize: '0.8rem',
                                color: '#94a3b8',
                                lineHeight: '1.5',
                                marginBottom: '0.5rem'
                              }}>
                                {alert.message}
                              </div>
                              {alert.type === 'complaint_emails' && (
                                <div style={{ 
                                  fontSize: '0.75rem',
                                  color: '#64748b',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  padding: '0.25rem 0.5rem',
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  borderRadius: '6px'
                                }}>
                                  <AlertCircle size={12} />
                                  {alert.count} complaint{alert.count !== 1 ? 's' : ''}
                                </div>
                              )}
                              {alert.type === 'conversion_rate' && (
                                <div style={{ 
                                  fontSize: '0.75rem',
                                  color: '#64748b',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  padding: '0.25rem 0.5rem',
                                  background: 'rgba(245, 158, 11, 0.1)',
                                  borderRadius: '6px'
                                }}>
                                  <Target size={12} />
                                  {alert.value}% (Threshold: {alert.threshold}%)
                                </div>
                              )}
                              {alert.type === 'revenue_delta' && (
                                <div style={{ 
                                  fontSize: '0.75rem',
                                  color: '#64748b',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  padding: '0.25rem 0.5rem',
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  borderRadius: '6px'
                                }}>
                                  <TrendingDown size={12} />
                                  {alert.value}% change
                                </div>
                              )}
                            </div>
                            {alert.actionable && (
                              <ChevronRight size={16} style={{ color: '#64748b', flexShrink: 0 }} />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="main-content">
          {renderContent()}
        </main>
      </div>

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;
