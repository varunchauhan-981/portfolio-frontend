import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { 
  Trash2, Mail, Briefcase, Award, User, LogOut, 
  Image as ImageIcon, PlusCircle, LayoutDashboard, ExternalLink, FileText 
} from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('messages');
  const [profile, setProfile] = useState({ name: '', title: '', bio: '', avatar: '', resumeUrl: '', github: '', linkedin: '' });
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const [projectForm, setProjectForm] = useState({ 
    title: '', description: '', technologies: '', imageUrl: '', githubUrl: '', liveUrl: '' 
  });
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Frontend' });
  
  const [uploadingProjectImg, setUploadingProjectImg] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false); // <-- Resume upload state
  const [statusMsg, setStatusMsg] = useState('');
  
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [profRes, projRes, skillRes, msgRes] = await Promise.all([
        API.get('/profile').catch(() => ({ data: null })),
        API.get('/projects').catch(() => ({ data: [] })),
        API.get('/skills').catch(() => ({ data: [] })),
        API.get('/contact').catch(() => ({ data: [] }))
      ]);

      if (profRes.data) setProfile(prev => ({ ...prev, ...profRes.data }));
      if (projRes.data) setProjects(projRes.data);
      if (skillRes.data) setSkills(skillRes.data);
      if (msgRes.data) setMessages(msgRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [navigate]);

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file); // Multer expects 'image' key, works for PDFs too

    if (type === 'project') setUploadingProjectImg(true);
    if (type === 'avatar') setUploadingAvatar(true);
    if (type === 'resume') setUploadingResume(true);

    try {
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (type === 'project') {
        setProjectForm(prev => ({ ...prev, imageUrl: res.data.url }));
        setStatusMsg('Project thumbnail uploaded to Cloudinary!');
      } else if (type === 'avatar') {
        setProfile(prev => ({ ...prev, avatar: res.data.url }));
        setStatusMsg('Profile avatar uploaded to Cloudinary!');
      } else if (type === 'resume') {
        setProfile(prev => ({ ...prev, resumeUrl: res.data.url }));
        setStatusMsg('Resume PDF uploaded to Cloudinary!');
      }
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert('Failed to upload file to Cloudinary');
      console.error(err);
    } finally {
      if (type === 'project') setUploadingProjectImg(false);
      if (type === 'avatar') setUploadingAvatar(false);
      if (type === 'resume') setUploadingResume(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await API.put('/profile', profile);
      setStatusMsg('Profile Updated Successfully!');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...projectForm, 
        technologies: projectForm.technologies ? projectForm.technologies.split(',').map(t => t.trim()) : [] 
      };
      await API.post('/projects', payload);
      setProjectForm({ title: '', description: '', technologies: '', imageUrl: '', githubUrl: '', liveUrl: '' });
      fetchData();
      setStatusMsg('Project Added Successfully!');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert('Failed to create project');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      await API.post('/skills', skillForm);
      setSkillForm({ name: '', category: 'Frontend' });
      fetchData();
    } catch (err) {
      alert('Failed to add skill');
    }
  };

  const deleteItem = async (endpoint, id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        await API.delete(`/${endpoint}/${id}`);
        fetchData();
      } catch (err) {
        alert(`Failed to delete from ${endpoint}`);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">CMS Control Panel</h1>
              <p className="text-xs text-slate-400">Manage Portfolio & Inquiries</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3.5 py-2 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto w-full px-6 py-8 flex-1 space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {['messages', 'projects', 'skills', 'profile'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab === 'messages' && <Mail size={16} />}
              {tab === 'projects' && <Briefcase size={16} />}
              {tab === 'skills' && <Award size={16} />}
              {tab === 'profile' && <User size={16} />}
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </div>

        {statusMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm text-center font-medium">
            {statusMsg}
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="text-indigo-400" size={18} /> Inquiries Received
            </h2>
            {messages.length === 0 ? (
              <div className="p-10 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 text-sm">No messages yet.</div>
            ) : (
              <div className="grid gap-3">
                {messages.map(m => (
                  <div key={m._id} className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl relative flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pr-8">
                        <span className="font-semibold text-white text-base">{m.name}</span>
                        <span className="text-xs text-slate-500">{new Date(m.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="text-xs text-indigo-400">{m.email}</span>
                      <p className="mt-3 text-slate-300 text-sm whitespace-pre-wrap leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60">{m.message}</p>
                    </div>
                    <button onClick={() => deleteItem('contact', m._id)} className="absolute top-5 right-5 text-slate-500 hover:text-rose-400 transition cursor-pointer"><Trash2 size={17} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleAddProject} className="lg:col-span-1 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 h-fit">
              <h3 className="font-bold text-white flex items-center gap-2 text-base"><PlusCircle size={18} className="text-indigo-400" /> New Project</h3>
              <input required placeholder="Project Name" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
              
              <div>
                <label className="text-xs text-slate-400 uppercase font-semibold">Project Thumbnail</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], 'project')} className="w-full mt-1 text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-600/20 file:text-indigo-400 cursor-pointer" />
                {uploadingProjectImg && <span className="text-xs text-indigo-400">Uploading...</span>}
                {projectForm.imageUrl && <div className="mt-2 text-xs text-emerald-400 truncate border border-slate-800 p-2 rounded-xl">Image Uploaded Successfully</div>}
              </div>

              <input placeholder="Tech (React, Node.js)" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none" value={projectForm.technologies} onChange={e => setProjectForm({...projectForm, technologies: e.target.value})} />
              <input placeholder="GitHub URL" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none" value={projectForm.githubUrl} onChange={e => setProjectForm({...projectForm, githubUrl: e.target.value})} />
              <input placeholder="Live Link" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none" value={projectForm.liveUrl} onChange={e => setProjectForm({...projectForm, liveUrl: e.target.value})} />
              <textarea required rows="3" placeholder="Description" className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none resize-none" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm">Publish Project</button>
            </form>

            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-bold text-white text-base">Existing Projects</h3>
              {projects.map(p => (
                <div key={p._id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {p.imageUrl ? <img src={p.imageUrl} className="w-16 h-16 object-cover rounded-xl" /> : <div className="w-16 h-16 bg-slate-950 rounded-xl flex items-center justify-center"><ImageIcon size={24}/></div>}
                    <div>
                      <h4 className="font-bold text-white text-sm">{p.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{p.description}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteItem('projects', p._id)} className="text-slate-500 hover:text-rose-400 p-2"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <form onSubmit={handleAddSkill} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-3">
              <input required placeholder="Skill Name" className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none" value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} />
              <select className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none" value={skillForm.category} onChange={e => setSkillForm({...skillForm, category: e.target.value})}>
                <option>Frontend</option><option>Backend</option><option>Database</option><option>Tools</option>
              </select>
              <button type="submit" className="px-6 py-3 bg-indigo-600 rounded-xl text-sm font-semibold">Add Skill</button>
            </form>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {skills.map(s => (
                <div key={s._id} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div><div className="font-semibold text-white text-sm">{s.name}</div><div className="text-[10px] text-indigo-400 uppercase">{s.category}</div></div>
                  <button onClick={() => deleteItem('skills', s._id)} className="text-slate-500 hover:text-rose-400 p-1"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE TAB (AVATAR & RESUME) */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-slate-400 uppercase font-semibold">Your Name</label>
              <input className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase font-semibold">Title</label>
              <input className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} />
            </div>
            
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 uppercase font-semibold">Profile Photo / Avatar</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0], 'avatar')} className="w-full mt-1 text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-600/20 file:text-indigo-400 cursor-pointer" />
              {uploadingAvatar && <span className="text-xs text-indigo-400">Uploading Avatar...</span>}
              {profile.avatar && <div className="mt-2 text-xs text-emerald-400 border border-slate-800 p-2 rounded-xl truncate">Avatar Uploaded</div>}
            </div>

            {/* NEW: Resume Upload */}
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 uppercase font-semibold">Resume / CV (PDF/DOC)</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e.target.files[0], 'resume')} className="w-full mt-1 text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-rose-600/20 file:text-rose-400 cursor-pointer" />
              {uploadingResume && <span className="text-xs text-indigo-400">Uploading Resume...</span>}
              {profile.resumeUrl && (
                <div className="mt-2 flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <FileText size={18} className="text-emerald-400" />
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:underline truncate">View Current Resume</a>
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 uppercase font-semibold">Bio</label>
              <textarea rows="4" className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none resize-none" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase font-semibold">GitHub URL</label>
              <input className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none" value={profile.github} onChange={e => setProfile({...profile, github: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase font-semibold">LinkedIn URL</label>
              <input className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none" value={profile.linkedin} onChange={e => setProfile({...profile, linkedin: e.target.value})} />
            </div>
            <button type="submit" className="sm:col-span-2 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold text-sm">Save Profile Details</button>
          </form>
        )}
      </div>
    </div>
  );
}