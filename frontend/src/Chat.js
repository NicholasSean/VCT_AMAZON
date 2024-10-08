// src/Chat.js
import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() !== "") {
      // Log the user input
      console.log("User input:", input);

      // Add user message to chat
      setMessages(prevMessages => [...prevMessages, { role: "user", content: input }]);

      try {
        // Send the prompt to your backend API
        console.log("Sending request to API with input:", input);

        const response = await axios.post('http://localhost:3001/api/chat', {
          prompt: input,
        });

        // Log the API response for debugging
        console.log("API response data:", response.data);

        // Assuming response data structure: { message: "response text" }
        const botMessage = response.data.message;

        // Add bot message to chat
        setMessages(prevMessages => [
          ...prevMessages,
          { role: "bot", content: botMessage }
        ]);

      } catch (error) {
        console.error("Error fetching bot response:", error.message);
        setMessages(prevMessages => [
          ...prevMessages,
          { role: "bot", content: "Sorry, I couldn't respond to that." }
        ]);
      }

      setInput(""); // Clear input field after sending the message
    }
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "user-message" : "bot-message"}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
