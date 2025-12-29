"""
Media Analyzer
Analyzes media sharing patterns and calculates chaos index for Slide 6
"""
import pandas as pd
from typing import Dict
from ..models.schemas import Slide6Data


class MediaAnalyzer:
    """Analyzer for media sharing patterns and chaos index."""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        
    def analyze(self) -> Slide6Data:
        """
        Analyze media sharing patterns and calculate chaos index.
        
        Returns:
            Slide6Data with media counts, ratios, and chaos metrics
        """
        # Count each media type
        image_count = len(self.df[self.df['message_type'] == 'image'])
        video_count = len(self.df[self.df['message_type'] == 'video'])
        sticker_count = len(self.df[self.df['message_type'] == 'sticker'])
        gif_count = len(self.df[self.df['message_type'] == 'gif'])
        document_count = len(self.df[self.df['message_type'] == 'document'])
        audio_count = len(self.df[self.df['message_type'] == 'audio'])
        
        total_media = image_count + video_count + sticker_count + gif_count + document_count + audio_count
        
        # Text messages
        text_count = len(self.df[self.df['message_type'] == 'text'])
        
        # Media to text ratio
        media_to_text_ratio = total_media / max(text_count, 1)
        
        # Find peak chaos day (day with most messages)
        daily_counts = self.df.groupby('date').size()
        if len(daily_counts) > 0:
            peak_chaos_date = daily_counts.idxmax()
            peak_chaos_messages = int(daily_counts.max())
            peak_chaos_day = str(peak_chaos_date)
        else:
            peak_chaos_day = "Unknown"
            peak_chaos_messages = 0
        
        # Find top media sharer
        media_types = ['image', 'video', 'sticker', 'gif', 'document', 'audio']
        media_df = self.df[self.df['message_type'].isin(media_types)]
        top_media_sharer = None
        if len(media_df) > 0:
            media_by_sender = media_df.groupby('sender').size()
            if len(media_by_sender) > 0:
                top_media_sharer = media_by_sender.idxmax()
        
        # Calculate chaos index (0-100)
        chaos_index = self._calculate_chaos_index(daily_counts, media_to_text_ratio)
        
        return Slide6Data(
            image_count=image_count,
            video_count=video_count,
            sticker_count=sticker_count,
            gif_count=gif_count,
            document_count=document_count,
            total_media=total_media,
            media_to_text_ratio=round(media_to_text_ratio, 2),
            peak_chaos_day=peak_chaos_day,
            peak_chaos_messages=peak_chaos_messages,
            chaos_index=round(chaos_index, 1),
            top_media_sharer=top_media_sharer
        )
    
    def _calculate_chaos_index(
        self, 
        daily_counts: pd.Series, 
        media_ratio: float
    ) -> float:
        """
        Calculate a chaos index (0-100) based on message patterns.
        
        Higher chaos = More messages + More variability + More media
        """
        if len(daily_counts) == 0:
            return 0.0
        
        # Factor 1: Average daily message density (normalized)
        avg_daily = daily_counts.mean()
        density_score = min(avg_daily / 100, 1.0) * 30  # Max 30 points
        
        # Factor 2: Variability (coefficient of variation)
        std = daily_counts.std()
        cv = std / max(avg_daily, 1)
        variability_score = min(cv, 1.0) * 30  # Max 30 points
        
        # Factor 3: Media ratio contribution
        media_score = min(media_ratio * 5, 1.0) * 20  # Max 20 points
        
        # Factor 4: Peak intensity
        max_daily = daily_counts.max()
        peak_ratio = max_daily / max(avg_daily, 1)
        peak_score = min((peak_ratio - 1) / 5, 1.0) * 20  # Max 20 points
        
        chaos_index = density_score + variability_score + media_score + peak_score
        
        return min(chaos_index, 100)
