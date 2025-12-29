# WhatsApp Wrapped 🎉

A beautiful, Spotify Wrapped-style visualization of your WhatsApp group chat statistics. Upload your chat export and discover insights about your conversations.

![WhatsApp Wrapped Preview](preview.png)

## Features

- 📊 **Message Statistics** - Total messages, words, and activity days
- ⏰ **Temporal Analysis** - Peak hours, busiest days, chronotype detection
- 👑 **MVP Detection** - Find out who carries the conversation
- 🗣️ **Topic Modeling** - AI-powered topic discovery using LDA
- 😀 **Emoji Analysis** - Top emojis and usage patterns
- 📷 **Media Insights** - Photo/video sharing stats and chaos index
- 💭 **Sentiment Analysis** - Monthly emotional timeline
- 🧑‍💻 **Code Detection** - Track those code snippets shared
- 🎴 **Shareable Cards** - Export and share your wrapped summary

## Privacy First 🔒

- All processing happens locally in your browser/machine
- No chat data is ever stored or sent to external servers
- Open source - verify the code yourself!

## Quick Start

### Prerequisites

- Node.js 18+ 
- Python 3.10+

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Export WhatsApp Chat

1. Open the WhatsApp group chat
2. Tap the three dots menu → More → Export chat
3. Choose "Without media" for faster processing
4. Save the `.txt` file
5. Upload to WhatsApp Wrapped!

## Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- Tailwind CSS 4
- Framer Motion
- Geist Font (Vercel)

**Backend:**
- FastAPI
- Pandas
- scikit-learn (LDA topic modeling)
- VADER Sentiment Analysis

## Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Deploy to Vercel
vercel --prod
```

### Backend (Any Python host)

```bash
cd backend
# Using Gunicorn for production
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

Set the `NEXT_PUBLIC_API_URL` environment variable in your frontend to point to your backend URL.

## Environment Variables

**Frontend (Vercel):**
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (e.g., `https://whatsapp-wrapped-backend.onrender.com`)

**Backend (Render/Railway/etc):**
- `CORS_ORIGINS_STR` - Comma-separated allowed origins (e.g., `https://your-app.vercel.app,https://custom-domain.com`)

## License

MIT License - feel free to use and modify!

## Credits

Built with ❤️ inspired by Spotify Wrapped, Apple Music Replay, and ChatGPT Wrapped.
