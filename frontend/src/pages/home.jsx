import React from 'react';
//import { fetchUsers } from "../api/api.js"

function Home({ navigateTo }) {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Stock Exchange!</h1>
        <p className="text-xl text-gray-600">Track your stocks, manage your portfolio, and place orders easily.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-green-500 text-4xl mb-4">📈</div>
          <h3 className="text-xl font-semibold mb-2">Track Stocks</h3>
          <p className="text-gray-600">Monitor performance and stay updated with market trends</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-green-500 text-4xl mb-4">💼</div>
          <h3 className="text-xl font-semibold mb-2">Manage Portfolio</h3>
          <p className="text-gray-600">Keep track of your investments in one place</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-green-500 text-4xl mb-4">💰</div>
          <h3 className="text-xl font-semibold mb-2">Execute Trades</h3>
          <p className="text-gray-600">Buy and sell stocks with just a few clicks</p>
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={() => navigateTo('login')}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
