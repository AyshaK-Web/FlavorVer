'use server';
/**
 * @fileoverview A chatbot flow for recipe assistance.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {
  type ChatbotInput,
  ChatbotInputSchema,
  type ChatbotOutput,
  ChatbotOutputSchema,
} from '@/ai/flows/chatbot-schemas';

export async function chatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const {history, message} = input;

    const systemPrompt = `You are a helpful and friendly recipe assistant chatbot named FlavorBot.
Your goal is to provide users with recipe suggestions, cooking tips, and ingredient substitution ideas.
Keep your responses concise and easy to understand.
You can also ask clarifying questions to better understand the user's needs.`;

    const model = googleAI.model('gemini-2.5-flash');

    const response = await ai.generate({
      model,
      system: systemPrompt,
      prompt: [
        ...history,
        {
          role: 'user',
          content: [{text: message}],
        },
      ],
    });

    return response.text;
  }
);
