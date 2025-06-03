import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ChakraProvider, defaultSystem} from '@chakra-ui/react';
import { router } from './Router'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
        <RouterProvider router={router} />
    </ChakraProvider>    
  </StrictMode>,
)
