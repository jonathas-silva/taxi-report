import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Inicio from './pages/Inicio'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Nova from './pages/Nova';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">

        <Inicio/>

    </div>
  )
}

export default App
