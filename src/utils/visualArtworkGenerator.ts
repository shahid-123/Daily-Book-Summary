import { BookCategory } from '../types';

interface DynamicArtResult {
  coverGradient: string;
  accentColor: string;
  contextImage: string;
}

export function generateDynamicBookArtwork(title: string, category: BookCategory = 'Mindset'): DynamicArtResult {
  const safeTitle = title.replace(/[<>&"]/g, '');
  const shortTitle = safeTitle.length > 24 ? safeTitle.slice(0, 22) + '...' : safeTitle;

  switch (category) {
    case 'Wealth & Mastery':
      return {
        coverGradient: 'from-emerald-700 via-teal-800 to-slate-950',
        accentColor: '#10b981',
        contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
          <defs>
            <linearGradient id="wealthGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#047857"/>
              <stop offset="100%" stop-color="#34d399"/>
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill="#042f2e"/>
          <path d="M 60 200 L 160 140 L 250 160 L 350 70" stroke="url(#wealthGrad)" stroke-width="4" fill="none" stroke-linecap="round"/>
          <circle cx="350" cy="70" r="16" fill="#fbbf24"/>
          <circle cx="250" cy="160" r="10" fill="#34d399"/>
          <circle cx="160" cy="140" r="8" fill="#10b981"/>
          <text x="50" y="60" fill="#a7f3d0" font-weight="bold" font-size="12" font-family="sans-serif">WEALTH &amp; MASTERY</text>
          <text x="50" y="85" fill="#fde68a" font-size="11" font-family="serif">"${shortTitle}"</text>
        </svg>`,
      };

    case 'Productivity':
      return {
        coverGradient: 'from-sky-700 via-blue-900 to-slate-950',
        accentColor: '#0ea5e9',
        contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
          <rect width="400" height="240" fill="#090d16"/>
          <circle cx="200" cy="120" r="70" stroke="#0ea5e9" stroke-width="2" stroke-dasharray="4 4" fill="#0369a1" fill-opacity="0.15"/>
          <circle cx="200" cy="120" r="35" fill="#38bdf8" fill-opacity="0.3"/>
          <circle cx="200" cy="120" r="12" fill="#ffffff"/>
          <line x1="200" y1="30" x2="200" y2="210" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
          <line x1="110" y1="120" x2="290" y2="120" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
          <text x="130" y="215" fill="#bae6fd" font-weight="bold" font-size="11" font-family="sans-serif">DEEP FOCUS &amp; RESULTS</text>
        </svg>`,
      };

    case 'Habits':
      return {
        coverGradient: 'from-orange-600 via-amber-700 to-slate-950',
        accentColor: '#f97316',
        contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
          <rect width="400" height="240" fill="#0f172a"/>
          <path d="M 50 190 Q 200 180 350 50" stroke="#f97316" stroke-width="5" fill="none" stroke-linecap="round"/>
          <circle cx="120" cy="184" r="6" fill="#ea580c"/>
          <circle cx="200" cy="172" r="8" fill="#f97316"/>
          <circle cx="280" cy="130" r="10" fill="#fb923c"/>
          <circle cx="350" cy="50" r="14" fill="#fde047"/>
          <text x="50" y="60" fill="#fdba74" font-weight="bold" font-size="12" font-family="sans-serif">COMPOUND HABIT GROWTH</text>
          <text x="50" y="85" fill="#fef08a" font-size="11" font-family="serif">"${shortTitle}"</text>
        </svg>`,
      };

    case 'Leadership':
      return {
        coverGradient: 'from-violet-700 via-indigo-900 to-slate-950',
        accentColor: '#8b5cf6',
        contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
          <rect width="400" height="240" fill="#0f0d1b"/>
          <circle cx="200" cy="120" r="75" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="6 6"/>
          <polygon points="200,60 215,100 255,100 220,125 235,165 200,140 165,165 180,125 145,100 185,100" fill="#c084fc"/>
          <text x="135" y="215" fill="#e9d5ff" font-weight="bold" font-size="11" font-family="sans-serif">INSPIRING LEADERSHIP</text>
        </svg>`,
      };

    case 'Resilience & Stoicism':
      return {
        coverGradient: 'from-stone-700 via-zinc-800 to-amber-950',
        accentColor: '#d97706',
        contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
          <rect width="400" height="240" fill="#1c1917"/>
          <rect x="180" y="60" width="40" height="130" fill="#d6d3d1" rx="4"/>
          <circle cx="200" cy="115" r="45" stroke="#f59e0b" stroke-width="3" stroke-dasharray="8 6"/>
          <text x="125" y="220" fill="#fef3c7" font-weight="bold" font-size="11" font-family="serif">INNER FORTRESS &amp; CALM</text>
        </svg>`,
      };

    case 'High Performance':
      return {
        coverGradient: 'from-red-800 via-rose-950 to-slate-950',
        accentColor: '#ef4444',
        contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
          <rect width="400" height="240" fill="#0a0a0a"/>
          <path d="M 200 40 L 290 80 C 290 160 200 210 200 210 C 200 210 110 160 110 80 Z" fill="#7f1d1d" stroke="#fca5a5" stroke-width="3"/>
          <circle cx="200" cy="115" r="25" fill="#ef4444"/>
          <text x="125" y="180" fill="#fef08a" font-weight="bold" font-size="12" font-family="sans-serif">UNBREAKABLE DRIVE</text>
        </svg>`,
      };

    case 'Mindset':
    default:
      return {
        coverGradient: 'from-amber-600 via-purple-700 to-slate-950',
        accentColor: '#f59e0b',
        contextImage: `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
          <rect width="400" height="240" fill="#0b0f19"/>
          <circle cx="200" cy="120" r="60" stroke="#f59e0b" stroke-width="3" fill="#1e1b4b"/>
          <polygon points="200,90 206,108 225,114 206,120 200,138 194,120 175,114 194,108" fill="#fef08a"/>
          <text x="135" y="175" fill="#cbd5e1" font-size="11" font-family="sans-serif">CLEAR &amp; EXPANDED MIND</text>
        </svg>`,
      };
  }
}
