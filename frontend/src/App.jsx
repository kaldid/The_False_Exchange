import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Portfolio from './pages/portfolio.jsx';
import Order from './pages/order.jsx';
import Explore from './pages/explore.jsx';
import Register from './pages/register.jsx';
import AmendCancelOrder from './pages/amendCancelOrder.jsx'
import PendingOrders from './pages/pendingOrders';

const backendURL = process.env.REACT_APP_BACKEND_URL

// Wrapper to pass navigate and login state to Header
function AppWrapper() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    // Login handler
    const handleLogin = (email) => {
        setIsLoggedIn(true);
        setUserEmail(email);
        navigate('/explore');
    };

    // Logout handler
    const handleLogout = async () => {
        try {
            const response = await fetch(`${backendURL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setIsLoggedIn(false);
                setUserEmail('');
                navigate('/', {replace: true});
            } else {
                console.error('Logout failed:', data.message);
            }
        } catch (error) {
            console.error('Error during logout:', error.message);
        }
    };

    const handleRegister = async (form) => {
        try {
            const response = await fetch(`${backendURL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password: form.password
                }),
            });
            const data = await response.json();
            if (data.success) {
                alert("Registration successful! Please log in.");
                navigate("/login");
            } else {
                alert(data.message || "Registration failed.");
            }
        } catch (error) {
            alert("Registration failed: " + error.message);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header
                isLoggedIn={isLoggedIn}
                navigateTo={navigate}
                handleLogout={handleLogout}
            />

            <main className="flex-grow container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Home navigateTo={navigate} />} />
                    <Route path="/login" element={<Login handleLogin={handleLogin} navigateTo={navigate} />} />
                    <Route path="/explore" element={isLoggedIn ? <Explore /> : <Navigate to="/home" replace />} />
                    <Route path="/portfolio" element={isLoggedIn ? <Portfolio navigateTo={navigate} /> : <Navigate to="/home" replace />} />
                    <Route path="/order" element={isLoggedIn ? <Order /> : <Navigate to="/home" replace />} />
                    <Route path="/register" element={<Register onRegister={handleRegister} navigateTo={navigate} />} />
                    <Route path="/amendOrder" element={isLoggedIn ? <AmendCancelOrder navigateTo={navigate} /> : <Navigate to="/home" replace />} />
                    <Route path="/" element={<Order />} />
                    <Route path="/pending-orders" element={<PendingOrders />} />
                    {/* Optional: catch-all route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppWrapper />
        </BrowserRouter>
    );
}

