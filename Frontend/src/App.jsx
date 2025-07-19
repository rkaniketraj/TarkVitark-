// import React from 'react'
// import { Routes, Route } from 'react-router-dom'

// import HomePage from './pages/HomePage'
// import Navbar from './components/Navbar'
// import Landing from './pages/Landing'
// import LeftSideBar from './components/LeftSideBar'
// import Footer from './components/Footer'
// import Login from './pages/login'
// import Register from './pages/Register'
// import ActiveDiscussion from './pages/ActiveDiscussion'
// import FutureEvents from './pages/FutureEvents'
// import ProfilePage from './pages/ProfilePage'
// import DiscussionPage from './pages/DiscussionPage'

// // added for the language
// import { LanguageProvider } from './context/LanguageContext'


// const App = () => {
//   return (
//     <LanguageProvider>
//       <Routes>
//         <Route path="/" element={<Landing />} />
//         <Route path="/home" element={<HomePage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/active/:debateId" element={<ActiveDiscussion />} />
//         <Route path="/upcoming" element={<FutureEvents />} />
//         <Route path="/profile" element={<ProfilePage />} />
//         <Route path="/discuss" element={<DiscussionPage/>}/>
//       </Routes>
      
//     </LanguageProvider>
//   )
// }

// export default App



import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import Landing from './pages/Landing';
import Login from './pages/login';
import Register from './pages/Register';
import ActiveDiscussion from './pages/ActiveDiscussion';
import FutureEvents from './pages/FutureEvents';
import ProfilePage from './pages/ProfilePage';
import DiscussionPage from './pages/DiscussionPage';

import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/active/:debateId" element={<PrivateRoute><ActiveDiscussion /></PrivateRoute>} />
          <Route path="/upcoming" element={<PrivateRoute><FutureEvents /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/discuss" element={<PrivateRoute><DiscussionPage /></PrivateRoute>} />
        </Routes>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;

