// Force Chakra UI dark mode for all users, regardless of system/browser theme
localStorage.setItem('chakra-ui-color-mode', 'dark');
// src/main.jsx or src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import App from './App';
import theme from './theme';
import store from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Provider>
  </>
);
