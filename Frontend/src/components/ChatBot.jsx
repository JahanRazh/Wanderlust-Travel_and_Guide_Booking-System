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
      // Extract city name and date from the message
      const cityMatch = message.match(/weather (?:in|at|for) ([A-Z][a-zA-Z\s-]+?)(?:\s+(?:on|for|at)\s+(\d{4}-\d{2}-\d{2})|\s*$)/i);
      
      if (cityMatch) {
        // Format city name to match backend requirements (capitalize first letter)
        const city = cityMatch[1].trim().split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        
        let date = cityMatch[2];
        
        // If no date is provided, use today's date
        if (!date) {
          date = new Date().toISOString().split('T')[0];
        }
        
        try {
          // Log the request details
          console.log('Making weather API request with:', {
            url: 'http://localhost:3000/predict',
            city: city,
            date: date
          });

          // Make the API request
          const response = await axios({
            method: 'post',
            url: 'http://localhost:3000/predict',
            data: {
              city: city,
              date: date
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });

          // Log the response
          console.log('Weather API response:', response.data);

          if (response.data) {
            const { temperature, rainfall, conditions } = response.data;
            const formattedDate = new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            return `Here's the weather forecast for ${city} on ${formattedDate}:\n\n🌡️ Temperature: ${temperature}\n🌧️ Rainfall: ${rainfall}\n🌤️ Conditions: ${conditions}`;
          } else {
            return `I'm sorry, I couldn't get weather information for ${city} on ${date}. Please try again.`;
          }
        } catch (error) {
          // Log detailed error information
          console.error('Weather API error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
          });

          if (error.response?.status === 404) {
            return `I'm sorry, I couldn't find weather data for ${city}. Please make sure the city name is correct and try again.`;
          } else if (error.response?.data?.error) {
            return `Error: ${error.response.data.error}`;
          } else if (error.message) {
            return `Error: ${error.message}. Please try again later.`;
          } else {
            return `I'm sorry, I couldn't get the weather information for ${city}. Please try again later.`;
          }
        }
      }
      return "Please specify a city name and optionally a date. For example:\n- 'What's the weather in Colombo?'\n- 'Weather in Colombo on 2024-01-15'\n- 'What's the weather in Galle on 15th January 2024?'";
    }
    
    // Handle other queries
    if (msg.includes('places') && msg.includes('galle')) {
      return 'In Galle, you can visit the Galle Fort, Jungle Beach, and Unawatuna.';
    } else if (msg.includes('help')) {
      return "I can help you with:\n1. Weather forecasts:\n   - 'What's the weather in Colombo?'\n   - 'Weather in Colombo on 2024-01-15'\n   - 'What's the weather in Galle on 15th January 2024?'\n2. Tourist spots (e.g., 'What places to visit in Galle?')\n3. General travel information";
    } else {
      return "I can provide information about Sri Lankan weather and tourist spots. Try asking about:\n- 'weather in Colombo'\n- 'weather in Colombo on 2024-01-15'\n- 'places in Galle'";
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
