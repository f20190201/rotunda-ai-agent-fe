import React, { useState } from 'react';
import { 
  Bot, 
  MessageSquare, 
  Clock,
  Zap,
  Globe,
  Mail,
  Linkedin,
  Phone,
  Sliders,
  Brain,
  AlertCircle,
  Save,
  RotateCcw
} from 'lucide-react';

const AgentSettings = () => {
  const [settings, setSettings] = useState({
    autoRespond: true,
    followUpEnabled: true,
    sentimentAnalysis: true,
    personalization: true,
    abTesting: false,
    emailChannel: true,
    linkedinChannel: true,
    phoneChannel: false,
    aggressiveness: 60,
    responseDelay: 30,
    maxFollowUps: 5,
    workingHoursOnly: true,
    timezone: 'America/New_York',
    tone: 'professional',
    language: 'en',
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSliderChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div className="page-title">Agent Settings</div>
          <div className="page-subtitle">Configure your AI sales agent behavior and preferences</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary">
            <RotateCcw size={18} />
            Reset Defaults
          </button>
          <button className="btn btn-primary">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>

      {/* AI Behavior Section */}
      <div className="settings-section">
        <div className="settings-section-title">
          <Brain size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          AI Behavior
        </div>
        <div className="settings-grid">
          <div className="setting-card">
            <div className="setting-header">
              <div className="setting-title">
                <Zap /> Auto-Respond
              </div>
              <div 
                className={`toggle ${settings.autoRespond ? 'active' : ''}`}
                onClick={() => handleToggle('autoRespond')}
              />
            </div>
            <div className="setting-description">
              Allow AI to automatically respond to incoming messages and inquiries based on context and intent.
            </div>
          </div>

          <div className="setting-card">
            <div className="setting-header">
              <div className="setting-title">
                <Clock /> Smart Follow-ups
              </div>
              <div 
                className={`toggle ${settings.followUpEnabled ? 'active' : ''}`}
                onClick={() => handleToggle('followUpEnabled')}
              />
            </div>
            <div className="setting-description">
              Automatically schedule and send follow-up messages to prospects who haven't responded.
            </div>
          </div>

          <div className="setting-card">
            <div className="setting-header">
              <div className="setting-title">
                <Brain /> Sentiment Analysis
              </div>
              <div 
                className={`toggle ${settings.sentimentAnalysis ? 'active' : ''}`}
                onClick={() => handleToggle('sentimentAnalysis')}
              />
            </div>
            <div className="setting-description">
              Analyze prospect responses to detect sentiment and adjust messaging strategy accordingly.
            </div>
          </div>

          <div className="setting-card">
            <div className="setting-header">
              <div className="setting-title">
                <MessageSquare /> Deep Personalization
              </div>
              <div 
                className={`toggle ${settings.personalization ? 'active' : ''}`}
                onClick={() => handleToggle('personalization')}
              />
            </div>
            <div className="setting-description">
              Use AI to research prospects and create highly personalized outreach messages.
            </div>
          </div>
        </div>
      </div>

      {/* Outreach Channels */}
      <div className="settings-section">
        <div className="settings-section-title">
          <Globe size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Outreach Channels
        </div>
        <div className="settings-grid">
          <div className="setting-card">
            <div className="setting-header">
              <div className="setting-title">
                <Mail /> Email Outreach
              </div>
              <div 
                className={`toggle ${settings.emailChannel ? 'active' : ''}`}
                onClick={() => handleToggle('emailChannel')}
              />
            </div>
            <div className="setting-description">
              Enable AI-powered email sequences with smart timing and personalization.
            </div>
          </div>

          <div className="setting-card">
            <div className="setting-header">
              <div className="setting-title">
                <Linkedin /> LinkedIn Automation
              </div>
              <div 
                className={`toggle ${settings.linkedinChannel ? 'active' : ''}`}
                onClick={() => handleToggle('linkedinChannel')}
              />
            </div>
            <div className="setting-description">
              Automate LinkedIn connection requests, messages, and engagement.
            </div>
          </div>

          <div className="setting-card">
            <div className="setting-header">
              <div className="setting-title">
                <Phone /> Voice Calling
              </div>
              <div 
                className={`toggle ${settings.phoneChannel ? 'active' : ''}`}
                onClick={() => handleToggle('phoneChannel')}
              />
            </div>
            <div className="setting-description">
              Enable AI voice agent for automated cold calls and follow-up calls.
            </div>
            {!settings.phoneChannel && (
              <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#f59e0b' }}>
                <AlertCircle size={14} />
                Requires additional setup
              </div>
            )}
          </div>

          <div className="setting-card">
            <div className="setting-header">
              <div className="setting-title">
                <Sliders /> A/B Testing
              </div>
              <div 
                className={`toggle ${settings.abTesting ? 'active' : ''}`}
                onClick={() => handleToggle('abTesting')}
              />
            </div>
            <div className="setting-description">
              Automatically test different message variations to optimize response rates.
            </div>
          </div>
        </div>
      </div>

      {/* Agent Parameters */}
      <div className="settings-section">
        <div className="settings-section-title">
          <Sliders size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Agent Parameters
        </div>
        <div className="glass-card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div>
              <div className="input-label">Outreach Aggressiveness</div>
              <div className="slider-container">
                <input
                  type="range"
                  className="slider"
                  min="0"
                  max="100"
                  value={settings.aggressiveness}
                  onChange={(e) => handleSliderChange('aggressiveness', e.target.value)}
                />
                <div className="slider-labels">
                  <span>Conservative</span>
                  <span style={{ color: '#6366f1', fontWeight: '600' }}>{settings.aggressiveness}%</span>
                  <span>Aggressive</span>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                Controls how frequently and persistently the agent reaches out to prospects.
              </div>
            </div>

            <div>
              <div className="input-label">Response Delay (minutes)</div>
              <div className="slider-container">
                <input
                  type="range"
                  className="slider"
                  min="0"
                  max="120"
                  value={settings.responseDelay}
                  onChange={(e) => handleSliderChange('responseDelay', e.target.value)}
                />
                <div className="slider-labels">
                  <span>Instant</span>
                  <span style={{ color: '#6366f1', fontWeight: '600' }}>{settings.responseDelay} min</span>
                  <span>2 hours</span>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                Add a natural delay before AI responds to make interactions feel more human.
              </div>
            </div>

            <div>
              <div className="input-label">Maximum Follow-ups</div>
              <div className="slider-container">
                <input
                  type="range"
                  className="slider"
                  min="1"
                  max="10"
                  value={settings.maxFollowUps}
                  onChange={(e) => handleSliderChange('maxFollowUps', e.target.value)}
                />
                <div className="slider-labels">
                  <span>1</span>
                  <span style={{ color: '#6366f1', fontWeight: '600' }}>{settings.maxFollowUps} follow-ups</span>
                  <span>10</span>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                Maximum number of follow-up messages per prospect before stopping.
              </div>
            </div>

            <div>
              <div className="input-group">
                <label className="input-label">Communication Tone</label>
                <select 
                  className="input-field select-field"
                  value={settings.tone}
                  onChange={(e) => setSettings(prev => ({ ...prev, tone: e.target.value }))}
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly & Casual</option>
                  <option value="formal">Formal</option>
                  <option value="conversational">Conversational</option>
                </select>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Set the overall tone for AI-generated messages.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule & Timezone */}
      <div className="settings-section">
        <div className="settings-section-title">
          <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Schedule & Timezone
        </div>
        <div className="settings-grid">
          <div className="setting-card">
            <div className="setting-header">
              <div className="setting-title">
                <Clock /> Working Hours Only
              </div>
              <div 
                className={`toggle ${settings.workingHoursOnly ? 'active' : ''}`}
                onClick={() => handleToggle('workingHoursOnly')}
              />
            </div>
            <div className="setting-description">
              Only send outreach during business hours (9 AM - 6 PM) in the prospect's timezone.
            </div>
          </div>

          <div className="setting-card">
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Default Timezone</label>
              <select 
                className="input-field select-field"
                value={settings.timezone}
                onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">GMT (London)</option>
                <option value="Europe/Paris">CET (Paris)</option>
                <option value="Asia/Tokyo">JST (Tokyo)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* AI Persona */}
      <div className="settings-section">
        <div className="settings-section-title">
          <Bot size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          AI Persona Configuration
        </div>
        <div className="glass-card">
          <div className="input-group">
            <label className="input-label">Agent Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g., Alex from Sales"
              defaultValue="Alex"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Company Value Proposition</label>
            <textarea 
              className="input-field textarea-field" 
              placeholder="Describe your company's main value proposition that the AI should emphasize..."
              defaultValue="We help small to medium businesses automate their sales outreach with AI, increasing response rates by 3x while saving 20+ hours per week."
            />
          </div>
          <div className="input-group">
            <label className="input-label">Custom Instructions</label>
            <textarea 
              className="input-field textarea-field" 
              placeholder="Add any specific instructions for how the AI should behave..."
              defaultValue="Always be respectful of prospect's time. If they mention they're not interested, thank them politely and mark as not interested. Focus on solving their problems rather than pushing features."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSettings;

