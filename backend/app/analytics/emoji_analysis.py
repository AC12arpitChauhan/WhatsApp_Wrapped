"""
Emoji Analyzer
Analyzes emoji and sticker usage for Slide 5
"""
import pandas as pd
import emoji
from collections import Counter
from typing import Dict, List
from ..models.schemas import Slide5Data, EmojiStat


class EmojiAnalyzer:
    """Analyzer for emoji and sticker patterns."""
    
    # Emoji mood categories
    MOOD_EMOJIS = {
        'happy': ['😂', '😊', '😄', '😁', '🙂', '😆', '😃', '🤣', '😅', '☺️', '🥳', '😋', '😎', '🤗'],
        'love': ['❤️', '😍', '🥰', '💕', '💗', '💖', '💘', '💝', '😘', '💓', '💞', '🤍', '💜', '💙'],
        'sad': ['😢', '😭', '😔', '😞', '😿', '💔', '🥺', '😥', '😓', '☹️'],
        'angry': ['😠', '😡', '🤬', '😤', '💢', '👿', '😾'],
        'surprised': ['😮', '😲', '😯', '🤯', '😱', '🙀', '😳', '🤭'],
        'thinking': ['🤔', '💭', '🧐', '🤨', '😐', '😑'],
    }
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        
    def analyze(self) -> Slide5Data:
        """
        Analyze emoji and sticker usage patterns.
        
        Returns:
            Slide5Data with top emojis, sticker count, mood breakdown
        """
        # Extract all emojis
        all_emojis = []
        emoji_by_sender = {}
        
        for _, row in self.df.iterrows():
            message = str(row['message'])
            sender = row['sender']
            
            # Extract emojis from message
            message_emojis = [c for c in message if c in emoji.EMOJI_DATA]
            all_emojis.extend(message_emojis)
            
            if sender not in emoji_by_sender:
                emoji_by_sender[sender] = []
            emoji_by_sender[sender].extend(message_emojis)
        
        # Count emojis
        emoji_counts = Counter(all_emojis)
        total_emojis = len(all_emojis)
        
        # Top emojis
        top_emojis = []
        for em, count in emoji_counts.most_common(10):
            percentage = (count / total_emojis * 100) if total_emojis > 0 else 0
            top_emojis.append(EmojiStat(
                emoji=em,
                count=count,
                percentage=round(percentage, 1)
            ))
        
        # Sticker count
        sticker_count = len(self.df[self.df['message_type'] == 'sticker'])
        
        # Emoji per message ratio
        text_messages = len(self.df[self.df['message_type'] == 'text'])
        emoji_per_message = total_emojis / max(text_messages, 1)
        
        # Mood breakdown
        mood_breakdown = self._calculate_mood_breakdown(emoji_counts)
        
        # Top emoji users
        top_emoji_users = self._find_top_emoji_users(emoji_by_sender, emoji_counts)
        
        return Slide5Data(
            top_emojis=top_emojis,
            total_emojis=total_emojis,
            sticker_count=sticker_count,
            emoji_per_message=round(emoji_per_message, 2),
            mood_breakdown=mood_breakdown,
            top_emoji_users=top_emoji_users
        )
    
    def _calculate_mood_breakdown(self, emoji_counts: Counter) -> Dict[str, float]:
        """Calculate mood distribution based on emoji categories."""
        mood_counts = {mood: 0 for mood in self.MOOD_EMOJIS}
        total = 0
        
        for em, count in emoji_counts.items():
            for mood, mood_emojis in self.MOOD_EMOJIS.items():
                if em in mood_emojis:
                    mood_counts[mood] += count
                    total += count
                    break
        
        if total == 0:
            return {mood: 0.0 for mood in self.MOOD_EMOJIS}
        
        return {
            mood: round(count / total * 100, 1)
            for mood, count in mood_counts.items()
        }
    
    def _find_top_emoji_users(
        self, 
        emoji_by_sender: Dict[str, List[str]], 
        emoji_counts: Counter
    ) -> Dict[str, str]:
        """Find who uses each top emoji the most."""
        top_emoji_users = {}
        
        for em, _ in emoji_counts.most_common(5):
            max_count = 0
            top_user = ""
            
            for sender, sender_emojis in emoji_by_sender.items():
                count = sender_emojis.count(em)
                if count > max_count:
                    max_count = count
                    top_user = sender
            
            if top_user:
                top_emoji_users[em] = top_user
        
        return top_emoji_users
