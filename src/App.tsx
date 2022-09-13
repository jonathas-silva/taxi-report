import './App.css'
import Inicio from './pages/Inicio'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Nova from './pages/Nova';
import { Route, Routes } from 'react-router-dom';
import {Box, ThemeProvider} from '@mui/material';
import {theme} from "./assets/Themes";


function App() {

  return (
    <ThemeProvider theme={theme}>
      <Box className="App" sx={{
        backgroundColor: 'background.paper'
      }}>
        <Routes>

          <Route path='/' element={ <Inicio/>} />
          <Route path='/nova' element={ <Nova/>} />

        </Routes>

      </Box>
    </ThemeProvider>
  )
}

export default App
