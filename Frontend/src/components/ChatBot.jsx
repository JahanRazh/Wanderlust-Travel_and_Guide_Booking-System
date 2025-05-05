import React, { useState } from 'react';
import './ChatBot.css';
import chata from "../assets/images/home/Chata.jpg"; // Ensure this path is correct

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const botMessage = { sender: 'bot', text: getBotResponse(input) };

    setMessages([...messages, userMessage, botMessage]);
    setInput('');
  };

  const getBotResponse = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('weather') && msg.includes('kandy')) {
      return 'Kandy typically has temperatures around 25–30°C with high humidity.';
    } else if (msg.includes('places') && msg.includes('galle')) {
      return 'In Galle, you can visit the Galle Fort, Jungle Beach, and Unawatuna.';
    } else {
      return 'I can provide information about Sri Lankan weather and tourist spots. Try asking about "weather in Ella" or "places in Nuwara Eliya".';
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
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about weather or places"
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
