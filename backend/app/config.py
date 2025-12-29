"""
Application configuration
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    APP_NAME: str = "WhatsApp Wrapped"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # CORS settings
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


settings = Settings()
