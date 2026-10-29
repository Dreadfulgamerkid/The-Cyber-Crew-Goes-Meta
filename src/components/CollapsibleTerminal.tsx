import React, { useState, useRef, useEffect } from 'react';
import { TerminalEntry, StoryPage } from '../types';
import { VirtualFileSystem } from '../utils/vfs';
import { sound } from '../utils/audio';
import { CharacterIcon } from './CharacterIcon';
import {
  Terminal as TerminalIcon,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Trash2,
  Sparkles,
  HelpCircle,
  Copy,
  FolderPlus,
  ArrowRight,
  Eye
} from 'lucide-react';

interface CollapsibleTerminalProps {
  vfs: VirtualFileSystem;
  currentPage: StoryPage;
  onCommandSuccess: (cmd: string, vfs: VirtualFileSystem) => void;
  onCommandExecuted?: (cmd: string, success: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const CollapsibleTerminal: React.FC<CollapsibleTerminalProps> = ({
  vfs,
  currentPage,
  onCommandSuccess,
  onCommandExecuted,
  isCollapsed,
  setIsCollapsed
}) => {
  const [entries, setEntries] = useState<TerminalEntry[]>([
    {
      id: 'init-1',
      type: 'system',
      content: 'Cyber Crew OS v6.12 (Glacier-Kernel)\nReady for adventure commands. Type "help" for a manual of commands.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (!isCollapsed) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries, isCollapsed]);

  // Focus input when opened
  useEffect(() => {
    if (!isCollapsed) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isCollapsed]);

  // Global hotkey: Ctrl + ~ or Ctrl + ` to toggle collapsible terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.key === '~')) {
        e.preventDefault();
        setIsCollapsed(!isCollapsed);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCollapsed, setIsCollapsed]);

  const handleRunCommand = (cmdToRun: string) => {
    const trimmed = cmdToRun.trim();
    if (!trimmed) return;

    sound.playKey();

    const cwdDisplay = vfs.getCwdDisplay();
    const newEntry: TerminalEntry = {
      id: Math.random().toString(),
      type: 'input',
      cwd: cwdDisplay,
      command: trimmed,
      content: trimmed,
      timestamp: new Date().toLocaleTimeString()
    };

    // Execute via VFS
    const res = vfs.executeCommand(trimmed);

    if (res.success && onCommandExecuted) {
      onCommandExecuted(trimmed, true);
    }

    let outputEntry: TerminalEntry | null = null;
    if (res.output === '__CLEAR__') {
      setEntries([]);
      setInputVal('');
      setHistoryIndex(null);
      return;
    } else if (res.output) {
      outputEntry = {
        id: Math.random().toString(),
        type: res.success ? 'output' : 'error',
        content: res.output,
        timestamp: new Date().toLocaleTimeString()
      };
    }

    setEntries(prev => [...prev, newEntry, ...(outputEntry ? [outputEntry] : [])]);
    setInputVal('');
    setHistoryIndex(null);

    // Check if matches the current adventure's required target command
    evaluateAdventureProgress(trimmed);
  };

  const evaluateAdventureProgress = (cmd: string) => {
    const normalized = cmd.trim().replace(/\s+/g, ' ');

    // Cheer check
    if (currentPage.isCheerPage && (normalized === 'sudo cheer' || normalized === 'cheer' || normalized === 'sudo')) {
      onCommandSuccess(normalized, vfs);
      return;
    }

    // Exact or regex match
    if (currentPage.targetCommand) {
      const targetNormalized = currentPage.targetCommand.trim().replace(/\s+/g, ' ');
      if (normalized === targetNormalized) {
        onCommandSuccess(normalized, vfs);
        return;
      }
    }

    // Alternate valid commands
    if (currentPage.alternateValidCommands) {
      const match = currentPage.alternateValidCommands.some(alt => {
        const altNorm = alt.trim().replace(/\s+/g, ' ');
        return normalized === altNorm;
      });
      if (match) {
        onCommandSuccess(normalized, vfs);
        return;
      }
    }

    // Flexible command checks (e.g. cp with source and dest)
    if (currentPage.commandMastered === 'cp' && normalized.startsWith('cp ')) {
      const parts = normalized.split(/\s+/);
      if (parts.length >= 3) {
        onCommandSuccess(normalized, vfs);
        return;
      }
    }

    if (currentPage.commandMastered === 'ls' && (normalized === 'ls' || normalized.startsWith('ls '))) {
      onCommandSuccess(normalized, vfs);
      return;
    }

    if (currentPage.pageNumber === 5 && (normalized.startsWith('mkdir') || normalized.startsWith('mv'))) {
      onCommandSuccess(normalized, vfs);
      return;
    }

    if (currentPage.commandMastered === 'grep' && normalized.startsWith('grep') && normalized.includes('CRITICAL')) {
      onCommandSuccess(normalized, vfs);
      return;
    }

    if (currentPage.commandMastered === 'cd' && (normalized === 'cd /telemetry' || normalized === 'cd telemetry')) {
      onCommandSuccess(normalized, vfs);
      return;
    }

    if (currentPage.commandMastered === 'chmod' && normalized.includes('chmod') && normalized.includes('emergency_drain.sh')) {
      onCommandSuccess(normalized, vfs);
      return;
    }

    if (normalized === './emergency_drain.sh' || normalized === 'bash emergency_drain.sh') {
      onCommandSuccess(normalized, vfs);
      return;
    }

    if (currentPage.commandMastered === 'ps' && normalized.startsWith('ps')) {
      onCommandSuccess(normalized, vfs);
      return;
    }

    if (currentPage.commandMastered === 'kill' && (normalized.includes('kill 404') || normalized.includes('killall rogue_bot'))) {
      onCommandSuccess(normalized, vfs);
      return;
    }

    // General matching rule for all 81 Linux commands
    if (currentPage.commandMastered) {
      const target = currentPage.commandMastered.toLowerCase();
      const firstWord = normalized.replace(/^sudo\s+/, '').split(/\s+/)[0].toLowerCase();
      if (firstWord === target) {
        onCommandSuccess(normalized, vfs);
        return;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const history = vfs.getHistory();
      if (history.length === 0) return;
      const nextIdx = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const history = vfs.getHistory();
      if (history.length === 0 || historyIndex === null) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(null);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const tokens = inputVal.split(/\s+/);
      const lastToken = tokens[tokens.length - 1] || '';
      const completions = vfs.getCompletions(lastToken);
      if (completions.length === 1) {
        tokens[tokens.length - 1] = completions[0];
        setInputVal(tokens.join(' '));
        sound.playKey();
      } else if (completions.length > 1) {
        setEntries(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            type: 'system',
            content: completions.join('  '),
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }
    }
  };

  const vaultDir = currentPage.visualState.vaultName || 'vault';
  const hasVault = !!(
    vfs.getNodeByPath(`/${vaultDir}`) ||
    vfs.getNodeByPath('/frost_vault') ||
    vfs.getNodeByPath('/archive_vault')
  );
  const activeTargetCommand = currentPage.pageNumber === 5
    ? (!hasVault ? `mkdir /${vaultDir}` : (currentPage.alternateValidCommands?.find(c => c.startsWith('mv')) || `mv ${currentPage.visualState.capsules[0]?.filename?.replace('.cad', '_backup.cad') || 'backup.cad'} /${vaultDir}/`))
    : currentPage.targetCommand;

  const promptStr = `kali@glacier-kernel:${vfs.getCwdDisplay()}$`;

  // Quick Action Buttons based on page
  const renderQuickChips = () => {
    const chips: Array<{ label: string; cmd: string; icon: React.ReactNode }> = [];

    if (activeTargetCommand) {
      chips.push({
        label: `Auto-type: ${activeTargetCommand}`,
        cmd: activeTargetCommand,
        icon: <Sparkles className="w-3 h-3 text-cyan-300" />
      });
    }

    // Always include useful tools
    chips.push({ label: 'ls', cmd: 'ls', icon: <Eye className="w-3 h-3 text-emerald-400" /> });
    chips.push({ label: 'pwd', cmd: 'pwd', icon: <ArrowRight className="w-3 h-3 text-sky-400" /> });

    if (currentPage.pageNumber === 3 && activeTargetCommand) {
      chips.push({
        label: activeTargetCommand,
        cmd: activeTargetCommand,
        icon: <Copy className="w-3 h-3 text-amber-300" />
      });
    } else if (currentPage.pageNumber === 5) {
      if (!hasVault) {
        chips.push({
          label: `mkdir /${vaultDir}`,
          cmd: `mkdir /${vaultDir}`,
          icon: <FolderPlus className="w-3 h-3 text-cyan-300" />
        });
      }
      const mvCmd = currentPage.alternateValidCommands?.find(c => c.startsWith('mv')) || `mv ${currentPage.visualState.capsules[0]?.filename?.replace('.cad', '_backup.cad') || 'backup.cad'} /${vaultDir}/`;
      chips.push({
        label: mvCmd,
        cmd: mvCmd,
        icon: <ArrowRight className="w-3 h-3 text-emerald-300" />
      });
    }

    return (
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-3 border-t border-slate-800 bg-slate-950/70 text-xs select-none">
        <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">Suggestions:</span>
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputVal(chip.cmd);
              inputRef.current?.focus();
            }}
            onDoubleClick={() => handleRunCommand(chip.cmd)}
            className="px-2 py-0.5 rounded-md bg-slate-800/90 hover:bg-slate-700 text-cyan-200 border border-slate-700/80 hover:border-cyan-500/50 text-[11px] font-mono flex items-center gap-1 transition-all shrink-0 cursor-pointer"
            title="Click to insert, double click to run"
          >
            {chip.icon}
            <span>{chip.label}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out border border-cyan-500/40 rounded-2xl bg-slate-950/95 shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden ${
        isFullscreen
          ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]'
          : isCollapsed
          ? 'h-14'
          : 'h-80 lg:h-96'
      }`}
    >
      {/* Terminal Titlebar Header */}
      <div className="h-14 px-4 bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border-b border-cyan-500/30 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          {/* Traffic light terminal dots */}
          <div className="flex items-center gap-1.5">
            <span
              onClick={() => setIsCollapsed(true)}
              className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-400 cursor-pointer shadow-[0_0_6px_rgba(244,63,94,0.6)]"
              title="Collapse Terminal"
            />
            <span
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 cursor-pointer shadow-[0_0_6px_rgba(245,158,11,0.6)]"
              title="Toggle Fullscreen"
            />
            <span
              onClick={() => setIsCollapsed(false)}
              className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 cursor-pointer shadow-[0_0_6px_rgba(16,185,129,0.6)]"
              title="Expand Terminal"
            />
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
            <div className="w-4 h-4 shrink-0 flex items-center justify-center">
              <CharacterIcon characterId="kali" />
            </div>
            <span className="font-mono text-xs font-bold text-slate-200">
              kali@glacier-kernel: {vfs.getCwdDisplay()} (bash)
            </span>
          </div>

          {/* Quick Target Directive Tag */}
          {currentPage.requiredCommandDesc && isCollapsed && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Target: {activeTargetCommand || currentPage.requiredCommandDesc}</span>
            </div>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
          >
            {isCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>EXPAND TERMINAL</span>
                <span className="hidden sm:inline text-[10px] text-cyan-400/60 font-normal">
                  [Ctrl+`]
                </span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>COLLAPSE</span>
              </>
            )}
          </button>

          {!isCollapsed && (
            <>
              <button
                onClick={() => setEntries([])}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Clear screen (clear)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expanded Terminal Body */}
      {!isCollapsed && (
        <div className="relative flex-1 flex flex-col min-h-0 bg-[#030712] overflow-hidden">
          {/* Transparent Kali Linux Dragon Background Watermark */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0 select-none">
            <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 max-w-[72%] max-h-[85%] opacity-[0.14] transition-opacity duration-300">
              <CharacterIcon
                characterId="kali"
                className="w-full h-full object-contain filter drop-shadow-[0_0_28px_rgba(56,189,248,0.45)]"
              />
            </div>
          </div>

          {/* Scrollable Output Screen */}
          <div className="relative z-10 flex-1 overflow-y-auto p-4 font-mono text-xs lg:text-[13px] leading-relaxed text-slate-200 space-y-2 select-text bg-transparent">
            {entries.map(entry => (
              <div key={entry.id} className="space-y-0.5">
                {entry.type === 'input' && (
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                    <span className="text-emerald-400">kali@glacier-kernel</span>
                    <span className="text-slate-500">:</span>
                    <span className="text-sky-300">{entry.cwd}</span>
                    <span className="text-slate-400">$</span>
                    <span className="text-white">{entry.content}</span>
                  </div>
                )}

                {entry.type === 'output' && (
                  <pre className="text-slate-300 font-mono whitespace-pre-wrap pl-4 border-l-2 border-cyan-500/20">
                    {entry.content}
                  </pre>
                )}

                {entry.type === 'error' && (
                  <pre className="text-rose-400 font-mono whitespace-pre-wrap pl-4 border-l-2 border-rose-500/40">
                    {entry.content}
                  </pre>
                )}

                {entry.type === 'system' && (
                  <div className="text-cyan-300/90 font-mono whitespace-pre-wrap bg-cyan-950/40 backdrop-blur-sm p-2 rounded border border-cyan-500/25">
                    {entry.content}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick Command Suggestions Bar */}
          <div className="relative z-10">
            {renderQuickChips()}
          </div>

          {/* Active Command Input Line */}
          <div className="relative z-10 px-3 py-2.5 bg-slate-900/95 backdrop-blur-sm border-t border-cyan-500/30 flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-400 shrink-0">
              kali@glacier-kernel<span className="text-slate-500">:</span>
              <span className="text-sky-300">{vfs.getCwdDisplay()}</span>
              <span className="text-slate-400">$</span>
            </span>

            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeTargetCommand
                  ? `Try: ${activeTargetCommand}`
                  : 'Type linux command... (try: ls, help, pwd)'
              }
              className="flex-1 bg-transparent text-white font-mono text-xs lg:text-[13px] outline-none border-none caret-cyan-400 placeholder:text-slate-600"
              spellCheck={false}
              autoComplete="off"
            />

            <button
              onClick={() => handleRunCommand(inputVal)}
              disabled={!inputVal.trim()}
              className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40 disabled:opacity-30 disabled:pointer-events-none text-cyan-300 border border-cyan-500/50 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              RUN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
