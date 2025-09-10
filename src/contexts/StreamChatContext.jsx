import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat as StreamChatProvider } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);


export const ChatProvider = ({ user, token, children }) => {
  const [chatClient, setChatClient] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!user || !token) return;
    const client = StreamChat.getInstance(import.meta.env.VITE_REACT_APP_STREAM_API_KEY);
    let didCancel = false;

    async function init() {
      const userDetails = {
        id: user.id || user.uid,
        name: user.name || user.displayName || user.email || 'User',
        image: user.image || user.photoURL || undefined,
      };

      await client.connectUser(userDetails, token);

      if (!didCancel) {
        setChatClient(client);
        setIsReady(true);
      }
    }

    init();

    return () => {
      didCancel = true;
      client.disconnectUser();
    };
  }, [user, token]);

  
  if (!isReady || !chatClient) {
    return <div style={{textAlign:'center',padding:'2rem'}}>Connecting to chat…</div>;
  }

  return (
    <ChatContext.Provider value={{ chatClient, isReady }}>
      <StreamChatProvider client={chatClient} theme="messaging light">
        {children}
      </StreamChatProvider>
    </ChatContext.Provider>
  );
};
