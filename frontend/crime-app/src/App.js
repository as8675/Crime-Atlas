import React, { createContext, useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';

export const UserContext = createContext();

const SESSION_KEY = 'crimeAtlasSession';

function getStoredSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const session = JSON.parse(raw);
        if (Date.now() > session.expiresAt) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }
        return session.user;
    } catch {
        localStorage.removeItem(SESSION_KEY);
        return null;
    }
}

function ProtectedRoute({ user, children }) {
    if (!user) return <Navigate to="/" replace />;
    return children;
}

function App() {
    const [user, setUser] = useState(null);
    const [sessionChecked, setSessionChecked] = useState(false);

    useEffect(() => {
        const storedUser = getStoredSession();
        if (storedUser) setUser(storedUser);
        setSessionChecked(true);
    }, []);

    if (!sessionChecked) return null;

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute user={user}>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </UserContext.Provider>
    );
}

export default App;
