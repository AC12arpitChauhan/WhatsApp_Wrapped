/**
 * API client for WhatsApp Wrapped backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface UploadResponse {
  success: boolean;
  message: string;
  session_id: string;
  data: WrappedData | null;
}

export interface WrappedData {
  slide1: Slide1Data;
  slide2: Slide2Data;
  slide3: Slide3Data;
  slide4: Slide4Data;
  slide5: Slide5Data;
  slide6: Slide6Data;
  slide7: Slide7Data;
  slide8: Slide8Data;
  slide9: Slide9Data;
  slide10: Slide10Data;
}

// Slide 1: Your WhatsApp Year
export interface Slide1Data {
  total_messages: number;
  total_words: number;
  active_days: number;
  media_shared: number;
  date_range: { start: string; end: string };
  participants_count: number;
}

// Slide 2: When You Were Most Alive
export interface HourlyActivity {
  hour: number;
  count: number;
}

export interface Slide2Data {
  most_active_hour: number;
  most_active_hour_label: string;
  most_active_day: string;
  messages_by_hour: Record<string, number>;
  messages_by_day: Record<string, number>;
  activity_by_hour: HourlyActivity[];
  chronotype: string;
  chronotype_emoji: string;
}

// Slide 3: Chat Personality
export interface PersonalityProfile {
  name: string;
  personality_type: string;
  personality_emoji: string;
  traits: string[];
  score: number;
}

export interface Slide3Data {
  personalities: PersonalityProfile[];
  group_personality: string;
  methodology: string;
}

// Slide 4: Who Carried the Group
export interface ContributorStats {
  name: string;
  messages: number;
  percentage: number;
  words: number;
  avg_message_length: number;
}

export interface Slide4Data {
  contributors: ContributorStats[];
  top_contributor: string;
  silent_members: string[];
  participation_ratio: number;
}

// Slide 5: Emoji & Sticker Wrapped
export interface EmojiStat {
  emoji: string;
  count: number;
  percentage: number;
}

export interface Slide5Data {
  top_emojis: EmojiStat[];
  total_emojis: number;
  sticker_count: number;
  emoji_per_message: number;
  mood_breakdown: Record<string, number>;
  top_emoji_users: Record<string, string>;
}

// Slide 6: Media & Chaos Index
export interface Slide6Data {
  image_count: number;
  video_count: number;
  sticker_count: number;
  gif_count: number;
  document_count: number;
  total_media: number;
  media_to_text_ratio: number;
  peak_chaos_day: string;
  peak_chaos_messages: number;
  chaos_index: number;
  top_media_sharer: string | null;
}

// Slide 7: Code & Geek Energy
export interface CoderStats {
  name: string;
  code_snippets: number;
  languages: string[];
}

export interface Slide7Data {
  total_code_snippets: number;
  coders: CoderStats[];
  dominant_language: string;
  common_keywords: string[];
  geek_energy_score: number;
  top_coder: string | null;
}

// Slide 8: Emotional Timeline
export interface MonthlySentiment {
  month: string;
  score: number;
  label: string;
  message_count: number;
}

export interface Slide8Data {
  monthly_sentiment: MonthlySentiment[];
  happiest_month: string;
  most_intense_month: string;
  average_sentiment: number;
  disclaimer: string;
}

// Slide 9: What You Talked About
export interface Topic {
  topic_id: number;
  label: string;
  keywords: string[];
  weight: number;
}

export interface Slide9Data {
  topics: Topic[];
  methodology: string;
}

// Slide 10: Final Summary
export interface Slide10Data {
  summary_text: string;
  total_messages: number;
  personality_type: string;
  peak_time: string;
  group_role: string;
  top_emoji: string;
  chat_name: string;
  year: number;
  shareable_stats: string[];
}

/**
 * Upload a WhatsApp chat file for analysis
 */
export async function uploadChat(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Upload failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
