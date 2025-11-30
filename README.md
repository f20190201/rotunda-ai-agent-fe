# Rotunda AI Sales Agent

An AI-powered sales outreach dashboard built with React.js, designed to help small to medium-scale organizations manage their sales operations, campaigns, and customer communications efficiently.

## 🚀 Features

### Dashboard
- **Sales Analytics**: Real-time revenue, leads, and conversion metrics
- **AI Sales Forecasting**: Predictive analytics for future sales performance
- **Marketing Analysis**: ROI and performance analysis across marketing channels
- **Interactive Charts**: Revenue trends, lead sources, and weekly outreach activity
- **Visual Analytics**: Beautiful charts and graphs with liquid glass design

### Campaigns
- **Campaign Management**: Create, view, and manage marketing campaigns
- **Multi-Channel Support**: Email, Social Media, and Paid Ads campaigns
- **Campaign Analytics**: Track impressions, clicks, conversions, and ROI
- **Lead Enrichment**: AI-powered lead data enrichment with company insights

### Email Management
- **AI Email Generation**: Generate marketing emails using AI
- **Respond to Emails**: Manage incoming customer emails with tone detection
- **Smart Categorization**: Automatically categorize emails by tone (#Complaint, #Appreciation, #Feedback, #Generic)
- **AI-Powered Responses**: Generate contextual email responses using AI

### AI Assistant
- **Intelligent Chatbot**: Interactive AI assistant for sales-related queries
- **Quick Actions**: Enrich leads, forecast sales, analyze campaigns
- **Real-time Support**: Get instant help with sales operations

### Notifications
- **Smart Alerts**: System alerts for complaint emails, low conversion rates, and revenue drops
- **Real-time Updates**: Automatic alert refresh every 30 seconds

## 🛠️ Tech Stack

- **Frontend Framework**: React.js 19.2.0
- **Charts**: Recharts 3.5.1
- **Icons**: Lucide React 0.555.0
- **Styling**: CSS with Glass Morphism design
- **Build Tool**: Create React App (react-scripts 5.0.1)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd team-rotunda
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional)
   - Create a `.env` file in the root directory
   - Add `REACT_APP_API_URL=http://your-backend-url:8000` for production

## 🚀 Getting Started

### Development Mode

Start the development server:

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

**Note**: The app uses a proxy configuration in `package.json` to connect to the backend API during development.

### Production Build

Create a production build:

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### The deployed version of this code can be accessed at [http://64.227.128.101:3005/](http://64.227.128.101:3005/)

## 🔧 Configuration

### Backend API

The application connects to a backend API. Configure the API URL:

- **Development**: Uses proxy from `package.json` (default: `http://64.227.128.101:8000/`)
- **Production**: Set `REACT_APP_API_URL` environment variable

## 📁 Project Structure

```
team-rotunda/
├── public/                 # Static assets
│   ├── cardano-loading.gif # Custom loading animation
│   └── *.gif              # Email tone GIFs
├── src/
│   ├── components/        # React components
│   │   ├── Dashboard.js   # Main dashboard with analytics
│   │   ├── Campaigns.js   # Campaign management
│   │   ├── EmailGenerator.js # AI email generation
│   │   ├── RespondToEmails.js # Email management
│   │   ├── Chatbot.js     # AI assistant
│   │   └── CardanoLoader.js # Custom loader component
│   ├── services/
│   │   └── api.js         # API service layer
│   ├── constants/
│   │   └── colors.js      # Centralized color palette
│   ├── App.js             # Main app component
│   └── App.css            # Global styles
└── package.json
```

## 🎨 Design Features

- **Dark Theme**: Modern dark UI with glass morphism effects
- **Liquid Glass Design**: Translucent, blurred glass effects throughout
- **Cardano Theme**: Custom Cardano-themed loading animations
- **Responsive Layout**: Works on desktop and mobile devices
- **Color Palette**: Consistent color scheme based on icon colors

## 📊 Key Components

### Dashboard
- Revenue and sales analytics
- AI-powered sales forecasting
- Marketing campaign analysis
- Interactive charts and visualizations

### Campaigns
- Create and manage campaigns
- Track campaign performance
- Lead enrichment tool
- Campaign analytics

### Email Generator
- AI-powered email creation
- HTML and plain text output
- Template-based generation

### Respond to Emails
- Email inbox management
- Tone detection and categorization
- AI-powered response generation
- Dynamic GIF display based on complaint percentage

## 🔌 API Integration

The application integrates with a FastAPI backend for:
- Sales forecasting
- Marketing analysis
- Lead enrichment
- Email generation
- Campaign management
- Email retrieval
- System alerts

See `src/services/api.js` for all available API endpoints.

## 🧪 Testing

Run tests:

```bash
npm test
```

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is private and proprietary.

## 👥 Contributors

- Subham Patel (subham@rotunda.ai)

---

**Built with ❤️ for efficient sales operations**

