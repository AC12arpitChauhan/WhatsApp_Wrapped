# WhatsApp Wrapped: A Data Analytics and NLP Project

A beautiful, Spotify Wrapped-style visualization of your WhatsApp group chat statistics. Upload your chat export and discover insights about your conversations.

<img width="1440" height="822" alt="Screenshot 2025-12-30 at 4 18 24 PM" src="https://github.com/user-attachments/assets/9ea97867-74bb-47db-add8-891c01b5b24e" />


## Features

## **Message Statistics** - Total messages, words, and activity days
<img width="1440" height="820" alt="Screenshot 2025-12-30 at 4 31 51 PM" src="https://github.com/user-attachments/assets/3168071d-0950-4979-b73d-a65db2de9701" />

## **Temporal Analysis** - Peak hours, busiest days, chronotype detection
<img width="1440" height="820" alt="Screenshot 2025-12-30 at 4 19 36 PM" src="https://github.com/user-attachments/assets/e9eed938-b4ac-4746-8b7b-477b26852c3a" />

## **MVP Detection** - Find out who carries the conversation
<img width="1440" height="820" alt="Screenshot 2025-12-30 at 4 19 44 PM" src="https://github.com/user-attachments/assets/65646993-2cd4-4860-8d44-c15925235b00" />

## **Topic Modeling** - AI-powered topic discovery using LDA
<img width="1440" height="820" alt="Screenshot 2025-12-30 at 4 20 16 PM" src="https://github.com/user-attachments/assets/e560107a-1e90-4293-b376-d2a0dc151d4f" />

## **Emoji Analysis** - Top emojis and usage patterns
<img width="1440" height="820" alt="Screenshot 2025-12-30 at 4 21 13 PM" src="https://github.com/user-attachments/assets/9f64727d-2f8d-44aa-ba71-6672bf9c4c3a" />

## **Media Insights** - Photo/video sharing stats and chaos index
<img width="1440" height="820" alt="Screenshot 2025-12-30 at 4 32 04 PM" src="https://github.com/user-attachments/assets/31e747cf-0993-4aae-af16-7cb7571533ce" />

## **Sentiment Analysis** - Monthly emotional timeline
<img width="1440" height="820" alt="Screenshot 2025-12-30 at 4 20 58 PM" src="https://github.com/user-attachments/assets/5ef12790-2388-417c-bfbc-ac66537fad06" />
  
## **Code Detection** - Track those code snippets shared
<img width="1440" height="820" alt="Screenshot 2025-12-30 at 4 20 35 PM" src="https://github.com/user-attachments/assets/3cf4f94a-2ed6-4c99-9205-653a0fc2a831" />
  
## **Shareable Cards** - Export and share your wrapped summary

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

Made by Arpit Chauhan. Built with ❤️ inspired by Spotify Wrapped, Apple Music Replay, and ChatGPT Wrapped.
