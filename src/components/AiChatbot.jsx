import { useState, useRef, useEffect } from 'react';
import { useAcademy } from '../context/DataContext.jsx';
import './AiChatbot.css';

export default function AiChatbot() {
  const { data } = useAcademy();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello! 👋 I'm your IT Academy Assistant. How can I help you explore courses, learning paths, or resources today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function generateAnswer(query) {
    const q = query.toLowerCase();
    const courses = data.courses || [];
    const paths = data.paths || [];
    const resources = data.resources || [];

    if (q.includes('course') || q.includes('catalog') || q.includes('class') || q.includes('train')) {
      const titles = courses.map((c) => `• ${c.title} (${c.category} - ${c.duration})`).join('\n');
      return `Here are the top available courses in the catalog:\n\n${titles}\n\nClick on "Catalog" in the navigation bar to see full details and modules!`;
    }

    if (q.includes('path') || q.includes('track') || q.includes('onboard') || q.includes('hire')) {
      const pathList = paths.map((p) => `• ${p.title}: ${p.effort}`).join('\n');
      return `We offer structured learning paths:\n\n${pathList}\n\nCheck out the "Paths" tab to follow your role-based progression!`;
    }

    if (q.includes('team') || q.includes('expert') || q.includes('who') || q.includes('trainer') || q.includes('instructor')) {
      const members = (data.team?.members || []).map((m) => `• ${m.name} (${m.role})`).join('\n');
      return `Meet our dedicated IT & Reliability team:\n\n${members}`;
    }

    if (q.includes('resource') || q.includes('sop') || q.includes('guide') || q.includes('template')) {
      const resList = resources.map((r) => `• ${r.name} (${r.type})`).join('\n');
      return `Available downloadable guides & templates:\n\n${resList}`;
    }

    if (q.includes('admin') || q.includes('login') || q.includes('edit') || q.includes('theme') || q.includes('custom')) {
      return `Admins can customize themes, page layout, department logos, and team members by clicking on "Admin Portal" or "Student Portal" in the top header (Default Password: academy-admin).`;
    }

    return `The ${data.site?.name || 'SharePoint Academy'} is designed for enterprise governance, reliability engineering, and technical development. Feel free to ask me about courses, paths, team leads, or resource downloads!`;
  }

  function handleSend(textToSend) {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = generateAnswer(text);
      setMessages((prev) => [...prev, { sender: 'bot', text: answer }]);
      setIsTyping(false);
    }, 600);
  }

  return (
    <div className="ai-chatbot-wrapper">
      {/* Floating Action Button */}
      <button
        className={`ai-chatbot-trigger ${open ? 'active' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle AI Assistant Chat"
        title="AI Assistant Chat"
      >
        {open ? (
          <span className="close-icon">✕</span>
        ) : (
          <span className="bot-icon">
            🤖 <span className="ai-pulse-dot"></span>
          </span>
        )}
      </button>

      {/* Chat Window Popup */}
      {open && (
        <div className="ai-chatbot-window glass-card animate-chat-slide">
          <div className="ai-chat-header">
            <div className="ai-chat-title">
              <span className="bot-avatar">🤖</span>
              <div>
                <h4>IT Academy AI Assistant</h4>
                <span className="online-status">⚡ Active &amp; Ready</span>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="ai-chat-body">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-bubble-row ${m.sender}`}>
                <div className="chat-bubble">
                  {m.text.split('\n').map((line, i) => (
                    <p key={i} style={{ margin: i > 0 ? '0.25rem 0 0' : 0 }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-row bot">
                <div className="chat-bubble typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="ai-chat-suggestions">
            <button onClick={() => handleSend('Show available courses')}>📚 Courses</button>
            <button onClick={() => handleSend('Show learning paths')}>🎓 Paths</button>
            <button onClick={() => handleSend('Who is in the team?')}>👥 Experts</button>
          </div>

          <form
            className="ai-chat-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="send-btn" disabled={!input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
