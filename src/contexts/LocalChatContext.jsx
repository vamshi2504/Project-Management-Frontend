import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const sendMessage = (msg) => {
    setMessages((prev) => [...prev, { ...msg, id: Date.now() }]);
  };

  const addReaction = (messageId, emoji, userId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: {
                ...msg.reactions,
                [emoji]: [...(msg.reactions?.[emoji] || []), userId],
              },
            }
          : msg
      )
    );
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, addReaction }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
