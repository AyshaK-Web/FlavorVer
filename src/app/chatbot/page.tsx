
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { chatbot } from '@/ai/flows/chatbot';
import type { ChatbotInput } from '@/ai/flows/chatbot-schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Bot, User, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { recipes } from '@/lib/recipes';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Message = {
  role: 'user' | 'model';
  content: string | React.ReactNode;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getFakeResponse = (userInput: string): React.ReactNode | null => {
    const lowerCaseInput = userInput.toLowerCase().trim();

    if (lowerCaseInput === 'hi' || lowerCaseInput === 'hello') {
      return 'Hello! How can I help you with your culinary adventures today?';
    }

    if (lowerCaseInput.includes('shrimp') && lowerCaseInput.includes('garlic') && lowerCaseInput.includes('onion')) {
        const recipe = recipes.find(r => r.slug === 'garlic-shrimp-scampi');
        const image = PlaceHolderImages.find(i => i.id === recipe?.imageId);
      
        if (!recipe || !image) return 'I found a great recipe for you, but I am having trouble loading the details.';

        return (
            <div className="space-y-2">
                <p>I found the perfect recipe for you: <strong>{recipe.title}</strong>! It's a quick and elegant pasta dish.</p>
                <div className="rounded-lg overflow-hidden border">
                    <Image src={image.imageUrl} alt={recipe.title} width={300} height={200} className="object-cover" />
                </div>
                <p>You can see the full recipe here:</p>
                <Button asChild variant="link" className="p-0 h-auto">
                    <Link href={`/recipes/${recipe.slug}`}>{recipe.title}</Link>
                </Button>
            </div>
        );
    }
    
    return "That's an interesting question! I'm still in training, but I'm learning more every day. Try asking me for a shrimp recipe with garlic and onion!";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // --- Faked AI Logic ---
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const fakeResponse = getFakeResponse(currentInput);
    
    const botMessage: Message = { role: 'model', content: fakeResponse };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
    // --- End of Faked AI Logic ---

    /* 
    // --- Real AI Logic (commented out) ---
    try {
      const chatHistory: ChatbotInput['history'] = messages.map(msg => ({
        role: msg.role,
        content: [{ text: typeof msg.content === 'string' ? msg.content : 'React Component response' }],
      }));

      const response = await chatbot({
        history: chatHistory,
        message: input,
      });

      const botMessage: Message = { role: 'model', content: response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      const errorMessage: Message = {
        role: 'model',
        content: "Sorry, I'm having a little trouble right now. Please try again later.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
    */
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 flex justify-center">
      <Card className="w-full max-w-3xl h-[70vh] flex flex-col">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline font-bold flex items-center justify-center gap-2" style={{ fontFamily: 'Alegreya, serif' }}>
            <Bot className="h-8 w-8 text-primary" />
            FlavorBot Assistant
          </CardTitle>
          <CardDescription>Your friendly AI culinary helper</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 p-4 pr-6 -m-4">
            <div className="space-y-6">
                {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'model' && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot size={20}/></AvatarFallback>
                    </Avatar>
                    )}
                    <div className={`rounded-lg p-3 max-w-[80%] ${
                        message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border'
                    }`}>
                    {typeof message.content === 'string' ? (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      message.content
                    )}
                    </div>
                    {message.role === 'user' && (
                     <Avatar className="h-8 w-8">
                        <AvatarFallback><User size={20} /></AvatarFallback>
                    </Avatar>
                    )}
                </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot size={20}/></AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg p-3 bg-card border">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                )}
            </div>
            </ScrollArea>
            <div className="mt-4 flex items-center gap-2">
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask for a recipe or cooking tip..."
                className="flex-1 h-12 text-base"
                disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon" className="h-12 w-12 flex-shrink-0">
                <Send className="h-5 w-5" />
            </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
