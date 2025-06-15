import React from 'react'
import { Routes, Route } from 'react-router-dom'

import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import LeftSideBar from './components/LeftSideBar'
import Footer from './components/Footer'
import Login from './pages/login'
import Register from './pages/Register'
import ActiveDiscussion from './pages/ActiveDiscussion'
import FutureEvents from './pages/FutureEvents'
import ProfilePage from './pages/ProfilePage'
import DiscussionPage from './pages/DiscussionPage'

// added for the language
import { LanguageProvider } from './context/LanguageContext'


const App = () => {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/active" element={<ActiveDiscussion />} />
        <Route path="/upcoming" element={<FutureEvents />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/discuss" element={<DiscussionPage/>}/>
      </Routes>
      
    </LanguageProvider>
  )
}

export default App
