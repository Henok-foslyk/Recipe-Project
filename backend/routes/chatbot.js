// routes/chatRouter.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const router = express.Router();

// If you need to parse JSON bodies, uncomment the next line
// router.use(bodyParser.json());

router.post('/send-message', async (req, res) => {
  try {
    const { conversation } = req.body;
    const messages = [
      {
        role: 'system',
        content:
          "You are a helpful recipe assistant. The first message is always going to be recipe info that seems as if its coming from the user, but it;s just preloaded data that you should act like you already knew.",
      },
      ...conversation.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });

    const replyText = completion.choices[0].message.content;
    console.log('OpenAI reply:', replyText);
    return res.json({ reply: replyText });
  } catch (err) {
    console.error('OpenAI error:', err);
    return res.status(500).json({ error: 'OpenAI request failed' });
  }
});

module.exports = router;
