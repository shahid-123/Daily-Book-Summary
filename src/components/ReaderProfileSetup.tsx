import React, { useState } from 'react';
import { Globe2, MapPin, Target, UserRound, X } from 'lucide-react';
import { ReaderProfile } from '../types';
import { saveReaderProfile } from '../utils/communityApi';

interface Props {
  existingProfile?: ReaderProfile | null;
  onSaved: (profile: ReaderProfile) => void;
  onClose?: () => void;
  required?: boolean;
}

export const ReaderProfileSetup: React.FC<Props> = ({ existingProfile, onSaved, onClose, required = false }) => {
  const [name, setName] = useState(existingProfile?.displayName || '');
  const [country, setCountry] = useState(existingProfile?.country || 'India');
  const [state, setState] = useState(existingProfile?.state || '');
  const [goal, setGoal] = useState(String(existingProfile?.yearlyGoal || 100));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !country.trim() || !state.trim()) {
      setError('Please enter your name, country and state/region.');
      return;
    }
    setSaving(true); setError('');
    try {
      const profile = await saveReaderProfile({ displayName: name, country, state, yearlyGoal: Number(goal) || 100 });
      onSaved(profile);
    } catch {
      setError('Could not save your reader profile. Please try again.');
    } finally { setSaving(false); }
  };

  return (
    <div className={`${required ? 'fixed' : 'relative'} inset-0 z-[80] ${required ? 'bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4' : ''}`}>
      <div className="w-full max-w-xl rounded-3xl border border-amber-500/30 bg-slate-900 shadow-2xl shadow-black/50 overflow-hidden">
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border-b border-slate-800">
          {!required && onClose && <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>}
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mb-4"><UserRound className="w-6 h-6" /></div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif text-white">Create Your Reading Journey</h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">No password and no login required. Your reader profile lets BookPulse remember your books, goal and community identity on this device.</p>
        </div>

        <form onSubmit={submit} className="p-6 sm:p-8 space-y-5">
          <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-amber-400">Your name</span><div className="mt-2 relative"><UserRound className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" /><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Shahid" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-10 py-3 text-sm text-white outline-none focus:border-amber-500" /></div></label>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-amber-400">Country</span><div className="mt-2 relative"><Globe2 className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" /><select value={country} onChange={e=>setCountry(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-10 py-3 text-sm text-white outline-none focus:border-amber-500"><option>India</option><option>United States</option><option>United Kingdom</option><option>United Arab Emirates</option><option>Canada</option><option>Australia</option><option>Saudi Arabia</option><option>Singapore</option><option>Other</option></select></div></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-amber-400">State / Region</span><div className="mt-2 relative"><MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" /><input value={state} onChange={e=>setState(e.target.value)} placeholder="e.g. Telangana" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-10 py-3 text-sm text-white outline-none focus:border-amber-500" /></div></label>
          </div>
          <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-amber-400">Your yearly reading target</span><div className="mt-2 relative"><Target className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" /><input type="number" min="1" max="1000" value={goal} onChange={e=>setGoal(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-10 py-3 text-sm text-white outline-none focus:border-amber-500" /></div><p className="text-[11px] text-slate-500 mt-2">You can change this target later.</p></label>
          {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 px-3 py-2 text-xs">{error}</div>}
          <button disabled={saving} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3.5 font-black text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 disabled:opacity-60">{saving ? 'Saving your journey…' : 'Start My Reading Journey →'}</button>
        </form>
      </div>
    </div>
  );
};
