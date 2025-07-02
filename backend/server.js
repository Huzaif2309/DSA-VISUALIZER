require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { sendFeedbackMail } = require('./utils/mailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
    // return res.status(503).json({ error: 'Service is temporarily paused. Try again later.' });//remove on pushing it
    try {
        const { message, systemInstruction } = req.body;
        
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        // Start a chat session with system instruction
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemInstruction }]
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I will strictly focus on DSA topics and reject all other queries with a polite response." }]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        });
        
        // Send message and get response
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        
        res.json({ response: text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

// Feedback/Contact form endpoint using modular mailer
app.post('/api/send-feedback', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await sendFeedbackMail({ name, email, message });
        res.json({ success: true });
    } catch (err) {
        console.error('❌ Error sending feedback:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});