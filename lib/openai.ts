import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AITimePreference {
  preference: string;
  availableSlots: string[];
  currentTime?: string;
  date?: string;
}

export const generateTimeRecommendation = async ({
  preference,
  availableSlots,
  currentTime,
  date
}: AITimePreference): Promise<{ time: string; reason: string }> => {
  try {
    const prompt = `You are an AI assistant for a booking system. A customer wants to book an appointment and needs help choosing the best time slot.

Customer preference: ${preference}
Available time slots: ${availableSlots.join(', ')}
Current time: ${currentTime || 'Not specified'}
Booking date: ${date || 'Today'}

Based on the customer's preference, recommend ONE specific time slot from the available options and provide a brief, friendly reason (max 50 characters) why this time is perfect for them.

Respond in JSON format:
{
  "time": "HH:MM",
  "reason": "Brief reason why this time is perfect"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful booking assistant that provides personalized time recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    if (!response) throw new Error('No response from OpenAI');

    const recommendation = JSON.parse(response);
    
    // Validate that the recommended time is in available slots
    if (!availableSlots.includes(recommendation.time)) {
      // Fallback to first available slot
      return {
        time: availableSlots[0],
        reason: "Great choice for your schedule!"
      };
    }

    return recommendation;
  } catch (error) {
    console.error('Error generating AI recommendation:', error);
    // Fallback recommendation
    return {
      time: availableSlots[0] || '10:00',
      reason: "Perfect timing for you!"
    };
  }
};