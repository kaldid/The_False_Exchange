import React from 'react';

function Header({ isLoggedIn, navigateTo, handleLogout }) {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h1 className="text-xl font-bold">StockEx</h1>
        </div>
        <nav className="flex items-center space-x-4">
          <button 
            onClick={() => navigateTo('home')}
            className="hover:text-green-300"
          >
            Home
          </button>
          {isLoggedIn ? (
            <>
              <button 
                onClick={() => navigateTo('portfolio')}
                className="hover:text-green-300"
              >
                Portfolio
              </button>
              <button 
                onClick={() => navigateTo('order')}
                className="hover:text-green-300"
              >
                Orders
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigateTo('login')}
              className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-white"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
