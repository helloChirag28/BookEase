'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Clock, 
  TrendingUp, 
  Users, 
  Calendar,
  Sparkles,
  Send,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedAIAssistantProps {
  availableSlots: Array<{ time: string; popular?: boolean }>;
  onSuggestion: (suggestion: { time: string; reason: string }) => void;
  selectedDate?: Date;
}

const quickPreferences = [
  { id: 'morning', label: 'Morning Person', icon: '🌅', description: 'I prefer early hours' },
  { id: 'afternoon', label: 'Afternoon', icon: '☀️', description: 'Midday works best' },
  { id: 'evening', label: 'Evening', icon: '🌆', description: 'After work hours' },
  { id: 'popular', label: 'Popular Times', icon: '⭐', description: 'Book when others do' },
  { id: 'quiet', label: 'Less Crowded', icon: '🤫', description: 'Prefer quieter times' },
  { id: 'asap', label: 'ASAP', icon: '⚡', description: 'First available slot' }
];

export function EnhancedAIAssistant({ availableSlots, onSuggestion, selectedDate }: EnhancedAIAssistantProps) {
  const [mode, setMode] = useState<'quick' | 'chat'>('quick');
  const [customPreference, setCustomPreference] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState<{ time: string; reason: string } | null>(null);

  const handleQuickPreference = async (preferenceId: string) => {
    setLoading(true);
    
    const preferenceMap = {
      morning: 'I prefer morning appointments to start my day fresh',
      afternoon: 'I like afternoon appointments for a midday break',
      evening: 'I prefer evening appointments after work',
      popular: 'I want to book during popular times when others typically book',
      quiet: 'I prefer less crowded, quieter appointment times',
      asap: 'I need the earliest available appointment'
    };

    try {
      const response = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preference: preferenceMap[preferenceId as keyof typeof preferenceMap],
          availableSlots: availableSlots.map(slot => slot.time),
          currentTime: new Date().toLocaleTimeString(),
          date: selectedDate?.toDateString()
        })
      });

      if (!response.ok) throw new Error('Failed to get AI suggestion');

      const result = await response.json();
      setSuggestion(result);
      setShowSuggestion(true);
    } catch (error) {
      console.error('AI suggestion error:', error);
      toast.error('Failed to get AI suggestion. Please try again.');
      
      // Fallback to local suggestion
      const fallbackSuggestion = generateFallbackSuggestion(preferenceId);
      setSuggestion(fallbackSuggestion);
      setShowSuggestion(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomPreference = async () => {
    if (!customPreference.trim()) return;

    setLoading(true);
    
    try {
      const response = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preference: customPreference,
          availableSlots: availableSlots.map(slot => slot.time),
          currentTime: new Date().toLocaleTimeString(),
          date: selectedDate?.toDateString()
        })
      });

      if (!response.ok) throw new Error('Failed to get AI suggestion');

      const result = await response.json();
      setSuggestion(result);
      setShowSuggestion(true);
    } catch (error) {
      console.error('AI suggestion error:', error);
      toast.error('Failed to get AI suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackSuggestion = (preferenceId: string): { time: string; reason: string } => {
    const slots = availableSlots.map(slot => slot.time);
    
    switch (preferenceId) {
      case 'morning':
        const morningSlots = slots.filter(time => parseInt(time) < 12);
        return {
          time: morningSlots[0] || slots[0],
          reason: 'Perfect for starting your day fresh!'
        };
      case 'afternoon':
        const afternoonSlots = slots.filter(time => {
          const hour = parseInt(time);
          return hour >= 12 && hour < 17;
        });
        return {
          time: afternoonSlots[0] || slots[0],
          reason: 'Great timing for a midday refresh!'
        };
      case 'evening':
        const eveningSlots = slots.filter(time => parseInt(time) >= 17);
        return {
          time: eveningSlots[0] || slots[slots.length - 1],
          reason: 'Unwind after a busy day!'
        };
      case 'popular':
        const popularSlots = availableSlots.filter(slot => slot.popular);
        return {
          time: popularSlots[0]?.time || slots[Math.floor(slots.length / 2)],
          reason: 'Our most popular time slot!'
        };
      case 'quiet':
        const quietSlots = availableSlots.filter(slot => !slot.popular);
        return {
          time: quietSlots[0]?.time || slots[0],
          reason: 'Enjoy a more peaceful experience!'
        };
      default:
        return {
          time: slots[0],
          reason: 'The earliest available slot!'
        };
    }
  };

  const handleAcceptSuggestion = () => {
    if (suggestion) {
      onSuggestion(suggestion);
      toast.success('Perfect choice! Time slot selected.');
    }
  };

  const resetAssistant = () => {
    setShowSuggestion(false);
    setSuggestion(null);
    setCustomPreference('');
    setMode('quick');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
          <p className="text-sm text-slate-600">AI is analyzing the best times for you...</p>
        </div>
      </div>
    );
  }

  if (showSuggestion && suggestion) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">AI Recommendation</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-5 h-5 text-slate-600" />
                <span className="text-2xl font-bold text-slate-900">
                  {suggestion.time}
                </span>
              </div>
              
              <p className="text-sm text-slate-600 font-medium">{suggestion.reason}</p>
              
              <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>AI Optimized</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>Available</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={resetAssistant}
            className="flex-1"
          >
            Try Different
          </Button>
          <Button
            size="sm"
            onClick={handleAcceptSuggestion}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Perfect! Book This
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2 text-center">
        <Bot className="w-6 h-6 text-purple-600" />
        <span className="text-sm text-slate-600">
          Tell me your preference and I'll find the perfect time!
        </span>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-slate-100 rounded-lg p-1">
        <button
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            mode === 'quick'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          onClick={() => setMode('quick')}
        >
          Quick Select
        </button>
        <button
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            mode === 'chat'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          onClick={() => setMode('chat')}
        >
          Describe Preference
        </button>
      </div>

      {mode === 'quick' ? (
        <div className="grid grid-cols-2 gap-3">
          {quickPreferences.map((pref) => (
            <motion.div
              key={pref.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto p-3 flex flex-col items-center space-y-2 hover:bg-purple-50 hover:border-purple-300 text-center"
                onClick={() => handleQuickPreference(pref.id)}
              >
                <span className="text-lg">{pref.icon}</span>
                <div>
                  <span className="text-xs font-medium block">{pref.label}</span>
                  <span className="text-xs text-slate-500">{pref.description}</span>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Input
              placeholder="e.g., I have a meeting at 3pm, so before that would be great..."
              value={customPreference}
              onChange={(e) => setCustomPreference(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomPreference()}
              className="flex-1"
            />
            <Button
              onClick={handleCustomPreference}
              disabled={!customPreference.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 text-center">
            Describe your ideal time preference and I'll find the perfect match!
          </p>
        </div>
      )}
    </motion.div>
  );
}