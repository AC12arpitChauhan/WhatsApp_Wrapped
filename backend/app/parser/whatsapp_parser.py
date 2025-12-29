"""
WhatsApp Chat Parser
Parses WhatsApp exported .txt files into structured DataFrames
"""
import regex as re
import pandas as pd
from datetime import datetime
from typing import Tuple, List, Optional
import logging

logger = logging.getLogger(__name__)


class WhatsAppParser:
    """
    Parser for WhatsApp chat exports.
    Handles multiple date formats and multi-line messages.
    """
    
    # Common WhatsApp message patterns
    # Format: DD/MM/YY, HH:MM - Sender: Message
    # Format: DD/MM/YYYY, HH:MM - Sender: Message
    # Format: MM/DD/YY, HH:MM - Sender: Message
    # Format: [DD/MM/YY, HH:MM:SS] Sender: Message
    PATTERNS = [
        # Pattern 1: DD/MM/YY, HH:MM - Sender: Message (12h)
        r'^(\d{1,2}/\d{1,2}/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\s*[-–]\s*([^:]+):\s*(.*)$',
        # Pattern 2: [DD/MM/YY, HH:MM:SS] Sender: Message
        r'^\[(\d{1,2}/\d{1,2}/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\]\s*([^:]+):\s*(.*)$',
        # Pattern 3: DD.MM.YY, HH:MM - Sender: Message
        r'^(\d{1,2}\.\d{1,2}\.\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\s*[-–]\s*([^:]+):\s*(.*)$',
    ]
    
    # System message indicators
    SYSTEM_INDICATORS = [
        'Messages and calls are end-to-end encrypted',
        'created group',
        'added',
        'removed',
        'left',
        'changed the subject',
        'changed this group',
        'changed the group',
        'deleted this message',
        'message was deleted',
        'security code changed',
        'joined using this group',
        'changed their phone number',
    ]
    
    # Media indicators
    MEDIA_PATTERNS = {
        'image': [r'<Media omitted>', r'image omitted', r'IMG-\d+', r'\.jpg', r'\.jpeg', r'\.png'],
        'video': [r'video omitted', r'VID-\d+', r'\.mp4', r'\.mov'],
        'audio': [r'audio omitted', r'PTT-\d+', r'\.opus', r'\.mp3'],
        'sticker': [r'sticker omitted', r'\.webp'],
        'gif': [r'GIF omitted'],
        'document': [r'document omitted', r'\.pdf', r'\.doc', r'\.xlsx'],
        'contact': [r'contact card omitted', r'\.vcf'],
        'location': [r'location:', r'live location shared'],
    }
    
    def __init__(self):
        self.compiled_patterns = [re.compile(p, re.MULTILINE) for p in self.PATTERNS]
        self.df = None
        self.chat_name = "WhatsApp Chat"
        
    def parse(self, content: str) -> pd.DataFrame:
        """
        Parse WhatsApp chat content into a DataFrame.
        
        Args:
            content: Raw text content from WhatsApp export
            
        Returns:
            DataFrame with columns: datetime, date, time, hour, day_of_week, 
                                   month, sender, message, message_type
        """
        messages = self._extract_messages(content)
        
        if not messages:
            raise ValueError("No valid messages found in the chat export")
        
        # Create DataFrame
        self.df = pd.DataFrame(messages, columns=['datetime', 'sender', 'message'])
        
        # Extract temporal features
        self.df['date'] = self.df['datetime'].dt.date
        self.df['time'] = self.df['datetime'].dt.time
        self.df['hour'] = self.df['datetime'].dt.hour
        self.df['day_of_week'] = self.df['datetime'].dt.day_name()
        self.df['month'] = self.df['datetime'].dt.month_name()
        self.df['year'] = self.df['datetime'].dt.year
        
        # Classify message types
        self.df['message_type'] = self.df['message'].apply(self._classify_message)
        
        # Extract word count for text messages
        self.df['word_count'] = self.df.apply(
            lambda row: len(row['message'].split()) if row['message_type'] == 'text' else 0,
            axis=1
        )
        
        # Filter out system messages
        self.df = self.df[self.df['message_type'] != 'system'].reset_index(drop=True)
        
        logger.info(f"Parsed {len(self.df)} messages from {self.df['sender'].nunique()} participants")
        
        return self.df
    
    def _extract_messages(self, content: str) -> List[Tuple[datetime, str, str]]:
        """Extract messages using regex patterns."""
        messages = []
        lines = content.split('\n')
        
        current_message = None
        
        for line in lines:
            # Skip empty lines
            if not line.strip():
                continue
                
            # Try to match message patterns
            matched = False
            for pattern in self.compiled_patterns:
                match = pattern.match(line)
                if match:
                    # Save previous message if exists
                    if current_message:
                        messages.append(current_message)
                    
                    date_str, time_str, sender, message = match.groups()
                    
                    # Parse datetime
                    dt = self._parse_datetime(date_str, time_str)
                    if dt:
                        current_message = (dt, sender.strip(), message.strip())
                        matched = True
                        break
            
            # If no match, it's a continuation of the previous message
            if not matched and current_message:
                dt, sender, prev_message = current_message
                current_message = (dt, sender, prev_message + '\n' + line.strip())
        
        # Don't forget the last message
        if current_message:
            messages.append(current_message)
        
        return messages
    
    def _parse_datetime(self, date_str: str, time_str: str) -> Optional[datetime]:
        """Parse date and time strings into datetime object."""
        # Normalize separators
        date_str = date_str.replace('.', '/')
        
        # Handle various date formats
        date_formats = [
            '%d/%m/%y', '%d/%m/%Y',
            '%m/%d/%y', '%m/%d/%Y',
        ]
        
        # Handle various time formats
        time_formats = [
            '%H:%M', '%H:%M:%S',
            '%I:%M %p', '%I:%M:%S %p',
            '%I:%M%p', '%I:%M:%S%p',
        ]
        
        time_str = time_str.strip().upper().replace(' ', '')
        if 'AM' in time_str or 'PM' in time_str:
            # Ensure space before AM/PM
            time_str = time_str.replace('AM', ' AM').replace('PM', ' PM').strip()
        
        for date_fmt in date_formats:
            for time_fmt in time_formats:
                try:
                    dt_str = f"{date_str} {time_str}"
                    fmt = f"{date_fmt} {time_fmt}"
                    return datetime.strptime(dt_str, fmt)
                except ValueError:
                    continue
        
        logger.warning(f"Could not parse datetime: {date_str} {time_str}")
        return None
    
    def _classify_message(self, message: str) -> str:
        """Classify message type based on content."""
        message_lower = message.lower()
        
        # Check for system messages
        for indicator in self.SYSTEM_INDICATORS:
            if indicator.lower() in message_lower:
                return 'system'
        
        # Check for media types
        for media_type, patterns in self.MEDIA_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, message, re.IGNORECASE):
                    return media_type
        
        return 'text'
    
    def get_participants(self) -> List[str]:
        """Get list of unique participants."""
        if self.df is None:
            return []
        return self.df['sender'].unique().tolist()
    
    def get_date_range(self) -> Tuple[str, str]:
        """Get the date range of the chat."""
        if self.df is None or len(self.df) == 0:
            return ("", "")
        return (
            self.df['datetime'].min().strftime('%Y-%m-%d'),
            self.df['datetime'].max().strftime('%Y-%m-%d')
        )
