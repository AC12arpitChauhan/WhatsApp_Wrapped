"""
Temporal Analyzer
Analyzes when users are most active for Slide 2
"""
import pandas as pd
from typing import Dict
from ..models.schemas import Slide2Data, HourlyActivity


class TemporalAnalyzer:
    """Analyzer for temporal patterns in chat activity."""
    
    HOUR_LABELS = {
        0: "12 AM", 1: "1 AM", 2: "2 AM", 3: "3 AM", 4: "4 AM", 5: "5 AM",
        6: "6 AM", 7: "7 AM", 8: "8 AM", 9: "9 AM", 10: "10 AM", 11: "11 AM",
        12: "12 PM", 13: "1 PM", 14: "2 PM", 15: "3 PM", 16: "4 PM", 17: "5 PM",
        18: "6 PM", 19: "7 PM", 20: "8 PM", 21: "9 PM", 22: "10 PM", 23: "11 PM"
    }
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        
    def analyze(self) -> Slide2Data:
        """
        Analyze temporal patterns of chat activity.
        
        Returns:
            Slide2Data with most active hour, day, chronotype, etc.
        """
        # Messages by hour
        hour_counts = self.df['hour'].value_counts().sort_index()
        messages_by_hour = {str(h): int(hour_counts.get(h, 0)) for h in range(24)}
        
        # Activity by hour list for chart display
        activity_by_hour = [
            HourlyActivity(hour=h, count=int(hour_counts.get(h, 0)))
            for h in range(24)
        ]
        
        # Most active hour
        most_active_hour = int(hour_counts.idxmax())
        most_active_hour_label = self.HOUR_LABELS[most_active_hour]
        
        # Messages by day of week
        day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        day_counts = self.df['day_of_week'].value_counts()
        messages_by_day = {day: int(day_counts.get(day, 0)) for day in day_order}
        
        # Most active day
        most_active_day = day_counts.idxmax()
        
        # Determine chronotype based on when MOST activity happens
        # Define time periods
        night_hours = [21, 22, 23, 0, 1, 2, 3, 4]  # 9 PM - 4 AM
        early_hours = [5, 6, 7, 8, 9]              # 5 AM - 9 AM  
        morning_hours = [10, 11]                   # 10 AM - 11 AM
        afternoon_hours = [12, 13, 14, 15, 16, 17] # 12 PM - 5 PM
        evening_hours = [18, 19, 20]               # 6 PM - 8 PM
        
        night_messages = sum(hour_counts.get(h, 0) for h in night_hours)
        early_messages = sum(hour_counts.get(h, 0) for h in early_hours)
        morning_messages = sum(hour_counts.get(h, 0) for h in morning_hours)
        afternoon_messages = sum(hour_counts.get(h, 0) for h in afternoon_hours)
        evening_messages = sum(hour_counts.get(h, 0) for h in evening_hours)
        
        total = night_messages + early_messages + morning_messages + afternoon_messages + evening_messages
        if total == 0:
            total = 1
        
        # Find dominant period
        periods = {
            'night': night_messages,
            'early': early_messages,
            'morning': morning_messages,
            'afternoon': afternoon_messages,
            'evening': evening_messages
        }
        dominant = max(periods, key=periods.get)
        
        # Assign chronotype based on dominant period
        if dominant == 'night' or (night_messages / total > 0.25):
            chronotype = "Night Owl"
            chronotype_emoji = "🦉"
        elif dominant == 'early' or (early_messages / total > 0.2):
            chronotype = "Early Bird"
            chronotype_emoji = "🌅"
        elif dominant == 'afternoon':
            chronotype = "Afternoon Crew"
            chronotype_emoji = "☀️"
        elif dominant == 'evening':
            chronotype = "Evening Squad"
            chronotype_emoji = "🌆"
        elif dominant == 'morning':
            chronotype = "Morning Person"
            chronotype_emoji = "🌤️"
        else:
            chronotype = "All-Day Texters"
            chronotype_emoji = "⚡"
        
        return Slide2Data(
            most_active_hour=most_active_hour,
            most_active_hour_label=most_active_hour_label,
            most_active_day=most_active_day,
            messages_by_hour=messages_by_hour,
            messages_by_day=messages_by_day,
            activity_by_hour=activity_by_hour,
            chronotype=chronotype,
            chronotype_emoji=chronotype_emoji
        )
