import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import AIFlowChat from './Components/chatArea'
import { Routes, BrowserRouter, Route } from "react-router"
import AllChats from './Pages/AllChats'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='h-[100vh] w-[100vw]'>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<AllChats />} />
      <Route path='/create-chat' element={<AIFlowChat />} />
    </Routes>
    </BrowserRouter>
    </div>
    </>
  )
}

export default App
