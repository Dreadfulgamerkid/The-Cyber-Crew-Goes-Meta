import React, { useState } from 'react';
import { Book, Adventure } from '../types';
import { CharacterIcon } from './CharacterIcon';
import { sound } from '../utils/audio';
import {
  Library,
  BookOpen,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Play,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Compass,
  Award,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface WindelsLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  currentAdventureId: string;
  onSelectAdventure: (adventureId: string) => void;
  onCheckoutMoreBooks: () => Promise<void>;
  isGenerating: boolean;
  completedEpisodeIds: string[];
}

export const WindelsLibrary: React.FC<WindelsLibraryProps> = ({
  isOpen,
  onClose,
  books,
  currentAdventureId,
  onSelectAdventure,
  onCheckoutMoreBooks,
  isGenerating,
  completedEpisodeIds
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'completed' | 'unplayed'>('all');
  const [collapsedBookIds, setCollapsedBookIds] = useState<string[]>([]);

  if (!isOpen) return null;

  // Total episodes count
  const totalEpisodes = books.reduce((acc, b) => acc + b.episodes.length, 0);
  const completedCount = completedEpisodeIds.length;
  const completionPercent = Math.min(100, Math.round((completedCount / (totalEpisodes || 1)) * 100));

  const toggleBookCollapse = (bookId: string) => {
    sound.playNotebookSnap();
    setCollapsedBookIds(prev =>
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  const collapseAll = () => {
    setCollapsedBookIds(books.map(b => b.id));
  };

  const expandAll = () => {
    setCollapsedBookIds([]);
  };

  // Filter books based on search and status
  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.themeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.episodes.some(ep =>
        ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.environmentName.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (filterMode === 'completed') {
      return book.episodes.every(ep => completedEpisodeIds.includes(ep.id));
    }
    if (filterMode === 'unplayed') {
      return book.episodes.some(ep => !completedEpisodeIds.includes(ep.id));
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 lg:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[92vh] bg-slate-900 border-2 border-cyan-400/50 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden">
        {/* Header Bar (fixed height, shrink-0) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-500/30 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            {/* Windel Avatar: Paperclip with Eyeballs */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-500/30 via-yellow-500/20 to-slate-900 border-2 border-amber-400 p-2 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <CharacterIcon characterId="windel" className="w-full h-full object-contain" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-black font-mono tracking-tight text-white flex items-center gap-2">
                  WINDEL'S LINUX LIBRARY
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-400/40">
                  4 - 7 EPISODES / BOOK
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5 hidden sm:block">
                "Infinite cyber adventures cataloged! Complete all 81 Linux command missions across the system!"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                sound.playNotebookSnap();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer border border-slate-700 hover:border-cyan-400/50"
              title="Close Library"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Library Card Stats & Big Action Checkout Banner (shrink-0) */}
        <div className="p-3 sm:p-4 bg-slate-950/80 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Stats Badges */}
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Total Books</div>
                <div className="text-xs sm:text-sm font-mono font-black text-cyan-300">{books.length} Books</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Total Episodes</div>
                <div className="text-xs sm:text-sm font-mono font-black text-emerald-300">{totalEpisodes} Episodes</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Completed</div>
                <div className="text-xs sm:text-sm font-mono font-black text-amber-300">
                  {completedCount} / {totalEpisodes} ({completionPercent}%)
                </div>
              </div>
            </div>
          </div>

          {/* CHECK OUT 5 MORE BOOKS BUTTON */}
          <button
            onClick={onCheckoutMoreBooks}
            disabled={isGenerating}
            className={`py-2 px-4 sm:py-2.5 sm:px-5 rounded-2xl font-mono text-xs sm:text-sm font-black flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all cursor-pointer ${
              isGenerating
                ? 'bg-amber-600/50 text-amber-200 cursor-wait'
                : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 transform hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-950" />
                <span>CATALOGING 5 NEW BOOKS (20 EPISODES)...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>📚 CHECK OUT 5 MORE BOOKS</span>
                <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  +20 Episodes
                </span>
              </>
            )}
          </button>
        </div>

        {/* Filter and Search Bar (shrink-0) */}
        <div className="px-4 py-2.5 bg-slate-900/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search books, settings, or blueprints..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 font-sans outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs font-mono">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterMode === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All ({books.length})
              </button>
              <button
                onClick={() => setFilterMode('unplayed')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterMode === 'unplayed'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Unplayed
              </button>
              <button
                onClick={() => setFilterMode('completed')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterMode === 'completed'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Completed
              </button>
            </div>

            <div className="border-l border-slate-700 pl-2 flex items-center gap-1 text-xs font-mono">
              <button
                onClick={expandAll}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1"
                title="Expand All Books"
              >
                <Maximize2 className="w-3 h-3 text-cyan-400" />
                <span className="hidden sm:inline">Expand All</span>
              </button>
              <button
                onClick={collapseAll}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1"
                title="Collapse All Books"
              >
                <Minimize2 className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Collapse All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Bookshelf Body (CRITICAL: flex-1 min-h-0 overflow-y-auto ensures smooth independent scrolling) */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 bg-[#030712]/90">
          {filteredBooks.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <BookOpen className="w-12 h-12 text-slate-600 mb-3" />
              <p className="font-mono text-sm text-slate-300">No books found matching "{searchQuery}"</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterMode('all');
                }}
                className="mt-3 px-4 py-1.5 rounded-lg bg-slate-800 text-cyan-300 hover:bg-slate-700 text-xs font-mono"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Inner Grid with explicit gap-6, items-start, and content-start so books never compress or smoosh */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start content-start pb-12">
              {filteredBooks.map(book => {
                const isCollapsed = collapsedBookIds.includes(book.id);
                const completedEpisodesInBook = book.episodes.filter(ep => completedEpisodeIds.includes(ep.id)).length;
                const bookDone = completedEpisodesInBook === book.episodes.length;

                return (
                  <div
                    key={book.id}
                    className={`rounded-2xl border-2 transition-all flex flex-col bg-slate-900/95 overflow-hidden shadow-xl shrink-0 min-h-fit ${
                      bookDone
                        ? 'border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
                        : 'border-slate-800 hover:border-cyan-400/60 shadow-[0_0_20px_rgba(0,0,0,0.5)]'
                    }`}
                  >
                    {/* Book Header / Hardcover Spine */}
                    <div
                      className={`p-4 sm:p-5 bg-gradient-to-r ${book.coverGradient} border-b border-white/10 flex items-start justify-between gap-3 shrink-0 select-none min-h-[82px]`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950/70 border border-white/20 flex items-center justify-center text-2xl shadow-inner shrink-0">
                          {book.badgeIcon}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                              BOOK #{book.number}
                            </span>
                            {bookDone && (
                              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> COMPLETED
                              </span>
                            )}
                          </div>
                          <h3 className="font-mono text-sm sm:text-base font-black text-white leading-tight mt-0.5">
                            {book.title}
                          </h3>
                          <p className="text-xs text-slate-300 font-sans mt-0.5 line-clamp-1">
                            {book.themeName}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleBookCollapse(book.id)}
                        className="p-2 rounded-xl bg-slate-950/50 hover:bg-slate-950/80 text-white transition-all cursor-pointer shrink-0 border border-white/10 hover:border-cyan-400/40"
                        title={isCollapsed ? 'Expand Episodes' : 'Collapse Episodes'}
                      >
                        {isCollapsed ? <ChevronDown className="w-4 h-4 text-cyan-300" /> : <ChevronUp className="w-4 h-4 text-cyan-300" />}
                      </button>
                    </div>

                    {/* Book Description & Reading Progress */}
                    <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-3 shrink-0">
                      <p className="line-clamp-1 italic text-slate-400 text-[11px]">{book.description}</p>
                      <div className="font-mono font-bold text-cyan-400 text-[11px] shrink-0">
                        {completedEpisodesInBook}/4 Completed
                      </div>
                    </div>

                    {/* 4 Episodes List */}
                    {!isCollapsed ? (
                      <div className="p-3 sm:p-4 space-y-2.5 bg-slate-950/30">
                        {book.episodes.map(ep => {
                          const isCompleted = completedEpisodeIds.includes(ep.id);
                          const isCurrent = ep.id === currentAdventureId;

                          return (
                            <div
                              key={ep.id}
                              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 shrink-0 ${
                                isCurrent
                                  ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                                  : isCompleted
                                  ? 'bg-slate-950/70 border-emerald-500/40'
                                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                                    isCompleted
                                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                                      : isCurrent
                                      ? 'bg-cyan-400 text-slate-950 shadow-sm'
                                      : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `E${ep.number}`}
                                </div>

                                <div className="min-w-0">
                                  <h4 className="font-mono text-xs font-bold text-white truncate flex items-center gap-1.5">
                                    {ep.title}
                                    {isCurrent && (
                                      <span className="text-[9px] font-sans px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950 font-black shrink-0">
                                        NOW PLAYING
                                      </span>
                                    )}
                                  </h4>
                                  <p className="text-[11px] text-slate-400 font-sans truncate">
                                    {ep.subtitle} • <span className="font-mono text-amber-400">[{ep.badge}]</span>
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  sound.playSuccess();
                                  onSelectAdventure(ep.id);
                                  onClose();
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                                  isCurrent
                                    ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                                    : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-slate-700'
                                }`}
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>{isCurrent ? 'RESUME' : 'PLAY'}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Collapsed view summary */
                      <div
                        onClick={() => toggleBookCollapse(book.id)}
                        className="px-4 py-3 bg-slate-950/20 text-xs font-mono text-slate-400 hover:text-cyan-300 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span>{book.episodes.length} Episodes inside this book</span>
                        <span className="text-[11px] text-cyan-400 font-bold flex items-center gap-1">
                          Click to view episodes <ChevronDown className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer (shrink-0) */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shrink-0">
          <div className="text-slate-400">
            Windel's Library • 4 - 7 Episodes per book • 81 Complete Linux Commands
          </div>
          <button
            onClick={() => {
              sound.playNotebookSnap();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer border border-slate-700"
          >
            CLOSE LIBRARY
          </button>
        </div>
      </div>
    </div>
  );
};
