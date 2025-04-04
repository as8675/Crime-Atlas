import React, { createContext, useState } from 'react';
import './App.css';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';

export const UserContext = createContext();

function App() {
const [user, setUser] = useState(null); // Store logged-in user

  return (
    <UserContext.Provider value={{ user, setUser }}>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
    </UserContext.Provider>
  );
}

export default App;
