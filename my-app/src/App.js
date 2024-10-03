import React, { useState } from 'react';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() !== "") {
      // Add user message to chat
      setMessages([...messages, { role: "user", content: input }]);
      
      // Call the API here
      try {
        const response = await fetch('api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: input, // Change to prompt
          }),
        });

        // Check if the response is ok (status 200-299)
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const botMessage = data.message; // Adjust based on your API response structure

        // Add bot message to chat
        setMessages(prevMessages => [
          ...prevMessages,
          { role: "user", content: input },
          { role: "bot", content: botMessage }
        ]);
        setInput(""); // Clear input field after sending the message
      } catch (error) {
        console.error("Error fetching bot response:", error);
        // Optionally, you can display an error message in the chat
        setMessages(prevMessages => [
          ...prevMessages,
          { role: "bot", content: "Sorry, I couldn't respond to that." }
        ]);
      }
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

export default Chatbot;
