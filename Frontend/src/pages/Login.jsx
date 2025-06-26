import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router';
// import { toast } from 'react-toastify';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // const handleSubmit = (e) => {
    
  //   e.preventDefault();
  //   // Perform login logic here using mock user data
  //   const mockUser = {
  //     email: 'test@gmail.com',
  //     password: '12345678',
  //   };

  //   if (email === mockUser.email && password === mockUser.password) {
  //     console.log('Login successful');
  //     // toast.success('Login successful!');
  //   } else {
  //     console.error('Invalid email or password');
  //     // toast.error('Invalid email or password');
  //     return;
  //   }

  //   navigate('/home'); // Redirect to home page after login

  //   console.log('Login attempt:', { email, password });
  // };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // required if you're using cookies for authentication
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Login successful:', data);
      navigate('/home'); // redirect after success
    } else {
      console.error('❌ Login failed:', data.message || 'Invalid credentials');
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Forgot password?
            </a>
          </div>
          {/* <Link> */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </Button>
          {/* </Link> */}
        </form>

        <div className="text-center text-sm flex justify-between items-center">
          <div>
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </div>
          <button
            onClick={() => {
              setEmail('test@gmail.com');
              setPassword('12345678');
            }}
            className="font-medium text-purple-600 hover:text-blue-500 ml-4"
          >
            Demo User
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;