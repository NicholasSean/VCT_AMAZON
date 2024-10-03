const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('@aws-sdk/client-bedrock-runtime');
const { fetchAuthSession } = require('aws-amplify');

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Fetch the Bedrock model based on session
const getModel = async (modelId = "anthropic.claude-instant-v1") => {
    const session = await fetchAuthSession();
    const region = session.identityId.split(":")[0];

    const bedrockClient = new AWS.BedrockRuntimeClient({
        region: region,
        credentials: session.credentials,
    });

    const model = new AWS.Bedrock({
        model: modelId,
        region: region,
        streaming: true,
        credentials: session.credentials,
        modelKwargs: { max_tokens_to_sample: 1000, temperature: 1 },
    });

    return { model, bedrockClient, session };
};

// API endpoint for chat requests
app.post('/api/chat', async (req, res) => {
    const { language, freeform_text } = req.body;

    if (!language || !freeform_text) {
        return res.status(400).json({ error: "Language and freeform text are required." });
    }

    try {
        // Prepare the model invocation
        const { model, bedrockClient, session } = await getModel();
        const region = session.identityId.split(":")[0];

        // Construct the prompt
        const prompt = `You are a chatbot. You are in ${language}.\n\n${freeform_text}`;

        const input = {
            body: JSON.stringify({
                modelId: model.model,
                prompt: prompt,
                maxTokensToSample: 2000,
                temperature: 1,
            }),
            contentType: "application/json",
            accept: "application/json",
        };

        // Send the command to invoke the model
        const command = new AWS.InvokeModelWithResponseStreamCommand(input);
        const response = await bedrockClient.send(command);

        // Parse the streaming response
        let completion = '';
        const decoder = new TextDecoder('utf-8');
        for await (const chunk of response.body) {
            const json_chunk = JSON.parse(decoder.decode(chunk.chunk.bytes));
            let text = '';

            if (json_chunk.type === 'content_block_start') {
                text = json_chunk.content_block.text;
            } else if (json_chunk.type === 'content_block_delta') {
                text = json_chunk.delta.text;
            }

            completion += text;
        }

        // Send the final completion text as response
        res.json({ text: completion });

    } catch (error) {
        console.error("Error invoking Bedrock model:", error);
        res.status(500).json({ error: "Failed to get response from the model." });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
