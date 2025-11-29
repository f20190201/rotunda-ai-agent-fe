import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import CardanoLoader from './CardanoLoader';
import { 
  Plus, 
  Search, 
  Filter,
  Mail,
  Linkedin,
  Phone,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  Edit,
  Users,
  Target,
  Clock,
  CheckCircle,
  Sparkles,
  UserPlus,
  X,
  Building,
  Globe,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

// Helper function to map API campaign to component format
const mapCampaignFromAPI = (apiCampaign) => {
  const today = new Date();
  const startDate = new Date(apiCampaign.start_date);
  const endDate = new Date(apiCampaign.end_date);
  
  // Determine status based on dates
  let status = 'active';
  if (today < startDate) {
    status = 'draft';
  } else if (today > endDate) {
    status = 'paused'; // Completed campaigns shown as paused
  }
  
  // Map channel to array format
  const channelMap = {
    'Email': 'email',
    'Social Media': 'linkedin',
    'Paid Ads': 'paid-ads'
  };
  const channels = [channelMap[apiCampaign.channel] || 'email'];
  
  // Format start date
  const formattedDate = startDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  return {
    id: apiCampaign.campaign_id,
    name: apiCampaign.campaign_name,
    type: apiCampaign.channel,
    status: status,
    prospects: apiCampaign.impressions || 0,
    contacted: apiCampaign.clicks || 0,
    responses: apiCampaign.conversions || 0,
    meetings: apiCampaign.leads || 0,
    channels: channels,
    startDate: formattedDate,
    // Additional API data
    spend: apiCampaign.spend,
    revenue: apiCampaign.revenue,
    emailSignups: apiCampaign.email_signups,
    endDate: endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
  };
};

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEnrichModal, setShowEnrichModal] = useState(false);
  const [enrichForm, setEnrichForm] = useState({ email: '', name: '', company: '', title: '' });
  const [enrichLoading, setEnrichLoading] = useState(false);
  const [enrichResult, setEnrichResult] = useState(null);
  const [enrichError, setEnrichError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    campaign_name: '',
    channel: 'Email',
    start_date: '',
    end_date: '',
    spend: 0,
    revenue: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    leads: 0,
    email_signups: 0
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  // Fetch campaigns function
  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getCampaigns();
      if (response.success && response.campaigns) {
        const mappedCampaigns = response.campaigns.map(mapCampaignFromAPI);
        setCampaigns(mappedCampaigns);
      } else {
        setError('Failed to fetch campaigns');
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  // Fetch campaigns on mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return <Mail size={14} />;
      case 'linkedin': return <Linkedin size={14} />;
      case 'phone': return <Phone size={14} />;
      case 'paid-ads': return <Globe size={14} />;
      default: return <Mail size={14} />;
    }
  };

  const handleEnrichLead = async () => {
    if (!enrichForm.email) {
      setEnrichError('Email is required');
      return;
    }

    setEnrichLoading(true);
    setEnrichError(null);
    setEnrichResult(null);

    try {
      const response = await api.enrichLead({
        email: enrichForm.email,
        name: enrichForm.name || undefined,
        company: enrichForm.company || undefined,
        title: enrichForm.title || undefined,
      });

      setEnrichResult(response.enriched_lead);
    } catch (error) {
      setEnrichError(error.message);
    } finally {
      setEnrichLoading(false);
    }
  };

  // Handle modal open/close with body scroll lock
  const openEnrichModal = () => {
    setShowEnrichModal(true);
    document.body.style.overflow = 'hidden';
  };

  const resetEnrichModal = () => {
    setShowEnrichModal(false);
    document.body.style.overflow = 'auto';
    setEnrichForm({ email: '', name: '', company: '', title: '' });
    setEnrichResult(null);
    setEnrichError(null);
  };

  // Prevent scroll propagation from modal
  const handleModalScroll = (e) => {
    e.stopPropagation();
  };

  // Handle create campaign
  const handleCreateCampaign = async () => {
    if (!createForm.campaign_name || !createForm.start_date || !createForm.end_date) {
      setCreateError('Campaign name, start date, and end date are required');
      return;
    }

    setCreateLoading(true);
    setCreateError(null);

    try {
      const campaignData = {
        campaign_name: createForm.campaign_name,
        channel: createForm.channel,
        start_date: createForm.start_date,
        end_date: createForm.end_date,
        spend: parseFloat(createForm.spend) || 0,
        revenue: parseFloat(createForm.revenue) || 0,
        impressions: parseInt(createForm.impressions) || 0,
        clicks: parseInt(createForm.clicks) || 0,
        conversions: parseInt(createForm.conversions) || 0,
        leads: parseInt(createForm.leads) || 0,
        email_signups: parseInt(createForm.email_signups) || 0
      };

      const response = await api.createCampaign(campaignData);
      
      if (response.success) {
        // Reset form and close modal
        setCreateForm({
          campaign_name: '',
          channel: 'Email',
          start_date: '',
          end_date: '',
          spend: 0,
          revenue: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          leads: 0,
          email_signups: 0
        });
        setShowCreateModal(false);
        document.body.style.overflow = 'auto';
        
        // Refresh campaigns list
        await fetchCampaigns();
      } else {
        setCreateError('Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      setCreateError(error.message || 'Failed to create campaign');
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle create modal open/close
  const openCreateModal = () => {
    setShowCreateModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    document.body.style.overflow = 'auto';
    setCreateForm({
      campaign_name: '',
      channel: 'Email',
      start_date: '',
      end_date: '',
      spend: 0,
      revenue: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      leads: 0,
      email_signups: 0
    });
    setCreateError(null);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div className="page-title">Campaigns</div>
          <div className="page-subtitle">Manage your AI-powered outreach campaigns</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={openEnrichModal}>
            <UserPlus size={18} />
            Enrich Lead
          </button>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={18} />
            New Campaign
          </button>
        </div>
      </div>

      {/* Lead Enrichment Modal - Portal */}
      {showEnrichModal && ReactDOM.createPortal(
        <>
          {/* Backdrop */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 9998
            }}
            onClick={resetEnrichModal}
          />
          {/* Modal */}
          <div 
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#12121a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '2rem',
              width: 'calc(100% - 4rem)',
              maxWidth: enrichResult ? '800px' : '500px',
              maxHeight: '85vh',
              overflow: 'auto',
              zIndex: 9999,
            }}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleModalScroll}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                  <Sparkles size={24} style={{ display: 'inline', marginRight: '0.5rem', color: '#6366f1' }} />
                  AI Lead Enrichment
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Get comprehensive data about any lead instantly
                </p>
              </div>
              <button 
                onClick={resetEnrichModal}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: 'none', 
                  borderRadius: '10px', 
                  padding: '0.5rem',
                  cursor: 'pointer',
                  color: '#94a3b8'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {!enrichResult ? (
              <>
                <div className="input-group">
                  <label className="input-label">Email Address *</label>
                  <input 
                    type="email" 
                    className="input-field" 
                    placeholder="john.doe@company.com"
                    value={enrichForm.email}
                    onChange={(e) => setEnrichForm({ ...enrichForm, email: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="John Doe"
                      value={enrichForm.name}
                      onChange={(e) => setEnrichForm({ ...enrichForm, name: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Company</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Tech Corp"
                      value={enrichForm.company}
                      onChange={(e) => setEnrichForm({ ...enrichForm, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Job Title</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="VP of Sales"
                    value={enrichForm.title}
                    onChange={(e) => setEnrichForm({ ...enrichForm, title: e.target.value })}
                  />
                </div>

                {enrichError && (
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    borderRadius: '12px',
                    color: '#ef4444',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <AlertCircle size={18} />
                    {enrichError}
                  </div>
                )}

                <button 
                  className="btn btn-primary" 
                  onClick={handleEnrichLead}
                  disabled={enrichLoading}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                >
                  {enrichLoading ? (
                    <>
                      <CardanoLoader size={18} />
                      Enriching Lead...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Enrich Lead with AI
                    </>
                  )}
                </button>
              </>
            ) : (
              <div>
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <CheckCircle size={24} style={{ color: '#10b981' }} />
                  <div>
                    <div style={{ fontWeight: '600', color: '#10b981' }}>Lead Enriched Successfully!</div>
                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      Confidence Score: {Math.round((enrichResult.confidence_score || 0) * 100)}%
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  {/* Company Info */}
                  {enrichResult.enriched_data?.company_info && (
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Building size={18} style={{ color: '#6366f1' }} />
                        <span style={{ fontWeight: '600' }}>Company Info</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <div><span style={{ color: '#64748b' }}>Industry:</span> {enrichResult.enriched_data.company_info.industry}</div>
                        <div><span style={{ color: '#64748b' }}>Size:</span> {enrichResult.enriched_data.company_info.company_size}</div>
                        <div><span style={{ color: '#64748b' }}>Revenue:</span> {enrichResult.enriched_data.company_info.revenue_range}</div>
                        <div><span style={{ color: '#64748b' }}>Location:</span> {enrichResult.enriched_data.company_info.location}</div>
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  {enrichResult.enriched_data?.contact_info && (
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Users size={18} style={{ color: '#8b5cf6' }} />
                        <span style={{ fontWeight: '600' }}>Contact Info</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <div><span style={{ color: '#64748b' }}>Name:</span> {enrichResult.enriched_data.contact_info.name}</div>
                        <div><span style={{ color: '#64748b' }}>Title:</span> {enrichResult.enriched_data.contact_info.title}</div>
                        <div><span style={{ color: '#64748b' }}>Phone:</span> {enrichResult.enriched_data.contact_info.phone}</div>
                        <div><span style={{ color: '#64748b' }}>LinkedIn:</span> {enrichResult.enriched_data.contact_info.linkedin_profile ? 'Available' : 'N/A'}</div>
                      </div>
                    </div>
                  )}

                  {/* Technographic Data */}
                  {enrichResult.enriched_data?.technographic_data && (
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Globe size={18} style={{ color: '#06b6d4' }} />
                        <span style={{ fontWeight: '600' }}>Tech Stack</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {enrichResult.enriched_data.technographic_data.technologies_used?.map((tech, i) => (
                          <span key={i} style={{
                            padding: '0.25rem 0.75rem',
                            background: 'rgba(6, 182, 212, 0.15)',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            color: '#06b6d4'
                          }}>{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Intent Signals */}
                  {enrichResult.enriched_data?.intent_signals && (
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <TrendingUp size={18} style={{ color: '#f59e0b' }} />
                        <span style={{ fontWeight: '600' }}>Intent Signals</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                        <div>
                          <div style={{ color: '#64748b', marginBottom: '0.25rem' }}>Engagement Score</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ flex: 1, height: '8px', background: '#1a1a25', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ 
                                width: `${enrichResult.enriched_data.intent_signals.engagement_score}%`, 
                                height: '100%', 
                                background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                                borderRadius: '4px'
                              }} />
                            </div>
                            <span style={{ fontWeight: '600' }}>{enrichResult.enriched_data.intent_signals.engagement_score}/100</span>
                          </div>
                        </div>
                        <div><span style={{ color: '#64748b' }}>Buyer Stage:</span> {enrichResult.enriched_data.intent_signals.buyer_stage}</div>
                        <div><span style={{ color: '#64748b' }}>Activity:</span> {enrichResult.enriched_data.intent_signals.recent_activity}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={resetEnrichModal}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Close
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      setEnrichResult(null);
                      setEnrichForm({ email: '', name: '', company: '', title: '' });
                    }}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <UserPlus size={18} />
                    Enrich Another Lead
                  </button>
                </div>
              </div>
            )}
          </div>
        </>,
        document.body
      )}

      {/* Create Campaign Modal - Portal */}
      {showCreateModal && ReactDOM.createPortal(
        <>
          {/* Backdrop */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 9998
            }}
            onClick={closeCreateModal}
          />
          {/* Modal */}
          <div 
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#12121a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              width: 'calc(100% - 4rem)',
              maxWidth: '600px',
              maxHeight: '85vh',
              overflow: 'auto',
              zIndex: 9999,
            }}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleModalScroll}
          >
            {/* Modal Header */}
            <div style={{ 
              padding: '1.5rem 2rem', 
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: '#12121a',
              zIndex: 10
            }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={24} style={{ color: '#6366f1' }} />
                  Create New Campaign
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Add a new marketing campaign
                </p>
              </div>
              <button 
                onClick={closeCreateModal}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: 'none', 
                  borderRadius: '10px', 
                  padding: '0.5rem',
                  cursor: 'pointer',
                  color: '#94a3b8'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '2rem' }}>
              {createError && (
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  borderRadius: '12px',
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  marginBottom: '1.5rem'
                }}>
                  ⚠️ {createError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Campaign Name */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    value={createForm.campaign_name}
                    onChange={(e) => setCreateForm({ ...createForm, campaign_name: e.target.value })}
                    placeholder="e.g., Summer Sale 2025"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Channel */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>
                    Channel *
                  </label>
                  <select
                    value={createForm.channel}
                    onChange={(e) => setCreateForm({ ...createForm, channel: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Email">Email</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Paid Ads">Paid Ads</option>
                  </select>
                </div>

                {/* Date Range */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={createForm.start_date}
                      onChange={(e) => setCreateForm({ ...createForm, start_date: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={createForm.end_date}
                      onChange={(e) => setCreateForm({ ...createForm, end_date: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>
                      Spend ($)
                    </label>
                    <input
                      type="number"
                      value={createForm.spend}
                      onChange={(e) => setCreateForm({ ...createForm, spend: e.target.value })}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>
                      Revenue ($)
                    </label>
                    <input
                      type="number"
                      value={createForm.revenue}
                      onChange={(e) => setCreateForm({ ...createForm, revenue: e.target.value })}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>
                      Impressions
                    </label>
                    <input
                      type="number"
                      value={createForm.impressions}
                      onChange={(e) => setCreateForm({ ...createForm, impressions: e.target.value })}
                      placeholder="0"
                      min="0"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>
                      Clicks
                    </label>
                    <input
                      type="number"
                      value={createForm.clicks}
                      onChange={(e) => setCreateForm({ ...createForm, clicks: e.target.value })}
                      placeholder="0"
                      min="0"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>
                      Conversions
                    </label>
                    <input
                      type="number"
                      value={createForm.conversions}
                      onChange={(e) => setCreateForm({ ...createForm, conversions: e.target.value })}
                      placeholder="0"
                      min="0"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>
                      Leads
                    </label>
                    <input
                      type="number"
                      value={createForm.leads}
                      onChange={(e) => setCreateForm({ ...createForm, leads: e.target.value })}
                      placeholder="0"
                      min="0"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>
                      Email Signups
                    </label>
                    <input
                      type="number"
                      value={createForm.email_signups}
                      onChange={(e) => setCreateForm({ ...createForm, email_signups: e.target.value })}
                      placeholder="0"
                      min="0"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={closeCreateModal}
                    style={{ flex: 1, justifyContent: 'center' }}
                    disabled={createLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleCreateCampaign}
                    disabled={createLoading}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {createLoading ? (
                      <>
                        <CardanoLoader size={18} />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Create Campaign
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Filters */}
      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Filter size={18} style={{ color: '#64748b' }} />
            <select
              className="input-field select-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon purple" style={{ width: '40px', height: '40px', marginBottom: 0 }}>
              <Target size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc' }}>
                {loading ? '...' : campaigns.length}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Campaigns</div>
            </div>
          </div>
        </div>
        <div className="stat-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon green" style={{ width: '40px', height: '40px', marginBottom: 0 }}>
              <Play size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc' }}>
                {loading ? '...' : campaigns.filter(c => c.status === 'active').length}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Active</div>
            </div>
          </div>
        </div>
        <div className="stat-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon cyan" style={{ width: '40px', height: '40px', marginBottom: 0 }}>
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc' }}>
                {loading ? '...' : campaigns.reduce((sum, c) => sum + (c.prospects || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Prospects</div>
            </div>
          </div>
        </div>
        <div className="stat-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon orange" style={{ width: '40px', height: '40px', marginBottom: 0 }}>
              <CheckCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc' }}>
                {loading ? '...' : campaigns.reduce((sum, c) => sum + (c.meetings || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Meetings Booked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="campaigns-grid">
        {loading ? (
          <div style={{ 
            gridColumn: '1 / -1', 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#64748b' 
          }}>
            <CardanoLoader size={48} style={{ marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
            <div>Loading campaigns...</div>
          </div>
        ) : error ? (
          <div style={{ 
            gridColumn: '1 / -1', 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#ef4444' 
          }}>
            <AlertCircle size={32} style={{ marginBottom: '1rem', display: 'block', margin: '0 auto 1rem', opacity: 0.5 }} />
            <div>{error}</div>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div style={{ 
            gridColumn: '1 / -1', 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#64748b' 
          }}>
            <Target size={32} style={{ marginBottom: '1rem', display: 'block', margin: '0 auto 1rem', opacity: 0.5 }} />
            <div>No campaigns found</div>
          </div>
        ) : (
          filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-card">
            <div className="campaign-header">
              <div>
                <div className="campaign-name">{campaign.name}</div>
                <div className="campaign-type">
                  {campaign.channels.map((channel, idx) => (
                    <span key={idx} style={{ marginRight: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      {getChannelIcon(channel)}
                    </span>
                  ))}
                  {campaign.type}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`campaign-status ${campaign.status}`}>{campaign.status}</span>
                <button className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <MoreVertical size={18} style={{ color: '#94a3b8' }} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              <Clock size={14} />
              Started: {campaign.startDate}
            </div>

            {/* Progress Bar */}
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Progress</span>
                <span style={{ fontSize: '0.8rem', color: '#f8fafc' }}>
                  {campaign.prospects > 0 ? Math.round((campaign.contacted / campaign.prospects) * 100) : 0}%
                </span>
              </div>
              <div style={{ height: '6px', background: '#1a1a25', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${campaign.prospects > 0 ? (campaign.contacted / campaign.prospects) * 100 : 0}%`,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            <div className="campaign-stats">
              <div className="campaign-stat">
                <div className="campaign-stat-value">{campaign.prospects.toLocaleString()}</div>
                <div className="campaign-stat-label">Prospects</div>
              </div>
              <div className="campaign-stat">
                <div className="campaign-stat-value">{campaign.contacted.toLocaleString()}</div>
                <div className="campaign-stat-label">Contacted</div>
              </div>
              <div className="campaign-stat">
                <div className="campaign-stat-value">{campaign.responses}</div>
                <div className="campaign-stat-label">Responses</div>
              </div>
              <div className="campaign-stat">
                <div className="campaign-stat-value">{campaign.meetings}</div>
                <div className="campaign-stat-label">Meetings</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              {campaign.status === 'active' ? (
                <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Pause size={16} /> Pause
                </button>
              ) : campaign.status === 'paused' ? (
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Play size={16} /> Resume
                </button>
              ) : (
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Play size={16} /> Start
                </button>
              )}
              <button className="btn btn-secondary" style={{ padding: '0.875rem' }}>
                <Edit size={16} />
              </button>
              <button className="btn btn-secondary" style={{ padding: '0.875rem' }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Campaigns;
