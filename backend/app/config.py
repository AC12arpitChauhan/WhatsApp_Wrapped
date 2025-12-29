"""
Application configuration
"""
from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    APP_NAME: str = "WhatsApp Wrapped"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # CORS settings - use string env var, parsed at runtime
    # Set CORS_ORIGINS_STR as comma-separated: "https://app.vercel.app,https://other.com"
    CORS_ORIGINS_STR: str = ""
    
    # Processing limits
    MAX_FILE_SIZE_MB: int = 10
    MAX_MESSAGES: int = 100000
    
    class Config:
        env_file = ".env"
        extra = "allow"
    
    def get_cors_origins(self) -> List[str]:
        """Get CORS origins - parses comma-separated string from env"""
        # Default origins for local development
        default_origins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
        
        # Parse env var if set
        if self.CORS_ORIGINS_STR:
            env_origins = [o.strip() for o in self.CORS_ORIGINS_STR.split(",") if o.strip()]
            return env_origins + default_origins
        
        return default_origins


settings = Settings()
