"""
Enhanced Topic Modeler
LDA-based topic modeling optimized for Hinglish group chats
"""
import pandas as pd
import regex as re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from typing import List, Dict
from collections import Counter
from ..models.schemas import Slide9Data, Topic


class TopicModeler:
    """Topic modeling using Latent Dirichlet Allocation (LDA) optimized for Hinglish."""
    
    # Comprehensive stopwords for Hinglish casual conversations
    STOPWORDS = set([
        # English common words
        'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
        'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'or',
        'and', 'but', 'if', 'because', 'as', 'until', 'while', 'so',
        'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you',
        'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his',
        'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself',
        'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
        'who', 'whom', 'this', 'that', 'these', 'those', 'am', 
        'having', 'doing', 'about', 'against', 'between', 'into', 'through',
        'during', 'before', 'after', 'above', 'below', 'up', 'down',
        'out', 'off', 'over', 'under', 'again', 'further',
        'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how',
        'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
        'no', 'nor', 'not', 'only', 'own', 'same', 'than', 'too',
        'very', 's', 't', 'just', 'don', 'now', 'get', 'got', 'also',
        # Hindi/Hinglish common words
        'hai', 'hain', 'ho', 'hoga', 'hogi', 'hoge', 'tha', 'thi', 'the', 'thhe',
        'kar', 'karo', 'kara', 'kari', 'kare', 'karke', 'kiya', 'kiye', 'kiye',
        'ke', 'ki', 'ka', 'ko', 'se', 'me', 'mein', 'mai', 'pe', 'par', 'bhi',
        'toh', 'to', 'ye', 'yeh', 'wo', 'woh', 'kya', 'kab', 'kaise', 'kese',
        'kaun', 'kahan', 'kaha', 'kyun', 'kyu', 'aur', 'ya', 'na', 'nhi', 'nahi', 
        'mat', 'bas', 'ab', 'abhi', 'agar', 'lekin', 'fir', 'phir', 'sirf', 'hi',
        'isse', 'usse', 'jab', 'tab', 'sab', 'sabhi', 'koi', 'kuch', 'kyaa',
        'tha', 'thi', 'gaya', 'gayi', 'gaye', 'jaa', 'jaana', 'aaya', 'aayi',
        'raha', 'rahi', 'rahe', 'rahega', 'rahegi', 'hoon', 'hun', 'hu',
        'diya', 'diye', 'de', 'dena', 'le', 'lena', 'liya', 'liye', 'lete',
        'hua', 'hui', 'hue', 'hota', 'hoti', 'hote', 'deta', 'deti', 'dete',
        # Casual chat fillers
        'ok', 'okay', 'yes', 'no', 'yeah', 'yea', 'nope', 'yaar', 'yaar',
        'hmm', 'hmmm', 'haha', 'lol', 'lmao', 'rofl', 'lmfao',
        'hehe', 'hehehe', 'omg', 'wtf', 'btw', 'idk', 'tbh', 'imo',
        'gonna', 'wanna', 'gotta', 'dunno',
        'bhai', 'bro', 'dude', 'guys', 'log', 'sab',
        're', 'are', 'arre', 'arrey', 'oho', 'acha', 'achha', 'thik', 'theek',
        'sahi', 'shi', 'bilkul', 'haan', 'han', 'na', 'ni', 'naa',
        # Explicit/casual abuse (common in friendly chats)
        'bc', 'bhai', 'bhaiya', 'bro', 'bhai', 'sir', 'guys',
        # Media indicators
        'media', 'omitted', 'image', 'video', 'sticker', 'gif', 'audio',
        'deleted', 'message', 'edited',
        # Time/date words
        'today', 'tomorrow', 'yesterday', 'kal', 'aaj', 'parso',
        # Group chat meta words
        'grp', 'group', 'chat', 'whatsapp', 'msg', 'message',
        # Common verbs in casual context
        'said', 'says', 'told', 'tell', 'bola', 'boli', 'bole', 'batao', 'bata',
        'dekh', 'dekho', 'dekha', 'dekhi', 'dekhe', 'dekhna', 'sun', 'suno', 'suna',
    ])
    
    # Enhanced topic detection patterns with Hinglish context
    TOPIC_PATTERNS = {
        'Birthday & Celebrations': {
            'keywords': ['birthday', 'party', 'celebration', 'wish', 'wishes', 'happy', 
                        'celebrate', 'congrats', 'thanks', 'diwali', 'festival'],
            'weight_boost': 1.3
        },
        'Meetup Plans': {
            'keywords': ['meet', 'meetup', 'milte', 'milna', 'plan', 'plans', 'chal', 
                        'chalte', 'chalo', 'aaja', 'aaoge', 'location', 'time', 'kab',
                        'jagah', 'place', 'free', 'available'],
            'weight_boost': 1.5
        },
        'College & Studies': {
            'keywords': ['college', 'clg', 'paper', 'exam', 'viva', 'gate', 'study', 
                        'padhai', 'iit', 'iiit', 'notes', 'library', 'assignment', 
                        'semester', 'endsem', 'class'],
            'weight_boost': 1.2
        },
        'Work & Projects': {
            'keywords': ['work', 'project', 'internship', 'sih', 'hackathon', 'coding',
                        'lld', 'dsa', 'devops', 'aws', 'sponsorship', 'dev', 'code'],
            'weight_boost': 1.2
        },
        'Relationships & Dating': {
            'keywords': ['girlfriend', 'boyfriend', 'bandi', 'bndi', 'crush', 'love',
                        'relationship', 'breakup', 'brkup', 'dating', 'ladki', 'ladka'],
            'weight_boost': 1.4
        },
        'Mental Health & Life': {
            'keywords': ['depression', 'depressed', 'stress', 'stressed', 'tension',
                        'thak', 'tired', 'sad', 'feelings', 'life'],
            'weight_boost': 1.3
        },
        'Travel & Places': {
            'keywords': ['travel', 'trip', 'indore', 'nagpur', 'delhi', 'russia',
                        'germany', 'foreign', 'visit', 'gaya', 'jaana', 'aaya'],
            'weight_boost': 1.2
        },
        'Food & Hangout': {
            'keywords': ['food', 'eat', 'khana', 'cafe', 'restaurant', 'momos',
                        'hungry', 'dinner', 'lunch'],
            'weight_boost': 1.1
        },
        'Fitness & Gym': {
            'keywords': ['gym', 'workout', 'fit', 'body', 'physique', 'exercise',
                        'muscle', 'fitness'],
            'weight_boost': 1.1
        },
        'Entertainment': {
            'keywords': ['movie', 'game', 'anime', 'show', 'watch', 'pubg', 'gaming',
                        'play', 'demon', 'slayer'],
            'weight_boost': 1.0
        }
    }
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        
    def analyze(self, n_topics: int = 4) -> Slide9Data:
        """
        Perform enhanced topic modeling on Hinglish chat messages.
        
        Args:
            n_topics: Number of topics to extract (default 4 for chat context)
            
        Returns:
            Slide9Data with discovered topics and keywords
        """
        # Filter text messages and remove very short ones
        text_df = self.df[self.df['message_type'] == 'text'].copy()
        
        if len(text_df) < 20:
            return self._fallback_response()
        
        # Preprocess messages
        text_df['processed'] = text_df['message'].apply(self._preprocess)
        
        # Filter out empty/too short messages
        text_df = text_df[text_df['processed'].str.len() >= 10]
        documents = text_df['processed'].tolist()
        
        if len(documents) < 10:
            return self._fallback_response()
        
        try:
            # Pattern-based topic detection (more reliable for casual chats)
            pattern_topics = self._detect_pattern_topics(text_df['message'].tolist())
            
            # LDA-based topic modeling for additional discovery
            lda_topics = self._lda_topic_modeling(documents, n_topics)
            
            # Merge and rank topics
            all_topics = self._merge_topics(pattern_topics, lda_topics)
            
            # Ensure we have meaningful topics
            if not all_topics:
                return self._fallback_response()
            
            # Return top topics
            final_topics = all_topics[:min(5, len(all_topics))]
            
        except Exception as e:
            print(f"Topic modeling error: {e}")
            return self._fallback_response()
        
        methodology = (
            "Topics discovered using hybrid approach: pattern matching for common "
            "conversation themes and LDA for unexpected topics in your Hinglish chats."
        )
        
        return Slide9Data(
            topics=final_topics,
            methodology=methodology
        )
    
    def _preprocess(self, text: str) -> str:
        """Enhanced preprocessing for Hinglish text."""
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'https?://\S+|www\.\S+', '', text)
        
        # Remove @mentions
        text = re.sub(r'@\S+', '', text)
        
        # Remove phone numbers
        text = re.sub(r'\d{10,}', '', text)
        
        # Remove excessive emojis but keep text
        text = re.sub(r'[😀-🙏🌀-🗿🚀-🛿✂-➰Ⓜ-🉑]+', '', text)
        
        # Keep alphanumeric and spaces
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        
        # Remove numbers standalone
        text = re.sub(r'\b\d+\b', '', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Remove stopwords
        words = [w for w in text.split() if w not in self.STOPWORDS and len(w) > 2]
        
        return ' '.join(words)
    
    def _detect_pattern_topics(self, messages: List[str]) -> List[Topic]:
        """Detect topics using pattern matching - more reliable for casual chats."""
        topic_scores = {name: 0 for name in self.TOPIC_PATTERNS.keys()}
        topic_keywords = {name: Counter() for name in self.TOPIC_PATTERNS.keys()}
        
        for msg in messages:
            msg_lower = msg.lower()
            for topic_name, config in self.TOPIC_PATTERNS.items():
                for keyword in config['keywords']:
                    if keyword in msg_lower:
                        topic_scores[topic_name] += config['weight_boost']
                        topic_keywords[topic_name][keyword] += 1
        
        # Filter and create topics
        topics = []
        total_score = sum(topic_scores.values())
        
        if total_score == 0:
            return []
        
        topic_id = 1
        for topic_name, score in sorted(topic_scores.items(), key=lambda x: x[1], reverse=True):
            if score > 0:
                weight = (score / total_score) * 100
                # Get top keywords for this topic
                top_keywords = [kw for kw, _ in topic_keywords[topic_name].most_common(5)]
                
                if top_keywords:  # Only add if we have keywords
                    topics.append(Topic(
                        topic_id=topic_id,
                        label=topic_name,
                        keywords=top_keywords,
                        weight=round(weight, 1)
                    ))
                    topic_id += 1
        
        return topics
    
    def _lda_topic_modeling(self, documents: List[str], n_topics: int) -> List[Topic]:
        """Traditional LDA topic modeling as backup."""
        try:
            # TF-IDF with adjusted parameters for short casual texts
            vectorizer = TfidfVectorizer(
                max_features=200,
                min_df=max(2, len(documents) // 50),
                max_df=0.7,
                ngram_range=(1, 2),  # Include bigrams
                stop_words=list(self.STOPWORDS)
            )
            
            tfidf_matrix = vectorizer.fit_transform(documents)
            
            # LDA with adjusted parameters
            n_components = min(n_topics, max(2, len(documents) // 20))
            lda = LatentDirichletAllocation(
                n_components=n_components,
                random_state=42,
                max_iter=30,
                learning_method='online',
                learning_offset=50.0
            )
            lda.fit(tfidf_matrix)
            
            # Extract topics
            feature_names = vectorizer.get_feature_names_out()
            return self._extract_lda_topics(lda, feature_names)
            
        except Exception as e:
            print(f"LDA error: {e}")
            return []
    
    def _extract_lda_topics(
        self, 
        lda: LatentDirichletAllocation, 
        feature_names: List[str]
    ) -> List[Topic]:
        """Extract topics from LDA model."""
        topics = []
        topic_weights = lda.components_.sum(axis=1)
        total_weight = topic_weights.sum()
        
        for topic_idx, topic in enumerate(lda.components_):
            top_indices = topic.argsort()[:-8:-1]  # Top 7 keywords
            keywords = [feature_names[i] for i in top_indices]
            
            # Filter out poor quality keywords
            keywords = [kw for kw in keywords if len(kw) > 2][:5]
            
            if not keywords:
                continue
            
            label = self._generate_smart_label(keywords)
            weight = (topic_weights[topic_idx] / total_weight * 100) if total_weight > 0 else 0
            
            topics.append(Topic(
                topic_id=topic_idx + 100,  # Different ID range to avoid conflicts
                label=label,
                keywords=keywords,
                weight=round(weight, 1)
            ))
        
        return topics
    
    def _merge_topics(self, pattern_topics: List[Topic], lda_topics: List[Topic]) -> List[Topic]:
        """Merge pattern-based and LDA topics intelligently."""
        # Pattern topics take priority
        all_topics = pattern_topics.copy()
        
        # Add unique LDA topics with significant weight
        for lda_topic in lda_topics:
            if lda_topic.weight > 5:  # Only significant topics
                # Check if similar to existing
                is_duplicate = False
                for pt in pattern_topics:
                    common_kw = set(lda_topic.keywords) & set(pt.keywords)
                    if len(common_kw) >= 2:
                        is_duplicate = True
                        break
                
                if not is_duplicate:
                    all_topics.append(lda_topic)
        
        # Sort by weight
        all_topics.sort(key=lambda x: x.weight, reverse=True)
        
        # Reassign IDs
        for idx, topic in enumerate(all_topics, 1):
            topic.topic_id = idx
        
        return all_topics
    
    def _generate_smart_label(self, keywords: List[str]) -> str:
        """Generate smart labels for discovered topics."""
        if not keywords:
            return "General Chat"
        
        # Check against known patterns
        for topic_name, config in self.TOPIC_PATTERNS.items():
            overlap = set(keywords) & set(config['keywords'])
            if len(overlap) >= 2:
                return topic_name
        
        # Generate from top keyword
        top_word = keywords[0].title()
        return f"{top_word} Discussion"
    
    def _fallback_response(self) -> Slide9Data:
        """Fallback when topic modeling fails."""
        return Slide9Data(
            topics=[Topic(
                topic_id=1,
                label="Friendship & Banter",
                keywords=["friends", "chat", "hangout", "fun"],
                weight=100.0
            )],
            methodology="Your chats are full of casual friendly banter!"
        )