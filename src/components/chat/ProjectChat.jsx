import React, { useEffect, useState, useRef } from 'react';
import { FaPaperclip } from 'react-icons/fa';
import { useChat } from '../../contexts/ChatContext';

const emojiList = ['👍', '❤️', '😂', '🎉', '😮', '😢', '😡'];

function ProjectChat({ projectName }) {
  const { user, selectedGroup, getGroupMessages, sendMessage, addReaction, uploadFile } = useChat();
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef();
  const userId = user?.uid || 'me';
  const userName = user?.displayName || user?.email || 'Me';
  const userAvatar = user?.photoURL || '/profile.png';

  const handleSend = async (e) => {
    e.preventDefault();
    console.log('Sending message:', { text, file });
    
    setSendError(null);
    if (!selectedGroup) return;
    if (!text && !file) return;
    setSending(true);
    try {
      if (file) {
        await uploadFile(selectedGroup.id, file, text);
      } else {
        await sendMessage(selectedGroup.id, { text });
      }
      setText('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setSendError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleReaction = (msgId, emoji) => {
    if (!selectedGroup) return;
    addReaction(selectedGroup.id, msgId, emoji);
  };

  const messages = selectedGroup ? getGroupMessages(selectedGroup.id) : [];
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      {/* Only keep the new flex-aligned group heading and Join Video Call button */}
     
      <div style={{ flex: 1, minHeight: 0, maxHeight: 600, overflowY: 'scroll', padding: 0, background: 'transparent', display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', alignItems: 'flex-end', width: '100%', marginBottom: 8 }}>
            {msg.userId !== userId && (
              <img src={msg.userAvatar || '/profile.png'} alt={msg.userName} style={{ width: 36, height: 36, borderRadius: '50%', marginRight: 10, border: '2px solid #232B3E', background: '#232B3E' }} />
            )}
            <div style={{ background: '#181F2A', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px #10162433', color: '#fff', border: msg.userId === userId ? '1.5px solid #3182ce' : '1.5px solid #232B3E', width: '100%' }}>
              <div style={{ fontWeight: 600, marginBottom: 4, color: '#4FD1C5', fontSize: 15 }}>{msg.userName}</div>
              {msg.text && <div style={{ marginBottom: 6, fontSize: 16 }}>{msg.text}</div>}
              {msg.file && (
                <div style={{ marginBottom: 6 }}>
                  {msg.file.url ? (
                    <a href={msg.file.url} target="_blank" rel="noopener noreferrer" style={{ color: '#90cdf4', textDecoration: 'underline', fontWeight: 500 }}>{msg.file.name}</a>
                  ) : (
                    <a
                      href={`data:${msg.file.type};base64,${msg.file.base64}`}
                      download={msg.file.name}
                      style={{ color: '#90cdf4', textDecoration: 'underline', fontWeight: 500 }}
                    >
                      {msg.file.name}
                    </a>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                {emojiList.map((emoji) => (
                  <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#fff', opacity: 0.85, transition: 'opacity 0.2s', padding: 0 }}>
                    {emoji} {msg.reactions?.[emoji]?.length > 0 ? <span style={{ fontSize: 13, color: '#4FD1C5', marginLeft: 2 }}>{msg.reactions[emoji].length}</span> : ''}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 6, textAlign: 'right' }}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            {msg.userId === userId && (
              <img src={msg.userAvatar || '/profile.png'} alt={msg.userName} style={{ width: 36, height: 36, borderRadius: '50%', marginLeft: 10, border: '2px solid #232B3E', background: '#232B3E' }} />
            )}
          </div>
        ))}
      </div>
  {sendError && <div style={{ color: 'red', marginBottom: 8 }}>{sendError}</div>}
  <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', padding: '18px 16px', borderTop: '1.5px solid #232B3E', background: '#181F2A', borderRadius: 14, gap: 10, boxShadow: '0 -2px 8px #10162422', border: '1.5px solid #232B3E', margin: '0 0 8px 0', width: '100%' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '12px 14px', borderRadius: 8, border: 'none', fontSize: 16, background: '#232B3E', color: '#fff', marginRight: 8, outline: 'none', boxShadow: '0 1px 2px #10162422' }}
        />
        <label htmlFor="chat-file-upload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#232B3E', borderRadius: 8, width: 44, height: 44, cursor: 'pointer', marginRight: 8, border: 'none', boxShadow: '0 1px 2px #10162422' }}>
          <FaPaperclip size={20} color="#90cdf4" />
          <input id="chat-file-upload" type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
        </label>
        <button type="submit" style={{ flex: 0.5, minWidth: 80, padding: '10px 0', borderRadius: 8, background: sending ? '#90cdf4' : '#3182ce', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #3182ce22', cursor: sending ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }} disabled={sending}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default ProjectChat;


