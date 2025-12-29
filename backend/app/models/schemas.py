"""
Pydantic schemas for API request/response models
"""
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from datetime import datetime


# ============ Slide 1: Your WhatsApp Year ============
class Slide1Data(BaseModel):
    """Basic statistics about the chat"""
    total_messages: int
    total_words: int
    active_days: int
    media_shared: int
    date_range: Dict[str, str]  # {"start": "2024-01-01", "end": "2024-12-31"}
    participants_count: int


# ============ Slide 2: When You Were Most Alive ============
class HourlyActivity(BaseModel):
    """Activity for a specific hour"""
    hour: int  # 0-23
    count: int


class Slide2Data(BaseModel):
    """Temporal activity analysis"""
    most_active_hour: int  # 0-23
    most_active_hour_label: str  # "11 PM"
    most_active_day: str  # "Saturday"
    messages_by_hour: Dict[str, int]  # {"0": 50, "1": 30, ...}
    messages_by_day: Dict[str, int]  # {"Monday": 100, ...}
    activity_by_hour: List[HourlyActivity]  # For chart display
    chronotype: str  # "Night Owl" or "Early Bird"
    chronotype_emoji: str  # "🦉" or "🐦"


# ============ Slide 3: Chat Personality ============
class PersonalityProfile(BaseModel):
    """Individual personality profile"""
    name: str
    personality_type: str
    personality_emoji: str
    traits: List[str]
    score: float  # 0-100


class Slide3Data(BaseModel):
    """Personality classification for each member"""
    personalities: List[PersonalityProfile]
    group_personality: str  # Overall group vibe
    methodology: str  # Explanation of how personality is determined


# ============ Slide 4: Who Carried the Group ============
class ContributorStats(BaseModel):
    """Stats for each contributor"""
    name: str
    messages: int
    percentage: float
    words: int
    avg_message_length: float


class Slide4Data(BaseModel):
    """Contribution breakdown"""
    contributors: List[ContributorStats]
    top_contributor: str
    silent_members: List[str]
    participation_ratio: float  # Gini coefficient for inequality


# ============ Slide 5: Emoji & Sticker Wrapped ============
class EmojiStat(BaseModel):
    """Stats for each emoji"""
    emoji: str
    count: int
    percentage: float


class Slide5Data(BaseModel):
    """Emoji and sticker analysis"""
    top_emojis: List[EmojiStat]
    total_emojis: int
    sticker_count: int
    emoji_per_message: float
    mood_breakdown: Dict[str, float]  # {"happy": 40, "love": 30, ...}
    top_emoji_users: Dict[str, str]  # {"😂": "John", ...}


# ============ Slide 6: Media & Chaos Index ============
class Slide6Data(BaseModel):
    """Media and chaos analysis"""
    image_count: int
    video_count: int
    sticker_count: int
    gif_count: int
    document_count: int
    total_media: int
    media_to_text_ratio: float
    peak_chaos_day: str  # "2024-03-15"
    peak_chaos_messages: int
    chaos_index: float  # 0-100
    top_media_sharer: Optional[str] = None  # Person who shared the most media


# ============ Slide 7: Code & Geek Energy ============
class CoderStats(BaseModel):
    """Stats for code contributors"""
    name: str
    code_snippets: int
    languages: List[str]


class Slide7Data(BaseModel):
    """Code snippet analysis"""
    total_code_snippets: int
    coders: List[CoderStats]
    dominant_language: str
    common_keywords: List[str]
    geek_energy_score: float  # 0-100
    top_coder: Optional[str]


# ============ Slide 8: Emotional Timeline ============
class MonthlySentiment(BaseModel):
    """Sentiment for a month"""
    month: str  # "January"
    score: float  # -1 to 1
    label: str  # "Positive", "Neutral", "Negative"
    message_count: int


class Slide8Data(BaseModel):
    """Sentiment analysis over time"""
    monthly_sentiment: List[MonthlySentiment]
    happiest_month: str
    most_intense_month: str
    average_sentiment: float
    disclaimer: str


# ============ Slide 9: What You Talked About ============
class Topic(BaseModel):
    """A conversation topic"""
    topic_id: int
    label: str  # Human-readable label
    keywords: List[str]
    weight: float  # 0-100


class Slide9Data(BaseModel):
    """Topic modeling results"""
    topics: List[Topic]
    methodology: str


# ============ Slide 10: Final Summary ============
class Slide10Data(BaseModel):
    """Shareable summary card"""
    summary_text: str
    total_messages: int
    personality_type: str
    peak_time: str
    group_role: str
    top_emoji: str
    chat_name: str
    year: int
    shareable_stats: List[str]


# ============ Combined Response ============
class WrappedData(BaseModel):
    """Complete wrapped data for all slides"""
    slide1: Slide1Data
    slide2: Slide2Data
    slide3: Slide3Data
    slide4: Slide4Data
    slide5: Slide5Data
    slide6: Slide6Data
    slide7: Slide7Data
    slide8: Slide8Data
    slide9: Slide9Data
    slide10: Slide10Data


class UploadResponse(BaseModel):
    """Response after file upload"""
    success: bool
    message: str
    session_id: str
    data: Optional[WrappedData] = None


class ErrorResponse(BaseModel):
    """Error response"""
    success: bool = False
    error: str
    detail: Optional[str] = None
