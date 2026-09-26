import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { Trash2 } from 'lucide-react';

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', technologies: '', githubUrl: '', liveUrl: '' });
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const res = await API.get('/projects');
    setProjects(res.data);
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      fetchProjects();
    }
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        technologies: form.technologies.split(',').map((t) => t.trim()),
      };
      await API.post('/projects', payload);
      setForm({ title: '', description: '', technologies: '', githubUrl: '', liveUrl: '' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this project?')) {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-bold">Admin CMS Dashboard</h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded text-sm font-medium">Logout</button>
        </div>

        <form onSubmit={handleAddProject} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <h2 className="text-lg font-semibold">Add New Project</h2>
          <input
            placeholder="Project Title"
            required
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            rows="3"
            required
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            placeholder="Technologies (comma-separated, e.g. React, Node.js)"
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
            value={form.technologies}
            onChange={(e) => setForm({ ...form, technologies: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="GitHub URL"
              className="p-2 bg-slate-800 border border-slate-700 rounded text-white"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            />
            <input
              placeholder="Live Demo URL"
              className="p-2 bg-slate-800 border border-slate-700 rounded text-white"
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            />
          </div>
          <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-medium">Create Project</button>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Manage Existing Projects</h2>
          {projects.map((p) => (
            <div key={p._id} className="flex justify-between items-center p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <div>
                <p className="font-semibold text-lg">{p.title}</p>
                <p className="text-sm text-slate-400">{p.technologies?.join(', ')}</p>
              </div>
              <button onClick={() => handleDelete(p._id)} className="text-rose-400 hover:text-rose-300 p-2">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}