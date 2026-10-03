import React, { useEffect, useState } from 'react';
import { BookOpen, Flame, Globe2, MapPin, Pencil, Target, Trophy } from 'lucide-react';
import { ReaderBook, ReaderProfile } from '../types';
import { fetchReaderSummary } from '../utils/communityApi';
import { ReaderProfileSetup } from './ReaderProfileSetup';

interface Props { onSelectBook?: (bookId: string) => void; }

export const MyReadingView: React.FC<Props> = ({ onSelectBook }) => {
  const [profile, setProfile] = useState<ReaderProfile | null>(null);
  const [books, setBooks] = useState<ReaderBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await fetchReaderSummary();
    setProfile(data.profile); setBooks(data.books); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">Loading your reading journey…</div>;
  if (!profile || editing) return <ReaderProfileSetup existingProfile={profile} onSaved={(p)=>{setProfile(p);setEditing(false);load();}} onClose={profile ? ()=>setEditing(false) : undefined} required={!profile} />;

  const count = books.length;
  const goal = profile.yearlyGoal || 100;
  const pct = Math.min(100, Math.round((count / goal) * 100));
  const next = count < goal ? Math.min(goal, Math.max(1, Math.ceil((count + 1) / 5) * 5)) : goal;
  const remaining = Math.max(0, next - count);
  const streak = (() => {
    const days = new Set(books.map(b => new Date(b.readAt).toISOString().slice(0,10)));
    let d = new Date(); let n=0;
    while (days.has(d.toISOString().slice(0,10))) { n++; d.setDate(d.getDate()-1); }
    return n;
  })();

  return <div className="space-y-7 animate-in fade-in duration-300">
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-950 p-6 sm:p-9 shadow-2xl">
      <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3"><span className="text-xs font-bold uppercase tracking-widest text-amber-400">My Reading Journey</span><span className="text-slate-600">•</span><span className="text-xs text-slate-400 flex items-center gap-1"><Globe2 className="w-3.5 h-3.5" /> {profile.country}</span><span className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.state}</span></div>
          <div className="flex items-center gap-3"><h1 className="text-3xl sm:text-4xl font-black font-serif text-white">Welcome, {profile.displayName}!</h1><button onClick={()=>setEditing(true)} title="Edit profile" className="p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white"><Pencil className="w-4 h-4" /></button></div>
          <p className="text-slate-300 mt-2 max-w-2xl">Every completed summary is another idea added to your life. Keep your momentum going — one book at a time.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <Stat icon={<BookOpen className="w-4 h-4" />} value={count} label="Books read" />
            <Stat icon={<Target className="w-4 h-4" />} value={goal} label="Yearly target" />
            <Stat icon={<Flame className="w-4 h-4" />} value={streak} label="Day streak" />
            <Stat icon={<Trophy className="w-4 h-4" />} value={Math.max(0, goal-count)} label="Books to goal" />
          </div>
        </div>
        <div className="relative w-44 h-44 flex items-center justify-center"><svg className="w-44 h-44 -rotate-90"><defs><linearGradient id="profileGold"><stop stopColor="#f59e0b"/><stop offset="1" stopColor="#fbbf24"/></linearGradient></defs><circle cx="88" cy="88" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800"/><circle cx="88" cy="88" r="72" stroke="url(#profileGold)" strokeWidth="12" fill="transparent" strokeDasharray="452" strokeDashoffset={452-(452*pct)/100} strokeLinecap="round"/></svg><div className="absolute text-center"><div className="text-3xl font-black text-white">{pct}%</div><div className="text-[10px] uppercase tracking-widest text-amber-400">Complete</div></div>
      </div>
      </div>
    </div>

    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"><div><div className="text-xs uppercase tracking-widest font-bold text-emerald-400">Your next milestone</div><h2 className="text-xl sm:text-2xl font-black text-white mt-1">{remaining === 0 ? '🎉 Target reached!' : `${remaining} more ${remaining === 1 ? 'book' : 'books'} to reach ${next}`}</h2><p className="text-sm text-slate-300 mt-1">{remaining === 0 ? 'Set a new target and keep your reading journey growing.' : 'You are closer than you think. Pick your next summary and keep going!'}</p></div><button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-black text-slate-950">📖 Continue Reading</button></div>

    <div><div className="flex items-center justify-between mb-3"><div><h2 className="text-xl font-bold text-white font-serif">Books I've Read</h2><p className="text-xs text-slate-400">Your personal reading history</p></div></div>{books.length===0 ? <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">Your completed books will appear here. Finish your first summary to start your journey. 📚</div> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{books.map(b=><button key={b.bookId} onClick={()=>onSelectBook?.(b.bookId)} className="text-left rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-amber-500/40 transition-all"><div className="text-xs text-amber-400 font-bold uppercase">✓ Completed</div><h3 className="font-bold text-white mt-2">{b.title}</h3><p className="text-xs text-slate-400 mt-1">by {b.author}</p><p className="text-[11px] text-slate-500 mt-3">{new Date(b.readAt).toLocaleDateString()} • {b.category}</p></button>)}</div>}</div>
  </div>;
};

const Stat = ({icon,value,label}:{icon:React.ReactNode;value:number;label:string}) => <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"><div className="text-amber-400">{icon}</div><div className="text-xl font-black text-white mt-1">{value}</div><div className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</div></div>;
