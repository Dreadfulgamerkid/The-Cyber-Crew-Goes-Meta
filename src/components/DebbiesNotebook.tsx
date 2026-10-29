import React, { useState, useMemo } from 'react';
import { CHARACTERS } from '../data/characters';
import { CharacterIcon } from './CharacterIcon';
import { VirtualFileSystem } from '../utils/vfs';
import { sound } from '../utils/audio';
import {
  LINUX_COMMANDS_81,
  LINUX_CATEGORIES,
  LinuxCategory,
  LinuxCommandDoc
} from '../data/linuxCommands81';
import {
  BookOpen,
  X,
  Shield,
  FolderTree,
  Users,
  Award,
  Terminal,
  FileCode,
  CheckCircle,
  Copy,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Bookmark,
  Layers,
  Flame,
  Info
} from 'lucide-react';

interface DebbiesNotebookProps {
  isOpen: boolean;
  onClose: () => void;
  vfs: VirtualFileSystem;
  masteredCommands: string[];
  commandExecutionCounts?: Record<string, number>;
}

export const DebbiesNotebook: React.FC<DebbiesNotebookProps> = ({
  isOpen,
  onClose,
  vfs,
  masteredCommands,
  commandExecutionCounts = {}
}) => {
  const [activeTab, setActiveTab] = useState<'commandList' | 'mastered' | 'crew' | 'tree' | 'rules'>('commandList');
  const [cmdSearchQuery, setCmdSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter commands for the "Command list" tab
  const filteredCommandList = useMemo(() => {
    return LINUX_COMMANDS_81.filter(item => {
      const matchesSearch =
        item.command.toLowerCase().includes(cmdSearchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(cmdSearchQuery.toLowerCase()) ||
        item.syntax.toLowerCase().includes(cmdSearchQuery.toLowerCase()) ||
        item.reliabilityTip.toLowerCase().includes(cmdSearchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [cmdSearchQuery, selectedCategory]);

  // Mastered commands details
  const masteredList = useMemo(() => {
    return LINUX_COMMANDS_81.filter(item => masteredCommands.includes(item.command));
  }, [masteredCommands]);

  // In-progress commands (used at least once but < 20 times)
  const inProgressList = useMemo(() => {
    return Object.entries(commandExecutionCounts)
      .filter(([cmd, count]) => count > 0 && count < 20)
      .map(([cmd, count]) => {
        const doc = LINUX_COMMANDS_81.find(c => c.command === cmd) || {
          command: cmd,
          category: 'File and Directory Commands' as LinuxCategory,
          syntax: `${cmd} [args]`,
          description: `Active field utility ${cmd}`,
          reliabilityTip: 'Practice makes permanent.'
        };
        return {
          ...doc,
          count
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [commandExecutionCounts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 lg:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-amber-50 dark:bg-[#0c1322] border-2 border-amber-400/50 rounded-2xl shadow-[0_0_60px_rgba(245,158,11,0.25)] flex flex-col overflow-hidden">
        {/* Notebook Spiral Binding Header */}
        <div className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-4 border-b-2 border-amber-700/50 flex items-center justify-between text-slate-950 shadow-md">
          {/* Spiral Ring Visuals */}
          <div className="absolute top-0 inset-x-8 -translate-y-1/2 flex justify-between pointer-events-none">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="w-3.5 h-6 rounded-full bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 border border-slate-700 shadow-md"
              />
            ))}
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <div className="w-9 h-9 rounded-xl bg-slate-950 border border-rose-900/50 p-1.5 flex items-center justify-center font-bold shadow">
              <CharacterIcon characterId="debbie" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-mono text-sm sm:text-base font-black tracking-tight text-slate-950 leading-tight">
                DEBBIE'S SYSTEM RELIABILITY NOTEBOOK
              </h2>
              <p className="text-[11px] font-sans font-semibold text-amber-950/90 tracking-wide">
                DreadfulSolutions Field Operations Manual & Safety Log
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playNotebookSnap();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-slate-950/15 hover:bg-slate-950/30 text-slate-950 flex items-center justify-center transition-all cursor-pointer"
            title="Snap notebook shut"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-amber-400/30 bg-amber-100/70 dark:bg-slate-900/80 px-3 sm:px-5 pt-2 gap-1.5 overflow-x-auto scrollbar-none text-xs font-mono font-bold shrink-0">
          {/* TAB 1: Command list */}
          <button
            onClick={() => setActiveTab('commandList')}
            className={`px-3 py-2 rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'commandList'
                ? 'bg-amber-50 dark:bg-[#0c1322] text-amber-600 dark:text-amber-400 border-t-2 border-amber-500 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Command list (81)</span>
          </button>

          {/* TAB 2: Mastered Commands */}
          <button
            onClick={() => setActiveTab('mastered')}
            className={`px-3 py-2 rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'mastered'
                ? 'bg-amber-50 dark:bg-[#0c1322] text-amber-600 dark:text-amber-400 border-t-2 border-amber-500 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Mastered Commands ({masteredCommands.length})</span>
            {masteredCommands.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* TAB 3: Cyber Crew */}
          <button
            onClick={() => setActiveTab('crew')}
            className={`px-3 py-2 rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'crew'
                ? 'bg-amber-50 dark:bg-[#0c1322] text-amber-600 dark:text-amber-400 border-t-2 border-amber-500 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>The Cyber Crew</span>
          </button>

          {/* TAB 4: Live File Tree */}
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-3 py-2 rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'tree'
                ? 'bg-amber-50 dark:bg-[#0c1322] text-amber-600 dark:text-amber-400 border-t-2 border-amber-500 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Live File Tree</span>
          </button>

          {/* TAB 5: Safety Rules */}
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-2 rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'rules'
                ? 'bg-amber-50 dark:bg-[#0c1322] text-amber-600 dark:text-amber-400 border-t-2 border-amber-500 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Safety Rules</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 text-slate-800 dark:text-slate-200 bg-amber-50/50 dark:bg-[#0c1322]">
          {/* TAB: COMMAND LIST (ALL 81 COMMANDS, STRICTLY REFERENCE, NO CHECKMARKS) */}
          {activeTab === 'commandList' && (
            <div className="space-y-4">
              {/* Reference Header Banner */}
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-xs font-sans text-cyan-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div>
                  <b className="text-cyan-400 font-mono text-sm block">
                    DEBBIE'S OFFICIAL 81 LINUX COMMAND REFERENCE GUIDE
                  </b>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Field reference catalog of all 81 Linux commands across 7 operational disciplines. Strictly for reference.
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold border border-cyan-400/40 shrink-0">
                  {filteredCommandList.length} of 81 Commands
                </div>
              </div>

              {/* Search and Category Filters */}
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={cmdSearchQuery}
                    onChange={e => setCmdSearchQuery(e.target.value)}
                    placeholder="Search 81 commands, syntax, or keywords (e.g., ls, chmod, ping)..."
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  {cmdSearchQuery && (
                    <button
                      onClick={() => setCmdSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-amber-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="All">All 7 Categories (81)</option>
                    {LINUX_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 81 Command Cards (Card Style identical to Mastered, Strictly Reference, NO checkmarks) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredCommandList.map(cmd => (
                  <div
                    key={cmd.id}
                    className="p-3.5 rounded-xl border border-slate-700/70 bg-slate-900/60 hover:border-amber-400/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
                            {cmd.command}
                          </span>
                          <span className="text-[10px] font-mono text-amber-400/90 font-semibold uppercase px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                            {cmd.category.replace(' Commands', '')}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          #{cmd.orderIndex} {cmd.isBeginner ? '• Beginner' : '• Core'}
                        </span>
                      </div>

                      <div className="font-mono text-xs text-amber-300 my-1.5 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 select-all">
                        $ {cmd.syntax}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
                        {cmd.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] font-sans text-amber-300/80 bg-amber-950/20 p-2 rounded-lg">
                      <b className="font-mono text-[10px] text-amber-400 uppercase tracking-wide block mb-0.5">
                        Reliability Tip:
                      </b>
                      {cmd.reliabilityTip}
                    </div>
                  </div>
                ))}
              </div>

              {filteredCommandList.length === 0 && (
                <div className="text-center py-12 text-slate-400 font-mono text-xs">
                  No commands match "{cmdSearchQuery}".
                </div>
              )}
            </div>
          )}

          {/* TAB: MASTERED COMMANDS (STARTS EMPTY, CHECKMARK AFTER 20 CORRECT USES) */}
          {activeTab === 'mastered' && (
            <div className="space-y-4">
              {/* Mastery Protocol Banner */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs font-sans text-amber-800 dark:text-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-amber-400" />
                  <b className="font-mono text-sm text-amber-400">
                    DreadfulSolutions Mastery Certification Protocol:
                  </b>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "A system without verified muscle memory is a system waiting to fail. A command is only officially registered as <b>Mastered</b> once you execute it <b>20 times correctly</b> across your field adventures."
                </p>
              </div>

              {/* Mastered Commands Section */}
              {masteredList.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Officially Certified Commands ({masteredList.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {masteredList.map(cmd => {
                      const count = commandExecutionCounts[cmd.command] || 20;
                      return (
                        <div
                          key={cmd.id}
                          className="p-3.5 rounded-xl border border-emerald-400/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                                  {cmd.command}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 uppercase">
                                  {cmd.category.replace(' Commands', '')}
                                </span>
                              </div>

                              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-300 font-bold bg-emerald-500/25 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                MASTERED
                              </span>
                            </div>

                            <div className="font-mono text-xs text-amber-400 my-1 bg-slate-950/70 px-2.5 py-1 rounded border border-slate-800">
                              $ {cmd.syntax}
                            </div>

                            <p className="text-xs text-slate-200 leading-relaxed font-sans mt-1">
                              {cmd.description}
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                            <span>Field Usage Count:</span>
                            <span className="font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                              {count} Executions (20 Required)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Empty state when 0 are mastered initially */
                <div className="p-8 rounded-2xl bg-slate-900/80 border border-dashed border-amber-400/40 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 text-2xl shadow-inner">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-mono text-base font-bold text-white mb-1">
                      0 Commands Mastered Initially
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed font-sans">
                      No commands have reached the <b>20-use threshold</b> yet! Every successful command you run in the terminal builds your count. Reach 20 to earn official DreadfulSolutions certification!
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-full border border-cyan-400/30">
                    💡 Tip: Practice commands in episodes or open terminal tests to build mastery!
                  </div>
                </div>
              )}

              {/* In Progress Practice Trackers */}
              {inProgressList.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <h3 className="font-mono text-xs font-bold text-amber-400 uppercase mb-2.5 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Commands In Training (Progress Toward 20 Uses)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {inProgressList.map(item => {
                      const percent = Math.min(100, Math.round((item.count / 20) * 100));
                      return (
                        <div
                          key={item.command}
                          className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-400/30">
                              {item.command}
                            </span>
                            <span className="font-mono text-[11px] text-amber-300">
                              {item.count} / 20 uses ({percent}%)
                            </span>
                          </div>

                          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CREW DOSSIER */}
          {activeTab === 'crew' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.values(CHARACTERS).filter(c => c.id !== 'narrator').map(char => (
                <div
                  key={char.id}
                  className="p-4 rounded-xl border border-slate-700 bg-slate-900/60 flex flex-col gap-2.5 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${char.avatarBg} border p-2 flex items-center justify-center shadow`}
                    >
                      <CharacterIcon characterId={char.id} className="w-full h-full object-contain" />
                    </div>

                    <div>
                      <h3 className="font-mono text-sm font-bold text-white flex items-center gap-1.5">
                        {char.name}
                      </h3>
                      <p className="text-xs font-mono text-cyan-400 font-semibold">
                        {char.title}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-sans text-slate-300 italic border-l-2 border-amber-400/50 pl-2">
                    "{char.tagline}"
                  </div>

                  <div className="text-[11px] font-sans text-slate-400 space-y-1">
                    <div>
                      <strong className="text-slate-300">Gear:</strong> {char.gearDescription}
                    </div>
                    <div>
                      <strong className="text-slate-300">Specialty:</strong> {char.personality}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: LIVE FILE TREE */}
          {activeTab === 'tree' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 font-sans">
                Real-time snapshot of the virtual directory tree. Notice how creating folders with <code className="text-cyan-400">mkdir</code> and moving files with <code className="text-cyan-400">mv</code> updates this filesystem!
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 font-mono text-xs leading-relaxed text-cyan-200">
                <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                  <FolderTree className="w-4 h-4 text-cyan-400" />
                  <span>Virtual Root /</span>
                </div>

                <div className="pl-4 border-l border-cyan-500/20 space-y-1">
                  <div>📁 home/</div>
                  <div className="pl-4 border-l border-cyan-500/20 space-y-1">
                    <div>📁 kali/ <span className="text-emerald-400 text-[10px]">(Current Working Dir ~)</span></div>
                    <div className="pl-4 border-l border-cyan-500/20 space-y-1 text-slate-300">
                      {(vfs.listFiles('/home/kali') || []).map(f => (
                        <div key={f.name} className="flex items-center gap-1.5">
                          {f.type === 'dir' ? '📁' : '📄'}
                          <span className={f.exec ? 'text-emerald-400 font-bold' : ''}>
                            {f.name}
                          </span>
                          <span className="text-[10px] text-slate-500">({f.permissions})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {vfs.getNodeByPath('/frost_vault') && (
                    <div className="text-emerald-400">
                      <div>📁 frost_vault/ <span className="text-[10px]">(Dedicated Safety Vault)</span></div>
                      <div className="pl-4 border-l border-cyan-500/20 space-y-1 text-slate-300">
                        {(vfs.listFiles('/frost_vault') || []).map(f => (
                          <div key={f.name} className="flex items-center gap-1.5 text-emerald-300">
                            📄 {f.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {vfs.getNodeByPath('/telemetry') && (
                    <div className="text-amber-400">
                      <div>📁 telemetry/</div>
                      <div className="pl-4 border-l border-cyan-500/20 space-y-1 text-slate-300">
                        {(vfs.listFiles('/telemetry') || []).map(f => (
                          <div key={f.name} className="flex items-center gap-1.5">
                            📄 {f.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SAFETY RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-3 font-sans text-xs text-slate-200">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-200">
                <h4 className="font-mono font-bold text-sm mb-1 text-amber-300">
                  DEBBIE'S TOP 5 SYSTEM RELIABILITY LAWS:
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>
                    <b>The Replica Rule:</b> Always copy with <code className="text-cyan-300 font-mono">cp</code> before editing or running experiments.
                  </li>
                  <li>
                    <b>Verify with ls:</b> Never assume a file materialized. Run <code className="text-cyan-300 font-mono">ls</code> or <code className="text-cyan-300 font-mono">ls -l</code> to inspect file timestamps and sizes.
                  </li>
                  <li>
                    <b>Dedicated Vaults:</b> Keep originals and backups in separated directories using <code className="text-cyan-300 font-mono">mkdir</code> and <code className="text-cyan-300 font-mono">mv</code>.
                  </li>
                  <li>
                    <b>Permission Discipline:</b> Don't grant world write privileges (chmod 777). Grant executable mode <code className="text-cyan-300 font-mono">chmod +x</code> only when necessary.
                  </li>
                  <li>
                    <b>Clean Terminations:</b> Check processes with <code className="text-cyan-300 font-mono">ps</code> and terminate rogue PIDs specifically with <code className="text-cyan-300 font-mono">kill</code>.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-100/40 dark:bg-slate-900 border-t border-amber-400/30 flex items-center justify-between text-xs font-mono shrink-0">
          <span className="text-slate-500 text-[11px]">
            Debbie's Notebook • DreadfulSolutions Field Operations Manual
          </span>
          <button
            onClick={() => {
              sound.playNotebookSnap();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all cursor-pointer shadow"
          >
            CLOSE NOTEBOOK [SNAP!]
          </button>
        </div>
      </div>
    </div>
  );
};
