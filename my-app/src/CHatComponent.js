// src/ChatComponent.js
import React, { useState } from 'react';
import './ChatComponent.css';  // For styling the chat interface

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input) return;

    // Add user's message to chat
    const newMessage = { sender: 'user', text: input };
    setMessages([...messages, newMessage]);

    // Clear input field
    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
