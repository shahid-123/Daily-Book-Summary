import React, { useState } from 'react';
import { BookSummary } from '../types';
import {
  BookOpen,
  Search,
  HardDrive,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface Props {
  allBooks: BookSummary[];
  readBookIds: string[];
  favoriteBookIds: string[];
  offlineBookIds: string[];
  onSelectBook: (book: BookSummary) => void;
}

export const LibraryView: React.FC<Props> = ({
  allBooks,
  readBookIds,
  favoriteBookIds,
  offlineBookIds,
  onSelectBook,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'offline' | 'favorites' | 'read' | 'custom'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Mindset', 'Productivity', 'Resilience & Stoicism', 'Wealth & Mastery', 'Leadership', 'Habits', 'High Performance'];

  const filteredBooks = allBooks.filter((book) => {
    // Search query match
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.category.toLowerCase().includes(q) ||
      book.hook.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Filter tab
    if (filterTab === 'offline' && !offlineBookIds.includes(book.id)) return false;
    if (filterTab === 'favorites' && !favoriteBookIds.includes(book.id)) return false;
    if (filterTab === 'read' && !readBookIds.includes(book.id)) return false;
    if (filterTab === 'custom' && !book.isCustom) return false;

    // Category filter
    if (selectedCategory !== 'all' && book.category !== selectedCategory) return false;

    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
            Curated Library & Offline Vault
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Access {allBooks.length} master summaries anytime, anywhere—even without Wi-Fi.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, author, concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-inner"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {[
          { id: 'all', label: `All Books (${allBooks.length})` },
          { id: 'offline', label: `Offline Vault (${offlineBookIds.length})`, icon: HardDrive },
          { id: 'read', label: `Read (${readBookIds.length})`, icon: CheckCircle2 },
          { id: 'favorites', label: `Favorites (${favoriteBookIds.length})`, icon: BookmarkCheck },
          { id: 'custom', label: 'Custom Generated', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = filterTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 rounded-xl px-3 py-1 text-[11px] font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-200">No summaries found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or tab filter. You can also generate a custom summary of any book!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const isRead = readBookIds.includes(book.id);
            const isOffline = offlineBookIds.includes(book.id);
            const isFavorite = favoriteBookIds.includes(book.id);

            return (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="cursor-pointer group rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 p-6 shadow-xl text-slate-100 flex flex-col justify-between transition-all hover:border-amber-500/40 hover:shadow-amber-500/5 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Category and Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {book.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isOffline && (
                        <span
                          className="h-6 w-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center"
                          title="Available Offline"
                        >
                          <HardDrive className="w-3 h-3" />
                        </span>
                      )}
                      {isRead && (
                        <span
                          className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center"
                          title="Completed"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </span>
                      )}
                      {isFavorite && (
                        <span
                          className="h-6 w-6 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center"
                          title="Favorite"
                        >
                          <BookmarkCheck className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">by {book.author}</p>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed italic bg-slate-800/30 p-3 rounded-xl border border-slate-700/40">
                    "{book.hook}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>~{book.readTimeMinutes} min read</span>
                  <div className="flex items-center gap-1 font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>Read Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
