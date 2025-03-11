'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const sampleQuestions = [
  "Lord Ram wept when his father died. Is this against the karma yoga?",
  "What is the central message of the Bhagavad Gita?",
  "How does Lord Krishna explain the concept of Dharma to Arjuna?",
  "How does the Bhagavad Gita describe the nature of the soul (Atman) and its relationship with the body?",
  "Explain karma yoga as per Bhagavad Gita?",
  "What is the significance of dharma according to Krishna?",
  "How does Krishna describe devotion (bhakti)?",
  "What is Krishna's advice on handling stress and anxiety?",
];

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/ask', { input });
      setMessages((prev) => [...prev, { role: 'bot', content: response.data.content }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', content: 'Error: Unable to fetch response.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[95vh] justify-center w-full max-w-2xl mx-auto p-4 bg-gray-900 text-white rounded-2xl shadow-lg">
      <ScrollArea className="flex-1 p-2 space-y-4 overflow-auto">
        <Image className='h-52 w-fit mx-auto mt-2' alt='Krishna.png' src={'/Krishna.png'} width={1000} height={1000} />
        <h1 className='text-center text-xl font-bold underline'>Chat with Bhagavad Gita</h1>
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`p-3 w-fit max-w-xs ${msg.role === 'user' ? 'ml-auto bg-blue-600' : 'bg-gray-800'} p-3 mt-4`}>
              <CardContent className="text-white">{msg.content}</CardContent>
            </Card>
          </motion.div>
        ))}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-gray-400 text-sm text-center mt-2"
          >
            Bot is thinking...
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <Carousel className="w-[80%] mx-auto mt-3">
        <CarouselContent className="w-fit mx-auto">
          {sampleQuestions.map((question, index) => (
            <CarouselItem key={index} className="p-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-700 w-fit mx-auto"
                onClick={() => setInput(question)}
              >
                {question}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-gray-900" />
        <CarouselNext className="text-gray-900" />
      </Carousel>
      <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-xl">
        <Input
          className="flex-1 bg-gray-700 text-white border-none focus:ring-0"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      </div>
    </div>
  );
}
