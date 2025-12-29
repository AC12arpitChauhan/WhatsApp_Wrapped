"""
Basic Statistics Analyzer
Calculates fundamental chat statistics for Slide 1
"""
import pandas as pd
from typing import Dict, Any
from ..models.schemas import Slide1Data


class BasicStatsAnalyzer:
    """Analyzer for basic chat statistics."""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        
    def analyze(self) -> Slide1Data:
        """
        Calculate basic statistics for the chat.
        
        Returns:
            Slide1Data with total messages, words, active days, media count
        """
        # Total messages
        total_messages = len(self.df)
        
        # Total words (only from text messages)
        total_words = self.df['word_count'].sum()
        
        # Active days (unique dates with messages)
        active_days = self.df['date'].nunique()
        
        # Media shared (non-text messages)
        media_types = ['image', 'video', 'audio', 'sticker', 'gif', 'document']
        media_shared = len(self.df[self.df['message_type'].isin(media_types)])
        
        # Date range
        date_range = {
            'start': self.df['datetime'].min().strftime('%Y-%m-%d'),
            'end': self.df['datetime'].max().strftime('%Y-%m-%d')
        }
        
        # Participants count
        participants_count = self.df['sender'].nunique()
        
        return Slide1Data(
            total_messages=total_messages,
            total_words=int(total_words),
            active_days=active_days,
            media_shared=media_shared,
            date_range=date_range,
            participants_count=participants_count
        )
