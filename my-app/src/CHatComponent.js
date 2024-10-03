import React, { useState } from 'react';
import axios from 'axios';

const ChatInterface = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handlePromptSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/api/query-bedrock', { prompt });
            setResponse(res.data);
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
