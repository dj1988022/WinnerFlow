
export type Sentiment = 'Positive' | 'Negative' | 'Neutral';
export type IntentType = 'Purchase' | 'Inquiry' | 'Complaint' | 'Spam' | 'Endorsement';

export interface CommentData {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes: number;
  sentiment: Sentiment;
  intent: IntentType;
  replyStatus: 'Pending' | 'Replied' | 'Ignored';
  suggestedReply?: string;
}

export interface AdAnalysis {
  id: string;
  platform: 'TikTok' | 'Meta' | 'YouTube';
  thumbnailUrl: string;
  hookType: string;
  hookScore: number; // 0-100
  painPoints: string[];
  sellingPoints: string[];
  cta: string;
  scriptStructure: {
    timestamp: string;
    segment: string;
    description: string;
  }[];
  remixDifficulty: 'Easy' | 'Medium' | 'Hard';
  viralScore: number; // 0-100
}

export interface TrendSignal {
  id: string;
  keyword: string;
  category: string;
  volume: number;
  growthRate: number; // Percentage
  competitionLevel: 'Low' | 'Medium' | 'High';
  opportunityScore: number; // 0-100
  prediction: 'Exploding' | 'Stable' | 'Declining';
}

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  platform: 'TikTok' | 'Instagram';
  followers: number;
  engagementRate: number;
  niche: string[];
  matchScore: number; // 0-100
  contactStatus: 'New' | 'Contacted' | 'Negotiating' | 'Signed';
}
