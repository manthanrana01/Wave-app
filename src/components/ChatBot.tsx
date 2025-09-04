import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Send, Mic, MicOff, Sparkles } from 'lucide-react';
import { CoastLocation, indiaCoastlines, findNearestCoast, generateTidePredictions, getNextTide, searchCoasts } from '@/lib/tideData';
import { format } from 'date-fns';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatBotProps {
  userLocation: { latitude: number; longitude: number } | null;
  onCoastSelect: (coast: CoastLocation) => void;
}

export default function ChatBot({ userLocation, onCoastSelect }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "🌊 Hi! I'm your enhanced tide assistant. I can help you with tide information across all Indian coastal states including Gujarat, Maharashtra, Goa, Karnataka, Kerala, Tamil Nadu, and more!",
      timestamp: new Date(),
      suggestions: [
        "What's the next high tide near me?",
        "Show tides for Gujarat coast",
        "Find coasts in Kerala",
        "Weather at Mumbai coast"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, 100);
  };

  const generateBotResponse = (userMessage: string): { content: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();
    
    // Enhanced location-based queries
    if (message.includes('near me') || message.includes('my location') || message.includes('current location')) {
      if (!userLocation) {
        return {
          content: "I need your location to help with that. Please allow location access or enter your location manually using the search bar above.",
          suggestions: ["How to enable location?", "Search Gujarat coasts", "Show all states"]
        };
      }
      
      const nearestCoast = findNearestCoast(userLocation.latitude, userLocation.longitude);
      const tides = generateTidePredictions(nearestCoast);
      const nextTide = getNextTide(tides);
      
      onCoastSelect(nearestCoast);
      
      if (nextTide) {
        return {
          content: `🎯 The nearest coast to you is **${nearestCoast.name}** in ${nearestCoast.state}.\n\n🌊 Next ${nextTide.type} tide: **${format(nextTide.time, 'h:mm a')}** (Height: ${nextTide.height.toFixed(1)}m)\n\nI've updated the map to show this location!`,
          suggestions: ["Get directions", "Weather forecast", "More coasts nearby"]
        };
      }
    }
    
    // State-based enhanced queries
    const stateQueries = {
      'gujarat': () => {
        const gujaratCoasts = indiaCoastlines.filter(c => c.state === 'Gujarat');
        const coastNames = gujaratCoasts.map(c => c.name).join(', ');
        return {
          content: `🏖️ **Gujarat Coast Information:**\n\nGujarat has ${gujaratCoasts.length} major coastal locations:\n${coastNames}\n\nGujarat's coastline stretches along the Arabian Sea with major ports like Kandla and beautiful beaches like Dwarka.`,
          suggestions: ["Show Kandla Port tides", "Dwarka Beach info", "Porbandar weather"]
        };
      },
      'maharashtra': () => {
        const coasts = indiaCoastlines.filter(c => c.state === 'Maharashtra');
        return {
          content: `🌊 **Maharashtra Coast:** ${coasts.length} locations including Mumbai, Alibag, and Ratnagiri. The Konkan coast is famous for its pristine beaches and fishing ports.`,
          suggestions: ["Mumbai tide times", "Alibag weather", "Ratnagiri port info"]
        };
      },
      'goa': () => {
        const coasts = indiaCoastlines.filter(c => c.state === 'Goa');
        return {
          content: `🏝️ **Goa Beaches:** ${coasts.length} major beaches including Calangute and Palolem. Known for golden sands, water sports, and vibrant nightlife.`,
          suggestions: ["Calangute tide times", "Palolem weather", "Water sports info"]
        };
      },
      'kerala': () => {
        const coasts = indiaCoastlines.filter(c => c.state === 'Kerala');
        return {
          content: `🥥 **Kerala Backwaters:** ${coasts.length} coastal locations including Kochi, Kovalam, and Alleppey. Famous for backwaters, houseboats, and Ayurvedic treatments.`,
          suggestions: ["Kochi port tides", "Kovalam beach", "Alleppey backwaters"]
        };
      },
      'tamil nadu': () => {
        const coasts = indiaCoastlines.filter(c => c.state === 'Tamil Nadu');
        return {
          content: `🏛️ **Tamil Nadu Coast:** ${coasts.length} locations from Chennai Marina to Kanyakumari. Rich in culture, temples, and the longest urban beach in India.`,
          suggestions: ["Chennai Marina tides", "Kanyakumari sunset", "Rameswaram info"]
        };
      }
    };
    
    // Check for state queries
    for (const [state, handler] of Object.entries(stateQueries)) {
      if (message.includes(state)) {
        return handler();
      }
    }
    
    // Specific location queries with enhanced search
    const searchResults = searchCoasts(userMessage);
    if (searchResults.length > 0) {
      const coast = searchResults[0];
      const tides = generateTidePredictions(coast);
      const nextTide = getNextTide(tides);
      
      onCoastSelect(coast);
      
      return {
        content: `📍 **${coast.name}** - ${coast.description}\n\n📍 Location: ${coast.state}, ${coast.country}\n🌊 Next ${nextTide?.type} tide: ${nextTide ? format(nextTide.time, 'h:mm a') : 'N/A'}\n\nMap updated to show this location!`,
        suggestions: ["Get directions", "Weather info", "Nearby coasts"]
      };
    }
    
    // Enhanced help and information queries
    if (message.includes('help') || message.includes('what can you do') || message.includes('commands')) {
      return {
        content: `🤖 **I can help you with:**\n\n🌊 **Tide Information:**\n• Real-time tide predictions\n• High/low tide times\n• Tide heights and status\n\n🗺️ **Location Services:**\n• Find nearest coasts\n• Search by state or city\n• Get directions\n\n🌤️ **Weather Data:**\n• Current conditions\n• Wind and wave info\n• Safety warnings\n\n📍 **All Indian States Covered:**\nGujarat, Maharashtra, Goa, Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Odisha, West Bengal, and island territories.`,
        suggestions: ["Show all Gujarat coasts", "Weather at my location", "Nearest fishing port"]
      };
    }
    
    // Weather queries
    if (message.includes('weather')) {
      return {
        content: `🌤️ Weather information is available in the Weather tab! I can show current conditions, wind speed, wave heights, and safety warnings for any coastal location.\n\nJust select a coast and check the weather tab for detailed information.`,
        suggestions: ["Show weather for Goa", "Wind conditions Mumbai", "Wave height Kerala"]
      };
    }
    
    // Tide-specific queries
    if (message.includes('high tide') || message.includes('low tide')) {
      return {
        content: `🌊 **Tide Information:**\n\n**High Tides:** Occur when water reaches maximum height. Best for:\n• Deep water fishing\n• Boat launching\n• Swimming (deeper water)\n\n**Low Tides:** Water at minimum level. Perfect for:\n• Beach walking\n• Shell collecting\n• Tide pool exploration\n• Rock fishing`,
        suggestions: ["Next high tide near me", "Low tide timing Mumbai", "Best fishing times"]
      };
    }
    
    // Enhanced default responses with more personality
    const enhancedResponses = [
      {
        content: `🌊 I'm here to help with tide and coastal information across India! Try asking about specific states like "Gujarat coasts" or "Kerala beaches". I have data for all major Indian coastal regions.`,
        suggestions: ["Show Gujarat coasts", "Kerala beach info", "Find nearest port"]
      },
      {
        content: `🏖️ Ask me about any Indian coastal location! I can help with tide times, weather conditions, and directions. Try "tides in Goa" or "weather at Mumbai coast".`,
        suggestions: ["Goa tide times", "Mumbai weather", "Nearest coast to me"]
      },
      {
        content: `🗺️ I have comprehensive data for Indian coastlines from Gujarat to West Bengal, plus island territories. What coastal information are you looking for?`,
        suggestions: ["All coastal states", "Island territories", "Major ports"]
      }
    ];
    
    return enhancedResponses[Math.floor(Math.random() * enhancedResponses.length)];
  };

  const handleSendMessage = (messageText?: string) => {
    const messageContent = messageText || input;
    if (!messageContent.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate bot response
    setTimeout(() => {
      const response = generateBotResponse(messageContent);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      
      setMessages(prev => [...prev, botResponse]);
      scrollToBottom();
    }, 500);
    
    setInput('');
    scrollToBottom();
  };

  const handleVoiceInput = () => {
    if (!recognition.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }
    
    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/50 dark:to-cyan-950/50">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Enhanced Tide Assistant
          <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
          <div className="space-y-4 pb-4 pt-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-foreground border shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                    }`}>
                      {format(message.timestamp, 'h:mm a')}
                    </p>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                </div>
                
                {/* Suggestions */}
                {message.type === 'bot' && message.suggestions && (
                  <div className="ml-11 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendMessage(suggestion)}
                        className="text-xs bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-white/50 dark:bg-gray-900/50">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about tides, coasts, weather, or any Indian coastal state..."
              className="flex-1"
            />
            
            <Button
              size="icon"
              variant="outline"
              onClick={handleVoiceInput}
              className={isListening ? 'bg-red-100 border-red-300 text-red-600' : 'hover:bg-blue-50'}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            
            <Button onClick={() => handleSendMessage()} size="icon" className="bg-gradient-to-r from-blue-600 to-cyan-600">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}