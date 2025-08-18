# Lente Legislativa - Legislative Lens

A comprehensive platform for analyzing and understanding Brazilian legislative data using AI-powered insights and real-time data from the Câmara dos Deputados (Brazilian Chamber of Deputies).

## 🚀 Features

### 📊 **Legislative Data Analysis**

- **Propositions Tracking**: Monitor bills, constitutional amendments, and legislative proposals
- **Procedures Timeline**: Track the complete legislative journey of propositions
- **Voting Records**: Comprehensive voting data with individual deputy votes
- **AI-Powered Analysis**: Get intelligent explanations of legislative procedures and outcomes

### 🤖 **AI Integration**

- **Procedures Analysis**: AI-generated explanations of what happened and what's next
- **Proposition Summaries**: Intelligent summaries of complex legislative texts
- **Voting Pattern Analysis**: Understand voting behaviors and outcomes
- **Contextual Insights**: Get explanations tailored to specific legislative contexts

### 🎯 **Data Sources**

- **Câmara dos Deputados**: Real-time legislative data

## 🏗️ Architecture

### **Backend (Deco MCP Server)**

- **Cloudflare Workers**: Serverless backend infrastructure
- **Deco Runtime**: MCP (Model Context Protocol) server for AI integration
- **SQLite Database**: Persistent data storage with Drizzle ORM
- **RESTful API**: Comprehensive endpoints for legislative data

### **Frontend (React + TypeScript)**

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and IntelliSense
- **Tailwind CSS**: Utility-first CSS framework
- **TanStack Query**: Server state management and caching
- **TanStack Router**: Type-safe routing

## 🛠️ Tools & Endpoints

### **Core Legislative Tools**

- `GET_PROPOSITIONS` - List all legislative propositions
- `GET_PROPOSITION` - Get detailed proposition information
- `GET_PROPOSITION_AUTHORS` - Retrieve proposition authors and sponsors
- `GET_PROPOSITION_PROCEDURES` - Get complete procedural timeline
- `GET_PROPOSITION_THEMES` - Retrieve thematic classifications
- `GET_PROPOSITION_POLLS` - Get voting records for propositions
- `GET_POLL_DETAILS` - Detailed voting information with individual votes

### **AI-Powered Tools**

- `EXPLAIN_PROPOSITION_AI` - AI-generated explanations of propositions
- `ANALYZE_PROPOSITION_PROCEDURES` - Intelligent analysis of legislative procedures
- `ANALYZE_PROCEDURES` - AI-powered procedure analysis and insights

### **Data Management Tools**

- `GET_PROPOSITION_DETAILS` - Comprehensive proposition data aggregation
- `GET_PROPOSITION_DETAILS_AI` - AI-enhanced proposition analysis

## 🎨 Views & Components

### **Main Pages**

- **Home** (`/`) - Overview and navigation
- **Propositions List** (`/propositions`) - Browse all legislative proposals
- **Proposition Details** (`/proposition/:id`) - Comprehensive proposition view

### **AI Analysis Components**

- **Procedures Analyzer**: AI-powered analysis of legislative procedures
- **Voting Insights**: Intelligent interpretation of voting patterns
- **Timeline Analysis**: AI explanations of procedural developments

## 🚀 Quick Start

### **Prerequisites**

- Node.js >= 22.0.0
- npm >= 8.0.0
- Deco CLI installed globally

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/diegosano/lente-legislativa
   cd lente-legislativa
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Deco CLI globally**

   ```bash
   npm i -g deco-cli 
   ```

4. **Login to Deco**

   ```bash
   deco login
   ```

5. **Configure the application**

   ```bash
   npm run configure
   ```

### **Development**

1. **Start development server**

   ```bash
   npm run dev
   ```

   This will:
   - Start the MCP server on port 8787
   - Build and serve the React frontend
   - Enable hot reload for both frontend and backend

2. **Generate types** (after adding new integrations)

   ```bash
   npm run gen
   ```

3. **Generate self-types** (after adding new tools/workflows)

   ```bash
   # Start the dev server first, then copy the development URL from logs
   DECO_SELF_URL=<your-dev-url> npm run gen:self
   ```

### **Production Deployment**

1. **Deploy to Cloudflare Workers**

   ```bash
   npm run deploy
   ```

2. **The app will be available at the public URL provided by Cloudflare**

## 📱 Usage Examples

### **AI Analysis of Procedures**

1. Navigate to a proposition detail page
2. Click the sparkles icon (✨) in the procedures timeline
3. View AI-generated explanation of what happened and what's next
4. Explore detailed analysis in the dialog

### **Voting Analysis**

1. View proposition details
2. Scroll to the "Votações" section
3. Click "Ver Detalhes" on any vote
4. See individual deputy votes and party positions

### **Procedural Tracking**

1. Browse propositions list
2. Select a proposition of interest
3. View complete procedural timeline
4. Get AI insights on procedural developments

## 📚 Resources

### **Documentation**

- [Deco Platform Documentation](https://deco.chat/docs)
- [Câmara dos Deputados API](https://dadosabertos.camara.leg.br/swagger/api.html)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Câmara dos Deputados** for providing open legislative data
- **Deco Platform** for AI integration capabilities
- **Open Source Community** for the amazing tools and libraries

---

## Built with ❤️ for Brazilian democracy and transparency
