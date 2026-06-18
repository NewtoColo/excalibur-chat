const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

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
    .message-text { max-width: 80%; padding: 12px 16px; border-radius: 12px; word-wrap: break-word; white-space: pre-wrap; font-size: 14px; line-height: 1.4; }
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

    function processMessage(text) {
      // Find the first occurrence of the contact form URL
      const urlIndex = text.indexOf('https://www.excaliburlegalsupport.com/contactus.html');
      
      if (urlIndex === -1) {
        return { cleanText: text, hasContactForm: false };
      }
      
      // Split text at the URL
      let cleanText = text.substring(0, urlIndex) + text.substring(urlIndex + 'https://www.excaliburlegalsupport.com/contactus.html'.length);
      cleanText = cleanText.trim();
      
      return { cleanText, hasContactForm: true };
    }

    function addMessage(text, sender) {
      const div = document.createElement('div');
      div.className = \`message \${sender}\`;
      const textDiv = document.createElement('div');
      textDiv.className = 'message-text';
      
      if (sender === 'bot') {
        const { cleanText, hasContactForm } = processMessage(text);
        
        // Create text content
        const textContent = document.createTextNode(cleanText);
        textDiv.appendChild(textContent);
        
        // Add Contact Us button INSIDE the message if URL was in response
        if (hasContactForm) {
          const lineBreak = document.createElement('br');
          const lineBreak2 = document.createElement('br');
          textDiv.appendChild(lineBreak);
          textDiv.appendChild(lineBreak2);
          
          const button = document.createElement('a');
          button.className = 'contact-button';
          button.href = 'https://www.excaliburlegalsupport.com/contactus.html';
          button.target = '_blank';
          button.textContent = 'Contact Us';
          textDiv.appendChild(button);
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

WHEN TO DIRECT TO CONTACT FORM - CRITICAL:
When someone asks about scheduling a consultation, getting more info, discussing their case, or how to get started:
1. Immediately mention the contact form in your response
2. Put the URL right after mentioning it (do not wait until the end)
3. Do not add any additional text after the URL

EXAMPLE - CORRECT FORMAT:
"Yes, absolutely! You can reach us by filling out our contact form right here: https://www.excaliburlegalsupport.com/contactus.html"

NOT like this - WRONG:
"You can reach us by filling out our contact form: https://www.excaliburlegalsupport.com/contactus.html. One of our team members will get back to you..."

Keep your response SHORT when including the contact form URL.

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

CONTACT INFORMATION:
Florida: 352-509-8900
South Carolina: 803-806-7800
Colorado: 719-208-4088
New Mexico: 505-208-6400

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
