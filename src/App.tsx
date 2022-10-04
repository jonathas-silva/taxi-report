import './App.css'
import Menu from './pages/Menu'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Taxi from './pages/Taxi';
import {Route, Routes} from 'react-router-dom';
import {Box, ThemeProvider} from '@mui/material';
import {theme} from "./assets/Themes";
import Database from "./pages/Database";
import Escolar from "./pages/Escolar";


function App() {

    return (
        <ThemeProvider theme={theme}>
            <Box className="App" sx={{
                backgroundColor: 'background.paper'
            }}>
                <Routes>

                    <Route path='/' element={<Menu/>}/>
                    <Route path='/nova' element={<Taxi/>}/>
                    <Route path='/dashboard' element={<Database/>}/>
                </Routes>

            </Box>
        </ThemeProvider>
    )
}

export default App
