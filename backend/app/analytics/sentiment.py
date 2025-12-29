"""
Sentiment Analyzer
VADER-based sentiment analysis for Slide 8
"""
import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from typing import Dict, List
from ..models.schemas import Slide8Data, MonthlySentiment


class SentimentAnalyzer:
    """Analyzer for emotional sentiment over time using VADER."""
    
    MONTH_ORDER = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.analyzer = SentimentIntensityAnalyzer()
        
    def analyze(self) -> Slide8Data:
        """
        Analyze sentiment patterns over time.
        
        Returns:
            Slide8Data with monthly sentiment trends
        """
        # Only analyze text messages
        text_df = self.df[self.df['message_type'] == 'text'].copy()
        
        # Calculate sentiment for each message
        text_df['sentiment'] = text_df['message'].apply(self._get_sentiment)
        
        # Group by month
        monthly_data = []
        for month in self.MONTH_ORDER:
            month_df = text_df[text_df['month'] == month]
            
            if len(month_df) == 0:
                continue
            
            avg_sentiment = month_df['sentiment'].mean()
            message_count = len(month_df)
            
            # Classify sentiment
            if avg_sentiment >= 0.2:
                label = "Positive"
            elif avg_sentiment <= -0.2:
                label = "Negative"
            else:
                label = "Neutral"
            
            monthly_data.append(MonthlySentiment(
                month=month,
                score=round(avg_sentiment, 3),
                label=label,
                message_count=message_count
            ))
        
        # Find extremes
        if monthly_data:
            happiest_month = max(monthly_data, key=lambda x: x.score).month
            
            # Most intense = highest absolute sentiment variance
            intensities = {
                m.month: text_df[text_df['month'] == m.month]['sentiment'].std()
                for m in monthly_data
                if len(text_df[text_df['month'] == m.month]) > 0
            }
            most_intense_month = max(intensities, key=intensities.get) if intensities else monthly_data[0].month
        else:
            happiest_month = "N/A"
            most_intense_month = "N/A"
        
        # Overall average
        average_sentiment = text_df['sentiment'].mean() if len(text_df) > 0 else 0.0
        
        disclaimer = (
            "Sentiment analysis uses VADER, which works best with English text. "
            "Results for Hinglish or mixed-language messages may be less accurate. "
            "This is an approximation, not a definitive measure of emotions."
        )
        
        return Slide8Data(
            monthly_sentiment=monthly_data,
            happiest_month=happiest_month,
            most_intense_month=most_intense_month,
            average_sentiment=round(average_sentiment, 3),
            disclaimer=disclaimer
        )
    
    def _get_sentiment(self, message: str) -> float:
        """
        Get compound sentiment score for a message.
        
        Returns:
            Compound score between -1 (negative) and 1 (positive)
        """
        try:
            scores = self.analyzer.polarity_scores(str(message))
            return scores['compound']
        except Exception:
            return 0.0
