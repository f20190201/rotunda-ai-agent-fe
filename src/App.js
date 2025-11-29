import React, { useState } from 'react';
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
  Reply
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Campaigns from './components/Campaigns';
import AgentSettings from './components/AgentSettings';
import LogsBilling from './components/LogsBilling';
import EmailGenerator from './components/EmailGenerator';
import RespondToEmails from './components/RespondToEmails';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'emails', label: 'Send AI Marketing Emails', icon: Mail },
    { id: 'respond', label: 'Respond to Emails', icon: Reply },
    { id: 'settings', label: 'Agent Settings', icon: Bot },
    { id: 'logs', label: 'Logs & Billing', icon: FileText },
  ];

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
          <button className="nav-item footer-item">
            <HelpCircle size={20} />
            <span>Help & Support</span>
          </button>
          <button className="nav-item footer-item">
            <Settings size={20} />
            <span>Preferences</span>
          </button>
          <div className="sidebar-divider" />
          <div className="user-card">
            <div className="avatar">SP</div>
            <div className="user-info">
              <div className="user-name">Subham Patel</div>
              <div className="user-email">subham@rotunda.ai</div>
            </div>
            <button className="logout-btn">
              <LogOut size={18} />
            </button>
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
          <div className="topbar-right">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
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
