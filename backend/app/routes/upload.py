"""
Upload and Analysis Route
Main endpoint for processing WhatsApp chat exports
"""
import uuid
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any

from ..parser import WhatsAppParser
from ..analytics import (
    BasicStatsAnalyzer,
    TemporalAnalyzer,
    PersonalityAnalyzer,
    EmojiAnalyzer,
    MediaAnalyzer,
    CodeDetector,
    SentimentAnalyzer,
    TopicModeler
)
from ..models.schemas import (
    UploadResponse, 
    WrappedData, 
    ErrorResponse,
    Slide10Data,
    Slide4Data,
    ContributorStats
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_chat(file: UploadFile = File(...)):
    """
    Upload and process a WhatsApp chat export file.
    
    Returns complete wrapped data for all 10 slides.
    """
    # Validate file type
    if not file.filename.endswith('.txt'):
        raise HTTPException(
            status_code=400,
            detail="Only .txt files are supported. Please export your WhatsApp chat as text."
        )
    
    try:
        # Read file content
        content = await file.read()
        content_str = content.decode('utf-8', errors='ignore')
        
        if len(content_str.strip()) == 0:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty."
            )
        
        # Parse chat
        parser = WhatsAppParser()
        df = parser.parse(content_str)
        
        if len(df) == 0:
            raise HTTPException(
                status_code=400,
                detail="No valid messages found in the chat export."
            )
        
        # Run all analyzers
        slide1 = BasicStatsAnalyzer(df).analyze()
        slide2 = TemporalAnalyzer(df).analyze()
        slide3 = PersonalityAnalyzer(df).analyze()
        slide4 = _calculate_contributions(df)
        slide5 = EmojiAnalyzer(df).analyze()
        slide6 = MediaAnalyzer(df).analyze()
        slide7 = CodeDetector(df).analyze()
        slide8 = SentimentAnalyzer(df).analyze()
        slide9 = TopicModeler(df).analyze()
        slide10 = _generate_summary(
            df, slide1, slide2, slide3, slide5
        )
        
        # Combine all slide data
        wrapped_data = WrappedData(
            slide1=slide1,
            slide2=slide2,
            slide3=slide3,
            slide4=slide4,
            slide5=slide5,
            slide6=slide6,
            slide7=slide7,
            slide8=slide8,
            slide9=slide9,
            slide10=slide10
        )
        
        session_id = str(uuid.uuid4())
        
        logger.info(f"Successfully processed chat with {len(df)} messages")
        
        return UploadResponse(
            success=True,
            message=f"Successfully analyzed {len(df)} messages from {slide1.participants_count} participants",
            session_id=session_id,
            data=wrapped_data
        )
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing chat: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat: {str(e)}"
        )


def _calculate_contributions(df) -> Slide4Data:
    """Calculate contribution statistics for each participant."""
    contributors = []
    total_messages = len(df)
    
    # Group by sender
    sender_stats = df.groupby('sender').agg({
        'message': 'count',
        'word_count': 'sum'
    }).reset_index()
    sender_stats.columns = ['sender', 'messages', 'words']
    
    # Calculate average message length
    for _, row in sender_stats.iterrows():
        text_msgs = df[(df['sender'] == row['sender']) & (df['message_type'] == 'text')]
        avg_length = text_msgs['word_count'].mean() if len(text_msgs) > 0 else 0
        
        contributors.append(ContributorStats(
            name=row['sender'],
            messages=int(row['messages']),
            percentage=round(row['messages'] / total_messages * 100, 1),
            words=int(row['words']),
            avg_message_length=round(avg_length, 1)
        ))
    
    # Sort by messages
    contributors.sort(key=lambda x: x.messages, reverse=True)
    
    # Top contributor
    top_contributor = contributors[0].name if contributors else "Unknown"
    
    # Silent members (bottom 20% by message count)
    threshold = total_messages * 0.05 / len(contributors) if contributors else 0
    silent_members = [c.name for c in contributors if c.messages < threshold]
    
    # Participation ratio (Gini coefficient approximation)
    if contributors:
        percentages = [c.percentage for c in contributors]
        n = len(percentages)
        mean_pct = 100 / n
        deviation = sum(abs(p - mean_pct) for p in percentages) / (2 * n * mean_pct)
        participation_ratio = 1 - deviation
    else:
        participation_ratio = 1.0
    
    return Slide4Data(
        contributors=contributors,
        top_contributor=top_contributor,
        silent_members=silent_members[:5],  # Top 5 silent members
        participation_ratio=round(participation_ratio, 2)
    )


def _generate_summary(df, slide1, slide2, slide3, slide5) -> Slide10Data:
    """Generate the final summary card data."""
    # Get primary year
    years = df['year'].value_counts()
    primary_year = int(years.idxmax()) if len(years) > 0 else 2024
    
    # Get top personality
    top_personality = slide3.personalities[0] if slide3.personalities else None
    personality_type = top_personality.personality_type if top_personality else "Chatter"
    
    # Get top emoji
    top_emoji = slide5.top_emojis[0].emoji if slide5.top_emojis else "💬"
    
    # Determine group role
    if slide1.participants_count > 5:
        group_role = "Group Chat Veteran"
    elif slide1.participants_count == 2:
        group_role = "One-on-One Champion"
    else:
        group_role = "Small Circle Keeper"
    
    # Generate summary text
    summary_text = (
        f"You exchanged {slide1.total_messages:,} messages over {slide1.active_days} days. "
        f"Your chat personality is {personality_type}, and you're most active at {slide2.most_active_hour_label}. "
        f"You're a {slide2.chronotype}!"
    )
    
    # Shareable stats
    shareable_stats = [
        f"📊 {slide1.total_messages:,} messages sent",
        f"📝 {slide1.total_words:,} words written",
        f"📅 Active for {slide1.active_days} days",
        f"🎭 Personality: {personality_type}",
        f"⏰ Peak time: {slide2.most_active_hour_label}",
    ]
    
    return Slide10Data(
        summary_text=summary_text,
        total_messages=slide1.total_messages,
        personality_type=personality_type,
        peak_time=slide2.most_active_hour_label,
        group_role=group_role,
        top_emoji=top_emoji,
        chat_name="WhatsApp Chat",
        year=primary_year,
        shareable_stats=shareable_stats
    )
