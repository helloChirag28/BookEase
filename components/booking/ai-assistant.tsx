'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Clock, 
  TrendingUp, 
  Users, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface AIAssistantProps {
  availableSlots: Array<{ time: string; popular?: boolean }>;
  onSuggestion: (suggestion: { time: string; reason: string }) => void;
  selectedDate?: Date;
}

const preferences = [
  { id: 'morning', label: 'Morning Person', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', icon: '☀️' },
  { id: 'evening', label: 'Evening', icon: '🌆' },
  { id: 'popular', label: 'Popular Times', icon: '⭐' },
  { id: 'quiet', label: 'Less Crowded', icon: '🤫' },
  { id: 'quick', label: 'ASAP', icon: '⚡' }
];

export function AIAssistant({ availableSlots, onSuggestion, selectedDate }: AIAssistantProps) {
  const [selectedPreference, setSelectedPreference] = useState<string>('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState<{ time: string; reason: string } | null>(null);

  const generateSuggestion = (preference: string) => {
    let suggestedSlots = [...availableSlots];
    let reason = '';

    switch (preference) {
      case 'morning':
        suggestedSlots = suggestedSlots.filter(slot => parseInt(slot.time) < 12);
        reason = 'Perfect for starting your day fresh!';
        break;
      case 'afternoon':
        suggestedSlots = suggestedSlots.filter(slot => {
          const hour = parseInt(slot.time);
          return hour >= 12 && hour < 17;
        });
        reason = 'Great timing for a midday refresh!';
        break;
      case 'evening':
        suggestedSlots = suggestedSlots.filter(slot => parseInt(slot.time) >= 17);
        reason = 'Unwind after a busy day!';
        break;
      case 'popular':
        suggestedSlots = suggestedSlots.filter(slot => slot.popular);
        reason = 'Our most popular time slot!';
        break;
      case 'quiet':
        suggestedSlots = suggestedSlots.filter(slot => !slot.popular);
        reason = 'Enjoy a more peaceful experience!';
        break;
      case 'quick':
        reason = 'The earliest available slot!';
        break;
    }

    if (suggestedSlots.length === 0) {
      suggestedSlots = availableSlots;
      reason = 'Best available option for you!';
    }

    const randomSlot = suggestedSlots[Math.floor(Math.random() * suggestedSlots.length)];
    return { time: randomSlot.time, reason };
  };

  const handlePreferenceSelect = (preferenceId: string) => {
    setSelectedPreference(preferenceId);
    const result = generateSuggestion(preferenceId);
    setSuggestion(result);
    setShowSuggestion(true);
  };

  const handleAcceptSuggestion = () => {
    if (suggestion) {
      onSuggestion(suggestion);
    }
  };

  return (
    <div className="space-y-4">
      {!showSuggestion ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 text-center">
            <Bot className="w-6 h-6 text-purple-600" />
            <span className="text-sm text-slate-600">
              What's your preference for today?
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {preferences.map((pref) => (
              <motion.div
                key={pref.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto p-3 flex flex-col items-center space-y-2 hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => handlePreferenceSelect(pref.id)}
                >
                  <span className="text-lg">{pref.icon}</span>
                  <span className="text-xs font-medium">{pref.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
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
                    {suggestion?.time}
                  </span>
                </div>
                
                <p className="text-sm text-slate-600">{suggestion?.reason}</p>
                
                <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Optimal</span>
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
              onClick={() => setShowSuggestion(false)}
              className="flex-1"
            >
              Try Again
            </Button>
            <Button
              size="sm"
              onClick={handleAcceptSuggestion}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Book This Time
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}