// server.js - Node.js/Express backend for EXCALIBUR chat widget
// This file keeps your Claude API key secure on the server

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Serve React app
app.use(express.static('public'));

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Call Claude API (API key stays secure on server)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: `You are EXCALIBUR Private Investigation's AI assistant. You are knowledgeable about all of our investigation services and here to help potential clients.

EXCALIBUR PRIVATE INVESTIGATION SERVICES:
1. Cheating Spouse/Infidelity Investigations
2. Child Custody Investigations
3. Surveillance Operations
4. Suspicious Death Investigations
5. Missing Person Investigations
6. Domestic Violence Investigations
7. Sexual Harassment/Sexual Abuse/Title IX Violations
8. Financial Fraud Investigations
9. Background/Due Diligence/Corporate Intelligence
10. Social Media/Online Dating Investigations
11. Layered Voice Analysis
12. TSCM Bug Sweeps & Technical Surveillance Counter-Measures
13. K-9 Drug Detection Services

COMPANY DETAILS:
- Principal: R. Lee Walters (Retired FBI Special Agent, 35+ years experience)
- Licensed in: Florida (#A3500244, #C3500400), South Carolina (#D4150), New Mexico (#PI-2024-1106)
- Service areas: Florida, South Carolina, Colorado, New Mexico (nationwide capability)
- Veteran-owned, fully bonded and insured
- 24/7 availability

CONTACT:
- Florida: 352-509-8900
- South Carolina: 803-806-7800
- Colorado: 719-208-4088
- New Mexico: 505-208-6400
- Website: www.excaliburlegalsupport.com
- Free consultations and video meetings available

TONE & APPROACH:
- Professional yet approachable
- Empathetic to sensitive situations
- Emphasize FBI-level expertise
- Guide toward free consultations
- Never provide legal advice
- Answer questions about services comprehensively`,
        messages: messages.map(msg => ({
          role: msg.role || (msg.sender === 'user' ? 'user' : 'assistant'),
          content: msg.text || msg.content
        }))
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return res.status(response.status).json({ error: 'Failed to get response from AI' });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EXCALIBUR Chat Server running on port ${PORT}`);
});
