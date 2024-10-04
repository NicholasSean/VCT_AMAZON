import React, { useState } from 'react';
import axios from 'axios';

const ChatInterface = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handlePromptSubmit = async (e) => {
        e.preventDefault();

        try {
            // Updated to match your backend endpoint
            const res = await axios.post('http://localhost:3001/api/chat', { 
                freeform_text: prompt,
                language: 'English' // Assuming you're using English
            });
            setResponse(res.data.text);  // Access the response text properly
        } catch (error) {
            console.error('Error querying Bedrock:', error);
            setResponse('An error occurred while connecting to Bedrock.');
        }
    };

    return (
        <div>
            <form onSubmit={handlePromptSubmit}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt"
                />
                <button type="submit">Submit</button>
            </form>

            <div>
                <h3>Response from Bedrock:</h3>
                <p>{response}</p>
            </div>
        </div>
    );
};

export default ChatInterface;
