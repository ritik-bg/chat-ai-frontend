import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import AIFlowChat from './Components/chatArea'
import { Routes, BrowserRouter, Route } from "react-router"
import AllChats from './Pages/AllChats'
import { Toaster } from 'sonner'
import PreviewChat from './Pages/Preview'

function App() {
  const [count, setCount] = useState(0)
  const [selected, setSelected] = useState(null);

  return (
    <>
      <Toaster theme="dark" richColors position='top-right' />
    <div className='h-[100vh] w-[100vw]'>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<AllChats selected={selected} setSelected={setSelected} />} />
      <Route path='/create-chat' element={<AIFlowChat  />} />
      <Route path='/chat-preview' element={<PreviewChat selected={selected} setSelected={setSelected} />} />
    </Routes>
    </BrowserRouter>
    </div>
    </>
  )
}

export default App
