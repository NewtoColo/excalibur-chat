const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Discord Webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1517584581233213440/cYYz7YFcdIE9Sj03OGi5uWv9W0JMfD8KDyFDanhJRmESVkPoLdslygtmxwESPIX38ur4';

// Function to send Discord notification
async function sendDiscordNotification(ip, city, state, timestamp) {
  try {
    const message = {
      content: `🌍 **New Website Visitor**\n📍 **Location:** ${city}, ${state}\n🔗 **IP:** ${ip}\n⏰ **Time:** ${timestamp}`
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  } catch (error) {
    console.error('Discord notification error:', error);
  }
}

// Function to get geolocation from IP
async function getGeolocation(ip) {
  try {
    const response = await fetch(`https://ipwhois.io/json/?ip=${ip}`, {
      timeout: 5000
    });
    
    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    
    if (data.success === true) {
      return {
        city: data.city || 'Unknown',
        state: data.region || 'Unknown'
      };
    }
    
    return { city: 'Unknown', state: 'Unknown' };
  } catch (error) {
    console.error('Geolocation error:', error);
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      return {
        city: data.city || 'Unknown',
        state: data.region || 'Unknown'
      };
    } catch (fallbackError) {
      console.error('Fallback geolocation error:', fallbackError);
      return { city: 'Unknown', state: 'Unknown' };
    }
  }
}

// Middleware to track visitors
app.use(async (req, res, next) => {
  // Get client IP
  let ip = req.headers['cf-connecting-ip'] ||
           req.headers['x-forwarded-for'] ||
           req.headers['x-real-ip'] ||
           req.connection.remoteAddress || 
           req.socket.remoteAddress;
  
  if (ip && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  if (ip && ip.includes(':')) {
    ip = ip.split(':').pop();
  }

  // Get geolocation from IP
  const { city, state } = await getGeolocation(ip);
  
  // Send Discord notification
  const timestamp = new Date().toLocaleString('en-US', { 
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  console.log(`Visitor: ${ip} - ${city}, ${state}`);
  await sendDiscordNotification(ip, city, state, timestamp);
  
  next();
});

// ROOT ROUTE - Simple HTML Chat
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EXCALIBUR Chat</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f5; }
    #chat-container { width: 100%; height: 100vh; display: flex; flex-direction: column; background: white; }
    #header { background: #003d7a; color: white; padding: 16px; text-align: center; }
    #header h2 { margin: 0; font-size: 18px; }
    #header p { margin: 4px 0 0 0; font-size: 12px; opacity: 0.9; }
    #messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .message { display: flex; margin: 8px 0; }
    .message.user { justify-content: flex-end; }
    .message.bot { justify-content: flex-start; }
    .message-text { max-width: 80%; padding: 12px 16px; border-radius: 12px; word-wrap: break-word; font-size: 14px; line-height: 1.4; }
    .message.user .message-text { background: #003d7a; color: white; }
    .message.bot .message-text { background: #e8e8e8; color: #333; }
    .contact-button { 
      display: inline-block; 
      margin-top: 12px; 
      padding: 12px 24px; 
      background: #003d7a; 
      color: white; 
      text-decoration: none; 
      border-radius: 6px; 
      font-weight: 600; 
      cursor: pointer; 
      border: none;
      font-size: 14px;
    }
    .contact-button:hover { 
      background: #002550; 
    }
    #input-area { border-top: 1px solid #ddd; padding: 12px; background: white; }
    #input-form { display: flex; gap: 8px; }
    #input-form input { flex: 1; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
    #input-form button { padding: 10px 16px; background: #003d7a; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
    #input-form button:disabled { background: #ccc; cursor: default; }
    .loading { text-align: center; color: #666; padding: 10px; }
  </style>
</head>
<body>
  <div id="chat-container">
    <div id="header">
      <h2>EXCALIBUR Private Investigation</h2>
      <p>AI Assistant</p>
    </div>
    <div id="messages"></div>
    <div id="input-area">
      <form id="input-form">
        <input type="text" id="message-input" placeholder="Ask about our services..." autocomplete="off">
        <button type="submit">Send</button>
      </form>
    </div>
  </div>

  <script>
    const messagesDiv = document.getElementById('messages');
    const inputForm = document.getElementById('input-form');
    const messageInput = document.getElementById('message-input');
    const sendButton = inputForm.querySelector('button');

    // Add initial message
    addMessage('Hello! I\\'m EXCALIBUR\\'s AI Assistant. I can help answer questions about our private investigation services. What would you like to know?', 'bot');

    function addMessage(text, sender) {
      const div = document.createElement('div');
      div.className = \`message \${sender}\`;
      const textDiv = document.createElement('div');
      textDiv.className = 'message-text';
      
      if (sender === 'bot') {
        // Check if text contains the marker
        if (text.includes('CONTACT_HERE')) {
          // Split at the marker
          const parts = text.split('CONTACT_HERE');
          const beforeText = parts[0].trim();
          const afterText = parts.slice(1).join('CONTACT_HERE').trim();
          
          // Add text before button
          textDiv.textContent = beforeText;
          
          // Add line breaks
          const br1 = document.createElement('br');
          const br2 = document.createElement('br');
          textDiv.appendChild(br1);
          textDiv.appendChild(br2);
          
          // Add button
          const button = document.createElement('a');
          button.className = 'contact-button';
          button.href = 'https://www.excaliburlegalsupport.com/contactus.html';
          button.target = '_blank';
          button.textContent = 'Contact Us';
          textDiv.appendChild(button);
          
          // Add text after button if there is any
          if (afterText) {
            const br3 = document.createElement('br');
            const br4 = document.createElement('br');
            textDiv.appendChild(br3);
            textDiv.appendChild(br4);
            textDiv.appendChild(document.createTextNode(afterText));
          }
        } else {
          // No button, just text
          textDiv.textContent = text;
        }
      } else {
        textDiv.textContent = text;
      }
      
      div.appendChild(textDiv);
      messagesDiv.appendChild(div);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    inputForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = messageInput.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      messageInput.value = '';
      sendButton.disabled = true;

      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'loading';
      loadingDiv.textContent = 'Thinking...';
      messagesDiv.appendChild(loadingDiv);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'user', content: text }] })
        });

        const data = await response.json();
        loadingDiv.remove();

        if (data.content && data.content[0]) {
          addMessage(data.content[0].text, 'bot');
        } else {
          addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
      } catch (error) {
        loadingDiv.remove();
        addMessage('Error connecting to server. Please try again.', 'bot');
      }

      sendButton.disabled = false;
    });
  </script>
</body>
</html>`);
});

// API ENDPOINT
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

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
        system: `You are EXCALIBUR Private Investigation's AI assistant. You help potential clients understand our investigation services.

IMPORTANT: Do not use markdown formatting like asterisks, bold text, or italics. Emojis are great and encouraged. Write in plain text with emojis but no asterisks.

RESPONSE STYLE:
Keep answers concise and conversational. Use clear, short sentences with one main idea each. Break up long thoughts into separate sentences. Be direct and friendly. Avoid run-on sentences. Aim for 3-5 sentences that provide helpful detail without being overwhelming.

WHEN DIRECTING TO CONTACT FORM:
Include the word CONTACT_HERE exactly where you want the button to appear.

EXCALIBUR SERVICES:
- Cheating Spouse/Infidelity Investigations
- Child Custody Investigations
- Surveillance Operations
- Suspicious Death Investigations
- Missing Person Investigations
- Domestic Violence Investigations
- Sexual Harassment, Sexual Abuse, and Title IX Violations
- Financial Fraud Investigations
- Background, Due Diligence, and Corporate Intelligence
- Social Media and Online Dating Investigations
- Layered Voice Analysis
- TSCM Bug Sweeps and Technical Surveillance Counter-Measures
- K-9 Drug Detection Services

COMPANY INFORMATION:
Principal: R. Lee Walters - Retired FBI Special Agent with 35+ years of investigation experience
Locations: Gainesville Florida, Columbia South Carolina, Colorado Springs Colorado, Santa Fe New Mexico
Licensed in: Florida (#A3500244 & #C3500400), South Carolina (#D4150), New Mexico (#PI-2024-1106)
Available nationwide and internationally

CONTACT INFORMATION - ALWAYS INCLUDE IN RELEVANT RESPONSES:
Florida: 352-509-8900
South Carolina: 803-806-7800
Colorado: 719-208-4088
New Mexico: 505-208-6400

IMPORTANT: When someone asks how to reach you, about getting started, scheduling a consultation, or for contact info, ALWAYS include:
1. The phone number(s) for the state(s) they mention or list all locations
2. A mention of the states you serve (Florida, South Carolina, Colorado, New Mexico)
3. Then offer the contact form with CONTACT_HERE

Example: "We operate in Florida, South Carolina, Colorado, and New Mexico. You can call us directly or fill out our contact form here: CONTACT_HERE"

Be professional, empathetic, and knowledgeable. Use emojis to make responses friendly and engaging.`,
        messages: messages
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EXCALIBUR Chat Server running on port ${PORT}`);
});
