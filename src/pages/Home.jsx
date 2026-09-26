import React, { useEffect, useState } from 'react';
import API from '../api';
import { ExternalLink, Code } from 'lucide-react';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/projects')
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Full Stack Developer</h1>
          <p className="text-slate-400 text-lg">
            Building robust web applications with Node.js, Express, MongoDB, and modern React.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-slate-800 pb-2">Projects</h2>
          {loading ? (
            <p className="text-slate-400">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-slate-500">No projects added yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((item) => (
                <div key={item._id} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-slate-400 text-sm mt-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.technologies?.map((tech, idx) => (
                        <span key={idx} className="text-xs bg-slate-800 text-indigo-400 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-slate-800/80">
                    {item.githubUrl && (
                      <a href={item.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-slate-300 hover:text-white">
                        <Code size={16} /> Code
                      </a>
                    )}
                    {item.liveUrl && (
                      <a href={item.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300">
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}