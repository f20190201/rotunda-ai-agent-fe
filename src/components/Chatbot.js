import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User,
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  Mail,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import CardanoLoader from './CardanoLoader';
import api from '../services/api';

const quickPrompts = [
  { icon: TrendingUp, text: "Forecast sales for next quarter" },
  { icon: Users, text: "Enrich lead: john@example.com" },
  { icon: Mail, text: "Help me write a cold email for SaaS companies" },
  { icon: Zap, text: "Analyze our marketing campaign performance" },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hey! 👋 I'm Rotunda AI, your intelligent sales assistant powered by real-time analytics. I can help you:\n\n• **Enrich leads** with company data & intent signals\n• **Forecast sales** using AI predictions\n• **Analyze campaigns** and optimize ROI\n• **Write emails** and outreach messages\n\nHow can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Check backend connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      await api.healthCheck();
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const formatResponse = (response) => {
    // Handle different response formats from the API
    if (typeof response === 'string') {
      return response;
    }
    
    if (response.response) {
      return response.response;
    }
    
    if (response.message) {
      return response.message;
    }

    // For enriched lead data
    if (response.enriched_lead) {
      const lead = response.enriched_lead;
      let formatted = "✅ **Lead Enriched Successfully!**\n\n";
      
      if (lead.enriched_data?.company_info) {
        const company = lead.enriched_data.company_info;
        formatted += "**Company Info:**\n";
        formatted += `• Industry: ${company.industry || 'N/A'}\n`;
        formatted += `• Size: ${company.company_size || 'N/A'}\n`;
        formatted += `• Revenue: ${company.revenue_range || 'N/A'}\n`;
        formatted += `• Location: ${company.location || 'N/A'}\n\n`;
      }
      
      if (lead.enriched_data?.intent_signals) {
        const intent = lead.enriched_data.intent_signals;
        formatted += "**Intent Signals:**\n";
        formatted += `• Engagement Score: ${intent.engagement_score || 'N/A'}/100\n`;
        formatted += `• Buyer Stage: ${intent.buyer_stage || 'N/A'}\n`;
        formatted += `• Recent Activity: ${intent.recent_activity || 'N/A'}\n\n`;
      }
      
      formatted += `**Confidence Score:** ${Math.round((lead.confidence_score || 0) * 100)}%`;
      return formatted;
    }

    // For sales forecast
    if (response.forecast) {
      const forecast = response.forecast;
      let formatted = "📊 **Sales Forecast Results**\n\n";
      
      if (forecast.statistical_analysis?.past_analysis) {
        const stats = forecast.statistical_analysis.past_analysis.summary_statistics;
        formatted += "**Historical Analysis:**\n";
        formatted += `• Average: $${stats?.mean?.toLocaleString() || 'N/A'}\n`;
        formatted += `• Trend: ${forecast.statistical_analysis.past_analysis.trend_analysis?.overall_trend || 'N/A'}\n\n`;
      }
      
      if (forecast.statistical_analysis?.forecast) {
        const pred = forecast.statistical_analysis.forecast;
        formatted += "**Predictions:**\n";
        if (Array.isArray(pred.forecast)) {
          pred.forecast.forEach((val, i) => {
            formatted += `• Period ${i + 1}: $${val?.toLocaleString() || 'N/A'}\n`;
          });
        }
        formatted += "\n";
      }
      
      if (forecast.ai_insights) {
        formatted += `**AI Insights:**\n${forecast.ai_insights}`;
      }
      
      return formatted;
    }

    // For marketing analysis
    if (response.analysis) {
      const analysis = response.analysis;
      let formatted = "📈 **Marketing Analysis Results**\n\n";
      
      if (analysis.statistical_analysis?.summary) {
        const summary = analysis.statistical_analysis.summary;
        formatted += "**Summary:**\n";
        formatted += `• Total Campaigns: ${summary.total_campaigns || 0}\n`;
        formatted += `• Total Spend: $${summary.total_spend?.toLocaleString() || 0}\n`;
        formatted += `• Total Revenue: $${summary.total_revenue?.toLocaleString() || 0}\n`;
        formatted += `• Average ROI: ${summary.average_roi?.toFixed(1) || 0}%\n`;
        formatted += `• Average CTR: ${summary.average_ctr?.toFixed(2) || 0}%\n\n`;
      }
      
      if (analysis.statistical_analysis?.best_campaign) {
        const best = analysis.statistical_analysis.best_campaign;
        formatted += `**Best Performing:** ${best.name} (${best.roi?.toFixed(1)}% ROI)\n\n`;
      }
      
      if (analysis.ai_insights) {
        formatted += `**AI Insights:**\n${analysis.ai_insights}`;
      }
      
      return formatted;
    }

    // Fallback to JSON display
    return JSON.stringify(response, null, 2);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Call the real API
      const response = await api.chat(currentInput, {
        agentId: 'chatagent'
      });

      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: formatResponse(response),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      // If API fails, show error message
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: `⚠️ **Connection Error**\n\nI couldn't reach the backend server. Please make sure:\n\n1. The backend is running at \`${api.BASE_URL}\`\n2. Run \`python main.py\` or start your server\n\nError: ${error.message}`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInputValue(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className={`chat-fab ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <div className="chat-fab-icon">
          <MessageSquare size={24} />
        </div>
        <div className="chat-fab-pulse" />
        <span className="chat-fab-label">AI Assistant</span>
      </button>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="chat-title">Rotunda AI Assistant</div>
              <div className="chat-status">
                {isConnected === null ? (
                  <>
                    <CardanoLoader size={12} />
                    <span>Connecting...</span>
                  </>
                ) : isConnected ? (
                  <>
                    <span className="status-dot" />
                    <span>Connected to backend</span>
                  </>
                ) : (
                  <>
                    <span className="status-dot offline" />
                    <span>Backend offline</span>
                    <button 
                      onClick={checkConnection} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        padding: '2px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <RefreshCw size={12} style={{ color: '#64748b' }} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <button className="chat-close" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`chat-message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className="message-content">
                <div className={`message-bubble ${message.isError ? 'error' : ''}`}>
                  {message.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.startsWith('**') && line.includes('**') ? (
                        <span>
                          {line.split('**').map((part, j) => 
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )}
                        </span>
                      ) : line.startsWith('• ') ? (
                        <div style={{ paddingLeft: '0.5rem' }}>{line}</div>
                      ) : line.startsWith('---') ? (
                        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.75rem 0' }} />
                      ) : line.includes('`') ? (
                        <span>
                          {line.split('`').map((part, j) => 
                            j % 2 === 1 ? (
                              <code key={j} style={{ 
                                background: 'rgba(99, 102, 241, 0.2)', 
                                padding: '0.15rem 0.4rem', 
                                borderRadius: '4px',
                                fontSize: '0.85em'
                              }}>{part}</code>
                            ) : part
                          )}
                        </span>
                      ) : (
                        line
                      )}
                      {i < message.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="message-time">
                  {message.isError && <AlertCircle size={12} style={{ color: '#f59e0b', marginRight: '4px' }} />}
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-message bot">
              <div className="message-avatar">
                <Bot size={16} />
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <CardanoLoader size={16} />
                  <span>Analyzing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="quick-prompts">
            {quickPrompts.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <button 
                  key={index} 
                  className="quick-prompt"
                  onClick={() => handleQuickPrompt(prompt.text)}
                >
                  <Icon size={14} />
                  <span>{prompt.text}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Input */}
        <div className="chat-input-container">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder={isConnected ? "Ask about leads, forecasts, campaigns..." : "Backend offline - check connection"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            disabled={isTyping}
          />
          <button 
            className={`chat-send ${inputValue.trim() ? 'active' : ''}`}
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
