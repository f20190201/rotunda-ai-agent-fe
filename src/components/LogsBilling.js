import React, { useState } from 'react';
import { 
  FileText, 
  CreditCard,
  Download,
  Filter,
  Search,
  Mail,
  Phone,
  Linkedin,
  Settings,
  Check,
  AlertCircle,
  Clock,
  Users,
  Zap,
  Shield,
  Headphones
} from 'lucide-react';

const logsData = [
  { id: 1, type: 'email', action: 'Email sent to John Smith', campaign: 'Q4 Enterprise', timestamp: '2024-11-28 14:32:15', status: 'success' },
  { id: 2, type: 'linkedin', action: 'Connection request sent to Sarah Johnson', campaign: 'SaaS Decision Makers', timestamp: '2024-11-28 14:28:42', status: 'success' },
  { id: 3, type: 'email', action: 'Follow-up email sent to Mike Chen', campaign: 'Q4 Enterprise', timestamp: '2024-11-28 14:15:08', status: 'success' },
  { id: 4, type: 'system', action: 'Campaign "Healthcare Push" paused due to rate limit', campaign: 'Healthcare Push', timestamp: '2024-11-28 13:45:22', status: 'warning' },
  { id: 5, type: 'call', action: 'Voicemail left for David Wilson', campaign: 'Startup Founders', timestamp: '2024-11-28 13:30:11', status: 'success' },
  { id: 6, type: 'email', action: 'Email bounced - invalid address', campaign: 'FinTech C-Suite', timestamp: '2024-11-28 13:22:45', status: 'error' },
  { id: 7, type: 'linkedin', action: 'Message sent to Emily Brown', campaign: 'SaaS Decision Makers', timestamp: '2024-11-28 13:15:33', status: 'success' },
  { id: 8, type: 'system', action: 'AI response generated for incoming reply', campaign: 'Q4 Enterprise', timestamp: '2024-11-28 12:58:19', status: 'success' },
  { id: 9, type: 'email', action: 'Meeting invitation sent to Lisa Anderson', campaign: 'Q4 Enterprise', timestamp: '2024-11-28 12:45:07', status: 'success' },
  { id: 10, type: 'call', action: 'Call completed with Robert Taylor (3m 24s)', campaign: 'Startup Founders', timestamp: '2024-11-28 12:30:00', status: 'success' },
];

const billingPlans = [
  {
    name: 'Starter',
    price: 49,
    features: [
      '500 AI-powered emails/month',
      '100 LinkedIn messages/month',
      'Basic analytics',
      'Email support',
      '1 user seat'
    ],
    popular: false
  },
  {
    name: 'Growth',
    price: 149,
    features: [
      '2,500 AI-powered emails/month',
      '500 LinkedIn messages/month',
      '100 AI voice calls/month',
      'Advanced analytics & reporting',
      'Priority support',
      '5 user seats',
      'A/B testing'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 399,
    features: [
      'Unlimited AI-powered emails',
      'Unlimited LinkedIn messages',
      '500 AI voice calls/month',
      'Custom integrations',
      'Dedicated success manager',
      'Unlimited users',
      'Custom AI training',
      'SLA guarantee'
    ],
    popular: false
  }
];

const LogsBilling = () => {
  const [activeTab, setActiveTab] = useState('logs');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredLogs = logsData.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.campaign.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email': return <Mail size={14} />;
      case 'linkedin': return <Linkedin size={14} />;
      case 'call': return <Phone size={14} />;
      case 'system': return <Settings size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <Check size={14} style={{ color: '#10b981' }} />;
      case 'warning': return <AlertCircle size={14} style={{ color: '#f59e0b' }} />;
      case 'error': return <AlertCircle size={14} style={{ color: '#ef4444' }} />;
      default: return <Clock size={14} style={{ color: '#64748b' }} />;
    }
  };

  return (
    <div className="fade-in">
      <div className="page-title">Logs & Billing</div>
      <div className="page-subtitle">Monitor activity and manage your subscription</div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <button
          className={`btn ${activeTab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('logs')}
        >
          <FileText size={18} />
          Activity Logs
        </button>
        <button
          className={`btn ${activeTab === 'billing' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('billing')}
        >
          <CreditCard size={18} />
          Billing & Plans
        </button>
      </div>

      {activeTab === 'logs' ? (
        <>
          {/* Logs Section */}
          <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Filter size={18} style={{ color: '#64748b' }} />
                <select
                  className="input-field select-field"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="all">All Types</option>
                  <option value="email">Email</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="call">Call</option>
                  <option value="system">System</option>
                </select>
              </div>
              <button className="btn btn-secondary">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          <div className="glass-card">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Action</th>
                  <th>Campaign</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span className={`log-type ${log.type}`}>
                        {getTypeIcon(log.type)}
                        {log.type}
                      </span>
                    </td>
                    <td style={{ color: '#f8fafc' }}>{log.action}</td>
                    <td>{log.campaign}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{log.timestamp}</td>
                    <td>{getStatusIcon(log.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* Current Plan */}
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Current Plan</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>Growth Plan</div>
                <div style={{ color: '#94a3b8' }}>Next billing date: December 28, 2024</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>$149<span style={{ fontSize: '1rem', color: '#64748b', WebkitTextFillColor: '#64748b' }}>/month</span></div>
                <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
            <div className="stat-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Mail size={20} style={{ color: '#6366f1' }} />
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>68% used</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>1,700 / 2,500</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Emails this month</div>
              <div style={{ height: '4px', background: '#1a1a25', borderRadius: '2px', marginTop: '0.75rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '68%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '2px' }} />
              </div>
            </div>
            <div className="stat-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Linkedin size={20} style={{ color: '#06b6d4' }} />
                <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '600' }}>82% used</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>410 / 500</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>LinkedIn messages</div>
              <div style={{ height: '4px', background: '#1a1a25', borderRadius: '2px', marginTop: '0.75rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '82%', background: 'linear-gradient(90deg, #06b6d4, #0891b2)', borderRadius: '2px' }} />
              </div>
            </div>
            <div className="stat-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Phone size={20} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>45% used</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>45 / 100</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Voice calls</div>
              <div style={{ height: '4px', background: '#1a1a25', borderRadius: '2px', marginTop: '0.75rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '45%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '2px' }} />
              </div>
            </div>
            <div className="stat-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Users size={20} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>60% used</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>3 / 5</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Team members</div>
              <div style={{ height: '4px', background: '#1a1a25', borderRadius: '2px', marginTop: '0.75rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg, #f59e0b, #d97706)', borderRadius: '2px' }} />
              </div>
            </div>
          </div>

          {/* Plans */}
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Available Plans</h3>
            <p style={{ color: '#94a3b8' }}>Choose the plan that best fits your outreach needs</p>
          </div>

          <div className="billing-cards">
            {billingPlans.map((plan, index) => (
              <div key={index} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">
                  ${plan.price}<span>/month</span>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>
                      <Check size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'center' }}>
                  {plan.name === 'Growth' ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="glass-card" style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Enterprise Features</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={20} style={{ color: '#6366f1' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>SSO & Security</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Enterprise-grade security with SAML SSO</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={20} style={{ color: '#10b981' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>API Access</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Full API access for custom integrations</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Headphones size={20} style={{ color: '#f59e0b' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>24/7 Support</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Dedicated support team & SLA</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LogsBilling;

