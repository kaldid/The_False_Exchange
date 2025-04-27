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
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserEmail('');
        setCurrentPage('home');
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
            {currentPage === 'register' && <Register />}
        </main>

        {/* Footer */}
        <Footer />
        </div>
    );
}

export default App;
