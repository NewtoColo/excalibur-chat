const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ROOT ROUTE - This was missing!
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>EXCALIBUR Chat</title>
      <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    </head>
    <body style="margin:0;padding:0;font-family:sans-serif;background:#f5f5f5;">
      <div id="root" style="width:100%;height:100vh;display:flex;align-items:center;justify-content:center;">
        <div style="padding:40px;text-align:center;background:white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <h1 style="color:#003d7a;margin:0 0 10px 0;">EXCALIBUR</h1>
          <p style="color:#666;margin:0;">AI Chat Assistant Loading...</p>
        </div>
      </div>
      <script>
        const ExcaliburChatWidget = () => {
          const [messages, setMessages] = React.useState([
            {
              id: 1,
              text: "Hello! 👋 I'm EXCALIBUR's AI Assistant. I can help answer questions about our private investigation services.",
              sender: 'bot',
              timestamp: new Date()
            }
          ]);
          const [inputValue, setInputValue] = React.useState('');
          const [isLoading, setIsLoading] = React.useState(false);
          const messagesEndRef = React.useRef(null);

          const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          };

          React.useEffect(() => {
            scrollToBottom();
          }, [messages]);

          const handleSendMessage = async (e) => {
            e.preventDefault();
            if (!inputValue.trim()) return;

            const userMessage = {
              id: messages.length + 1,
              text: inputValue,
              sender: 'user',
              timestamp: new Date()
            };

            setMessages(prev => [...prev, userMessage]);
            setInputValue('');
            setIsLoading(true);

            try {
              const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  messages: messages
                    .filter(m => m.sender === 'user' || m.sender === 'bot')
                    .map(m => ({
                      role: m.sender === 'user' ? 'user' : 'assistant',
                      content: m.text
                    }))
                })
              });

              const data = await response.json();
              
              if (data.content && data.content[0]) {
                const botMessage = {
                  id: messages.length + 2,
                  text: data.content[0].text,
                  sender: 'bot',
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
              }
            } catch (error) {
              const errorMessage = {
                id: messages.length + 2,
                text: "I apologize for the technical difficulty. Call us directly: Florida: 352-509-8900",
                sender: 'bot',
                timestamp: new Date()
              };
              setMessages(prev => [...prev, errorMessage]);
            }

            setIsLoading(false);
          };

          return (
            <div style={{
              width: '100%',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#f5f5f5'
            }}>
              <div style={{
                backgroundColor: '#003d7a',
                color: 'white',
                padding: '16px',
                textAlign: 'center'
              }}>
                <h2 style={{margin: 0}}>EXCALIBUR Private Investigation</h2>
                <p style={{margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9}}>AI Assistant</p>
              </div>

              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {messages.map((message) => (
                  <div key={message.id} style={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{
                      maxWidth: '80%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: message.sender === 'user' ? '#003d7a' : '#e8e8e8',
                      color: message.sender === 'user' ? 'white' : '#333',
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && <div style={{padding: '12px'}}>⏳ Thinking...</div>}
                <div ref={messagesEndRef} />
              </div>

              <div style={{
                borderTop: '1px solid #ddd',
                padding: '12px',
                backgroundColor: 'white'
              }}>
                <form onSubmit={handleSendMessage} style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about our services..."
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: isLoading || !inputValue.trim() ? '#ccc' : '#003d7a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: isLoading || !inputValue.trim() ? 'default' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<ExcaliburChatWidget />);
      </script>
    </body>
    </html>
  `);
});

// API ENDPOINT
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

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
        system: `You are EXCALIBUR Private Investigation's AI assistant...`,
        messages: messages
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EXCALIBUR Chat Server running on port ${PORT}`);
});
