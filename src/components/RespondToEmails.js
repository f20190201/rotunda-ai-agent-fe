import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  Mail, 
  Search, 
  Filter,
  AlertCircle,
  Heart,
  MessageSquare,
  Hash,
  Bot,
  Loader2,
  X,
  Copy,
  Check,
  Sparkles,
  Send,
  RefreshCw,
  Settings
} from 'lucide-react';
import api from '../services/api';
import { mockRetrieveEmails } from '../mocks/emailMocks';

// Flag to switch between mock and real API
// Set to true to use mock data, false to use real API
const USE_MOCK_API = true;

// Valid tone enums from API
const VALID_TONES = ['#Complaint', '#Appreciation', '#Feedback', '#Generic'];

// Helper function to normalize tone value from API
const normalizeTone = (tone) => {
  if (!tone) return '#Generic';
  
  // Convert to string and ensure it starts with #
  const toneStr = String(tone).trim();
  const normalizedTone = toneStr.startsWith('#') ? toneStr : `#${toneStr}`;
  
  // Validate against known tones (case-insensitive)
  const validTone = VALID_TONES.find(
    validTone => validTone.toLowerCase() === normalizedTone.toLowerCase()
  );
  
  return validTone || '#Generic';
};

// Fallback function to determine tone from email content (only used if API doesn't provide tone)
const detectToneFromContent = (subject, body) => {
  const text = `${subject} ${body}`.toLowerCase();
  
  // More comprehensive keyword matching
  const complaintKeywords = [
    'not working', 'broken', 'issue', 'problem', 'error', 'bug', 'disappointed',
    'complaint', 'refund', 'cancel', 'unhappy', 'dissatisfied', 'terrible',
    'worst', 'horrible', 'frustrated', 'angry', 'upset', 'failed', 'failure'
  ];
  
  const appreciationKeywords = [
    'thank', 'thanks', 'appreciate', 'grateful', 'great', 'excellent', 'amazing',
    'love', 'wonderful', 'fantastic', 'awesome', 'perfect', 'brilliant',
    'outstanding', 'impressed', 'pleased', 'satisfied', 'happy'
  ];
  
  const feedbackKeywords = [
    'suggestion', 'feedback', 'improve', 'improvement', 'feature', 'recommend',
    'recommendation', 'idea', 'thought', 'opinion', 'consider', 'should',
    'could', 'would be nice', 'wish', 'hope'
  ];
  
  // Check for complaint keywords (highest priority)
  if (complaintKeywords.some(keyword => text.includes(keyword))) {
    return '#Complaint';
  }
  
  // Check for appreciation keywords
  if (appreciationKeywords.some(keyword => text.includes(keyword))) {
    return '#Appreciation';
  }
  
  // Check for feedback keywords
  if (feedbackKeywords.some(keyword => text.includes(keyword))) {
    return '#Feedback';
  }
  
  // Default to generic
  return '#Generic';
};

// Helper function to format email data from API response
const formatEmailData = (emails) => {
  if (!emails || !Array.isArray(emails)) return [];
  
  return emails.map((email, index) => {
    // Prioritize API's tone field, fallback to content-based detection
    const apiTone = email.tone || email.tone_category || email.sentiment;
    const detectedTone = apiTone 
      ? normalizeTone(apiTone) 
      : detectToneFromContent(email.subject || '', email.body || email.snippet || '');
    
    return {
      id: email.id || email.message_id || email.uid || index + 1,
      from: email.from || email.sender || email.email_address || email.from_address || 'unknown@example.com',
      subject: email.subject || '(No Subject)',
      preview: email.body || email.snippet || email.preview || email.text || email.content || '',
      timestamp: email.timestamp || email.date || email.received_at || email.sent_date || new Date().toISOString(),
      tone: detectedTone,
      campaign: email.campaign || email.folder || 'Inbox'
    };
  });
};

const RespondToEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toneFilter, setToneFilter] = useState('all');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [responseError, setResponseError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [emailConfig, setEmailConfig] = useState({
    email_address: '',
    password: '',
    imap_server: 'imap.gmail.com',
    imap_port: 993,
    folder: 'INBOX',
    limit: 50,
    unread_only: true,
    use_gmail_api: false
  });

  // Fetch emails from API
  const fetchEmails = async () => {
    // Skip validation when using mock API
    if (!USE_MOCK_API) {
      if (!emailConfig.email_address || (!emailConfig.password && !emailConfig.use_gmail_api)) {
        setError('Please configure email settings first');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      
      // Use mock API or real API based on flag
      if (USE_MOCK_API) {
        console.log('Using mock API for email retrieval');
        response = await mockRetrieveEmails(emailConfig);
      } else {
        response = await api.retrieveEmails(emailConfig);
      }
      
      // Handle different response formats
      let emailsList = [];
      if (response.emails) {
        emailsList = response.emails;
      } else if (response.data) {
        emailsList = response.data;
      } else if (Array.isArray(response)) {
        emailsList = response;
      } else if (response.messages) {
        emailsList = response.messages;
      }

      const formattedEmails = formatEmailData(emailsList);
      setEmails(formattedEmails);
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError(err.message || 'Failed to fetch emails. Please check your email configuration.');
    } finally {
      setLoading(false);
    }
  };

  // Load saved email config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('emailRetrievalConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setEmailConfig(prev => ({ ...prev, ...config }));
      } catch (e) {
        console.error('Error loading saved config:', e);
      }
    }
  }, []);

  const handleSaveConfig = () => {
    localStorage.setItem('emailRetrievalConfig', JSON.stringify(emailConfig));
    setShowConfigModal(false);
    fetchEmails();
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          email.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTone = toneFilter === 'all' || email.tone === toneFilter;
    return matchesSearch && matchesTone;
  });

  const getToneBadge = (tone) => {
    const toneMap = {
      '#Complaint': { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', icon: AlertCircle },
      '#Appreciation': { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', icon: Heart },
      '#Feedback': { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', icon: MessageSquare },
      '#Generic': { bg: 'rgba(100, 116, 139, 0.15)', color: '#64748b', icon: Hash },
    };
    const config = toneMap[tone] || toneMap['#Generic'];
    const Icon = config.icon;
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        background: config.bg,
        color: config.color,
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem'
      }}>
        <Icon size={12} />
        {tone}
      </span>
    );
  };

  const handleEmailClick = (email) => {
    if (email.tone === '#Complaint') {
      setSelectedEmail(email);
      setShowComplaintModal(true);
      setAiResponse(null);
      setResponseError(null);
      document.body.style.overflow = 'hidden';
    }
  };

  const handleGenerateResponse = async () => {
    if (!selectedEmail) return;

    setLoadingResponse(true);
    setResponseError(null);
    setAiResponse(null);

    try {
      const emailContent = selectedEmail.preview || selectedEmail.body || '';
      const response = await api.resolveEmailComplaint(
        emailContent,
        {
          email: selectedEmail.from,
          subject: selectedEmail.subject
        },
        'rotunda-frontend-agent'
      );

      setAiResponse(response.resolution);
    } catch (error) {
      console.error('Error generating response:', error);
      setResponseError(error.message);
    } finally {
      setLoadingResponse(false);
    }
  };

  const handleCopyResponse = () => {
    if (aiResponse?.response) {
      navigator.clipboard.writeText(aiResponse.response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const closeComplaintModal = () => {
    setShowComplaintModal(false);
    setSelectedEmail(null);
    setAiResponse(null);
    setResponseError(null);
    document.body.style.overflow = 'auto';
  };

  const handleModalScroll = (e) => {
    e.stopPropagation();
  };

  const complaintCount = emails.filter(e => e.tone === '#Complaint').length;
  const totalEmails = emails.length;
  const complaintPercentage = totalEmails > 0 ? (complaintCount / totalEmails) * 100 : 0;
  const showTenorGifHigh = complaintPercentage >= 75 && complaintPercentage <= 100;
  const showTenorGifMedium = complaintPercentage >= 50 && complaintPercentage < 75;
  const showTenorGifLow = complaintPercentage >= 25 && complaintPercentage < 50;
  const showTenorGif = showTenorGifHigh || showTenorGifMedium || showTenorGifLow;

  // Load Tenor embed script if needed
  useEffect(() => {
    if (showTenorGif) {
      // Check if script already exists
      let script = document.querySelector('script[src="https://tenor.com/embed.js"]');
      
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://tenor.com/embed.js';
        script.async = true;
        script.type = 'text/javascript';
        document.body.appendChild(script);
      }

      return () => {
        // Don't remove script on cleanup to avoid reloading
      };
    }
  }, [showTenorGif]);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div className="page-title">Respond to Emails</div>
          <div className="page-subtitle">Manage and respond to incoming customer emails</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowConfigModal(true)}
          >
            <Settings size={18} />
            Configure
          </button>
          <button 
            className="btn btn-primary" 
            onClick={fetchEmails}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Fetch Emails
              </>
            )}
          </button>
        </div>
        {/* GIF in top right */}
        {complaintCount > 0 && (
          <div style={{ position: 'relative', width: '150px', height: '150px' }}>
            {showTenorGifHigh ? (
              <div 
              className="tenor-gif-embed" 
              data-postid="21433767" 
              data-share-method="host" 
              data-aspect-ratio="1.66667" 
              data-width="100%"
              style={{ width: '150px', height: '150px', maxWidth: '150px', maxHeight: '150px' }}
            >
              <a href="https://tenor.com/view/jethalal-angry-tarak-mehta-ka-ooltah-chashmah-gif-21433767">
                Jethalal Angry Tarak Mehta Ka Ooltah Chashmah GIF
              </a>
              from <a href="https://tenor.com/search/jethalal+angry-gifs">Jethalal Angry GIFs</a>
            </div>
            ) : showTenorGifMedium ? (

                <div 
                className="tenor-gif-embed" 
                data-postid="19312105" 
                data-share-method="host" 
                data-aspect-ratio="1.09215" 
                data-width="100%"
                style={{ width: '150px', height: '150px', maxWidth: '150px', maxHeight: '150px' }}
              >
                <a href="https://tenor.com/view/jethalal-jethalal-champaklal-gada-tmkoc-tarak-mehta-jethalal-angry-gif-19312105">
                  Jethalal Jethalal Champaklal Gada GIF
                </a>
                from <a href="https://tenor.com/search/jethalal-gifs">Jethalal GIFs</a>
              </div>
              
            ) : showTenorGifLow ? (
              <div 
                className="tenor-gif-embed" 
                data-postid="27709993" 
                data-share-method="host" 
                data-aspect-ratio="1" 
                data-width="100%"
                style={{ width: '150px', height: '150px', maxWidth: '150px', maxHeight: '150px' }}
              >
                <a href="https://tenor.com/view/angry-girl-gif-27709993">
                  Angry Girl GIF
                </a>
                from <a href="https://tenor.com/search/angry-gifs">Angry GIFs</a>
              </div>
            ) : (
              <>
                <img 
                  src="/jethalal-happy.gif" 
                  alt="Happy Jethalal GIF"
                  style={{
                    width: '150px',
                    height: '150px',
                    maxWidth: '150px',
                    maxHeight: '150px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    border: '2px solid rgba(16, 185, 129, 0.3)'
                  }}
                />
                {complaintCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    border: '2px solid #12121a'
                  }}>
                    {complaintCount}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-card" style={{ 
          marginBottom: '1.5rem', 
          padding: '1rem', 
          background: 'rgba(239, 68, 68, 0.1)', 
          borderRadius: '12px',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Filter size={18} style={{ color: '#64748b' }} />
            <select
              className="input-field select-field"
              value={toneFilter}
              onChange={(e) => setToneFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">All Tones</option>
              <option value="#Complaint">#Complaint</option>
              <option value="#Appreciation">#Appreciation</option>
              <option value="#Feedback">#Feedback</option>
              <option value="#Generic">#Generic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Emails Table */}
      <div className="glass-card">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <Loader2 size={32} className="spin" style={{ marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
            <div>Fetching emails...</div>
          </div>
        ) : filteredEmails.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <Mail size={32} style={{ marginBottom: '1rem', display: 'block', margin: '0 auto 1rem', opacity: 0.5 }} />
            <div>{emails.length === 0 ? 'No emails found. Click "Fetch Emails" to retrieve emails.' : 'No emails match your filters.'}</div>
          </div>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Preview</th>
                <th>Tone</th>
                <th>Campaign</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmails.map((email) => (
              <tr 
                key={email.id} 
                style={{ 
                  cursor: email.tone === '#Complaint' ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleEmailClick(email)}
                onMouseEnter={(e) => {
                  if (email.tone === '#Complaint') {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <td style={{ color: '#f8fafc', fontWeight: '500' }}>{email.from}</td>
                <td style={{ color: '#f8fafc' }}>{email.subject}</td>
                <td style={{ color: '#94a3b8', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {email.preview}
                </td>
                <td>{getToneBadge(email.tone)}</td>
                <td style={{ color: '#94a3b8' }}>{email.campaign}</td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#64748b' }}>
                  {email.timestamp}
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Complaint Modal - Portal */}
      {showComplaintModal && selectedEmail && ReactDOM.createPortal(
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
            onClick={closeComplaintModal}
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
              maxWidth: '800px',
              maxHeight: '85vh',
              overflow: 'auto',
              zIndex: 9999
            }}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleModalScroll}
          >
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <AlertCircle size={24} style={{ color: '#ef4444' }} />
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Customer Complaint</h2>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  <strong>From:</strong> {selectedEmail.from}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  <strong>Subject:</strong> {selectedEmail.subject}
                </div>
              </div>
              <button 
                onClick={closeComplaintModal}
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

            {/* Email Content */}
            <div style={{ 
              padding: '1.5rem', 
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '16px',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#c4c9d4', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                {selectedEmail.preview}
              </div>
            </div>

            {/* AI Response Section */}
            {!aiResponse ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={handleGenerateResponse}
                  disabled={loadingResponse}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {loadingResponse ? (
                    <>
                      <Loader2 size={18} className="spin" />
                      Generating AI Response...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Respond using AI
                    </>
                  )}
                </button>
                {responseError && (
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    borderRadius: '12px',
                    color: '#ef4444',
                    fontSize: '0.875rem'
                  }}>
                    ⚠️ {responseError}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bot size={18} style={{ color: '#6366f1' }} />
                    <span style={{ fontWeight: '600' }}>AI-Generated Response</span>
                  </div>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleCopyResponse}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                
                <div style={{ 
                  padding: '1.5rem', 
                  background: 'rgba(99, 102, 241, 0.08)', 
                  borderRadius: '16px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  marginBottom: '1rem'
                }}>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#c4c9d4', 
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Outfit, sans-serif'
                  }}
                  dangerouslySetInnerHTML={{ __html: aiResponse.response }}
                  >
                    {/* {aiResponse.response} */}
                  </div>
                </div>

                {aiResponse.resolved && (
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <Check size={20} style={{ color: '#10b981' }} />
                    <span style={{ color: '#10b981', fontWeight: '500' }}>
                      Complaint marked as resolved
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <Send size={18} />
                    Send Response
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setAiResponse(null);
                      setResponseError(null);
                    }}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        </>,
        document.body
      )}

      {/* Email Configuration Modal - Portal */}
      {showConfigModal && ReactDOM.createPortal(
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
            onClick={() => setShowConfigModal(false)}
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
              maxWidth: '600px',
              maxHeight: '85vh',
              overflow: 'auto',
              zIndex: 9999
            }}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleModalScroll}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Email Configuration</h2>
              <button 
                onClick={() => setShowConfigModal(false)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Email Address *</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="your.email@example.com"
                  value={emailConfig.email_address}
                  onChange={(e) => setEmailConfig({ ...emailConfig, email_address: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Password / App Password *</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter your password or app password"
                  value={emailConfig.password}
                  onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
                />
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  For Gmail, use an App Password instead of your regular password
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">IMAP Server</label>
                  <input
                    type="text"
                    className="input-field"
                    value={emailConfig.imap_server}
                    onChange={(e) => setEmailConfig({ ...emailConfig, imap_server: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">IMAP Port</label>
                  <input
                    type="number"
                    className="input-field"
                    value={emailConfig.imap_port}
                    onChange={(e) => setEmailConfig({ ...emailConfig, imap_port: parseInt(e.target.value) || 993 })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Folder</label>
                  <input
                    type="text"
                    className="input-field"
                    value={emailConfig.folder}
                    onChange={(e) => setEmailConfig({ ...emailConfig, folder: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Limit</label>
                  <input
                    type="number"
                    className="input-field"
                    value={emailConfig.limit}
                    onChange={(e) => setEmailConfig({ ...emailConfig, limit: parseInt(e.target.value) || 50 })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                <input
                  type="checkbox"
                  checked={emailConfig.unread_only}
                  onChange={(e) => setEmailConfig({ ...emailConfig, unread_only: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label style={{ cursor: 'pointer', flex: 1 }}>Only fetch unread emails</label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowConfigModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSaveConfig}
                  disabled={!emailConfig.email_address || (!emailConfig.password && !emailConfig.use_gmail_api)}
                  style={{ flex: 1 }}
                >
                  Save & Fetch
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default RespondToEmails;

