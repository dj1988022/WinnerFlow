
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  label: string;
  icon: string;
  config: Record<string, any>;
  status: 'idle' | 'running' | 'completed' | 'failed';
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  isActive: boolean;
  lastRun?: string;
  stats: {
    runs: number;
    successRate: number;
  };
}

export const initialWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Competitor Price Watch',
    description: 'Monitor competitor prices and auto-adjust ads.',
    isActive: true,
    lastRun: '10 mins ago',
    stats: { runs: 142, successRate: 98 },
    nodes: [
      {
        id: 'n1',
        type: 'trigger',
        label: 'Competitor Price Change',
        icon: 'DollarSign',
        config: { platform: 'Amazon', threshold: -5 },
        status: 'idle'
      },
      {
        id: 'n2',
        type: 'condition',
        label: 'Drop > 10%?',
        icon: 'GitBranch',
        config: {},
        status: 'idle'
      },
      {
        id: 'n3',
        type: 'action',
        label: 'Update Ad Spend',
        icon: 'TrendingUp',
        config: { action: 'increase_bid', amount: 10 },
        status: 'idle'
      },
      {
        id: 'n4',
        type: 'action',
        label: 'Notify Team',
        icon: 'Bell',
        config: { channel: 'Slack' },
        status: 'idle'
      }
    ]
  },
  {
    id: 'wf-2',
    name: 'Viral Comment Interceptor',
    description: 'Auto-reply to high intent comments on viral posts.',
    isActive: true,
    lastRun: '2 mins ago',
    stats: { runs: 856, successRate: 94 },
    nodes: [
      {
        id: 'n1',
        type: 'trigger',
        label: 'New Viral Post Detected',
        icon: 'Flame',
        config: { platform: 'TikTok', minViews: 100000 },
        status: 'completed'
      },
      {
        id: 'n2',
        type: 'action',
        label: 'Scan Comments',
        icon: 'Search',
        config: { keywords: ['buy', 'link', 'price'] },
        status: 'completed'
      },
      {
        id: 'n3',
        type: 'action',
        label: 'AI Generate Reply',
        icon: 'MessageSquare',
        config: { tone: 'helpful' },
        status: 'running'
      },
      {
        id: 'n4',
        type: 'delay',
        label: 'Wait 2-5 mins',
        icon: 'Clock',
        config: { min: 2, max: 5 },
        status: 'idle'
      },
      {
        id: 'n5',
        type: 'action',
        label: 'Post Reply',
        icon: 'Send',
        config: {},
        status: 'idle'
      }
    ]
  }
];
