const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// Your Amazon Bedrock API configuration
const bedrockApiUrl = "bedrock.ap-southeast-1.amazonaws.com"; // Example Bedrock URL, replace with actual API URL
const apiKey = "Ybd133807-fa72-4ed9-86ec-a0a3ae92c604";

// Endpoint to connect with Amazon Bedrock Claude 3 Haiku model
app.post('/generate-haiku', async (req, res) => {
    const { prompt } = req.body;

    try {
        // Send a request to Amazon Bedrock Claude 3 Haiku Model
        const response = await axios.post(bedrockApiUrl, {
            model: "claude-3-haiku",
            prompt: prompt
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const haiku = response.data.generated_text; // Modify based on Bedrock response structure
        res.json({ haiku });
    } catch (error) {
        console.error("Error generating haiku:", error.message);
        res.status(500).json({ error: "Failed to generate haiku" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
