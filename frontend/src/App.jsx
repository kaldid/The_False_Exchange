import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Portfolio from './pages/portfolio.jsx';
import Order from './pages/order.jsx';
import Explore from './pages/explore.jsx';
import Register from './pages/register.jsx';
import AmendCancelOrder from './pages/amendCancelOrder.jsx';
import PendingOrders from './pages/pendingOrders.jsx';

// ProtectedRoute component
function ProtectedRoute({ isLoggedIn, loading, children }) {
    if (loading) {
        return <div className="text-center mt-10 text-gray-600">Loading...</div>;
    }
    return isLoggedIn ? children : <Navigate to="/" replace />;
}

function AppWrapper() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    console.log("AppWrapper mounted");

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:8000/verifyToken", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                // console.log(response.ok);
                if (response.ok && data.success) {
                    setIsLoggedIn(true);
                    setUserEmail(data.email || "");
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error verifying login:", error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogin = (email) => {
        setIsLoggedIn(true);
        setUserEmail(email);
        navigate('/explore');
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8000/logout', {
                method: 'POST',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setIsLoggedIn(false);
                setUserEmail('');
                navigate('/', { replace: true });
            } else {
                console.error('Logout failed:', data.message);
            }
        } catch (error) {
            console.error('Error during logout:', error.message);
        }
    };

    const handleRegister = async (form) => {
        try {
            const response = await fetch("http://localhost:8000/register", {
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
            {!loading && (
            <Header
                isLoggedIn={isLoggedIn}
                navigateTo={navigate}
                handleLogout={handleLogout}
            />
        )}

            <main className="flex-grow container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Home navigateTo={navigate} />} />
                    <Route path="/login" element={<Login handleLogin={handleLogin} navigateTo={navigate} />} />
                    <Route path="/register" element={<Register onRegister={handleRegister} navigateTo={navigate} />} />

                    <Route path="/explore" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
                            <Explore />
                        </ProtectedRoute>
                    } />

                    <Route path="/portfolio" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
                            <Portfolio navigateTo={navigate} />
                        </ProtectedRoute>
                    } />

                    <Route path="/order" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
                            <Order />
                        </ProtectedRoute>
                    } />

                    <Route path="/amendOrder" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
                            <AmendCancelOrder navigateTo={navigate} />
                        </ProtectedRoute>
                    } />

                    <Route path="/pending-orders" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
                            <PendingOrders />
                        </ProtectedRoute>
                    } />

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
