import React, { useEffect, useState } from 'react';
import API from '../api';
import { 
  ExternalLink, 
  Code2, 
  Sparkles, 
  FolderGit2, 
  Send, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

export default function Home() {
  const [profile, setProfile] = useState({
    name: 'Varun Chauhan',
    title: 'Full Stack MERN Developer',
    bio: 'Passionate software engineer crafting resilient web architectures, modern reactive interfaces, and scalable backend microservices.',
    avatar: '',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  });

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [profRes, projRes, skillRes] = await Promise.all([
          API.get('/profile').catch(() => null),
          API.get('/projects').catch(() => null),
          API.get('/skills').catch(() => null)
        ]);

        if (profRes && profRes.data) {
          setProfile(prev => ({ ...prev, ...profRes.data }));
        }
        if (projRes && Array.isArray(projRes.data)) {
          setProjects(projRes.data);
        }
        if (skillRes && Array.isArray(skillRes.data)) {
          setSkills(skillRes.data);
        }
      } catch (err) {
        console.error('Data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSendingMessage(true);
    try {
      await API.post('/contact', contactForm);
      setSentSuccess(true);
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setSentSuccess(false), 5000);
    } catch (err) {
      alert('Failed to send message. Please verify backend server.');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-blue-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-[800px] -left-40 w-[500px] h-[500px] bg-indigo-900/10 blur-[130px] pointer-events-none rounded-full" />

      {/* TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#060913]/70 border-b border-slate-800/60 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 text-white font-extrabold tracking-tight text-lg group">
            <span className="p-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30 group-hover:scale-105 transition">
              <Terminal size={18} />
            </span>
            <span>{profile.name?.split(' ')[0] || 'Dev'}<span className="text-indigo-400">.io</span></span>
          </a>

          <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
            <a href="#skills" className="hover:text-white transition">Skills</a>
            <a href="#projects" className="hover:text-white transition">Projects</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
            
            {/* GitHub SVG Icon */}
            {profile.github && (
              <a 
                href={profile.github} 
                target="_blank" 
                rel="noreferrer" 
                className="text-slate-400 hover:text-white transition"
                title="GitHub"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
            )}

            {/* LinkedIn SVG Icon */}
            {profile.linkedin && (
              <a 
                href={profile.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                className="text-slate-400 hover:text-white transition"
                title="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-6 shadow-inner">
          <Sparkles size={14} className="animate-pulse" /> Available for Opportunities
        </div>

        {profile.avatar && (
          <div className="mx-auto mb-6 w-28 h-28 rounded-full ring-4 ring-indigo-500/20 p-1 bg-gradient-to-tr from-indigo-500 to-purple-600">
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-full" />
          </div>
        )}

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Hi, I'm <span className="bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">{profile.name}</span>
        </h1>
        
        <p className="mt-4 text-xl sm:text-2xl font-medium text-indigo-400 max-w-2xl mx-auto">
          {profile.title}
        </p>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {profile.bio}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            Explore Projects <ArrowUpRight size={17} />
          </a>
          <a
            href="#contact"
            className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition cursor-pointer active:scale-95"
          >
            Get In Touch
          </a>
        </div>
      </header>

      {/* SKILLS SECTION */}
      <section id="skills" className="max-w-5xl mx-auto px-6 py-16 relative z-10 border-t border-slate-900">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="text-indigo-400" size={20} />
          <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Expertise</h2>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8">Technologies & Frameworks</h3>

        {skills.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JavaScript (ES6+)', 'REST APIs', 'Git & GitHub'].map((item) => (
              <div key={item} className="p-3.5 bg-slate-900/40 border border-slate-800/80 rounded-xl text-center text-sm font-medium text-slate-300">
                {item}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {skills.map((skill) => (
              <div 
                key={skill._id}
                className="group p-4 bg-slate-900/40 hover:bg-slate-800/40 border border-slate-800 hover:border-indigo-500/40 rounded-xl transition duration-200 flex flex-col justify-between"
              >
                <span className="font-semibold text-white text-sm group-hover:text-indigo-300 transition">{skill.name}</span>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-mono mt-2">{skill.category || 'Technology'}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="max-w-5xl mx-auto px-6 py-20 relative z-10 border-t border-slate-900">
        <div className="flex items-center gap-2 mb-2">
          <FolderGit2 className="text-indigo-400" size={20} />
          <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Portfolio</h2>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-10">Selected Works</h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800" />
            <div className="h-64 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800" />
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-400">No projects added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj) => (
              <div
                key={proj._id}
                className="group bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg shadow-black/20"
              >
                <div>
                  {proj.imageUrl ? (
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-b border-slate-800">
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-slate-950/60 border-b border-slate-800 flex items-center justify-center text-slate-700">
                      <Code2 size={40} />
                    </div>
                  )}

                  <div className="p-6">
                    <h4 className="text-xl font-bold text-white group-hover:text-indigo-300 transition">
                      {proj.title}
                    </h4>
                    <p className="mt-2 text-slate-400 text-sm leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {proj.technologies?.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-950 border border-slate-800 text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center gap-4">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                      Live Demo <ExternalLink size={13} />
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200"
                    >
                      Source Code 
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="max-w-3xl mx-auto px-6 py-20 relative z-10 border-t border-slate-900">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 mb-3 border border-indigo-500/20">
            <Send size={22} />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Get In Touch</h3>
          <p className="mt-2 text-slate-400 text-sm">
            Have an open role, project inquiry, or just want to connect? Send a note directly.
          </p>
        </div>

        {sentSuccess ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="mx-auto text-emerald-400" size={32} />
            <h4 className="font-bold text-white">Message Dispatched!</h4>
            <p className="text-xs text-slate-300">Thank you for reaching out. I'll get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4 bg-slate-900/50 p-6 sm:p-8 rounded-2xl border border-slate-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Your Name</label>
                <input
                  required
                  placeholder="e.g. John Doe"
                  className="w-full mt-1.5 p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-indigo-500 transition"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Your Email</label>
                <input
                  required
                  type="email"
                  placeholder="e.g. recruiter@company.com"
                  className="w-full mt-1.5 p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-indigo-500 transition"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Message</label>
              <textarea
                required
                rows="4"
                placeholder="Hi, I saw your portfolio and would like to talk about..."
                className="w-full mt-1.5 p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-indigo-500 transition resize-none"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={sendingMessage}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              {sendingMessage ? 'Transmitting...' : 'Send Message'} <Send size={16} />
            </button>
          </form>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}