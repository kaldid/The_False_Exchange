import React, { useState } from 'react';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Portfolio from './pages/portfolio.jsx';
import Order from './pages/order.jsx';
import Explore from './pages/explore.jsx'
import Register from './pages/register.jsx'

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    // Navigation function
    const navigateTo = (page) => {
        setCurrentPage(page);
    };

    // Login handler
    const handleLogin = (email) => {
        setIsLoggedIn(true);
        setUserEmail(email);
        setCurrentPage('explore');
    };

    // Logout handler
    const handleLogout = async (request,response) => {
        try {
            const response = await fetch('http://localhost:8000/logout', {
                method: 'POST',
                credentials: 'include', // important to send cookies
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setIsLoggedIn(false);
                setUserEmail('');
                setCurrentPage('home');
            } else {
                console.error('Logout failed:', data.message);
            }
        } catch (error) {
            console.error('Error during logout:', error.message);
        }
    };
    

    const handleRegister = async (form) => { 
        try {
            const response = await fetch("http://localhost:8000/register", { // Change URL to your backend
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
                navigateTo("login");
            } else {
                alert(data.message || "Registration failed.");
            }
        } catch (error) {
            alert("Registration failed: " + error.message);
        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <Header 
            isLoggedIn={isLoggedIn} 
            navigateTo={navigateTo} 
            handleLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-grow container mx-auto p-4">
            {currentPage === 'home' && <Home navigateTo={navigateTo} />}
            {currentPage === 'login' && <Login handleLogin={handleLogin} navigateTo={navigateTo} />}
            {currentPage === 'explore' && isLoggedIn && <Explore />}
            {currentPage === 'portfolio' && isLoggedIn && <Portfolio navigateTo={navigateTo} />}
            {currentPage === 'order' && isLoggedIn && <Order />}
            {currentPage === 'register' && <Register onRegister={handleRegister} navigateTo={navigateTo} />}
        </main>

        {/* Footer */}
        <Footer />
        </div>
    );
}

export default App;
