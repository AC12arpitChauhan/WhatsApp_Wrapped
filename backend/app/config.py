"""
Application configuration
"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    APP_NAME: str = "WhatsApp Wrapped"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # CORS settings - can be overridden with CORS_ORIGINS env var
    # Format: comma-separated URLs like "https://app.vercel.app,https://other.com"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Processing limits
    MAX_FILE_SIZE_MB: int = 10
    MAX_MESSAGES: int = 100000
    
    class Config:
        env_file = ".env"
        extra = "allow"
    
    def get_cors_origins(self) -> List[str]:
        """Get CORS origins from env var or defaults"""
        env_origins = os.environ.get("CORS_ORIGINS", "")
        if env_origins:
            # Parse comma-separated origins
            origins = [o.strip() for o in env_origins.split(",") if o.strip()]
            return origins + self.CORS_ORIGINS
        return self.CORS_ORIGINS


settings = Settings()
