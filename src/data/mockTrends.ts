
export interface TrendItem {
  id: string;
  productName: string;
  thumbnail: string;
  category: string;
  viralScore: number; // 0-100
  prediction: 'Exploding' | 'Rising' | 'Peaking' | 'Declining';
  confidenceLevel: 'High' | 'Medium' | 'Low';
  stats: {
    views: number;
    shares: number;
    comments: number;
    growthRate: number; // % per hour
  };
  aiAnalysis: {
    hook: string;
    emotionalTriggers: string[];
    riskFactors: string[];
    opportunity: string;
  };
  chartData: { time: string; value: number; predicted: boolean }[];
}

export const mockTrends: TrendItem[] = [
  {
    id: '1',
    productName: 'Levitating Moon Lamp',
    thumbnail: 'https://picsum.photos/seed/moon/300/300',
    category: 'Home Decor',
    viralScore: 94,
    prediction: 'Exploding',
    confidenceLevel: 'High',
    stats: {
      views: 1250000,
      shares: 45000,
      comments: 8200,
      growthRate: 15.4
    },
    aiAnalysis: {
      hook: "Visual Shock: Anti-gravity effect stops the scroll immediately.",
      emotionalTriggers: ["Awe", "Curiosity", "Relaxation"],
      riskFactors: ["Fragile shipping", "High return rate on cheap knockoffs"],
      opportunity: "Bundle with 'Galaxy Projector' for higher AOV."
    },
    chartData: [
      { time: '0h', value: 1000, predicted: false },
      { time: '4h', value: 5000, predicted: false },
      { time: '8h', value: 15000, predicted: false },
      { time: '12h', value: 45000, predicted: false },
      { time: '16h', value: 120000, predicted: false },
      { time: '20h', value: 250000, predicted: true },
      { time: '24h', value: 500000, predicted: true },
    ]
  },
  {
    id: '2',
    productName: 'Portable Neck Fan',
    thumbnail: 'https://picsum.photos/seed/fan/300/300',
    category: 'Gadgets',
    viralScore: 88,
    prediction: 'Rising',
    confidenceLevel: 'Medium',
    stats: {
      views: 850000,
      shares: 12000,
      comments: 3400,
      growthRate: 8.2
    },
    aiAnalysis: {
      hook: "Problem/Solution: 'Sweating in public?' -> 'Instant cool'.",
      emotionalTriggers: ["Comfort", "Social Anxiety Relief"],
      riskFactors: ["Seasonal product (Summer only)", "Battery safety regulations"],
      opportunity: "Target outdoor workers and commuters."
    },
    chartData: [
      { time: '0h', value: 2000, predicted: false },
      { time: '4h', value: 8000, predicted: false },
      { time: '8h', value: 22000, predicted: false },
      { time: '12h', value: 50000, predicted: false },
      { time: '16h', value: 90000, predicted: true },
      { time: '20h', value: 140000, predicted: true },
      { time: '24h', value: 200000, predicted: true },
    ]
  },
  {
    id: '3',
    productName: 'Galaxy Slime Kit',
    thumbnail: 'https://picsum.photos/seed/slime/300/300',
    category: 'Toys',
    viralScore: 76,
    prediction: 'Peaking',
    confidenceLevel: 'Low',
    stats: {
      views: 3200000,
      shares: 15000,
      comments: 1200,
      growthRate: 2.1
    },
    aiAnalysis: {
      hook: "ASMR: Satisfying sounds and visuals.",
      emotionalTriggers: ["Satisfaction", "Stress Relief"],
      riskFactors: ["Market saturation", "Low perceived value"],
      opportunity: "Pivot to 'DIY Kit' angle for educational value."
    },
    chartData: [
      { time: '0h', value: 50000, predicted: false },
      { time: '4h', value: 150000, predicted: false },
      { time: '8h', value: 400000, predicted: false },
      { time: '12h', value: 800000, predicted: false },
      { time: '16h', value: 950000, predicted: false },
      { time: '20h', value: 1000000, predicted: true },
      { time: '24h', value: 1020000, predicted: true },
    ]
  }
];
