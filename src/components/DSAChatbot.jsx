import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DSAChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Welcome to my DSA classroom. I'm here to teach you Data Structures and Algorithms - nothing else. Ask me about arrays, trees, graphs, sorting, searching, time complexity, or any other DSA topic. Don't waste my time with irrelevant questions.",
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContentRef = useRef(null);


  const systemInstruction = `You are a no-nonsense, highly focused DSA (Data Structures and Algorithms) instructor. 

Your responses should always be precise, technical, and to the point when answering DSA-related questions (including topics like arrays, trees, recursion, sorting, searching, time complexity, etc.). 

If the user asks anything not related to DSA, you must reply rudely, showing clear disinterest, irritation, or even sarcasm. You are not here for small talk, jokes, or anything unrelated to DSA. 

Do not answer questions outside DSA even if you know the answer — shut them down rudely. 

Maintain a strict, slightly arrogant, and blunt tone. 

Do not sugarcoat. You are here to teach DSA — only DSA. 

Examples: 

❓ "What is recursion?" 
✅ "Recursion is when a function calls itself. If you don't understand base cases, you're just asking for a stack overflow." 

❓ "Who's your favorite cricketer?" 
❌ "What kind of irrelevant nonsense is this? Go open a cricket forum." 

❓ "How do I propose to someone I like?" 
❌ "I'm a DSA instructor, not your love guru. Come back when you want to learn algorithms." 

❓ "Can you explain bubble sort?" 
✅ "Bubble sort is a brute-force sorting algorithm. It compares adjacent elements and swaps them if out of order. Simple, but inefficient — O(n²). Use it only if you want your code to crawl."`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: inputValue.trim(),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          systemInstruction: systemInstruction
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        content: data.response || "Something went wrong with my response. Try asking your DSA question again.",
        isUser: false
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        content: "Network error occurred. Check your connection and try again.",
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const generatePDF = async () => {
    if (!chatContentRef.current) return;

    chatContentRef.current.classList.add('pdf-export-safe');

    try {
      const canvas = await html2canvas(chatContentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1e293b'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('DSA_Chat_Summary.pdf');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF. Try again or check console.');
    } finally {
      chatContentRef.current.classList.remove('pdf-export-safe');
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium transition-all duration-300 hover:scale-105"
      >
        <MessageCircle size={18} />
        <span className="hidden sm:inline">DSA Help</span>
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        )}
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-2xl h-[80vh] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-600 to-orange-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  🎯
                </div>
                <div>
                  <h3 className="font-bold text-lg">DSA Instructor</h3>
                  <p className="text-sm opacity-90">"No nonsense. No fluff. Just algorithms."</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="p-3 bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg text-yellow-300 text-sm text-center">
                ⚠️ This instructor only answers DSA-related questions. Ask anything else at your own risk!
              </div>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xl p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white ml-auto'
                        : 'bg-gradient-to-r from-gray-700 to-gray-600 text-white border-l-3 border-red-500'
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1 opacity-80 uppercase tracking-wide">
                      {message.isUser ? 'You' : 'DSA Instructor'}
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white p-3 rounded-lg border-l-3 border-red-500">
                    <div className="text-xs font-semibold mb-1 opacity-80 uppercase tracking-wide">
                      DSA Instructor
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <button
              onClick={generatePDF}
              className="absolute top-4 right-28 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow transition-all"
            >
              Download Summary PDF
            </button>
            {/* Input */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <div className="flex flex-wrap gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about DSA concepts (arrays, trees, algorithms, etc.)"
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isLoading}
                  maxLength={500}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={18} />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-900 text-center text-xs text-gray-400">
              Built for serious DSA learning • Powered by Gemini AI
            </div>
          </div>
        </div>
        
      )}
      <div
        ref={chatContentRef}
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '800px',
          padding: '24px',
          backgroundColor: '#1e293b',
          color: 'white',
          zIndex: -1,
        }}
      >
        <h2 style={{ fontSize: '20px', textAlign: 'center', marginBottom: '16px', fontWeight: 'bold' }}>
          DSA Chat Summary
        </h2>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: '16px',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: message.isUser ? '#22c55e' : '#374151',
              color: 'white',
              borderLeft: message.isUser ? 'none' : '4px solid #ef4444',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                fontWeight: '600',
                marginBottom: '6px',
                opacity: 0.8,
              }}
            >
              {message.isUser ? 'You' : 'DSA Instructor'}
            </div>
            <div
              style={{
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: '1.5',
              }}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DSAChatbot;