import React, { useState, useRef, useEffect } from 'react';

const ExcaliburChatWidget = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm EXCALIBUR's AI Assistant. I can help answer questions about our private investigation services, including infidelity investigations, surveillance, background checks, fraud investigations, and much more. What can I help you with today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [conversationId] = useState(`chat-${Date.now()}`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const serviceContext = `
EXCALIBUR Private Investigation Services Overview:

MAIN SERVICES:
1. Cheating Spouse/Infidelity Investigations - Discreet investigations to uncover evidence of infidelity
2. Child Custody Investigations - Gather evidence regarding child safety and welfare
3. Surveillance - Professional surveillance operations using unmarked vehicles and equipment
4. Suspicious Death Investigations - FBI-level death investigation expertise
5. Missing Person Investigations - Locate missing individuals using advanced techniques
6. Domestic Violence Investigations - Document abuse patterns and gather evidence
7. Sexual Harassment/Sexual Abuse/Title IX Violations - Investigate workplace and institutional misconduct
8. Financial Fraud Investigations - Trace stolen assets and identify fraud perpetrators
9. Background/Due Diligence/Corporate Intelligence - Comprehensive background checks and vetting
10. Social Media/Online Dating Investigations - Investigate catfishing and online deception
11. Layered Voice Analysis (Voice Stress Analysis) - Deception detection analysis
12. TSCM Bug Sweeps & Technical Surveillance Counter-Measures - Identify and neutralize eavesdropping devices
13. K-9 Drug Detection Services - K-9 teams for drug detection

COMPANY INFO:
- Principal: R. Lee Walters (Retired FBI Special Agent with 35+ years experience
- Locations: Gainesville FL, Columbia SC, Colorado Springs CO, Santa Fe NM
- Licensed in: Florida (#A3500244 & C3500400), South Carolina (#D4150), New Mexico (#PI-2024-1106)
- Services available in all 50 states and internationally
- Veteran-owned business
- 24/7 availability
- Free consultations available

CONTACT INFO:
- Florida: 352-509-8900
- South Carolina: 803-806-7800
- Colorado: 719-208-4088
- New Mexico: 505-208-6400
- Email: [protected]
- Video consultations via Google Meet available

KEY VALUES:
- FBI-level expertise and tradecraft
- Fully licensed, bonded, and insured
- AI-enhanced investigations with human verification
- Court-admissible evidence
- Complete client confidentiality
- Real-time case updates
- Direct investigator access

Always guide users toward scheduling a free consultation or calling directly for specific cases.
`;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
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
      // Call Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: `You are EXCALIBUR Private Investigation's AI assistant. You are knowledgeable about all of our investigation services and here to help potential clients understand what we offer. 

${serviceContext}

You should:
- Answer questions about our services in a professional, friendly manner
- Explain what each service involves
- Emphasize our FBI-level expertise and professional standards
- Guide people toward scheduling a free consultation
- Provide contact numbers and information when relevant
- Be empathetic to sensitive situations (infidelity, custody concerns, etc.)
- Never provide legal advice, but encourage consultation with our investigators
- Ask clarifying questions if someone's needs are unclear
- Mention that we serve multiple states and can handle nationwide cases`,
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
      } else if (data.error) {
        const errorMessage = {
          id: messages.length + 2,
          text: "I apologize, but I'm having trouble connecting. Please call us directly:\n\n📞 Florida: 352-509-8900\n📞 South Carolina: 803-806-7800\n📞 Colorado: 719-208-4088\n📞 New Mexico: 505-208-6400",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        text: "I apologize for the technical difficulty. Our team is here to help!\n\n📞 Florida: 352-509-8900\n📞 South Carolina: 803-806-7800\n📞 Colorado: 719-208-4088\n📞 New Mexico: 505-208-6400",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const closeChat = () => {
    window.parent.postMessage('closeChat', '*');
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#003d7a',
        color: 'white',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>EXCALIBUR Legal Support</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>AI Assistant - Usually replies instantly</p>
        </div>
        <button
          onClick={closeChat}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '18px',
            lineHeight: '1'
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '8px'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: message.sender === 'user' ? '#003d7a' : '#e8e8e8',
                color: message.sender === 'user' ? 'white' : '#333',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                fontSize: '14px',
                lineHeight: '1.4'
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '8px'
          }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: '#e8e8e8',
              color: '#333'
            }}>
              <span style={{
                display: 'inline-block',
                animation: 'pulse 1.4s infinite',
                fontSize: '12px'
              }}>
                ● ● ●
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
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
            placeholder="Ask about our investigation services..."
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
            onFocus={(e) => e.target.style.borderColor = '#003d7a'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
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
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
          >
            Send
          </button>
        </form>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 60%, 100% { opacity: 0.3; }
          30% { opacity: 1; }
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default ExcaliburChatWidget;
