import React, { useState } from 'react';

function Login({ handleLogin, navigateTo }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("")

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
  
      const data = await response.json(); // Only call once!
  
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login Failed");
      }
  
      handleLogin(data.email || username);
      navigateTo("explore");
  
    } catch (error) {
      setError(error.message);
    }
  };
  

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">username</label>
          <input
            id="username"
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="your username"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="********"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
        >
          Login
        </button>
        <p className="text-center text-gray-600 mt-4 text-sm">
            Don't have an account?{" "}
            <button
                className="text-green-600 hover:underline font-medium"
                onClick={() => navigateTo && navigateTo("register")}
            >
                Register
            </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
