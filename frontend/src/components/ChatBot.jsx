import React, { useState } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm MediBot. How can I help you with your health needs today?", isBot: true }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages([...messages, { text: userMsg, isBot: false }]);
    setInput('');

    // Mock bot response
    setTimeout(() => {
        let reply = "I'm not sure about that. Try asking about fever or cough!";
        if(userMsg.toLowerCase().includes('fever')) reply = "For fever, Paracetamol is commonly used. Please consult a doctor for dosage.";
        if(userMsg.toLowerCase().includes('cough')) reply = "Try our cough syrups for relief. If it persists, see a specialist.";
        
        setMessages(prev => [...prev, { text: reply, isBot: true }]);
    }, 1000);
  };

  return (
    <>
      <div className="chatbot-bubble" onClick={() => setIsOpen(!isOpen)}>
        <i className="fa fa-robot"></i>
      </div>

      <div className={`chatbot-window ${isOpen ? 'active' : ''}`}>
        <div className="chatbot-header">
          <div className="d-flex align-items-center gap-2">
            <span style={{fontSize: '1.2rem'}}>🤖</span>
            <div>
              <div style={{fontWeight: 700, fontSize: '0.9rem'}}>MediBot</div>
              <div style={{fontSize: '0.65rem', opacity: 0.8}}>Online | Health Assistant</div>
            </div>
          </div>
          <button className="chat-close-btn" style={{background: 'none', border: 'none', color: 'white'}} onClick={() => setIsOpen(false)}>✕</button>
        </div>
        
        <div className="chat-messages" style={{height: '300px', overflowY: 'auto', padding: '15px', background: '#f8fafc'}}>
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.isBot ? 'bot-msg' : 'user-msg'}`} style={{
                background: m.isBot ? 'white' : 'var(--green-600)',
                color: m.isBot ? 'var(--gray-700)' : 'white',
                padding: '10px 14px',
                borderRadius: '12px',
                marginBottom: '10px',
                fontSize: '0.85rem',
                alignSelf: m.isBot ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                boxShadow: m.isBot ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                marginLeft: m.isBot ? '0' : 'auto',
                marginRight: m.isBot ? 'auto' : '0'
            }}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="chat-input-area" style={{padding: '12px', background: 'white', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: '8px'}}>
          <input 
            type="text" 
            placeholder="Ask about health..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{flex: 1, border: '1.5px solid var(--gray-200)', borderRadius: '10px', padding: '8px 12px', outline: 'none', fontSize: '0.85rem'}}
          />
          <button className="btn-main" style={{padding: '0 12px', borderRadius: '10px', height: '36px', minWidth: 'auto', minHeight: 'auto'}} onClick={handleSend}>
            <i className="fa fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
