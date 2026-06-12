import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Tab, Tabs, TextField } from "@mui/material";
import { BASE_URL } from './constants';
import { UserContext } from './App';
import LOGIN_IMAGE_URL from './Logo.png';
import "./Login.css";

const SESSION_KEY = 'crimeAtlasSession';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

const FEATURES = [
    { icon: '📍', title: '1M+ Records', desc: 'Full LAPD crime dataset from 2020 to present' },
    { icon: '🗺️', title: 'Geospatial Search', desc: 'Find crimes within any radius on the map' },
    { icon: '💬', title: 'Community Notes', desc: 'Annotate locations with Street View context' },
];

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTabChange = (e, newValue) => {
        setCurrentTabIndex(newValue);
        setError("");
    };

    const handleLoginOnClick = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) throw new Error('Invalid email or password');
            const data = await response.json();
            localStorage.setItem(SESSION_KEY, JSON.stringify({
                token: data.token,
                user: data.user,
                expiresAt: Date.now() + SESSION_DURATION_MS
            }));
            setUser(data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || "Failed to log in.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterOnClick = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phoneNumber, password })
            });
            if (!response.ok) throw new Error('Failed to register');
            setCurrentTabIndex(0);
            setError("");
        } catch (err) {
            setError(err.message || "Failed to register.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            currentTabIndex === 0 ? handleLoginOnClick() : handleRegisterOnClick();
        }
    };

    return (
        <div className="container">
            {/* ── Left panel ── */}
            <div className="subContainer">
                <div className="brand">
                    <img src={LOGIN_IMAGE_URL} alt="CrimeAtlas" className="image" />
                    <div className="title-2">CrimeAtlas</div>
                </div>

                <p className="tagline">Explore LAPD crime data across Los Angeles</p>

                <div className="features">
                    {FEATURES.map(f => (
                        <div className="feature-item" key={f.title}>
                            <div className="feature-icon">{f.icon}</div>
                            <div className="feature-text">
                                <strong>{f.title}</strong>
                                <span>{f.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right panel ── */}
            <div className="tabContainer">
                <div className="login-card" onKeyDown={handleKeyDown}>
                    <h2>{currentTabIndex === 0 ? 'Welcome back' : 'Create account'}</h2>
                    <p className="subtitle">
                        {currentTabIndex === 0
                            ? 'Sign in to your CrimeAtlas account'
                            : 'Join CrimeAtlas to explore crime data'}
                    </p>

                    <Tabs value={currentTabIndex} onChange={handleTabChange}>
                        <Tab label="Sign In" />
                        <Tab label="Register" />
                    </Tabs>

                    {currentTabIndex === 0 && (
                        <>
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                label="Password"
                                variant="outlined"
                                fullWidth
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button variant="contained" fullWidth onClick={handleLoginOnClick} disabled={loading}>
                                {loading ? <CircularProgress size={22} style={{ color: '#fff' }} /> : 'Sign In'}
                            </Button>
                        </>
                    )}

                    {currentTabIndex === 1 && (
                        <>
                            <TextField
                                label="Full Name"
                                variant="outlined"
                                fullWidth
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                label="Phone Number"
                                variant="outlined"
                                fullWidth
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <TextField
                                label="Password"
                                variant="outlined"
                                fullWidth
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button variant="contained" fullWidth onClick={handleRegisterOnClick} disabled={loading}>
                                {loading ? <CircularProgress size={22} style={{ color: '#fff' }} /> : 'Create Account'}
                            </Button>
                        </>
                    )}

                    {error && (
                        <div style={{ color: '#d93025', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
