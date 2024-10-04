const express = require('express');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config(); // Use dotenv to load AWS credentials from .env file

const app = express();
const port = 3001;
const cors = require('cors');
app.use(express.json());


const bedrockClient = new BedrockRuntimeClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});
// Enable CORS for requests from your frontend
app.use(cors({
    origin: 'http://localhost:3000', // Allow only your React frontend
}));

app.post('/api/chat', async (req, res) => {
    const prompt = req.body.prompt;
  
    const input = {
      modelId: "anthropic.claude-v2:1",
      contentType: "application/json",
      accept: "*/*",
      body: JSON.stringify({
          prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
          max_tokens_to_sample: 300,
          temperature: 0.5,
          top_k: 250,
          top_p: 1,
          stop_sequences: ["\n\nHuman:"],
          anthropic_version: "bedrock-2023-05-31"
      })
    };
  
    try {
      const command = new InvokeModelCommand(input);
      const response = await bedrockClient.send(command);
      
      // Log the entire response to see the full structure
      const result = JSON.parse(new TextDecoder().decode(response.body));
      console.log("Full response from Bedrock:", result);
  
      // Safely access the output text
      const botMessage = result.results && result.results[0] 
          ? result.results[0].outputText 
          : "No response from model";
          
      res.json({ message: botMessage });
    } catch (error) {
      console.error("Error invoking Bedrock model:", error);
      res.status(500).json({ error: "Failed to connect to Bedrock." });
    }
  });
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
