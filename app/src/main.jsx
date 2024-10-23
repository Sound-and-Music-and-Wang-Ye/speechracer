import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import App from './App.jsx'

const theme = extendTheme({
  initialColorMode: "dark",
  useSystemColorMode: false,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  </StrictMode>
)
