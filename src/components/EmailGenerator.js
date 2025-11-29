import React, { useState } from 'react';
import { 
  Mail, 
  Sparkles, 
  Send, 
  Copy, 
  Check,
  Loader2,
  FileText,
  User,
  Building,
  Target,
  RefreshCw,
  Eye
} from 'lucide-react';
import api from '../services/api';

const promptTemplates = [
  {
    title: "SaaS Product Launch",
    prompt: "Create a cold email for launching a new AI-powered sales automation tool targeting VP of Sales at mid-market SaaS companies. Highlight 3x response rate improvement and time savings."
  },
  {
    title: "Follow-up Email",
    prompt: "Write a follow-up email for prospects who opened our initial email but didn't respond. Keep it short, add value with a case study mention, and create urgency."
  },
  {
    title: "Meeting Request",
    prompt: "Create a personalized meeting request email for C-suite executives in the healthcare industry. Focus on compliance and ROI benefits."
  },
  {
    title: "Re-engagement Campaign",
    prompt: "Write a re-engagement email for leads who went cold 3 months ago. Mention new features and offer an exclusive demo."
  }
];

const EmailGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailResponse, setEmailResponse] = useState(null); // Full API response
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('html'); // 'html', 'plain'

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt describing the email you want to generate');
      return;
    }

    setLoading(true);
    setError(null);
    setEmailResponse(null);

    try {
      const response = await api.generateHtmlEmail(prompt);
      console.log('HTML email response:', response);
      setEmailResponse(response);
    } catch (err) {
      console.error('Email generation error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!emailResponse) return;
    
    let textToCopy = '';
    if (viewMode === 'html') {
      textToCopy = emailResponse.html_email || '';
    } else if (viewMode === 'plain') {
      textToCopy = emailResponse.plain_text || '';
    }
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTemplateSelect = (template) => {
    setPrompt(template.prompt);
  };

  const renderEmailPreview = () => {
    if (!emailResponse) return null;

    if (viewMode === 'html') {
      return (
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '16px', 
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ 
            padding: '1rem', 
            borderBottom: '1px solid #e5e7eb',
            background: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Mail size={18} style={{ color: '#6366f1' }} />
            <span style={{ fontWeight: '600', color: '#374151' }}>HTML Email Preview</span>
          </div>
          <div 
            style={{ 
              padding: '1rem',
              maxHeight: '600px',
              overflow: 'auto',
              background: '#f9fafb'
            }}
            dangerouslySetInnerHTML={{ __html: emailResponse.html_email || '' }}
          />
        </div>
      );
    } else if (viewMode === 'plain') {
      return (
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '16px', 
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ 
            padding: '1rem', 
            borderBottom: '1px solid #e5e7eb',
            background: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FileText size={18} style={{ color: '#6366f1' }} />
            <span style={{ fontWeight: '600', color: '#374151' }}>Plain Text Version</span>
          </div>
          <div 
            style={{ 
              padding: '1.5rem',
              maxHeight: '600px',
              overflow: 'auto',
              fontSize: '0.95rem',
              lineHeight: '1.7',
              color: '#374151',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace'
            }}
            dangerouslySetInnerHTML={{ __html: emailResponse.plain_text || '' }}
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="fade-in">
      <div className="page-title">Send AI Marketing Emails</div>
      <div className="page-subtitle">Generate AI-powered cold emails for your outreach campaigns</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left Column - Input */}
        <div>
          {/* Prompt Templates */}
          <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
            <div className="glass-card-header" style={{ marginBottom: '1rem' }}>
              <div className="glass-card-title">
                <Target /> Quick Templates
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {promptTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateSelect(template)}
                  style={{
                    padding: '1rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#f8fafc', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                    {template.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>
                    {template.prompt.substring(0, 60)}...
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="glass-card">
            <div className="glass-card-header" style={{ marginBottom: '1rem' }}>
              <div className="glass-card-title">
                <FileText /> Email Prompt
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Describe the email you want to generate</label>
              <textarea
                className="input-field textarea-field"
                placeholder="E.g., Create a cold email for launching a new AI-powered sales tool targeting VP of Sales at SaaS companies. Highlight time savings and ROI benefits..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={{ minHeight: '180px' }}
              />
            </div>

            {error && (
              <div style={{ 
                padding: '1rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                borderRadius: '12px',
                color: '#ef4444',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={handleGenerate}
                disabled={loading}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Email
                  </>
                )}
              </button>
              
              {emailResponse && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setEmailResponse(null);
                    setPrompt('');
                  }}
                >
                  <RefreshCw size={18} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="glass-card" style={{ marginTop: '1.5rem' }}>
            <div className="glass-card-title" style={{ marginBottom: '1rem' }}>
              <Sparkles /> Pro Tips
            </div>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: '1.8' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <User size={16} style={{ color: '#6366f1', marginTop: '2px', flexShrink: 0 }} />
                <span>Specify your <strong style={{ color: '#f8fafc' }}>target audience</strong> (job title, industry)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Building size={16} style={{ color: '#8b5cf6', marginTop: '2px', flexShrink: 0 }} />
                <span>Mention your <strong style={{ color: '#f8fafc' }}>value proposition</strong> and key benefits</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <Target size={16} style={{ color: '#06b6d4', marginTop: '2px', flexShrink: 0 }} />
                <span>Include the <strong style={{ color: '#f8fafc' }}>desired action</strong> (meeting, demo, reply)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Output */}
        <div>
          <div className="glass-card" style={{ minHeight: '400px' }}>
            <div className="glass-card-header">
              <div className="glass-card-title">
                <Mail /> Generated Email
              </div>
              {emailResponse && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className={`btn ${viewMode === 'html' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setViewMode('html')}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                  >
                    <Eye size={14} />
                    HTML
                  </button>
                  <button
                    className={`btn ${viewMode === 'plain' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setViewMode('plain')}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                  >
                    <FileText size={14} />
                    Plain
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCopy}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>

            {emailResponse ? (
              renderEmailPreview()
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                height: '300px',
                color: '#64748b',
                textAlign: 'center'
              }}>
                <Mail size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <div style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No email generated yet</div>
                <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                  Enter a prompt and click "Generate Email" to create your outreach email
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {emailResponse && (
            <div className="glass-card" style={{ marginTop: '1.5rem' }}>
              <div className="glass-card-title" style={{ marginBottom: '1rem' }}>
                <Send /> Next Steps
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Send size={18} />
                  Add to Campaign
                </button>
                <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Mail size={18} />
                  Send Email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailGenerator;

