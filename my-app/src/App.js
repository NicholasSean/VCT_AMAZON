import React, { useState } from 'react';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() !== "") {
      // Log the user input
      console.log("User input:", input);

      // Add user message to chat
      setMessages([...messages, { role: "user", content: input }]);

      // Call the API here
      try {
        console.log("Sending request to API with input:", input);
        
        const response = await fetch('http://localhost:3001/api/chat', { // Ensure correct API URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: input, // Log the input
          }),
        });

        // Log the response status
        console.log("API response status:", response.status);

        // Check if the response is ok (status 200-299)
        if (!response.ok) {
          // Log the error status and message
          console.error(`Error: ${response.status} ${response.statusText}`);
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        // Parse and log the response data
        const data = await response.json();
        console.log("API response data:", data);

        const botMessage = data.message; // Adjust based on your API response structure

        // Add bot message to chat
        setMessages(prevMessages => [
          ...prevMessages,
          { role: "user", content: input },
          { role: "bot", content: botMessage }
        ]);

        setInput(""); // Clear input field after sending the message

      } catch (error) {
        // Log the error message and stack trace
        console.error("Error fetching bot response:", error.message);
        console.error("Error stack trace:", error.stack);

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
