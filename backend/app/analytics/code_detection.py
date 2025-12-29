"""
Code Detector
Detects and analyzes code snippets for Slide 7
"""
import pandas as pd
import regex as re
from collections import Counter
from typing import Dict, List, Tuple
from ..models.schemas import Slide7Data, CoderStats


class CodeDetector:
    """Detector for code snippets in chat messages."""
    
    # Language-specific patterns
    LANGUAGE_PATTERNS = {
        'C++': [
            r'#include\s*<[^>]+>',
            r'using\s+namespace\s+std',
            r'int\s+main\s*\(',
            r'cout\s*<<',
            r'cin\s*>>',
            r'std::',
            r'nullptr',
            r'vector<',
            r'->',
        ],
        'Python': [
            r'def\s+\w+\s*\(',
            r'import\s+\w+',
            r'from\s+\w+\s+import',
            r'print\s*\(',
            r'if\s+__name__\s*==',
            r'class\s+\w+:',
            r'self\.',
            r'lambda\s+\w+:',
        ],
        'JavaScript': [
            r'function\s+\w+\s*\(',
            r'const\s+\w+\s*=',
            r'let\s+\w+\s*=',
            r'console\.log\s*\(',
            r'=>',
            r'async\s+function',
            r'require\s*\(',
            r'export\s+(default|const)',
        ],
        'Java': [
            r'public\s+class',
            r'public\s+static\s+void\s+main',
            r'System\.out\.println',
            r'private\s+\w+\s+\w+',
            r'@Override',
        ],
        'SQL': [
            r'SELECT\s+.+\s+FROM',
            r'INSERT\s+INTO',
            r'UPDATE\s+\w+\s+SET',
            r'CREATE\s+TABLE',
            r'WHERE\s+\w+\s*=',
        ],
    }
    
    # Common programming keywords
    PROGRAMMING_KEYWORDS = [
        'function', 'return', 'if', 'else', 'for', 'while', 'class',
        'int', 'string', 'bool', 'float', 'void', 'public', 'private',
        'import', 'export', 'const', 'let', 'var', 'array', 'list',
        'true', 'false', 'null', 'undefined', 'None', 'print', 'cout',
    ]
    
    # Generic code indicators
    CODE_INDICATORS = [
        r'\{[\s\S]*\}',  # Curly braces with content
        r'\(\s*\w+\s*,\s*\w+\s*\)',  # Function parameters
        r';\s*$',  # Semicolon at end
        r'==|!=|>=|<=',  # Comparison operators
        r'\+=|-=|\*=|/=',  # Assignment operators
    ]
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        
    def analyze(self) -> Slide7Data:
        """
        Detect and analyze code snippets in chat.
        
        Returns:
            Slide7Data with code statistics, top coders, detected languages
        """
        code_messages = []
        coder_languages: Dict[str, List[str]] = {}
        keyword_counts = Counter()
        
        for _, row in self.df.iterrows():
            message = str(row['message'])
            sender = row['sender']
            
            # Check if message contains code
            is_code, languages, keywords = self._detect_code(message)
            
            if is_code:
                code_messages.append({
                    'sender': sender,
                    'message': message,
                    'languages': languages
                })
                
                if sender not in coder_languages:
                    coder_languages[sender] = []
                coder_languages[sender].extend(languages)
                keyword_counts.update(keywords)
        
        # Total code snippets
        total_code_snippets = len(code_messages)
        
        # Build coder stats
        coders = []
        for sender, languages in coder_languages.items():
            snippet_count = sum(1 for m in code_messages if m['sender'] == sender)
            unique_languages = list(set(languages)) if languages else ['Unknown']
            coders.append(CoderStats(
                name=sender,
                code_snippets=snippet_count,
                languages=unique_languages
            ))
        
        # Sort by code snippets
        coders.sort(key=lambda x: x.code_snippets, reverse=True)
        
        # Determine dominant language
        all_languages = []
        for coder in coders:
            all_languages.extend(coder.languages)
        
        language_counts = Counter(all_languages)
        dominant_language = language_counts.most_common(1)[0][0] if language_counts else "None detected"
        
        # Top coder
        top_coder = coders[0].name if coders else None
        
        # Common keywords
        common_keywords = [kw for kw, _ in keyword_counts.most_common(10)]
        
        # Geek energy score (0-100)
        geek_energy_score = self._calculate_geek_energy(total_code_snippets, len(self.df))
        
        return Slide7Data(
            total_code_snippets=total_code_snippets,
            coders=coders[:10],  # Top 10 coders
            dominant_language=dominant_language,
            common_keywords=common_keywords,
            geek_energy_score=round(geek_energy_score, 1),
            top_coder=top_coder
        )
    
    def _detect_code(self, message: str) -> Tuple[bool, List[str], List[str]]:
        """
        Detect if a message contains code.
        
        Returns:
            (is_code, detected_languages, found_keywords)
        """
        detected_languages = []
        found_keywords = []
        code_score = 0
        
        # Check language-specific patterns
        for lang, patterns in self.LANGUAGE_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, message, re.IGNORECASE):
                    detected_languages.append(lang)
                    code_score += 2
                    break
        
        # Check generic code indicators
        for pattern in self.CODE_INDICATORS:
            if re.search(pattern, message):
                code_score += 1
        
        # Check programming keywords
        message_lower = message.lower()
        for keyword in self.PROGRAMMING_KEYWORDS:
            if re.search(rf'\b{keyword}\b', message_lower):
                found_keywords.append(keyword)
                code_score += 0.5
        
        # Consider it code if score >= 3
        is_code = code_score >= 3
        
        # Remove duplicates
        detected_languages = list(set(detected_languages))
        
        return is_code, detected_languages, found_keywords
    
    def _calculate_geek_energy(self, code_snippets: int, total_messages: int) -> float:
        """Calculate geek energy score based on code prevalence."""
        if total_messages == 0:
            return 0.0
        
        code_ratio = code_snippets / total_messages
        
        # Scale: 1% code = ~50 geek energy, 5% = ~90
        geek_energy = min(code_ratio * 1000, 100)
        
        return geek_energy
