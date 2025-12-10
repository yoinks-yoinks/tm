# TaskFlow - AI-Powered Task Manager

A modern, feature-rich Task Manager application with **AI-powered voice input** supporting 15+ languages including regional Pakistani languages. Built with React 19, Cloudflare Workers, and Workers AI.

🌐 **Live Demo:** [https://tm.writetoberyal.workers.dev/](https://tm.writetoberyal.workers.dev/)

> 🎓 **Note:** This project is a fork of the original Task Manager created for the **Advanced Full Stack Development & Software Testing** course. I've extended it with additional features including AI voice input, multi-language support, and mobile optimizations.
>
> 📚 **Original Course:** [AFST Course by Ehtisham Sajjad](https://github.com/ehtishamsajjad/afst)

---

## ✨ Features

### 🎤 AI Voice Input (NEW!)
- **Speech-to-Text** - Create tasks by speaking using Cloudflare Workers AI (Whisper v3 Turbo)
- **15+ Languages Supported** including:
  - **Common:** English, Urdu (اردو)
  - **KPK:** Pashto (پښتو), Hindko (ہندکو), Saraiki (سرائیکی)
  - **Balochistan:** Balochi (بلوچی), Brahui (براہوئی)
  - **Gilgit-Baltistan:** Balti (བལྟི), Shina (شینا), Burushaski (بروشسکی), Khowar (کھوار), Wakhi (وخی)
  - **Additional:** Punjabi (پنجابی), Sindhi (سنڌي)
- **Smart Silence Detection** - Auto-stops recording after 3 seconds of silence
- **Usage Tracking** - Visual indicator showing remaining AI minutes for the day
- **Free Tier Protected** - Programmatic controls to stay within Cloudflare's free tier

### 📝 Task Management
- **CRUD Operations** - Create, read, update, and delete tasks
- **Rich Details** - Title, description, priority, due dates, and tags
- **Quick Create** - Fast task creation from anywhere in the app

### 📋 Multiple Views
- **Kanban Board** - Drag & drop tasks between columns (Todo, In Progress, Done)
  - Touch-friendly for mobile devices
  - Smooth animations with Framer Motion
- **Table View** - Sortable, searchable data table with all task details
- **Dashboard** - Analytics with animated counters and progress tracking

### 🎯 Organization
- **Priority System** - Four levels: Urgent, High, Medium, Low (color-coded)
- **Smart Tags** - Create custom color-coded tags for categorization
- **Due Date Tracking** - Calendar picker with overdue detection and relative dates
- **Filtering** - Filter tasks by status, priority, or tags

### 🎨 User Experience
- **Dark & Light Mode** - Beautiful themes with system preference detection
- **Keyboard Shortcuts** - Cmd/Ctrl+K for command palette, quick navigation
- **Navigation Progress** - Visual shimmer indicator during page transitions
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Confetti Celebration** - Fun animation when completing tasks

### 🔐 Authentication
- **Secure Auth** - Better Auth with email/password
- **Password Recovery** - Email-based password reset flow
- **User Profile** - Update name and change password

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev/) | UI library |
| [TanStack Router](https://tanstack.com/router) | Type-safe routing |
| [TanStack Query](https://tanstack.com/query) | Server state management |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [shadcn/ui](https://ui.shadcn.com/) | UI component library |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [dnd-kit](https://dndkit.com/) | Drag and drop |
| [Lucide Icons](https://lucide.dev/) | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| [Hono](https://hono.dev/) | Web framework for edge |
| [Drizzle ORM](https://orm.drizzle.team/) | TypeScript ORM |
| [Cloudflare D1](https://developers.cloudflare.com/d1/) | SQLite database |
| [Cloudflare KV](https://developers.cloudflare.com/kv/) | Key-value storage (usage tracking) |
| [Better Auth](https://better-auth.com/) | Authentication |
| [Zod](https://zod.dev/) | Schema validation |

### AI & Infrastructure
| Technology | Purpose |
|------------|---------|
| [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) | Voice transcription (Whisper) |
| [Cloudflare Workers](https://developers.cloudflare.com/workers/) | Edge runtime |
| [Vite](https://vite.dev/) | Build tool |
| [Wrangler](https://developers.cloudflare.com/workers/wrangler/) | Deployment CLI |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ or Bun
- Cloudflare account (for deployment)
- Wrangler CLI configured

### Installation

```bash
# Clone the repository
git clone https://github.com/yoinks-yoinks/tm.git
cd tm

# Install dependencies
bun install
```

### Configuration

1. Copy the environment template:
```bash
cp .dev.vars.example .dev.vars
```

2. Configure your Cloudflare bindings in `wrangler.json`:
   - D1 Database
   - KV Namespace (for AI usage tracking)
   - AI binding

### Development

```bash
# Start the development server
bun run dev
```

Application runs at [http://localhost:5173](http://localhost:5173)

### Database Setup

```bash
# Generate migrations
bun run db:generate

# Apply migrations locally
bun run db:migrate:local

# Apply migrations to production
bun run db:migrate
```

---

## 📦 Production Deployment

```bash
# Build for production
bun run build

# Preview locally
bun run preview

# Deploy to Cloudflare Workers
bun run deploy
```

---

## 📁 Project Structure

```text
tm/
├── src/
│   ├── react-app/              # Frontend React application
│   │   ├── components/         # UI components
│   │   │   ├── ui/            # shadcn/ui base components
│   │   │   ├── voice-recorder.tsx
│   │   │   ├── language-selector.tsx
│   │   │   ├── kanban-board.tsx
│   │   │   └── ...
│   │   ├── hooks/              # Custom React hooks
│   │   ├── routes/             # TanStack Router pages
│   │   ├── constants/          # App constants
│   │   └── lib/                # Utilities
│   └── worker/                 # Backend Hono API
│       ├── db/                 # Database schema
│       ├── lib/                # Auth & utilities
│       └── index.ts            # API routes
├── drizzle/                    # Database migrations
├── public/                     # Static assets
└── scripts/                    # Utility scripts
```

---

## 🔒 Free Tier Protection

The application is designed to stay within Cloudflare's free tier limits:

- **Workers AI:** 10,000 neurons/day (~212 minutes of transcription)
- **KV Storage:** 100,000 reads/day, 1,000 writes/day
- **Safety Buffer:** 95% usage limit to prevent overages
- **Visual Feedback:** Usage indicator shows remaining minutes

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Baryalai** - Full Stack Developer

- 🔗 LinkedIn: [@baryalai](https://www.linkedin.com/in/baryalai/)
- 📧 Email: [writetoberyal@gmail.com](mailto:writetoberyal@gmail.com)

---

## 🙏 Acknowledgments

- **Ehtisham Sajjad** - Original project creator and course instructor
  - LinkedIn: [@ehtishamsajjad](https://www.linkedin.com/in/ehtishamsajjad/)
  - Course: [AFST - Advanced Full Stack Development & Software Testing](https://github.com/ehtishamsajjad/afst)

---

## 📸 Screenshots

### Landing Page
The landing page showcases key features including voice input in 15+ languages.

### Dashboard
Real-time analytics with animated counters and task progress tracking.

### Kanban Board
Touch-friendly drag-and-drop task organization with smooth animations.

### Voice Input
AI-powered speech-to-text with language selection for regional Pakistani languages.
