"""
FastAPI Main Application
Entry point for the WhatsApp Wrapped backend
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routes.upload import router as upload_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Analyze WhatsApp chat exports and generate a Spotify Wrapped-style experience",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload_router, prefix="/api", tags=["Upload & Analysis"])


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "message": "WhatsApp Wrapped is ready to analyze your chats!"
    }


# Privacy notice endpoint
@app.get("/api/privacy")
async def privacy_notice():
    """Return privacy information."""
    return {
        "notice": "All processing happens on our servers but is ephemeral.",
        "data_retention": "None - your chat data is processed and immediately discarded.",
        "storage": "No database, no logs of chat content.",
        "tracking": "No analytics tracking of users.",
        "commitment": "We take your privacy seriously. Your conversations are yours."
    }
