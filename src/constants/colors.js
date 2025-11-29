/**
 * Centralized Color Library
 * Ensures color uniformity across the application
 */

// Chart Colors - High contrast colors for dark backgrounds
// Palette: ["#00E8C7", "#FF2D95", "#FFD85E", "#6A5CFF", "#FF6B4A", "#72F5FF"]
export const chartColors = {
  // Primary chart colors
  emails: '#72F5FF',        // Light Cyan/Sky Blue
  linkedin: '#00E8C7',      // Teal/Cyan
  calls: '#FF6B4A',         // Orange/Red
  email: '#72F5FF',          // Light Cyan/Sky Blue (for pie chart)
  coldCall: '#6A5CFF',       // Purple/Indigo
  referral: '#FFD85E',      // Yellow
  
  // Alternative names for consistency
  revenue: '#72F5FF',
  leads: '#00E8C7',
  
  // Additional palette colors available
  pink: '#FF2D95',           // Pink/Magenta
};

// Semantic Colors - For UI elements, status indicators, etc.
export const semanticColors = {
  success: '#10b981',        // Green - for positive values, success states
  error: '#ef4444',          // Red - for errors, negative values
  warning: '#f59e0b',        // Orange/Amber - for warnings
  info: '#6366f1',           // Indigo - for informational elements
  text: {
    primary: '#f8fafc',      // Primary text color
    secondary: '#cbd5e1',    // Secondary text color
    muted: '#94a3b8',        // Muted text color
    disabled: '#64748b',     // Disabled text color
  },
};

// Color mapping for tooltips and labels
export const colorMap = {
  // Bar chart mappings
  'Emails': chartColors.emails,
  'emails': chartColors.emails,
  'LinkedIn': chartColors.linkedin,
  'linkedin': chartColors.linkedin,
  'Calls': chartColors.calls,
  'calls': chartColors.calls,
  
  // Pie chart mappings
  'Email': chartColors.email,
  'Cold Call': chartColors.coldCall,
  'Referral': chartColors.referral,
  
  // Other chart mappings
  'Revenue ($)': chartColors.revenue,
  'Leads': chartColors.leads,
  'value': chartColors.emails, // Default fallback
};

/**
 * Get color for a given key
 * @param {string} key - The key to look up (e.g., 'Emails', 'LinkedIn')
 * @param {string} fallback - Fallback color if key not found
 * @returns {string} Hex color code
 */
export const getColor = (key, fallback = chartColors.emails) => {
  return colorMap[key] || fallback;
};

/**
 * Get color from Recharts entry (for tooltips)
 * @param {Object} entry - Recharts payload entry
 * @returns {string} Hex color code
 */
export const getColorFromEntry = (entry) => {
  // Priority: entry.fill (bar charts) > entry.color (pie charts) > colorMap > default
  return entry.fill || 
         entry.color || 
         (entry.payload && entry.payload.fill) ||
         colorMap[entry.name] || 
         colorMap[entry.dataKey] || 
         chartColors.emails;
};

export default {
  chartColors,
  semanticColors,
  colorMap,
  getColor,
  getColorFromEntry,
};

