"""
Personality Analyzer
Enhanced rule-based personality classification for Slide 3
"""
import pandas as pd
import emoji
from typing import List, Dict, Tuple
from ..models.schemas import Slide3Data, PersonalityProfile


class PersonalityAnalyzer:
    """
    Analyzer for personality classification based on chat behavior.
    Uses rule-based heuristics rather than ML for interpretability.
    """
    
    PERSONALITY_TYPES = {
        'spammer': {
            'emoji': '🔥',
            'traits': ['Extremely high message frequency', 'Rapid-fire responses', 'Dominates conversations']
        },
        'silent_observer': {
            'emoji': '👀',
            'traits': ['Very rare messages', 'Selective participation', 'Quality over quantity']
        },
        'emoji_addict': {
            'emoji': '😂',
            'traits': ['Emoji in most messages', 'Expressive communication', 'Visual storyteller']
        },
        'essay_writer': {
            'emoji': '📝',
            'traits': ['Long detailed messages', 'Thoughtful responses', 'Deep discussions']
        },
        'chaos_creator': {
            'emoji': '🌪️',
            'traits': ['High media sharing', 'Unpredictable timing', 'Conversation starter']
        },
        'night_owl': {
            'emoji': '🦉',
            'traits': ['Most active late night', 'Nocturnal chatter', 'After-hours responder']
        },
        'early_bird': {
            'emoji': '🌅',
            'traits': ['Morning message surge', 'Starts conversations early', 'Dawn communicator']
        },
        'ghost': {
            'emoji': '👻',
            'traits': ['Unpredictable appearances', 'Long gaps between messages', 'Mystery participant']
        },
        'hype_person': {
            'emoji': '🎉',
            'traits': ['Enthusiastic responses', 'Caps lock lover', 'Energy booster']
        },
        'meme_lord': {
            'emoji': '🎭',
            'traits': ['Heavy media sharer', 'Visual communicator', 'Entertainment provider']
        },
        'voice_note_fan': {
            'emoji': '🎤',
            'traits': ['Prefers audio messages', 'Vocal communicator', 'Too lazy to type']
        },
        'question_asker': {
            'emoji': '❓',
            'traits': ['Frequently asks questions', 'Curious mind', 'Discussion initiator']
        },
        'reply_speedster': {
            'emoji': '⚡',
            'traits': ['Lightning-fast responses', 'Always online', 'Instant replier']
        },
        'one_word_warrior': {
            'emoji': '💬',
            'traits': ['Brief messages', 'Gets to the point', 'Efficient communicator']
        },
        'balanced_chatter': {
            'emoji': '⚖️',
            'traits': ['Moderate activity', 'Diverse message types', 'Consistent presence']
        }
    }
    
    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()
        # Safely extract hour, handling missing or invalid timestamps
        if 'hour' not in self.df.columns:
            if 'timestamp' in self.df.columns:
                try:
                    self.df['hour'] = pd.to_datetime(self.df['timestamp'], errors='coerce').dt.hour
                    self.df['hour'] = self.df['hour'].fillna(12).astype(int)
                except Exception:
                    self.df['hour'] = 12
            elif 'datetime' in self.df.columns:
                try:
                    self.df['hour'] = pd.to_datetime(self.df['datetime'], errors='coerce').dt.hour
                    self.df['hour'] = self.df['hour'].fillna(12).astype(int)
                except Exception:
                    self.df['hour'] = 12
            else:
                self.df['hour'] = 12
        
    def analyze(self) -> Slide3Data:
        """
        Classify personality for each participant.
        
        Returns:
            Slide3Data with personality profiles for each member
        """
        personalities = []
        
        # Calculate group-level metrics for comparison
        num_senders = self.df['sender'].nunique()
        avg_messages = len(self.df) / max(num_senders, 1)
        
        text_df = self.df[self.df['message_type'] == 'text']
        if len(text_df) > 0 and 'word_count' in text_df.columns:
            avg_word_count = text_df['word_count'].mean()
        else:
            avg_word_count = 0
        
        for sender in self.df['sender'].unique():
            sender_df = self.df[self.df['sender'] == sender]
            profile = self._classify_personality(sender_df, avg_messages, avg_word_count)
            personalities.append(profile)
        
        # Sort by score descending
        personalities.sort(key=lambda x: x.score, reverse=True)
        
        # Determine group personality
        group_personality = self._determine_group_personality(personalities)
        
        methodology = (
            "Personality is determined by analyzing message frequency, timing patterns, "
            "average message length, emoji usage, media sharing patterns, and response behavior. "
            "Each member is compared against group averages to identify dominant traits."
        )
        
        return Slide3Data(
            personalities=personalities,
            group_personality=group_personality,
            methodology=methodology
        )
    
    def _classify_personality(
        self, 
        sender_df: pd.DataFrame, 
        avg_messages: float,
        avg_word_count: float
    ) -> PersonalityProfile:
        """Classify personality for a single sender with improved distribution."""
        sender = sender_df['sender'].iloc[0]
        message_count = len(sender_df)
        
        # Calculate metrics
        text_messages = sender_df[sender_df['message_type'] == 'text']
        avg_length = text_messages['word_count'].mean() if len(text_messages) > 0 else 0
        
        # Emoji ratio
        emoji_count = sum(
            len([c for c in msg if c in emoji.EMOJI_DATA])
            for msg in sender_df['message'].astype(str)
        )
        emoji_ratio = emoji_count / max(message_count, 1)
        
        # Media ratio
        media_types = ['image', 'video', 'sticker', 'gif', 'document']
        media_count = len(sender_df[sender_df['message_type'].isin(media_types)])
        media_ratio = media_count / max(message_count, 1)
        
        # Audio ratio
        audio_count = len(sender_df[sender_df['message_type'] == 'audio'])
        audio_ratio = audio_count / max(message_count, 1)
        
        # Frequency ratio (compared to average)
        freq_ratio = message_count / max(avg_messages, 1)
        
        # Time-based analysis
        hour_counts = sender_df['hour'].value_counts()
        night_messages = sender_df[sender_df['hour'].isin([22, 23, 0, 1, 2, 3])]['hour'].count()
        morning_messages = sender_df[sender_df['hour'].isin([5, 6, 7, 8, 9])]['hour'].count()
        night_ratio = night_messages / max(message_count, 1)
        morning_ratio = morning_messages / max(message_count, 1)
        
        # Response time analysis (simple: messages within 5 minutes of previous message)
        quick_ratio = 0
        if 'timestamp' in sender_df.columns or 'datetime' in sender_df.columns:
            time_col = 'timestamp' if 'timestamp' in sender_df.columns else 'datetime'
            try:
                sender_df_sorted = sender_df.sort_values(time_col).copy()
                sender_df_sorted['time_diff'] = pd.to_datetime(sender_df_sorted[time_col], errors='coerce').diff().dt.total_seconds() / 60
                quick_responses = len(sender_df_sorted[sender_df_sorted['time_diff'] < 5])
                quick_ratio = quick_responses / max(message_count - 1, 1)
            except Exception:
                quick_ratio = 0
        
        # Question analysis
        question_count = sum(
            '?' in str(msg) 
            for msg in text_messages['message']
        )
        question_ratio = question_count / max(len(text_messages), 1)
        
        # Caps analysis (enthusiasm)
        caps_count = sum(
            sum(1 for c in str(msg) if c.isupper()) > len(str(msg)) * 0.3 
            for msg in text_messages['message']
        )
        caps_ratio = caps_count / max(len(text_messages), 1)
        
        # Score each personality type with improved thresholds
        scores = {}
        
        # Spammer: >2.5x average frequency (increased threshold)
        scores['spammer'] = min(freq_ratio / 3, 1.0) * 100 if freq_ratio > 2.5 else 0
        
        # Silent observer: <0.5x average frequency
        scores['silent_observer'] = (1 - min(freq_ratio * 2, 1)) * 100 if freq_ratio < 0.5 else 0
        
        # Ghost: very low frequency with irregular patterns
        if message_count < avg_messages * 0.3 and len(sender_df) < 20:
            scores['ghost'] = 70.0
        
        # Emoji addict: >40% emoji usage
        scores['emoji_addict'] = min(emoji_ratio / 0.6, 1.0) * 100 if emoji_ratio > 0.4 else 0
        
        # Essay writer: avg message length >40 words
        scores['essay_writer'] = min(avg_length / 60, 1.0) * 100 if avg_length > 40 else 0
        
        # One word warrior: very short messages
        scores['one_word_warrior'] = (1 - min(avg_length / 10, 1)) * 100 if avg_length < 5 and avg_length > 0 else 0
        
        # Night owl: >30% of messages at night
        scores['night_owl'] = min(night_ratio / 0.4, 1.0) * 100 if night_ratio > 0.3 else 0
        
        # Early bird: >25% of messages in morning
        scores['early_bird'] = min(morning_ratio / 0.35, 1.0) * 100 if morning_ratio > 0.25 else 0
        
        # Meme lord: high media sharing (not just any media, but stickers/gifs/images)
        visual_media = len(sender_df[sender_df['message_type'].isin(['image', 'sticker', 'gif'])])
        visual_ratio = visual_media / max(message_count, 1)
        scores['meme_lord'] = min(visual_ratio / 0.4, 1.0) * 100 if visual_ratio > 0.25 else 0
        
        # Chaos creator: balanced media + moderate frequency
        chaos_score = (media_ratio * 0.5 + min(freq_ratio, 2) / 2 * 0.5) * 100
        scores['chaos_creator'] = chaos_score if media_ratio > 0.2 and media_ratio < 0.6 else 0
        
        # Voice note fan: >20% audio messages
        scores['voice_note_fan'] = min(audio_ratio / 0.3, 1.0) * 100 if audio_ratio > 0.2 else 0
        
        # Question asker: >30% messages with questions
        scores['question_asker'] = min(question_ratio / 0.4, 1.0) * 100 if question_ratio > 0.3 else 0
        
        # Hype person: caps usage + high emoji + moderate frequency
        hype_score = (caps_ratio * 0.4 + min(emoji_ratio / 0.3, 1) * 0.6) * 100
        scores['hype_person'] = hype_score if caps_ratio > 0.2 or (emoji_ratio > 0.3 and freq_ratio > 0.8) else 0
        
        # Reply speedster: >60% quick responses
        scores['reply_speedster'] = min(quick_ratio / 0.7, 1.0) * 100 if quick_ratio > 0.6 else 0
        
        # Find dominant personality with minimum threshold
        max_score = max(scores.values()) if scores else 0
        
        if max_score < 40:  # Increased threshold for balanced
            personality_type = 'balanced_chatter'
            score = 55.0
        else:
            personality_type = max(scores, key=scores.get)
            score = scores[personality_type]
        
        type_info = self.PERSONALITY_TYPES[personality_type]
        
        return PersonalityProfile(
            name=sender,
            personality_type=personality_type.replace('_', ' ').title(),
            personality_emoji=type_info['emoji'],
            traits=type_info['traits'],
            score=round(min(score, 99.0), 1)  # Cap at 99 for realism
        )
    
    def _determine_group_personality(self, personalities: List[PersonalityProfile]) -> str:
        """Determine the overall group personality."""
        type_counts = {}
        for p in personalities:
            ptype = p.personality_type
            type_counts[ptype] = type_counts.get(ptype, 0) + 1
        
        dominant_type = max(type_counts, key=type_counts.get)
        
        group_map = {
            "Spammer": "The Hyperactive Squad 🔥",
            "Silent Observer": "The Quiet Watchers 👀",
            "Ghost": "The Mystery Gang 👻",
            "Emoji Addict": "The Emoji Express 😂",
            "Essay Writer": "The Intellectuals 📚",
            "One Word Warrior": "The Efficiency Experts 💬",
            "Chaos Creator": "The Chaos Collective 🌪️",
            "Night Owl": "The Night Crew 🦉",
            "Early Bird": "The Morning Glory ☀️",
            "Meme Lord": "The Meme Team 🎭",
            "Voice Note Fan": "The Audio Enthusiasts 🎤",
            "Question Asker": "The Curious Minds ❓",
            "Hype Person": "The Hype Squad 🎉",
            "Reply Speedster": "The Lightning League ⚡",
            "Balanced Chatter": "The Balanced Bunch ⚖️"
        }
        
        return group_map.get(dominant_type, "The Balanced Bunch ⚖️")