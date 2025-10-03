# Declutter

**Your Private, Offline AI Assistant**

Declutter is a full-stack web application that allows users to create workspaces, upload documents and media files (or provide links), and interact with an AI to process and query this content. Built with privacy and offline-first functionality in mind.

![Declutter Landing Page](https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Screenshot-2025-10-03-202707-1759504633221.png)

## 🌟 Features

### 📁 Workspace Management
- Create multiple workspaces to organize different projects
- Each workspace tracks PDFs, images, and audio files separately
- Delete workspaces with confirmation dialog
- Real-time modification tracking

### 💬 AI Chat Interface
- Three-column layout for optimal workflow:
  - **Left:** Source files panel with upload functionality
  - **Center:** Chat interface with AI assistant
  - **Right:** Analytics dashboard
- Natural language queries about your uploaded content
- Copy and voice playback options for AI responses
- Real-time message history

### 📤 File Upload & Processing
- Support for multiple file formats:
  - **PDFs:** Full text processing and analysis
  - **Images:** Visual content analysis and description
  - **Audio:** Storage (queryable in future updates)
- Drag-and-drop file upload
- Real-time upload progress

### 📊 Analytics Dashboard
- Total query count
- Breakdown by content type (PDF, Image, Audio)
- Visual indicators with color-coded metrics

### ⚙️ Settings & Customization
- **Profile Management:**
  - Update display name
  - Avatar upload capability
  - Email management
- **Appearance:**
  - Dark mode toggle (default: dark)
  - Smooth theme transitions
- **Voice Settings:**
  - Gender selection (Female/Male)
  - Auto-read AI responses toggle

### 🔐 Authentication
- Login and Sign Up pages
- Secure token-based authentication
- Password visibility toggle
- Forgot password functionality
- Beautiful animated UI with gradient backgrounds

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS v4** - Utility-first styling
- **Shadcn/UI** - High-quality UI components
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **REST API** - RESTful architecture
- Mock data storage (ready for database integration)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd declutter
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📂 Project Structure

```
declutter/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── signup/route.ts
│   │   │   ├── chat/route.ts
│   │   │   ├── settings/route.ts
│   │   │   ├── upload/route.ts
│   │   │   └── workspaces/route.ts
│   │   ├── auth/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── workspace/[id]/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── ui/              # Shadcn/UI components
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utility functions
├── public/                  # Static assets
└── package.json
```

## 🔌 API Endpoints

### Authentication
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/signup` - User registration

### Workspaces
- **GET** `/api/workspaces?userId={id}` - Get all user workspaces
- **POST** `/api/workspaces` - Create new workspace
- **DELETE** `/api/workspaces?id={id}` - Delete workspace

### File Upload
- **POST** `/api/upload` - Upload file to workspace
- **GET** `/api/upload?workspaceId={id}` - Get workspace files

### Chat
- **POST** `/api/chat` - Send message and get AI response
- **GET** `/api/chat?workspaceId={id}` - Get conversation history

### Settings
- **GET** `/api/settings?userId={id}` - Get user settings
- **PUT** `/api/settings` - Update user settings

## 🎨 Design Features

### Dark Theme
- Sleek dark mode with gray-900/black color palette
- Gradient backgrounds for landing and auth pages
- Smooth hover transitions and animations
- Backdrop blur effects

### Responsive Layout
- Mobile-first design approach
- Adaptive three-column layout
- Touch-friendly interactions
- Optimized for tablets and desktops

### Animations
- Page transition animations with Framer Motion
- Hover effects on interactive elements
- Loading states with spinners
- Smooth modal transitions

## 🔮 Future Enhancements

### Planned Features
1. **Database Integration:**
   - PostgreSQL/Supabase for persistent storage
   - User authentication with sessions
   - Real file storage and retrieval

2. **AI Integration:**
   - Connect to OpenAI/Anthropic APIs
   - Document OCR for PDFs and images
   - Audio transcription and analysis
   - URL content scraping and analysis

3. **Advanced Features:**
   - Collaborative workspaces
   - Export chat history
   - Advanced analytics and insights
   - Custom AI model selection
   - Offline mode with service workers

4. **Enhanced Security:**
   - End-to-end encryption
   - Two-factor authentication
   - Session management
   - Rate limiting

## 📸 Screenshots

### Landing Page
![Landing Page](https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Screenshot-2025-10-03-202707-1759504633221.png)

### Authentication
![Auth Page](https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Screenshot-2025-10-03-093650-1759504634000.png)

### Dashboard
![Dashboard](https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Screenshot-2025-10-03-202937-1759504633741.png)

### Chat Interface
![Chat Interface](https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Screenshot-2025-10-03-203316-1759504633947.png)

### Settings
![Settings](https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Screenshot-2025-10-03-203107-Copy-1759504633771.png)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**