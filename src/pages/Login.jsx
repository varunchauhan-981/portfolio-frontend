import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login details');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-xl space-y-5">
        <h2 className="text-2xl font-bold text-white text-center">CMS Admin Login</h2>
        {error && <div className="text-red-400 text-sm text-center bg-red-950/40 p-2 rounded">{error}</div>}
        <div>
          <label className="text-slate-300 text-sm">Email</label>
          <input
            type="email"
            required
            className="w-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Password</label>
          <input
            type="password"
            required
            className="w-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium transition">
          Sign In
        </button>
      </form>
    </div>
  );
}