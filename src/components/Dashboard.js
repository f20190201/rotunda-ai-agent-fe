import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { 
  TrendingUp, 
  Users, 
  Mail, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Sparkles,
  BarChart3,
  DollarSign,
  X,
  Eye,
  Phone,
  Award,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../services/api';
import { chartColors, getColorFromEntry } from '../constants/colors';
import CardanoLoader from './CardanoLoader';

// Custom Liquid Glass Tooltip Component
const LiquidGlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  // Get primary color from first payload item
  const primaryColor = payload[0]?.color || '#6366f1';
  
  return (
    <div className="liquid-glass-tooltip" style={{
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.6) 0%, rgba(139, 92, 246, 0.6) 50%, rgba(6, 182, 212, 0.6) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      borderRadius: '20px',
      padding: '1rem 1.25rem',
      boxShadow: `
        0 8px 32px rgba(99, 102, 241, 0.3),
        0 4px 16px rgba(139, 92, 246, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.3)
      `,
      position: 'relative',
      overflow: 'hidden',
      minWidth: '180px'
    }}>
      {/* Animated background gradient overlay */}
      <div className="tooltip-glow-overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 50% 0%, ${primaryColor}30 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />
      
      {/* Shimmer effect */}
      <div className="tooltip-shimmer" style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'shimmer 3s infinite'
      }} />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '0.875rem',
          fontWeight: '700',
          color: '#f8fafc',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          {label}
        </div>
        {payload.map((entry, index) => {
          // Use centralized color library
          const color = getColorFromEntry(entry);
          
          return (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: index < payload.length - 1 ? '0.5rem' : '0',
              padding: '0.5rem',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="tooltip-dot" style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  // background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                  backgroundColor: color,
                  color, // Set color property so currentColor works in dotPulse animation
                  boxShadow: `0 0 12px ${color}80, 0 0 6px ${color}40`
                }} />
                <span style={{
                  fontSize: '0.8rem',
                  color: '#cbd5e1',
                  fontWeight: '500'
                }}>
                  {entry.name}:
                </span>
              </div>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#f8fafc',
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
              }}>
                {typeof entry.value === 'number' 
                  ? entry.value.toLocaleString() 
                  : entry.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const revenueData = [
  { name: 'Jan', value: 4000, leads: 240 },
  { name: 'Feb', value: 3000, leads: 198 },
  { name: 'Mar', value: 5000, leads: 320 },
  { name: 'Apr', value: 4500, leads: 278 },
  { name: 'May', value: 6000, leads: 389 },
  { name: 'Jun', value: 5500, leads: 356 },
  { name: 'Jul', value: 7000, leads: 423 },
  { name: 'Aug', value: 8500, leads: 512 },
];

const conversionData = [
  { name: 'Email', value: 45, color: chartColors.email },
  { name: 'LinkedIn', value: 30, color: chartColors.linkedin },
  { name: 'Cold Call', value: 15, color: chartColors.coldCall },
  { name: 'Referral', value: 10, color: chartColors.referral },
];

const weeklyOutreach = [
  { day: 'Mon', emails: 120, calls: 45, linkedin: 60 },
  { day: 'Tue', emails: 150, calls: 52, linkedin: 75 },
  { day: 'Wed', emails: 180, calls: 61, linkedin: 90 },
  { day: 'Thu', emails: 140, calls: 48, linkedin: 70 },
  { day: 'Fri', emails: 200, calls: 72, linkedin: 100 },
  { day: 'Sat', emails: 80, calls: 20, linkedin: 40 },
  { day: 'Sun', emails: 60, calls: 15, linkedin: 30 },
];

const recentActivities = [
  { id: 1, title: 'New lead qualified', subtitle: 'John Smith from Acme Corp', time: '2 min ago', type: 'success' },
  { id: 2, title: 'Campaign "Q4 Outreach" started', subtitle: '500 prospects added', time: '15 min ago', type: 'info' },
  { id: 3, title: 'Meeting scheduled', subtitle: 'Sarah Johnson - Demo call', time: '1 hour ago', type: 'success' },
  { id: 4, title: 'AI response rate improved', subtitle: '+12% this week', time: '2 hours ago', type: 'warning' },
];

const Dashboard = () => {
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [forecastError, setForecastError] = useState(null);
  
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // Handle modal open/close with body scroll lock
  const openAnalysisModal = () => {
    setShowAnalysisModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAnalysisModal = () => {
    setShowAnalysisModal(false);
    document.body.style.overflow = 'auto';
  };

  // Prevent scroll propagation from modal
  const handleModalScroll = (e) => {
    e.stopPropagation();
  };

  // Generate Sales Forecast
  const handleGenerateForecast = async () => {
    setForecastLoading(true);
    setForecastError(null);
    
    try {
      // Format historical data - 3 months only
      const historicalData = {
        months: ["Jan", "Feb", "Mar"],
        sales: [100000, 120000, 110000]
      };
      
      console.log('Sending historical data:', historicalData);
      
      const response = await api.salesForecast(
        "Forecast sales for next 3 months based on our historical data",
        historicalData
      );
      
      console.log('Forecast response:', response);
      setForecastData(response.forecast);
    } catch (error) {
      console.error('Forecast error:', error);
      setForecastError(error.message);
    } finally {
      setForecastLoading(false);
    }
  };

  // Generate Marketing Analysis
  const handleMarketingAnalysis = async () => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    
    try {
      const campaignData = {
        campaigns: [
          {
            name: "Q4 Enterprise Outreach",
            channel: "Email",
            impressions: 100000,
            clicks: 5000,
            conversions: 500,
            spend: 10000,
            revenue: 50000
          },
          {
            name: "LinkedIn Campaign",
            channel: "Social Media",
            impressions: 75000,
            clicks: 3000,
            conversions: 300,
            spend: 8000,
            revenue: 35000
          },
          {
            name: "Cold Call Blitz",
            channel: "Phone",
            impressions: 5000,
            clicks: 2000,
            conversions: 400,
            spend: 15000,
            revenue: 80000
          }
        ]
      };
      
      const response = await api.marketingAnalysis(
        "Analyze ROI and performance across all our marketing channels",
        campaignData
      );
      
      setAnalysisData(response.analysis);
    } catch (error) {
      setAnalysisError(error.message);
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'N/A';
    return `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // Format percentage
  const formatPercent = (value) => {
    if (!value && value !== 0) return 'N/A';
    return `${Number(value).toFixed(1)}%`;
  };

  return (
    <div className="fade-in">
      <div className="page-title">Sales Dashboard</div>
      <div className="page-subtitle">Monitor your AI-powered outreach performance and analytics</div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <TrendingUp size={24} />
          </div>
          <div className="stat-value">$124,500</div>
          <div className="stat-label">Revenue Generated</div>
          <div className="stat-change positive">
            <ArrowUpRight size={14} />
            <span>+23.5% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Users size={24} />
          </div>
          <div className="stat-value">2,847</div>
          <div className="stat-label">Leads Generated</div>
          <div className="stat-change positive">
            <ArrowUpRight size={14} />
            <span>+18.2% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Mail size={24} />
          </div>
          <div className="stat-value">15,234</div>
          <div className="stat-label">Emails Sent</div>
          <div className="stat-change positive">
            <ArrowUpRight size={14} />
            <span>+31.4% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cyan">
            <Target size={24} />
          </div>
          <div className="stat-value">34.8%</div>
          <div className="stat-label">Conversion Rate</div>
          <div className="stat-change negative">
            <ArrowDownRight size={14} />
            <span>-2.1% from last month</span>
          </div>
        </div>
      </div>

      {/* AI-Powered Insights Section */}
      <div className="charts-section" style={{ marginBottom: '2rem' }}>
        {/* Sales Forecast Card */}
        <div className="glass-card">
          <div className="glass-card-header">
            <div className="glass-card-title">
              <Brain /> AI Sales Forecast
            </div>
            <button 
              className="btn btn-primary" 
              onClick={handleGenerateForecast}
              disabled={forecastLoading}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              {forecastLoading ? (
                <>
                  <CardanoLoader size={16} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Forecast
                </>
              )}
            </button>
          </div>
          
          {forecastError && (
            <div style={{ 
              padding: '1rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              borderRadius: '12px',
              color: '#ef4444',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              ⚠️ {forecastError} - Make sure backend is running
            </div>
          )}
          
          {forecastData ? (
            <div>
              {/* Forecast Value */}
              {forecastData.statistical_analysis?.forecast && (
                <div style={{ 
                  padding: '1.25rem', 
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)', 
                  borderRadius: '16px',
                  marginBottom: '1rem',
                  border: '1px solid rgba(99, 102, 241, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <DollarSign size={18} style={{ color: '#6366f1' }} />
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Next Period Forecast</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
                    {formatCurrency(forecastData.statistical_analysis.forecast.forecast?.[0])}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                    <span style={{ color: '#10b981' }}>
                      ↑ {formatCurrency(forecastData.statistical_analysis.forecast.confidence_intervals?.upper?.[0])}
                    </span>
                    <span style={{ color: '#ef4444' }}>
                      ↓ {formatCurrency(forecastData.statistical_analysis.forecast.confidence_intervals?.lower?.[0])}
                    </span>
                    <span style={{ color: '#64748b' }}>
                      Model: {forecastData.statistical_analysis.model_used || 'ARIMA'}
                    </span>
                  </div>
                </div>
              )}

              {/* Summary Stats Grid */}
              {forecastData.statistical_analysis?.past_analysis && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>
                      {formatCurrency(forecastData.statistical_analysis.past_analysis.summary_statistics?.mean)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Average Sales</div>
                  </div>
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '700', 
                      color: forecastData.statistical_analysis.past_analysis.trend_analysis?.overall_trend === 'increasing' ? '#10b981' : '#ef4444'
                    }}>
                      {forecastData.statistical_analysis.past_analysis.trend_analysis?.overall_trend === 'increasing' ? '↑' : '↓'} {forecastData.statistical_analysis.past_analysis.trend_analysis?.overall_trend}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Trend</div>
                  </div>
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>
                      {formatPercent(forecastData.statistical_analysis.past_analysis.volatility?.coefficient_of_variation)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Volatility</div>
                  </div>
                </div>
              )}

              {/* Best/Worst Period */}
              {forecastData.statistical_analysis?.past_analysis && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.875rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ArrowUpRight size={18} style={{ color: '#10b981' }} />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#10b981' }}>
                        {formatCurrency(forecastData.statistical_analysis.past_analysis.best_period?.value)}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Best Period</div>
                    </div>
                  </div>
                  <div style={{ padding: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ArrowDownRight size={18} style={{ color: '#ef4444' }} />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#ef4444' }}>
                        {formatCurrency(forecastData.statistical_analysis.past_analysis.worst_period?.value)}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Worst Period</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* AI Insights */}
              {forecastData.ai_insights && (
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(99, 102, 241, 0.08)', 
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  lineHeight: '1.7',
                  maxHeight: '150px',
                  overflow: 'auto'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Sparkles size={14} style={{ color: '#6366f1' }} />
                    <strong style={{ color: '#f8fafc', fontSize: '0.8rem' }}>AI Insights</strong>
                  </div>
                  {forecastData.ai_insights.split('\n').slice(0, 3).map((line, i) => (
                    <div key={i} style={{ marginBottom: '0.25rem' }}>
                      {line.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '• ')}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ 
              height: '200px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#64748b',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <Brain size={32} style={{ opacity: 0.5 }} />
              <span>Click "Generate Forecast" to get AI predictions</span>
            </div>
          )}
        </div>

        {/* Marketing Analysis Card */}
        <div className="glass-card">
          <div className="glass-card-header">
            <div className="glass-card-title">
              <BarChart3 />
            </div>
            <button 
              className="btn btn-primary" 
              onClick={handleMarketingAnalysis}
              disabled={analysisLoading}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              {analysisLoading ? (
                <>
                  <CardanoLoader size={16} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Get Marketing Analysis
                </>
              )}
            </button>
          </div>
          
          {analysisError && (
            <div style={{ 
              padding: '1rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              borderRadius: '12px',
              color: '#ef4444',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              ⚠️ {analysisError}
            </div>
          )}
          
          {analysisData ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                    {analysisData.statistical_analysis?.summary?.average_roi?.toFixed(1) || 0}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Average ROI</div>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6366f1' }}>
                    ${analysisData.statistical_analysis?.summary?.total_revenue?.toLocaleString() || 0}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Revenue</div>
                </div>
              </div>
              
              {analysisData.statistical_analysis?.best_campaign && (
                <div style={{ 
                  padding: '1rem', 
                  background: 'rgba(245, 158, 11, 0.1)', 
                  borderRadius: '12px',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                    🏆 Best Performing Campaign
                  </div>
                  <div style={{ fontWeight: '600', color: '#f8fafc' }}>
                    {analysisData.statistical_analysis.best_campaign.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                    {analysisData.statistical_analysis.best_campaign.roi?.toFixed(1)}% ROI
                  </div>
                </div>
              )}
              
              {analysisData.ai_insights && (
                <div style={{ 
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  {analysisData.ai_insights.substring(0, 200)}...
                </div>
              )}
              
              <button 
                className="btn btn-secondary" 
                onClick={openAnalysisModal}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Eye size={16} />
                View Detailed Analysis
              </button>
            </div>
          ) : (
            <div style={{ 
              height: '200px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#64748b',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <BarChart3 size={32} style={{ opacity: 0.5 }} />
              <span>Click "Get Marketing Analysis" to access marketing analysis</span>
            </div>
          )}
        </div>
      </div>

      {/* Marketing Analysis Detail Modal - Portal */}
      {showAnalysisModal && analysisData && ReactDOM.createPortal(
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
            onClick={closeAnalysisModal}
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
              maxWidth: '900px',
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
                  <BarChart3 size={24} style={{ color: '#6366f1' }} />
                  Marketing Analysis Report
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Detailed breakdown of campaign performance
                </p>
              </div>
              <button 
                onClick={closeAnalysisModal}
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

            <div style={{ padding: '2rem' }}>
              {/* Summary Stats */}
              {analysisData.statistical_analysis?.summary && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#94a3b8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PieChartIcon size={18} /> Summary Overview
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    <div style={{ padding: '1.25rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#6366f1' }}>
                        {analysisData.statistical_analysis.summary.total_campaigns}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Campaigns</div>
                    </div>
                    <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10b981' }}>
                        ${(analysisData.statistical_analysis.summary.total_revenue / 1000).toFixed(0)}K
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Revenue</div>
                    </div>
                    <div style={{ padding: '1.25rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#f59e0b' }}>
                        {analysisData.statistical_analysis.summary.average_roi?.toFixed(0)}%
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Average ROI</div>
                    </div>
                    <div style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#ef4444' }}>
                        ${analysisData.statistical_analysis.summary.average_cpa?.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Average CPA</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Campaign Metrics Table */}
              {analysisData.statistical_analysis?.campaign_metrics && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#94a3b8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={18} /> Campaign Performance
                  </h3>
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Campaign</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Channel</th>
                          <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Spend</th>
                          <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Revenue</th>
                          <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>ROI</th>
                          <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>CTR</th>
                          <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Conv. Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisData.statistical_analysis.campaign_metrics.map((campaign, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '1rem', color: '#f8fafc', fontWeight: '500' }}>{campaign.name}</td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{ 
                                padding: '0.25rem 0.75rem', 
                                background: campaign.channel === 'Email' ? 'rgba(99, 102, 241, 0.15)' : 
                                           campaign.channel === 'Phone' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                                color: campaign.channel === 'Email' ? '#6366f1' : 
                                       campaign.channel === 'Phone' ? '#10b981' : '#06b6d4',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: '500'
                              }}>
                                {campaign.channel}
                              </span>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'right', color: '#94a3b8' }}>${campaign.spend?.toLocaleString()}</td>
                            <td style={{ padding: '1rem', textAlign: 'right', color: '#10b981', fontWeight: '600' }}>${campaign.revenue?.toLocaleString()}</td>
                            <td style={{ padding: '1rem', textAlign: 'right', color: '#f59e0b', fontWeight: '600' }}>{campaign.roi?.toFixed(1)}%</td>
                            <td style={{ padding: '1rem', textAlign: 'right', color: '#94a3b8' }}>{campaign.ctr?.toFixed(1)}%</td>
                            <td style={{ padding: '1rem', textAlign: 'right', color: '#94a3b8' }}>{campaign.conversion_rate?.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Channel Comparison */}
              {analysisData.statistical_analysis?.channel_comparison && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#94a3b8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart3 size={18} /> Channel Comparison
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {analysisData.statistical_analysis.channel_comparison.map((channel, index) => (
                      <div key={index} style={{ 
                        padding: '1.25rem', 
                        background: 'rgba(255,255,255,0.03)', 
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                          {channel.channel === 'Email' && <Mail size={18} style={{ color: '#6366f1' }} />}
                          {channel.channel === 'Phone' && <Phone size={18} style={{ color: '#10b981' }} />}
                          {channel.channel === 'Social Media' && <Users size={18} style={{ color: '#06b6d4' }} />}
                          <span style={{ fontWeight: '600', color: '#f8fafc' }}>{channel.channel}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>Spend</div>
                            <div style={{ fontWeight: '600', color: '#ef4444' }}>${channel.spend?.toLocaleString()}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>Revenue</div>
                            <div style={{ fontWeight: '600', color: '#10b981' }}>${channel.revenue?.toLocaleString()}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>Conversions</div>
                            <div style={{ fontWeight: '600', color: '#f8fafc' }}>{channel.conversions?.toLocaleString()}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>ROI</div>
                            <div style={{ fontWeight: '600', color: '#f59e0b' }}>{channel.roi?.toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Best Campaign */}
              {analysisData.statistical_analysis?.best_campaign && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#94a3b8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={18} /> Best Performing Campaign
                  </h3>
                  <div style={{ 
                    padding: '1.5rem', 
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(234, 88, 12, 0.1) 100%)', 
                    borderRadius: '16px',
                    border: '1px solid rgba(245, 158, 11, 0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>🏆</span>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>
                          {analysisData.statistical_analysis.best_campaign.name}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                          {analysisData.statistical_analysis.best_campaign.channel} Campaign
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>ROI</div>
                        <div style={{ fontWeight: '700', color: '#f59e0b', fontSize: '1.1rem' }}>
                          {analysisData.statistical_analysis.best_campaign.roi?.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>Revenue</div>
                        <div style={{ fontWeight: '600', color: '#10b981' }}>
                          ${analysisData.statistical_analysis.best_campaign.revenue?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>Conversions</div>
                        <div style={{ fontWeight: '600', color: '#f8fafc' }}>
                          {analysisData.statistical_analysis.best_campaign.conversions?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>CTR</div>
                        <div style={{ fontWeight: '600', color: '#f8fafc' }}>
                          {analysisData.statistical_analysis.best_campaign.ctr?.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>Conv. Rate</div>
                        <div style={{ fontWeight: '600', color: '#f8fafc' }}>
                          {analysisData.statistical_analysis.best_campaign.conversion_rate?.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Insights */}
              {analysisData.ai_insights && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#94a3b8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={18} /> AI Insights & Recommendations
                  </h3>
                  <div style={{ 
                    padding: '1.5rem', 
                    background: 'rgba(99, 102, 241, 0.08)', 
                    borderRadius: '16px',
                    fontSize: '0.9rem',
                    color: '#c4c9d4',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {analysisData.ai_insights}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ 
              padding: '1.5rem 2rem', 
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              position: 'sticky',
              bottom: 0,
              background: '#12121a'
            }}>
              <button 
                className="btn btn-secondary"
                onClick={closeAnalysisModal}
              >
                Close
              </button>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Charts Section */}
      <div className="charts-section">
        <div className="glass-card">
          <div className="glass-card-header">
            <div className="glass-card-title">
              <TrendingUp /> Revenue & Leads Trend
            </div>
            <select className="input-field select-field" style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 0.75rem' }}>
              <option>Last 8 months</option>
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.revenue} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColors.revenue} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.leads} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColors.leads} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip content={<LiquidGlassTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={chartColors.revenue}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue ($)"
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke={chartColors.leads}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                  name="Leads"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <div className="glass-card-header">
            <div className="glass-card-title">
              <Target /> Lead Sources
            </div>
          </div>
          <div className="chart-container" style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<LiquidGlassTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {conversionData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Outreach & Activity */}
      <div className="charts-section">
        <div className="glass-card">
          <div className="glass-card-header">
            <div className="glass-card-title">
              <Zap /> Weekly Outreach Activity
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyOutreach}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  content={<LiquidGlassTooltip />}
                  wrapperStyle={{ outline: 'none' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="emails" fill={chartColors.emails} radius={[4, 4, 0, 0]} name="Emails" />
                <Bar dataKey="linkedin" fill={chartColors.linkedin} radius={[4, 4, 0, 0]} name="LinkedIn" />
                <Bar dataKey="calls" fill={chartColors.calls} radius={[4, 4, 0, 0]} name="Calls" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: chartColors.emails }} />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Emails</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: chartColors.linkedin }} />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>LinkedIn</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: chartColors.calls }} />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Calls</span>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="glass-card-header">
            <div className="glass-card-title">
              <Clock /> Recent Activity
            </div>
          </div>
          <div className="activity-feed">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'success' && <CheckCircle size={18} />}
                  {activity.type === 'info' && <Zap size={18} />}
                  {activity.type === 'warning' && <TrendingUp size={18} />}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-time">{activity.subtitle} • {activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
