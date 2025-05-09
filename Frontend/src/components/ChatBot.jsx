import React, { useState } from 'react';
import './ChatBot.css';
import chata from "../assets/images/home/Chata.jpg";
import axios from 'axios';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await getBotResponse(input);
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "I'm sorry, I couldn't process your request. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (message) => {
    const msg = message.toLowerCase();
    
    // Check if the message is about weather
    if (msg.includes('weather')) {
      // Extract city name from the message
      const cityMatch = message.match(/weather (?:in|at|for) ([A-Z][a-zA-Z\s-]+)/i);
      if (cityMatch) {
        const city = cityMatch[1];
        const today = new Date().toISOString().split('T')[0];
        
        try {
          const response = await axios.post('http://localhost:3000/predict', {
            city: city,
            date: today
          });
          
          const { temperature, rainfall, conditions } = response.data;
          return `Here's the weather forecast for ${city} today:\n\n🌡️ Temperature: ${temperature}\n🌧️ Rainfall: ${rainfall}\n🌤️ Conditions: ${conditions}`;
        } catch (error) {
          return `I'm sorry, I couldn't get the weather information for ${city}. Please make sure the city name is correct and try again.`;
        }
      }
      return "Please specify a city name. For example: 'What's the weather in Colombo?'";
    }
    
    // Handle other queries
    if (msg.includes('places') && msg.includes('galle')) {
      return 'In Galle, you can visit the Galle Fort, Jungle Beach, and Unawatuna.';
    } else if (msg.includes('help')) {
      return "I can help you with:\n1. Weather forecasts (e.g., 'What's the weather in Colombo?')\n2. Tourist spots (e.g., 'What places to visit in Galle?')\n3. General travel information";
    } else {
      return "I can provide information about Sri Lankan weather and tourist spots. Try asking about 'weather in Colombo' or 'places in Galle'.";
    }
  };

  return (
    <div>
      <button className="chat-circle" onClick={toggleChat}>
        <img 
          src={chata} 
          alt="ChatBot"
          className="h-10 w-10 object-contain"
        />
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Travel Assistant</span>
            <button onClick={toggleChat}>✖</button>
          </div>
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="chat-message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about weather or places"
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
