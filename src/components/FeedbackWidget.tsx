import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { formatDistanceToNow } from 'date-fns';

interface Feedback {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  reply?: string;
}

// Mock initial feedback data
const initialFeedback: Feedback[] = [
  {
    id: '1',
    userId: 'user2',
    userName: 'Alex Chen',
    content: "The Ad Decoder is amazing but I need to export the scripts to PDF for my team.",
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    reply: "Great idea, Alex! We've added this to our roadmap for next week."
  },
  {
    id: '2',
    userId: 'user3',
    userName: 'Sarah Jones',
    content: "Can you add support for Instagram Reels analysis too?",
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
  }
];

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(initialFeedback);
  const [newFeedback, setNewFeedback] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  const { user } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedback.trim() || !user) return;

    const feedback: Feedback = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      content: newFeedback,
      timestamp: Date.now()
    };

    setFeedbackList([feedback, ...feedbackList]);
    setNewFeedback('');
  };

  const handleReply = (feedbackId: string) => {
    if (!replyText.trim()) return;
    
    setFeedbackList(feedbackList.map(item => 
      item.id === feedbackId 
        ? { ...item, reply: replyText }
        : item
    ));
    setReplyText('');
    setReplyingTo(null);
  };

  return (
    <>
      {/* Announcement Banner */}
      <div className="bg-gradient-to-r from-emerald-900/40 to-zinc-900 border-b border-emerald-500/20 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-emerald-100/90">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">Beta Feedback:</span>
            <span className="hidden sm:inline text-emerald-200/70">We are actively improving based on your criticism. Tell us what we're doing wrong.</span>
            <span className="sm:hidden text-emerald-200/70">Tell us what we're doing wrong.</span>
          </div>
          <button 
            onClick={() => setIsOpen(true)}
            className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-3 h-3" />
            Public Feedback Board
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#09090b] border border-zinc-800 w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  Community Feedback
                </h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Input Area */}
                {user ? (
                  <form onSubmit={handleSubmit} className="mb-6">
                    <textarea
                      value={newFeedback}
                      onChange={(e) => setNewFeedback(e.target.value)}
                      placeholder="What should we improve? Everyone can see this."
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none h-24"
                    />
                    <div className="flex justify-end mt-2">
                      <button 
                        type="submit"
                        disabled={!newFeedback.trim()}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                      >
                        <Send className="w-3 h-3" />
                        Post Feedback
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 text-center mb-6">
                    <p className="text-zinc-400 text-sm">Please login to leave feedback.</p>
                  </div>
                )}

                {/* Feedback List */}
                <div className="space-y-4">
                  {feedbackList.map((item) => (
                    <div key={item.id} className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 font-medium">
                            {item.userName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-zinc-300">{item.userName}</span>
                          <span className="text-xs text-zinc-600">{formatDistanceToNow(item.timestamp)} ago</span>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-400 pl-8 mb-3">{item.content}</p>
                      
                      {/* Admin Reply */}
                      {item.reply && (
                        <div className="ml-8 bg-emerald-900/10 border border-emerald-500/10 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-500">Official Response</span>
                          </div>
                          <p className="text-xs text-emerald-100/80">{item.reply}</p>
                        </div>
                      )}

                      {/* Reply Input (Admin Only) */}
                      {user?.role === 'admin' && !item.reply && (
                        <div className="ml-8 mt-2">
                          {replyingTo === item.id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                              />
                              <button
                                onClick={() => handleReply(item.id)}
                                className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-500"
                              >
                                Reply
                              </button>
                              <button
                                onClick={() => setReplyingTo(null)}
                                className="text-xs text-zinc-500 hover:text-zinc-300 px-2"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setReplyingTo(item.id)}
                              className="text-xs text-zinc-600 hover:text-emerald-500 transition-colors"
                            >
                              Reply as Admin
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
