import React from 'react';
import { Adventure } from '../types';
import { sound } from '../utils/audio';
import { CharacterIcon } from './CharacterIcon';
import {
  Terminal,
  BookOpen,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Library,
  Layers,
  Compass
} from 'lucide-react';

interface TopBarProps {
  currentAdventure: Adventure;
  adventuresList: Adventure[];
  totalBooksCount: number;
  onSelectAdventure: (id: string) => void;
  currentPageNumber: number;
  totalPageCount: number;
  onOpenNotebook: () => void;
  onOpenLibrary: () => void;
  onOpenKazzIsolate: () => void;
  isKazzIsolateOpen?: boolean;
  masteredCount: number;
  onResetAdventure: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleTerminal: () => void;
  isTerminalCollapsed: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentAdventure,
  adventuresList,
  totalBooksCount,
  onSelectAdventure,
  currentPageNumber,
  totalPageCount,
  onOpenNotebook,
  onOpenLibrary,
  onOpenKazzIsolate,
  isKazzIsolateOpen = false,
  masteredCount,
  onResetAdventure,
  isMuted,
  onToggleMute,
  onToggleTerminal,
  isTerminalCollapsed
}) => {
  return (
    <header className="w-full bg-slate-900/90 border-b border-cyan-500/30 backdrop-blur-md px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg select-none">
      {/* Brand & Adventure Title */}
      <div className="flex items-center gap-3">
        {/* Cyber Crew Logo Mark */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 p-[1.5px] shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-300 font-mono font-black text-sm">
            &gt;_
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5">
              THE CYBER CREW <span className="text-cyan-400">//</span> LINUX ADVENTURES
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-400/40">
              BOOK {currentAdventure.bookNumber || 1} • EPISODE {currentAdventure.number}
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-400 truncate max-w-xs sm:max-w-md">
            {currentAdventure.title}
          </p>
        </div>
      </div>

      {/* Action Buttons: Windel's Library, Kazz's Isolate, Debbie's Notebook, Terminal, Audio */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* WINDEL'S LIBRARY BUTTON */}
        <button
          onClick={() => {
            sound.playNotebookSnap();
            onOpenLibrary();
          }}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 border-2 border-amber-400/60 text-xs font-mono font-black flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.25)] transform hover:scale-[1.02]"
          title="Open Windel's Library to view all books and check out 5 more"
        >
          <div className="w-4 h-4 shrink-0 flex items-center justify-center">
            <CharacterIcon characterId="windel" />
          </div>
          <span>WINDEL'S LIBRARY</span>
          <span className="px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black">
            {totalBooksCount} BOOKS
          </span>
        </button>

        {/* KAZZ'S ISOLATE BUTTON (WITH KASM LOGO & GLOW EFFECT) */}
        <button
          onClick={() => {
            sound.playContainerIsolate();
            onOpenKazzIsolate();
          }}
          className={`relative px-3.5 py-1.5 rounded-xl text-xs font-mono font-black flex items-center gap-2 transition-all cursor-pointer transform hover:scale-[1.03] ${
            isKazzIsolateOpen
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 border-2 border-sky-300 shadow-[0_0_25px_rgba(14,165,233,0.8),0_0_50px_rgba(249,115,22,0.4)] animate-pulse'
              : 'bg-gradient-to-r from-sky-500/20 via-blue-600/20 to-sky-500/20 hover:from-sky-500/35 hover:to-blue-600/35 text-sky-300 border-2 border-sky-400/80 shadow-[0_0_20px_rgba(14,165,233,0.35)]'
          }`}
          title="Open Kazz's Kasm VNC Isolated Workspace to safely test and memorize commands with AI"
        >
          <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
            <CharacterIcon characterId="kazz" />
          </div>
          <span className="relative tracking-wider">ISOLATE</span>
          <span className="relative px-1.5 py-0.2 rounded-md bg-sky-400 text-slate-950 text-[10px] font-black">
            KAZZ
          </span>
        </button>

        {/* Quick Adventure Dropdown */}
        <div className="relative">
          <select
            value={currentAdventure.id}
            onChange={e => onSelectAdventure(e.target.value)}
            className="appearance-none bg-slate-800/90 hover:bg-slate-700/90 text-cyan-200 text-xs font-mono font-semibold py-1.5 pl-3 pr-8 rounded-lg border border-cyan-500/40 outline-none cursor-pointer shadow-sm transition-all max-w-[200px] truncate"
          >
            {adventuresList.map(adv => (
              <option key={adv.id} value={adv.id} className="bg-slate-900 text-white">
                B{adv.bookNumber || 1}-E{adv.number}: {adv.title.replace('The Cyber Crew and the ', '')}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Debbie's Notebook button */}
        <button
          onClick={() => {
            sound.playNotebookSnap();
            onOpenNotebook();
          }}
          className="px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-400/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          title="Open Debbie's System Reliability Notebook"
        >
          <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
            <CharacterIcon characterId="debbie" />
          </div>
          <span className="hidden lg:inline">NOTEBOOK</span>
          <span className="w-4 h-4 rounded-full bg-pink-400 text-slate-950 text-[10px] flex items-center justify-center font-black">
            {masteredCount}
          </span>
        </button>

        {/* Collapsible Terminal Toggle */}
        <button
          onClick={onToggleTerminal}
          className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
            !isTerminalCollapsed
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-cyan-500/50'
          }`}
          title="Toggle Terminal [Ctrl+`]"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">TERMINAL</span>
        </button>

        {/* Sound Mute Toggle */}
        <button
          onClick={onToggleMute}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Reset Adventure */}
        <button
          onClick={onResetAdventure}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition-all cursor-pointer"
          title="Reset Current Episode"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
