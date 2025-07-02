// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',        // or 'light'
  useSystemColorMode: false,       // set to true to follow system settings
};

const theme = extendTheme({ config });

export default theme;
