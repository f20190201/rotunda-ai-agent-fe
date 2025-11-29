# Loader Inventory

This document lists all loading states and loaders used throughout the application.

## 1. App.js - Alerts Loading
- **Location**: `src/App.js`
- **State**: `loadingAlerts`
- **Line**: ~33, 45, 77, 258-266
- **Usage**: Loading state for fetching alerts in the notification dropdown
- **UI**: Text "Loading alerts..." in dropdown

## 2. Dashboard.js - Sales Forecast Loading
- **Location**: `src/components/Dashboard.js`
- **State**: `forecastLoading`
- **Line**: ~190, 217, 240, 374-381
- **Usage**: Loading state when generating AI sales forecast
- **UI**: Button shows "Analyzing..." with Loader2 spinner icon

## 3. Dashboard.js - Marketing Analysis Loading
- **Location**: `src/components/Dashboard.js`
- **State**: `analysisLoading`
- **Line**: ~194, 246, 291, 537-544
- **Usage**: Loading state when generating marketing analysis
- **UI**: Button shows "Analyzing..." with Loader2 spinner icon

## 4. RespondToEmails.js - Fetch Emails Loading
- **Location**: `src/components/RespondToEmails.js`
- **State**: `loading`
- **Line**: ~114, 146, 178, 361-373, 512-516
- **Usage**: 
  - Button loading state when fetching emails
  - Full page loader when emails are being fetched
- **UI**: 
  - Button shows "Loading..." with Loader2 spinner
  - Full page shows large Loader2 spinner with "Fetching emails..." text

## 5. RespondToEmails.js - AI Response Loading
- **Location**: `src/components/RespondToEmails.js`
- **State**: `loadingResponse`
- **Line**: ~121, 277, 312, 683-688
- **Usage**: Loading state when generating AI response for email
- **UI**: Button shows Loader2 spinner when generating response

## 6. EmailGenerator.js - Generate Email Loading
- **Location**: `src/components/EmailGenerator.js`
- **State**: `loading`
- **Line**: ~39, 51, 63, 243-250
- **Usage**: Loading state when generating HTML email
- **UI**: Button shows "Generating..." with Loader2 spinner icon

## 7. Campaigns.js - Lead Enrichment Loading
- **Location**: `src/components/Campaigns.js`
- **State**: `enrichLoading`
- **Line**: ~110, 135, 151, 322-329
- **Usage**: Loading state when enriching lead data
- **UI**: Button shows "Enriching Lead..." with Loader2 spinner icon

## 8. Chatbot.js - Connection Status Loading
- **Location**: `src/components/Chatbot.js`
- **State**: `isConnected === null` (connection check)
- **Line**: ~250-254
- **Usage**: Shows loading state when checking backend connection
- **UI**: Status shows "Connecting..." with Loader2 spinner

## 9. Chatbot.js - Message Typing Indicator
- **Location**: `src/components/Chatbot.js`
- **State**: Message with `typing` class
- **Line**: ~342-344
- **Usage**: Shows typing indicator when AI is processing/responding
- **UI**: Message bubble with Loader2 spinner and "Analyzing..." text

## Summary

**Total Loader Instances**: 9
- **Button Loaders**: 6 (with Loader2 spinner + text)
- **Full Page Loaders**: 1 (large spinner)
- **Status Loaders**: 2 (connection status, typing indicator)

**Components Used**:
- `Loader2` from `lucide-react` (all instances)
- CSS class `spin` for rotation animation (all instances)

**Common Patterns**:
- All use `Loader2` component from lucide-react
- All use `className="spin"` for animation
- Button loaders typically show spinner + text
- Loading states are managed with React `useState`

