import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  role: "user" | "assistant";
  content: string;
  showContactPrompt?: boolean;
};

type ChatPhase = "chat" | "contact-prompt" | "collecting-contact" | "submitted";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const SAVE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-chat-inquiry`;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const QUICK_OPTIONS = [
  "What services do you offer?",
  "How does your process work?",
  "What areas do you service?",
  "How do I book a free design consult?",
];

const OFF_TOPIC_KEYWORDS = [
  "weather",
  "temperature",
  "sports",
  "nfl",
  "nba",
  "cricket",
  "soccer",
  "bitcoin",
  "crypto",
  "stocks",
  "share market",
  "politics",
  "election",
  "movie",
  "movies",
  "tv show",
  "song",
  "music",
  "recipe",
  "cooking tips",
  "homework",
  "math",
  "algebra",
  "python",
  "javascript",
  "coding",
  "programming",
  "translate",
  "horoscope",
  "astrology",
];

const RENOVATION_SCOPE_KEYWORDS = [
  "renovation",
  "renovate",
  "kitchen",
  "bathroom",
  "laundry",
  "living",
  "extension",
  "whole home",
  "gold coast",
  "cdc",
  "concept design construct",
  "quote",
  "consult",
  "consultation",
  "design tool",
  "moodboard",
  "ai generator",
  "service",
  "timeline",
  "cost",
  "budget",
  "call",
  "phone",
];

// Keywords that indicate AI doesn't have a definitive answer
const UNCERTAINTY_PHRASES = [
  "i don't have specific information",
  "i'd suggest getting in touch",
  "i suggest getting in touch",
  "get in touch",
  "contact us",
  "reach out",
  "would you like to drop in your contact",
  "drop in your contact",
  "leave your contact",
  "i'm not certain",
  "i can't confirm",
  "you'd need to speak",
  "speak with our team",
  "contact our team",
];

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey there! I'm your 24/7 renovation specialist. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatPhase, setChatPhase] = useState<ChatPhase>("chat");
  const [messageCount, setMessageCount] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatPhase, isTyping]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  // Detect if AI response indicates uncertainty
  const detectUncertainty = (response: string): boolean => {
    const lowerResponse = response.toLowerCase();
    return UNCERTAINTY_PHRASES.some(phrase => lowerResponse.includes(phrase));
  };

  // Generate context-based message from conversation for pre-populating the form
  const generateContextMessage = (msgs: Message[]): string => {
    const userMessages = msgs.filter(m => m.role === "user");
    if (userMessages.length === 0) return "";
    
    // Get the recent user messages to understand their intent
    const recentMessages = userMessages.slice(-3).map(m => m.content);
    const lastUserMessage = userMessages[userMessages.length - 1].content;
    
    // Create a natural message based on what they were asking about
    const lowerLast = lastUserMessage.toLowerCase();
    
    if (lowerLast.includes("logan") || lowerLast.includes("brisbane") || lowerLast.includes("ipswich")) {
      const area = lastUserMessage.match(/\b(logan|brisbane|ipswich|south|north|west|east)\b/i)?.[0] || "my area";
      return `I am looking for services around ${area}`;
    }
    if (lowerLast.includes("price") || lowerLast.includes("cost") || lowerLast.includes("quote") || lowerLast.includes("budget")) {
      return "I would like to get a quote for my renovation project";
    }
    if (lowerLast.includes("bathroom")) {
      return "I am interested in a bathroom renovation";
    }
    if (lowerLast.includes("kitchen")) {
      return "I am interested in a kitchen renovation";
    }
    if (lowerLast.includes("living") || lowerLast.includes("lounge") || lowerLast.includes("room")) {
      return "I am interested in a living area renovation";
    }
    if (lowerLast.includes("whole") || lowerLast.includes("entire") || lowerLast.includes("full")) {
      return "I am interested in a whole home renovation";
    }
    if (lowerLast.includes("timeline") || lowerLast.includes("when") || lowerLast.includes("how long")) {
      return "I would like to know about timelines for my project";
    }
    
    // Default: summarize what they were asking about
    return `I was asking about: ${lastUserMessage}`;
  };

  // Trigger contact collection after a few messages OR when AI shows uncertainty
  useEffect(() => {
    if (chatPhase !== "chat") return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role !== "assistant") return;

    // Check if AI response indicates uncertainty
    if (detectUncertainty(lastMessage.content)) {
      setTimeout(() => {
        setChatPhase("contact-prompt");
      }, 1000);
      return;
    }

    // Also trigger after 6+ exchanges
    if (messageCount >= 6) {
      const showMessage = async () => {
        setIsTyping(true);
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I've loved chatting with you! Would you like to connect with our team to discuss your project in more detail?",
          },
        ]);
        setChatPhase("contact-prompt");
      };
      showMessage();
    }
  }, [messageCount, chatPhase, messages]);

  const getFunctionHeaders = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token || SUPABASE_PUBLISHABLE_KEY;

    return {
      "Content-Type": "application/json",
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token}`,
    };
  };

  const streamChat = async (messagesToSend: Message[]) => {
    const headers = await getFunctionHeaders();
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ messages: messagesToSend.map(m => ({ role: m.role, content: m.content })) }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      if (resp.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      }
      if (resp.status === 402) {
        throw new Error("Service temporarily unavailable.");
      }
      throw new Error(errorData.error || "Failed to get response");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant" && prev.length > 1) {
                return prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          // Skip malformed chunks instead of re-buffering (prevents infinite loop)
        }
      }
    }
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const trimmed = text.trim();
    const lowerText = trimmed.toLowerCase();
    const isGreetingOnly = /^(hi|hello|hey|good morning|good afternoon|good evening|thanks|thank you)$/i.test(trimmed);
    const hasScopeKeyword = RENOVATION_SCOPE_KEYWORDS.some((keyword) => lowerText.includes(keyword));
    const hasOffTopicKeyword = OFF_TOPIC_KEYWORDS.some((keyword) => lowerText.includes(keyword));
    const isClearlyOffTopic = !isGreetingOnly && hasOffTopicKeyword && !hasScopeKeyword;

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setMessageCount((prev) => prev + 1);

    if (isClearlyOffTopic) {
      // Show typing indicator for off-topic messages too
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I can only help with Concept Design Construct and home renovation questions. I can help with services, process, design tools, or booking a free design consult.",
        },
      ]);
      return;
    }

    // Show typing indicator with a natural delay before AI responds
    setIsTyping(true);
    const typingDelay = 1000 + Math.random() * 1000; // 1-2 seconds random delay
    await new Promise((resolve) => setTimeout(resolve, typingDelay));
    setIsTyping(false);

    setIsLoading(true);

    try {
      await streamChat(newMessages.slice(1));
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send message");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickOption = (option: string) => {
    handleSend(option);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleContactResponse = async (wantsContact: boolean) => {
    if (wantsContact) {
      // Pre-populate the message field with context from the conversation
      const contextMessage = generateContextMessage(messages);
      setContactForm(prev => ({ ...prev, message: contextMessage }));
      setChatPhase("collecting-contact");
    } else {
      setChatPhase("chat");
      // Show typing indicator before response
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "No worries! Feel free to keep exploring. I'm here if you have any other questions about our services.",
        },
      ]);
    }
  };

  const generateConversationSummary = (): string => {
    const userMessages = messages.filter(m => m.role === "user");
    const topics = userMessages.map(m => m.content).join(". ");
    return `Customer inquired about: ${topics.substring(0, 300)}${topics.length > 300 ? "..." : ""}`;
  };

  const handleSubmitContact = async () => {
    if (!contactForm.name.trim() || !contactForm.phone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const contextSummary = generateConversationSummary();
      const headers = await getFunctionHeaders();
      
      const resp = await fetch(SAVE_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: contactForm.name,
          phone: contactForm.phone,
          email: contactForm.email,
          additionalNotes: contactForm.message,
          conversationHistory: messages,
          contextSummary,
          website: "",
        }),
      });

      if (!resp.ok) {
        throw new Error("Failed to submit");
      }

      setChatPhase("submitted");
      // Show typing indicator before success message
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `__SUBMITTED__Thanks ${contactForm.name}! Our team will be in touch soon to help with your project.`,
        },
      ]);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => (isOpen ? handleClose() : handleOpen())}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-120px)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Chat View */}
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col h-full"
            >
                  {/* Header */}
                  <div className="bg-primary text-primary-foreground px-5 py-4">
                    <p className="font-semibold">CDC Online</p>
                    <p className="text-xs text-primary-foreground/80">Your 24/7 Renovation Specialist</p>
                  </div>

                  <div className="flex-1 min-h-0 max-h-[calc(100vh-280px)] overflow-y-auto p-4 space-y-4 bg-muted/30">
                    <AnimatePresence initial={false}>
                      {messages.map((msg, index) => {
                        const isSubmittedMessage = msg.content.startsWith("__SUBMITTED__");
                        const displayContent = isSubmittedMessage 
                          ? msg.content.replace("__SUBMITTED__", "") 
                          : msg.content;
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-background text-foreground shadow-sm border border-border rounded-bl-md"
                              }`}
                            >
                              {isSubmittedMessage && (
                                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  <span className="text-xs font-medium text-green-700">Details submitted</span>
                                </div>
                              )}
                              {displayContent}
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {/* Quick Options */}
                    {messages.length === 1 && !isLoading && chatPhase === "chat" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                      >
                        <p className="text-xs text-foreground/60 px-1">Quick questions:</p>
                        <div className="flex flex-col gap-2">
                          {QUICK_OPTIONS.map((option, index) => (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.35 + index * 0.05 }}
                              whileHover={{ scale: 1.01, x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleQuickOption(option)}
                              className="text-sm text-left bg-background border border-border rounded-xl px-4 py-2.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                            >
                              {option}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Contact Prompt with Quick Options */}
                    <AnimatePresence>
                      {chatPhase === "contact-prompt" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3"
                        >
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-background text-foreground shadow-sm border border-border rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed"
                          >
                            I'd be happy to connect you with our team who can give you a proper answer. Would you like to drop in your contact details?
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col gap-2"
                          >
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleContactResponse(true)}
                              className="text-sm bg-primary text-primary-foreground rounded-full px-4 py-2 hover:bg-primary/90 transition-colors"
                            >
                              Yes, please!
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleContactResponse(false)}
                              className="text-sm bg-background border border-border rounded-full px-4 py-2 hover:bg-muted transition-colors"
                            >
                              No, just exploring
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleContactResponse(false)}
                              className="text-sm bg-background border border-border rounded-full px-4 py-2 hover:bg-muted transition-colors"
                            >
                              Maybe later
                            </motion.button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Inline Contact Form */}
                    <AnimatePresence>
                      {chatPhase === "collecting-contact" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3"
                        >
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-background text-foreground shadow-sm border border-border rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed"
                          >
                            Great! Just fill in your details below and our team will reach out soon.
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-background border border-border rounded-xl p-4 space-y-3"
                          >
                            <Input
                              placeholder="Full name *"
                              value={contactForm.name}
                              onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                              className="bg-muted/50"
                            />
                            <Input
                              placeholder="Phone number *"
                              type="tel"
                              value={contactForm.phone}
                              onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                              className="bg-muted/50"
                            />
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                              <Input
                                placeholder="Email (optional)"
                                type="email"
                                value={contactForm.email}
                                onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                                className="pl-10 bg-muted/50"
                              />
                            </div>
                            
                            {/* Message Field - Pre-populated with context */}
                            <div className="space-y-1">
                              <p className="text-xs text-foreground/60">Your message:</p>
                              <textarea
                                placeholder="What would you like help with?"
                                value={contactForm.message}
                                onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                                className="w-full min-h-[70px] px-3 py-2 text-sm rounded-md border border-input bg-muted/50 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                            </div>
                            
                            <div className="flex gap-2 pt-1">
                              <Button
                                onClick={handleSubmitContact}
                                disabled={isSubmitting}
                                className="flex-1"
                                size="sm"
                              >
                                {isSubmitting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Submit"
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={async () => {
                                  setChatPhase("chat");
                                  setIsTyping(true);
                                  await new Promise((resolve) => setTimeout(resolve, 800));
                                  setIsTyping(false);
                                  setMessages((prev) => [
                                    ...prev,
                                    {
                                      role: "assistant",
                                      content: "No worries! Feel free to keep chatting. I'm here to help!",
                                    },
                                  ]);
                                }}
                                size="sm"
                                className="text-foreground/60"
                              >
                                Skip
                              </Button>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Typing Indicator - Shows during typing delay and while waiting for stream */}
                    <AnimatePresence>
                      {(isTyping || (isLoading && messages[messages.length - 1]?.role === "user")) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex justify-start"
                        >
                          <div className="bg-background rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-border">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-foreground/50 italic">typing</span>
                              <div className="flex gap-1">
                                <motion.span
                                  className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                                  animate={{ y: [0, -3, 0] }}
                                  transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                                />
                                <motion.span
                                  className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                                  animate={{ y: [0, -3, 0] }}
                                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.12 }}
                                />
                                <motion.span
                                  className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                                  animate={{ y: [0, -3, 0] }}
                                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.24 }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  {(chatPhase === "chat" || chatPhase === "submitted") && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="border-t border-border p-3 bg-background"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder={chatPhase === "submitted" ? "Chat with us anytime!" : "Type your message..."}
                          className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                          disabled={isLoading}
                        />
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="icon"
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className="rounded-full w-10 h-10 shrink-0"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
