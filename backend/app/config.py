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
    
    # Processing limits
    MAX_FILE_SIZE_MB: int = 10
    MAX_MESSAGES: int = 100000
    
    class Config:
        env_file = ".env"
        extra = "allow"
    
    def get_cors_origins(self) -> List[str]:
        """Get CORS origins from environment variable"""
        # Default origins for local development
        default_origins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
        
        # Check multiple possible env var names
        env_value = os.environ.get("CORS_ORIGINS_STR") or os.environ.get("CORS_ORIGINS") or ""
        
        if env_value:
            # Parse comma-separated origins
            env_origins = [o.strip() for o in env_value.split(",") if o.strip()]
            return env_origins + default_origins
        
        return default_origins


settings = Settings()
