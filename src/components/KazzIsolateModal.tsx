import React, { useState, useEffect, useRef } from 'react';
import { CharacterIcon } from './CharacterIcon';
import { sound } from '../utils/audio';
import { KazzCoachData, getKazzFallbackAdvice } from '../data/kazzMemoryBank';
import { StoryPage } from '../types';
import {
  X,
  Sparkles,
  Terminal,
  Shield,
  Layers,
  Send,
  RefreshCw,
  Maximize2,
  Minimize2,
  Wifi,
  Sliders,
  Copy,
  Check,
  Zap,
  Volume2,
  Lock,
  ArrowRight,
  Info,
  Activity,
  Flame
} from 'lucide-react';

interface KazzIsolateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: StoryPage;
  adventureTitle: string;
}

export const KazzIsolateModal: React.FC<KazzIsolateModalProps> = ({
  isOpen,
  onClose,
  currentPage,
  adventureTitle
}) => {
  // Extract target command for current page
  const rawCommand =
    currentPage.targetCommand?.split(/\s+/)[0]?.replace(/^sudo\s+/, '') ||
    currentPage.commandMastered ||
    'ls';

  const [activeCommand, setActiveCommand] = useState<string>(rawCommand);
  const [coachData, setCoachData] = useState<KazzCoachData>(() =>
    getKazzFallbackAdvice(rawCommand, adventureTitle)
  );
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'briefing' | 'sandbox' | 'flags'>('briefing');

  // Kasm VNC Toolbar Controls state
  const [showKasmSidebar, setShowKasmSidebar] = useState<boolean>(false);
  const [isVncFullscreen, setIsVncFullscreen] = useState<boolean>(false);
  const [streamQuality, setStreamQuality] = useState<'WebRTC / VP9' | 'Lossless H.264'>('WebRTC / VP9');
  const [audioStreamEnabled, setAudioStreamEnabled] = useState<boolean>(true);
  const [copiedMnemonic, setCopiedMnemonic] = useState<boolean>(false);

  // Ephemeral Sandbox Terminal inside Kasm VNC
  const [sandboxInput, setSandboxInput] = useState<string>('');
  const [sandboxLogs, setSandboxLogs] = useState<Array<{ id: string; type: 'cmd' | 'res' | 'sys'; text: string }>>([
    {
      id: 'init-0',
      type: 'sys',
      text: 'Kasm Container Pod [ephemeral-kazz-recon-01] provisioned. Namespace: isolated-chroot.'
    },
    {
      id: 'init-1',
      type: 'sys',
      text: 'Safe Sandbox Mode: Real-time execution without modifying host filesystem.'
    }
  ]);

  const sandboxInputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Sync command when page changes
  useEffect(() => {
    if (rawCommand) {
      setActiveCommand(rawCommand);
      fetchKazzAdvice(rawCommand);
    }
  }, [rawCommand, currentPage.pageNumber]);

  // Scroll sandbox logs
  useEffect(() => {
    if (activeTab === 'sandbox') {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sandboxLogs, activeTab]);

  const fetchKazzAdvice = async (cmd: string, customPrompt?: string) => {
    setIsLoadingAi(true);
    sound.playContainerIsolate();

    try {
      const res = await fetch('/api/kazz-isolate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: cmd,
          commandSyntax: currentPage.targetCommand || `${cmd} [args]`,
          adventureTitle,
          pageNumber: currentPage.pageNumber,
          contextStory: (currentPage.narrativeText || []).join(' '),
          userPrompt: customPrompt || ''
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.coachData) {
          setCoachData(data.coachData);
          setIsLoadingAi(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Using client fallback advice for Kazz:', e);
    }

    // High quality offline fallback
    setCoachData(getKazzFallbackAdvice(cmd, adventureTitle, customPrompt));
    setIsLoadingAi(false);
  };

  const handleAskKazz = (promptText?: string) => {
    const q = promptText || userQuery;
    if (!q.trim()) return;
    setUserQuery('');
    fetchKazzAdvice(activeCommand, q);
  };

  const handleSandboxRun = (customCmd?: string) => {
    const toRun = customCmd || sandboxInput;
    if (!toRun.trim()) return;

    sound.playKey();
    const cmdId = Math.random().toString();
    const resId = Math.random().toString();

    setSandboxLogs(prev => [
      ...prev,
      { id: cmdId, type: 'cmd', text: `kasm-user@sandbox:~$ ${toRun}` }
    ]);

    setTimeout(() => {
      sound.playPing();
      let output = `[Kasm Sandbox Pod: Execution OK] Command '${toRun}' verified in isolated container layer. Zero host risk.`;

      const clean = toRun.trim();
      if (clean === 'ls' || clean.startsWith('ls ')) {
        output = `total 24\n-rw-r--r-- 1 kasm-user crew  2048 Oct 28 23:35 heater_core.cad\n-rw-r--r-- 1 kasm-user crew  2048 Oct 28 23:35 heater_backup.cad\ndrwxr-xr-x 2 kasm-user crew  4096 Oct 28 23:36 /frost_vault`;
      } else if (clean.startsWith('mkdir')) {
        output = `mkdir: created directory '${clean.replace(/^mkdir\s+(-[a-zA-Z]+\s+)?/, '')}' in sandbox ephemeral namespace.`;
      } else if (clean.startsWith('cp')) {
        output = `cp: cloned source to destination with copy-on-write integrity verified.`;
      } else if (clean.startsWith('cat')) {
        output = `=== BLUEPRINT SPECIFICATION ===\nID: HEATER-CORE-CAD-V4\nSTATUS: FROST-PROOF VERIFIED\nSAFETY ARCHIVE: READY`;
      } else if (clean === 'pwd') {
        output = `/home/kasm-user/isolated-workspace`;
      } else if (clean.startsWith('grep')) {
        output = `MATCH FOUND: "temperature_threshold = -45C" [line 14]`;
      } else if (clean === 'clear') {
        setSandboxLogs([]);
        setSandboxInput('');
        return;
      }

      setSandboxLogs(prev => [
        ...prev,
        { id: resId, type: 'res', text: output }
      ]);
    }, 180);

    setSandboxInput('');
  };

  const copyMnemonic = () => {
    if (coachData?.mnemonic) {
      navigator.clipboard?.writeText(coachData.mnemonic);
      setCopiedMnemonic(true);
      setTimeout(() => setCopiedMnemonic(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md">
      {/* Container Isolation Glow Perimeter */}
      <div
        className={`relative w-full max-w-5xl ${
          isVncFullscreen ? 'h-[98vh] max-h-[98vh]' : 'h-[90vh] max-h-[90vh]'
        } bg-[#0b0f19] border-2 border-sky-400/80 rounded-2xl sm:rounded-3xl shadow-[0_0_70px_rgba(14,165,233,0.45),0_0_120px_rgba(249,115,22,0.25)] flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* KASM VNC TITLEBAR & BROWSER ADDRESS BAR */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-3 sm:px-4 border-b border-sky-500/30 flex items-center justify-between gap-3 shrink-0 select-none">
          {/* Left: Kasm Window Controls & Identity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={onClose}
                className="w-3.5 h-3.5 rounded-full bg-rose-500/80 hover:bg-rose-400 cursor-pointer shadow-[0_0_8px_rgba(244,63,94,0.7)]"
                title="Disconnect & Terminate Session"
              />
              <button
                onClick={() => setIsVncFullscreen(!isVncFullscreen)}
                className="w-3.5 h-3.5 rounded-full bg-amber-500/80 hover:bg-amber-400 cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.7)]"
                title="Toggle Fullscreen"
              />
              <button
                onClick={() => fetchKazzAdvice(activeCommand)}
                className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 hover:bg-emerald-400 cursor-pointer shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                title="Re-spawn Ephemeral Pod"
              />
            </div>

            {/* Kasm Web Logo & Title */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-6 h-6 rounded-lg bg-sky-950/80 p-0.5 border border-sky-400/60 shadow flex items-center justify-center">
                <CharacterIcon characterId="kazz" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm font-black tracking-wider text-sky-400">
                    KASM VNC // ISOLATE
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono text-[9px] font-bold border border-orange-500/40 animate-pulse">
                    LIVE STREAM
                  </span>
                </div>
                <div className="hidden sm:block text-[10px] font-mono text-slate-400">
                  Containerized Sandbox Pod #01 • Kazz AI Memory Engine
                </div>
              </div>
            </div>
          </div>

          {/* Center: Simulated WebRTC VNC Address Bar */}
          <div className="hidden md:flex items-center gap-2 bg-slate-950/90 px-3 py-1 rounded-xl border border-sky-500/30 text-xs font-mono text-slate-300 max-w-sm flex-1 justify-center truncate">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-slate-500">kasmvnc://</span>
            <span className="text-cyan-300 truncate">glacier-kernel.cybercrew.local</span>
            <span className="text-orange-400">:8443</span>
            <span className="text-slate-600">/isolate/{activeCommand}</span>
          </div>

          {/* Right: Stream Diagnostics & Close Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Stream Stats Pill */}
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>60 FPS</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">1.8ms</span>
              <span className="text-slate-600">•</span>
              <span>TLS 1.3</span>
            </div>

            {/* Re-Isolate / Refresh AI Button */}
            <button
              onClick={() => fetchKazzAdvice(activeCommand)}
              disabled={isLoadingAi}
              className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/30 text-sky-300 border border-sky-400/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Re-generate AI memory advice for this command"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isLoadingAi ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">RE-ISOLATE</span>
            </button>

            {/* Terminate Session Button */}
            <button
              onClick={() => {
                sound.playNotebookSnap();
                onClose();
              }}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer border border-slate-700"
              title="Terminate Kasm session"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAIN KASM VNC WORKSPACE CANVAS */}
        <div className="relative flex-1 flex overflow-hidden bg-[#070b14]">
          {/* ICONIC KASM SLIDE-OUT CONTROL TAB (Left Edge Pill) */}
          <div className="relative z-30 flex">
            {/* The Floating Tab Button that slides out */}
            <div className="flex flex-col justify-center items-center py-4 bg-slate-950/90 border-r border-sky-500/20 px-1 sm:px-1.5 select-none shrink-0 shadow-lg">
              <button
                onClick={() => setShowKasmSidebar(!showKasmSidebar)}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500/30 to-blue-600/30 hover:from-sky-500/50 hover:to-blue-600/50 border border-sky-400/50 text-sky-300 flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                title="Toggle Kasm VNC Control Panel"
              >
                <Sliders className="w-4 h-4" />
              </button>

              <div className="my-2 h-px w-4 bg-slate-800" />

              {/* Quick Tab Icon Shortcuts */}
              <button
                onClick={() => setActiveTab('briefing')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer text-xs mb-1.5 ${
                  activeTab === 'briefing'
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(14,165,233,0.6)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title="Kazz's AI Tactical Briefing"
              >
                <Sparkles className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('sandbox')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer text-xs mb-1.5 ${
                  activeTab === 'sandbox'
                    ? 'bg-orange-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(249,115,22,0.6)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title="Isolated Ephemeral Sandbox CLI"
              >
                <Terminal className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('flags')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer text-xs ${
                  activeTab === 'flags'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title="Command Flags & Safety Parameters"
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>

            {/* Slide-out Sidebar Drawer for Kasm Controls */}
            {showKasmSidebar && (
              <div className="w-64 bg-slate-950/95 border-r border-sky-500/30 p-4 flex flex-col gap-3 font-mono text-xs z-30 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-sky-400 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-sky-400" />
                    KASM VNC SETTINGS
                  </span>
                  <button
                    onClick={() => setShowKasmSidebar(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase">Stream Encoder</label>
                  <select
                    value={streamQuality}
                    onChange={e => setStreamQuality(e.target.value as any)}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 text-cyan-300 text-xs p-1.5 rounded-lg outline-none"
                  >
                    <option value="WebRTC / VP9">WebRTC / VP9 (Low Latency)</option>
                    <option value="Lossless H.264">Lossless H.264 (Crisp Text)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    Audio Stream
                  </span>
                  <button
                    onClick={() => setAudioStreamEnabled(!audioStreamEnabled)}
                    className={`w-9 h-5 rounded-full transition-colors flex items-center p-0.5 ${
                      audioStreamEnabled ? 'bg-sky-500 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-orange-950/30 border border-orange-500/30 text-[11px] text-orange-300 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-orange-400">
                    <Flame className="w-3.5 h-3.5" />
                    CONTAINER STATUS:
                  </div>
                  <div>Ephemeral Namespace Active</div>
                  <div className="text-[10px] text-slate-400">
                    All commands executed inside Kasm VNC are segregated from host kernel storage.
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-800 text-[10px] text-slate-500">
                  Kasm Workspaces Engine • Build 2026.4
                </div>
              </div>
            )}
          </div>

          {/* RIGHT / MAIN CANVAS: Kazz's Interactive Command Isolation Center */}
          <div className="flex-1 flex flex-col overflow-y-auto p-3 sm:p-5 relative select-text">
            {/* Subtle Kasm Grid Background overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 z-0" />

            {/* TOP BAR: KAZZ AVATAR + ACTIVE COMMAND HERO BANNER */}
            <div className="relative z-10 mb-4 p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950 border border-sky-500/40 shadow-[0_0_30px_rgba(14,165,233,0.2)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {/* Kazz Avatar with Holographic Visor & Laser Glow */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-sky-500/30 via-blue-600/20 to-slate-950 border-2 border-sky-400 p-2.5 flex items-center justify-center shadow-[0_0_25px_rgba(14,165,233,0.5)]">
                    <CharacterIcon characterId="kazz" className="w-full h-full object-contain" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-mono text-[9px] font-black border border-emerald-300">
                    ONLINE
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-black font-mono text-white flex items-center gap-2">
                      KAZZ'S ISOLATED RECON POD
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono text-[11px] font-bold border border-sky-400/40">
                      COMMAND: [{activeCommand}]
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans mt-0.5">
                    "Isolate first, execute without fear! Let's lock this command into your permanent memory!"
                  </p>

                  {/* Audio Waveform Animation (Simulates Kazz speaking) */}
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="text-[10px] font-mono text-sky-400 mr-1">AUDIO FEED:</span>
                    {[4, 12, 8, 16, 10, 6, 14, 9, 15, 7, 11, 4].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-sky-400 rounded-full animate-pulse"
                        style={{
                          height: `${isLoadingAi ? (i % 2 === 0 ? 16 : 6) : h}px`,
                          animationDelay: `${i * 90}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Command Selector Buttons for Instant Switching */}
              <div className="flex items-center gap-1.5 flex-wrap self-stretch md:self-auto justify-end">
                {['cp', 'mkdir', 'mv', 'ls', 'cat', 'grep', 'chmod'].map(cmd => (
                  <button
                    key={cmd}
                    onClick={() => {
                      setActiveCommand(cmd);
                      fetchKazzAdvice(cmd);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeCommand === cmd
                        ? 'bg-sky-500 text-slate-950 shadow-[0_0_12px_rgba(14,165,233,0.6)]'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT 1: AI TACTICAL BRIEFING & UNFORGETTABLE MNEMONIC */}
            {activeTab === 'briefing' && (
              <div className="space-y-4 relative z-10">
                {/* THE MEMORY HOOK / UNFORGETTABLE MNEMONIC (Hero Card with Glowing Border) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-950/80 via-slate-900/90 to-blue-950/80 border-2 border-sky-400/70 shadow-[0_0_35px_rgba(14,165,233,0.3)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400 animate-bounce" />
                      <span className="font-mono text-xs sm:text-sm font-black text-amber-400 tracking-wider uppercase">
                        KAZZ'S UNFORGETTABLE MEMORY ANCHOR:
                      </span>
                    </div>

                    <button
                      onClick={copyMnemonic}
                      className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Copy memory mnemonic"
                    >
                      {copiedMnemonic ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-sky-400" />
                          <span>Copy Hook</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="font-mono text-base sm:text-lg font-black text-white bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-sky-500/30 shadow-inner leading-relaxed">
                    "{coachData?.mnemonic}"
                  </div>

                  {/* Kazz's Direct Speech Explanation */}
                  <div className="mt-3.5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 font-bold font-mono text-xs border border-sky-500/40">
                      KAZZ
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs sm:text-[13px] text-slate-200 font-sans leading-relaxed">
                        {coachData?.explanation}
                      </p>
                      <p className="text-xs text-sky-300 font-mono italic">
                        💡 Tactical Recon Tip: {coachData?.sandboxTip}
                      </p>
                    </div>
                  </div>
                </div>

                {/* TWO-COLUMN GRID: Container Safety Fact & Practice Challenge */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Container Fun Fact */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <h4 className="font-mono text-xs font-bold text-emerald-400 uppercase">
                          Kasm Isolation Insight:
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {coachData?.funFact}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                      Status: Isolated Namespace Protection Active
                    </div>
                  </div>

                  {/* Practice Challenge with Quick-Run Button */}
                  <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <h4 className="font-mono text-xs font-bold text-orange-400 uppercase">
                          Sandbox Practice Challenge:
                        </h4>
                      </div>
                      <p className="text-xs text-slate-200 font-sans leading-relaxed">
                        {coachData?.practiceChallenge}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-orange-500/20 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-orange-300">Ready to test?</span>
                      <button
                        onClick={() => {
                          setActiveTab('sandbox');
                          const match = coachData?.practiceChallenge?.match(/Try typing:?\s*([a-zA-Z0-9_\-\.\/\s]+)/i);
                          if (match && match[1]) {
                            handleSandboxRun(match[1].trim());
                          }
                        }}
                        className="px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-mono text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow"
                      >
                        <span>LAUNCH IN SANDBOX</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI ASK KAZZ SECTION (Interactive Conversation / Memory Drills) */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-sky-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
                      <h4 className="font-mono text-xs font-bold text-white uppercase">
                        Ask Kazz Anything (Powered by AI)
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/30">
                      Muse Spark 1.2
                    </span>
                  </div>

                  {/* Quick-Prompt Question Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      'Give me another unforgettable memory hook',
                      'What is the most dangerous typo with this command?',
                      'Explain the most useful flags for this command',
                      'How do sysadmins use this in production?'
                    ].map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => handleAskKazz(prompt)}
                        disabled={isLoadingAi}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-slate-700/80 hover:border-sky-400/50 text-[11px] font-sans flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>

                  {/* Ask Input Form */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={userQuery}
                      onChange={e => setUserQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAskKazz()}
                      placeholder={`Ask Kazz: "How do I remember ${activeCommand}?" or "What happens if I forget a flag?"...`}
                      className="flex-1 bg-slate-950 border border-slate-700 focus:border-sky-400 px-3 py-2 rounded-xl text-xs font-mono text-white placeholder-slate-500 outline-none transition-all"
                    />
                    <button
                      onClick={() => handleAskKazz()}
                      disabled={!userQuery.trim() || isLoadingAi}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-mono text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>ASK KAZZ</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: ISOLATED EPHEMERAL SANDBOX CLI */}
            {activeTab === 'sandbox' && (
              <div className="flex-1 flex flex-col rounded-2xl bg-slate-950 border border-orange-500/40 overflow-hidden relative shadow-[0_0_30px_rgba(249,115,22,0.15)] min-h-[340px]">
                {/* Sandbox Header */}
                <div className="p-3 bg-slate-900 border-b border-orange-500/30 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-orange-400" />
                    <span className="font-bold text-orange-400">
                      EPHEMERAL SANDBOX SHELL (ZERO RISK LAYER)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Host Filesystem Protected • Discard on Exit
                  </span>
                </div>

                {/* Output Screen */}
                <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 select-text text-slate-200">
                  {sandboxLogs.map(log => (
                    <div key={log.id}>
                      {log.type === 'cmd' && (
                        <div className="text-orange-300 font-bold">{log.text}</div>
                      )}
                      {log.type === 'res' && (
                        <pre className="text-emerald-300 pl-3 border-l-2 border-emerald-500/30 whitespace-pre-wrap">
                          {log.text}
                        </pre>
                      )}
                      {log.type === 'sys' && (
                        <div className="text-sky-300/80 text-[11px] bg-sky-950/30 p-1.5 rounded border border-sky-500/20">
                          ℹ️ {log.text}
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>

                {/* Sandbox Command Input */}
                <div className="p-2.5 bg-slate-900/95 border-t border-orange-500/30 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-orange-400 shrink-0">
                    kasm-user@sandbox:~$
                  </span>
                  <input
                    ref={sandboxInputRef}
                    type="text"
                    value={sandboxInput}
                    onChange={e => setSandboxInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSandboxRun()}
                    placeholder={`Test running ${activeCommand} safely in container...`}
                    className="flex-1 bg-transparent border-none text-white font-mono text-xs outline-none caret-orange-400"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSandboxRun()}
                    disabled={!sandboxInput.trim()}
                    className="px-3 py-1 rounded bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 border border-orange-500/50 text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    RUN TEST
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: COMMAND FLAGS & SAFETY PARAMETERS */}
            {activeTab === 'flags' && (
              <div className="space-y-4 relative z-10">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30">
                  <h3 className="font-mono text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    KEY OPERATIONAL FLAGS FOR [{activeCommand.toUpperCase()}]
                  </h3>
                  <p className="text-xs text-slate-300 font-sans mb-3">
                    In high-stress field missions across Glacier Kernel, mastering command flags prevents corrupted copies and accidental overwrites!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {coachData?.flagsToKnow && coachData.flagsToKnow.length > 0 ? (
                      coachData.flagsToKnow.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40">
                              {item.flag}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 font-sans">
                            {item.meaning}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-950/80 text-xs text-slate-400 font-mono">
                        No complex sub-flags needed for this fundamental command! Run it directly!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KASM VNC BOTTOM STATUS BAR */}
        <div className="p-2 sm:px-4 bg-slate-950 border-t border-sky-500/20 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-bold">KASM SECURE SESSION #01</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-sky-400 hidden sm:inline">
              Active Command: {activeCommand}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 hidden md:inline">
              "Three, two, one... SUDO!"
            </span>
            <button
              onClick={() => {
                sound.playNotebookSnap();
                onClose();
              }}
              className="px-3 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer shadow"
            >
              DISCONNECT [CLOSE]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
