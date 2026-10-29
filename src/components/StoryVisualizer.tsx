import React, { useEffect, useState } from 'react';
import { StoryPage, CharacterId } from '../types';
import { CHARACTERS } from '../data/characters';
import { CharacterIcon } from './CharacterIcon';
import { VirtualFileSystem } from '../utils/vfs';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Snowflake, Sparkles, CheckCircle2, ChevronRight, Waves, Radio, Anchor } from 'lucide-react';

interface StoryVisualizerProps {
  currentPage: StoryPage;
  totalPageCount: number;
  onAdvancePage: () => void;
  canAdvance: boolean;
  onTriggerCheer?: () => void;
  isCheered?: boolean;
  vfs?: VirtualFileSystem;
}

export const StoryVisualizer: React.FC<StoryVisualizerProps> = ({
  currentPage,
  totalPageCount,
  onAdvancePage,
  canAdvance,
  onTriggerCheer,
  isCheered,
  vfs
}) => {
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(0);

  useEffect(() => {
    setActiveDialogueIndex(0);
  }, [currentPage.pageNumber]);

  const activeDialogue = currentPage.dialogue[activeDialogueIndex] || currentPage.dialogue[0];
  const speaker = CHARACTERS[activeDialogue.speaker] || CHARACTERS.kali;

  const vaultFolder = currentPage.visualState.vaultName || 'vault';
  const hasVault = !!(
    vfs?.getNodeByPath(`/${vaultFolder}`) ||
    vfs?.getNodeByPath('/frost_vault') ||
    vfs?.getNodeByPath('/archive_vault') ||
    currentPage.visualState.vaultExists
  );

  // Dynamic capsule list evaluated against VFS
  const renderedCapsules = (() => {
    const baseCapsules = currentPage.visualState.capsules;
    if (baseCapsules.length === 0) return [];

    const origCap = baseCapsules.find(c => !c.isBackup) || baseCapsules[0];
    const backupCap = baseCapsules.find(c => c.isBackup);

    const origFilename = origCap?.filename || 'blueprint.cad';
    const backupFilename = backupCap?.filename || origFilename.replace('.cad', '_backup.cad');

    const origInHome = !!vfs?.getNodeByPath(`/home/kali/${origFilename}`);
    const backupInHome = !!vfs?.getNodeByPath(`/home/kali/${backupFilename}`);
    const backupInVault = !!(
      vfs?.getNodeByPath(`/${vaultFolder}/${backupFilename}`) ||
      vfs?.getNodeByPath(`/frost_vault/${backupFilename}`) ||
      vfs?.getNodeByPath(`/archive_vault/${backupFilename}`)
    );

    const list: Array<{
      id: string;
      filename: string;
      label: string;
      isBackup: boolean;
      inVault: boolean;
      color: 'gold' | 'cyan' | 'emerald' | 'amber';
    }> = [];

    if (origInHome || currentPage.pageNumber >= 2) {
      list.push({
        id: 'orig',
        filename: origFilename,
        label: origFilename,
        isBackup: false,
        inVault: false,
        color: 'gold'
      });
    }

    if (backupInVault) {
      list.push({
        id: 'backup',
        filename: backupFilename,
        label: `${backupFilename} (Vault Secured)`,
        isBackup: true,
        inVault: true,
        color: 'emerald'
      });
    } else if (backupInHome || currentPage.pageNumber >= 4) {
      list.push({
        id: 'backup',
        filename: backupFilename,
        label: backupFilename,
        isBackup: true,
        inVault: false,
        color: 'cyan'
      });
    }

    return list;
  })();

  const vehicleType = currentPage.visualState.vehicleType || 'rover';
  const containerShape = currentPage.visualState.containerShape || 'capsule';

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] bg-slate-950 flex flex-col min-h-[480px] lg:min-h-[530px]">
      {/* Dynamic Environment Stage */}
      <div className="relative flex-1 w-full overflow-hidden select-none">
        {/* Arctic Environment (Glacier Kernel) */}
        {currentPage.visualState.environment === 'arctic' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#041c32] to-[#0b2b40]">
            <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
              <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[80%] bg-gradient-to-r from-emerald-500/30 via-cyan-400/40 to-indigo-500/30 blur-3xl animate-pulse" />
              <div className="absolute -top-1/3 left-1/4 w-[120%] h-[70%] bg-gradient-to-r from-teal-400/20 via-sky-400/30 to-violet-500/20 blur-3xl" />
            </div>

            {/* Falling snow particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/70 animate-bounce"
                  style={{
                    width: `${Math.random() * 3 + 1.5}px`,
                    height: `${Math.random() * 3 + 1.5}px`,
                    left: `${(i * 5) % 100}%`,
                    top: `${(i * 8) % 100}%`,
                    animationDuration: `${Math.random() * 3 + 2.5}s`,
                    animationDelay: `${i * 0.15}s`,
                    opacity: 0.3 + (i % 5) * 0.12
                  }}
                />
              ))}
            </div>

            {/* Frozen High-Tech Outpost Platform */}
            <div className="absolute bottom-0 inset-x-4 lg:inset-x-12 h-28 bg-gradient-to-t from-cyan-950/80 to-slate-900/90 border-t-2 border-cyan-400/60 rounded-t-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-md">
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:28px_28px]" />
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4]" />
              <div className="absolute top-2 left-6 flex items-center gap-2 text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                Glacier Kernel Platform // Sub-Zero Node
              </div>
            </div>
          </div>
        )}

        {/* Lake Binary Environment (Aquatic Node) */}
        {currentPage.visualState.environment === 'lake' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#031525] via-[#052e4a] to-[#041c2c]">
            {/* Water Light Reflections */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.25)_0,transparent_60%)]" />

            {/* Gentle Water Ripples */}
            <div className="absolute inset-x-0 bottom-24 h-36 overflow-hidden pointer-events-none opacity-40">
              <div className="w-[200%] h-full bg-[repeating-linear-gradient(90deg,transparent_0_40px,rgba(56,189,248,0.15)_40px_80px)] animate-[pulse_4s_infinite]" />
            </div>

            {/* Wooden Dock Platform with Copper Bolted Accents */}
            <div className="absolute bottom-0 inset-x-4 lg:inset-x-12 h-28 bg-gradient-to-t from-amber-950/90 via-amber-900/80 to-stone-900 border-t-2 border-amber-400/70 rounded-t-3xl shadow-[0_0_35px_rgba(245,158,11,0.25)] backdrop-blur-md">
              <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,#f59e0b_2px,transparent_2px)] bg-[size:32px_100%]" />
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b]" />
              <div className="absolute top-2 left-6 flex items-center gap-2 text-[10px] font-mono text-amber-300 font-bold tracking-widest uppercase">
                <Anchor className="w-3.5 h-3.5 text-amber-400" />
                Lake Binary Wooden Dock // Slipway Alpha
              </div>
            </div>
          </div>
        )}

        {/* Sandstorm Environment */}
        {currentPage.visualState.environment === 'sandstorm' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c0e04] via-[#2d1808] to-[#120a04]">
            <div className="absolute inset-0 opacity-30 bg-amber-500/20 blur-2xl animate-pulse" />
            <div className="absolute bottom-0 inset-x-4 lg:inset-x-12 h-28 bg-amber-950/80 border-t-2 border-amber-400/60 rounded-t-3xl backdrop-blur-md" />
            <div className="absolute top-2 left-6 text-[10px] font-mono text-amber-400/80 tracking-widest uppercase">
              Solar Dune Relay // Particulate Level 84%
            </div>
          </div>
        )}

        {/* Dam Environment */}
        {currentPage.visualState.environment === 'dam' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#022c22] via-[#064e3b] to-[#021d17]">
            <div className="absolute inset-0 opacity-30 bg-emerald-400/20 blur-2xl" />
            <div className="absolute bottom-0 inset-x-4 lg:inset-x-12 h-28 bg-emerald-950/80 border-t-2 border-emerald-400/60 rounded-t-3xl backdrop-blur-md" />
            <div className="absolute top-2 left-6 text-[10px] font-mono text-emerald-400/80 tracking-widest uppercase">
              Cascade Hydro-Dam // Reservoir Telemetry
            </div>
          </div>
        )}

        {/* Volcano Environment */}
        {currentPage.visualState.environment === 'volcano' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a0808] via-[#450a0a] to-[#1a0505]">
            <div className="absolute inset-0 opacity-40 bg-red-500/25 blur-3xl animate-pulse" />
            <div className="absolute bottom-0 inset-x-4 lg:inset-x-12 h-28 bg-red-950/80 border-t-2 border-red-500/60 rounded-t-3xl backdrop-blur-md" />
            <div className="absolute top-2 left-6 text-[10px] font-mono text-red-400/80 tracking-widest uppercase">
              Magma Mount // Geothermal Substation Core
            </div>
          </div>
        )}

        {/* Default / Other Sci-Fi Environments */}
        {!['arctic', 'lake', 'sandstorm', 'dam', 'volcano'].includes(currentPage.visualState.environment) && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#020617]">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.25)_0,transparent_70%)]" />
            <div className="absolute bottom-0 inset-x-4 lg:inset-x-12 h-28 bg-slate-900 border-t-2 border-indigo-500/60 rounded-t-3xl backdrop-blur-md" />
            <div className="absolute top-2 left-6 text-[10px] font-mono text-indigo-300 tracking-widest uppercase">
              Cyber Node // {currentPage.subtitle || 'Active Sector'}
            </div>
          </div>
        )}

        {/* Interactive Delivery Vehicles, Blueprint Containers & Vault */}
        <div className="absolute inset-x-0 bottom-24 h-48 flex items-end justify-between px-6 lg:px-16 pointer-events-none">
          {/* Left Side: Delivery Vehicle (Submarine, Rover, Drone, Crawler, Glider) */}
          {(currentPage.visualState.vehicleArrived || currentPage.visualState.roverArrived) && (
            <motion.div
              initial={{ x: -160, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="relative flex flex-col items-center pointer-events-auto"
            >
              {vehicleType === 'submarine' ? (
                /* Tiny Delivery Submarine (as in Lake Binary script) */
                <div className="relative">
                  <div className="relative w-32 h-16 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-full border-2 border-yellow-200 shadow-[0_0_25px_rgba(234,179,8,0.6)] flex items-center justify-center">
                    {/* Periscope */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-5 border-l-2 border-t-2 border-amber-300 rounded-tl flex items-start">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                    </div>
                    {/* Porthole */}
                    <div className="w-6 h-6 rounded-full bg-cyan-900 border-2 border-white/50 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
                    </div>
                    {/* Rear Propeller */}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-8 bg-slate-800 rounded-full animate-spin" />
                  </div>
                  {/* Bubble Emitter */}
                  <div className="flex gap-1 justify-center mt-1">
                    <span className="w-2 h-2 rounded-full bg-sky-300/60 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-300/40 animate-bounce delay-100" />
                  </div>
                </div>
              ) : vehicleType === 'drone' ? (
                /* Flying Drone */
                <div className="relative">
                  <div className="w-28 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl border border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center justify-center">
                    <div className="w-3 h-3 bg-cyan-200 rounded-full animate-ping" />
                  </div>
                  <div className="absolute -top-3 -left-2 w-8 h-2 bg-slate-700 rounded animate-spin" />
                  <div className="absolute -top-3 -right-2 w-8 h-2 bg-slate-700 rounded animate-spin" />
                </div>
              ) : (
                /* Default Delivery Snow-Rover / Ground Crawler */
                <div className="relative">
                  <div className="relative w-32 h-16 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-xl border border-yellow-200/50 shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center">
                    <div className="absolute -top-3 right-4 w-5 h-5 bg-cyan-400/30 border border-cyan-400 rounded-full flex items-center justify-center animate-spin">
                      <div className="w-1.5 h-1.5 bg-cyan-200 rounded-full" />
                    </div>
                    <div className="text-[10px] font-mono font-bold text-slate-950 px-2 py-0.5 bg-yellow-300 rounded shadow-sm">
                      {currentPage.visualState.vehicleLabel || 'DELIVERY-01'}
                    </div>
                  </div>
                  <div className="flex justify-between w-32 -mt-1 px-1">
                    <div className="w-8 h-5 bg-slate-800 border border-slate-600 rounded-full shadow-inner animate-pulse" />
                    <div className="w-8 h-5 bg-slate-800 border border-slate-600 rounded-full shadow-inner animate-pulse" />
                    <div className="w-8 h-5 bg-slate-800 border border-slate-600 rounded-full shadow-inner animate-pulse" />
                  </div>
                </div>
              )}

              <div className="mt-1 text-[10px] font-mono text-amber-300 font-bold tracking-wider bg-slate-900/90 px-2 py-0.5 rounded border border-amber-400/40">
                [{currentPage.visualState.vehicleLabel || `Delivery ${vehicleType}`}]
              </div>
            </motion.div>
          )}

          {/* Center Stage: Containers (Cylinder, Capsule, Crystal) */}
          <div className="flex items-center gap-8 lg:gap-14 my-auto">
            {renderedCapsules.map(capsule => {
              const isOrig = !capsule.isBackup;
              return (
                <motion.div
                  key={capsule.id}
                  initial={{ scale: 0.2, opacity: 0, y: -20 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    y: [0, -8, 0],
                    x: capsule.inVault ? 80 : 0
                  }}
                  transition={{
                    y: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' },
                    x: { type: 'spring', damping: 20 },
                    scale: { duration: 0.4 }
                  }}
                  className="flex flex-col items-center pointer-events-auto group cursor-pointer"
                >
                  <div className="relative">
                    <div
                      className={`absolute -inset-3 rounded-full blur-md transition-all ${
                        capsule.color === 'gold'
                          ? 'bg-amber-400/40 group-hover:bg-amber-400/70'
                          : capsule.color === 'emerald'
                          ? 'bg-emerald-400/50 group-hover:bg-emerald-400/80'
                          : 'bg-cyan-400/50 group-hover:bg-cyan-400/80'
                      }`}
                    />

                    {/* Container Shape Rendering */}
                    {containerShape === 'cylinder' ? (
                      /* Glowing Glass Cylinder (from Lake Binary script) */
                      <div
                        className={`relative w-14 h-24 rounded-lg border-2 flex flex-col items-center justify-between p-2 backdrop-blur-md shadow-2xl ${
                          capsule.color === 'gold'
                            ? 'bg-gradient-to-b from-amber-200/40 via-yellow-400/20 to-amber-700/50 border-amber-300'
                            : capsule.color === 'emerald'
                            ? 'bg-gradient-to-b from-emerald-200/40 via-teal-400/20 to-emerald-700/50 border-emerald-300'
                            : 'bg-gradient-to-b from-cyan-200/40 via-sky-400/20 to-blue-700/50 border-cyan-300'
                        }`}
                      >
                        <div className="w-12 h-2.5 rounded bg-slate-800 border border-white/40 shadow-inner" />
                        <div className="flex flex-col items-center justify-center">
                          <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
                          <span className="text-[8px] font-mono font-black uppercase tracking-tighter mt-1 text-white">
                            .CAD
                          </span>
                        </div>
                        <div className="w-12 h-2.5 rounded bg-slate-800 border border-white/40 shadow-inner" />
                      </div>
                    ) : (
                      /* Classic Glowing Capsule */
                      <div
                        className={`relative w-16 h-24 rounded-full border-2 flex flex-col items-center justify-between p-2 backdrop-blur-md shadow-2xl ${
                          capsule.color === 'gold'
                            ? 'bg-gradient-to-b from-amber-300/30 via-yellow-500/20 to-amber-700/40 border-amber-300'
                            : capsule.color === 'emerald'
                            ? 'bg-gradient-to-b from-emerald-300/30 via-teal-500/20 to-emerald-800/40 border-emerald-300'
                            : 'bg-gradient-to-b from-cyan-300/30 via-sky-500/20 to-blue-800/40 border-cyan-300'
                        }`}
                      >
                        <div className="w-8 h-2 rounded-full bg-white/60 shadow-inner" />
                        <div className="flex flex-col items-center justify-center">
                          <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
                          <span className="text-[8px] font-mono font-black uppercase tracking-tighter mt-1 text-white">
                            .CAD
                          </span>
                        </div>
                        <div className="w-10 h-3 rounded-full bg-slate-900/80 border border-white/30 flex items-center justify-center">
                          <div className={`w-2 h-2 rounded-full animate-ping ${capsule.color === 'gold' ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className={`mt-2 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md flex items-center gap-1.5 shadow-lg ${
                      capsule.color === 'gold'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-400/50'
                        : capsule.color === 'emerald'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-400/50'
                        : 'bg-cyan-950/80 text-cyan-300 border-cyan-400/50'
                    }`}
                  >
                    {capsule.inVault && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    <span>{capsule.filename}</span>
                  </div>

                  <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                    {isOrig ? '(Original Golden Cylinder)' : capsule.inVault ? '(Vault Secured)' : '(Exact cp Replica)'}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Right Side: Dedicated Vault (e.g. /archive_vault/ or /frost_vault/) */}
          {hasVault && (
            <motion.div
              initial={{ scale: 0.4, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="relative flex flex-col items-center pointer-events-auto"
            >
              <div className="relative w-36 h-36 rounded-2xl bg-gradient-to-b from-cyan-900/40 via-sky-950/70 to-slate-950 border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(6,182,212,0.4)] backdrop-blur-xl flex flex-col items-center justify-center p-3 overflow-hidden">
                <div className="absolute inset-2 border border-cyan-400/30 rounded-xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0,transparent_70%)]" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 border-2 border-cyan-300 flex items-center justify-center mb-1 shadow-[0_0_15px_#06b6d4]">
                    <ShieldCheck className="w-6 h-6 text-cyan-300" />
                  </div>

                  <div className="text-[11px] font-mono font-bold text-cyan-200">
                    /{vaultFolder}/
                  </div>
                  <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 font-bold mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> SECURED
                  </div>
                </div>

                <Snowflake className="absolute -top-2 -right-2 w-7 h-7 text-cyan-300/40 rotate-12" />
                <Snowflake className="absolute -bottom-2 -left-2 w-6 h-6 text-cyan-300/30 -rotate-12" />
              </div>

              <div className="mt-1 text-[10px] font-mono text-cyan-300 font-bold bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-400/40">
                [Dedicated Safe Archive]
              </div>
            </motion.div>
          )}
        </div>

        {/* Cheer Ritual Modal / Overlay */}
        {currentPage.isCheerPage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/40 backdrop-blur-[2px]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-slate-900/95 border-2 border-cyan-400/70 rounded-2xl p-6 text-center shadow-[0_0_50px_rgba(6,182,212,0.3)]"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Synchronize Root Permissions
              </div>

              <h3 className="text-xl lg:text-2xl font-black text-white tracking-tight mb-2">
                “ROOT PERMISSIONS READY TO GO, THREE, TWO, ONE... SUDO!”
              </h3>

              <p className="text-sm text-cyan-100/80 mb-5 leading-relaxed">
                Kazz, Windel, Kali, and Debbie lock hands in the center of the circle to open the emerald terminal window.
              </p>

              <button
                onClick={onTriggerCheer}
                className="w-full py-3.5 px-6 rounded-xl font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200 transition-all shadow-[0_0_25px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2 text-base cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>⚡ LOCK HANDS & CHEER: SUDO!</span>
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Narrative & Dialogue Bottom Bar */}
      <div className="relative border-t border-cyan-500/20 bg-slate-900/90 backdrop-blur-md p-4 lg:p-5 flex flex-col gap-3">
        <div className="text-xs lg:text-sm text-slate-200 leading-relaxed space-y-1.5 font-medium border-l-2 border-cyan-400/60 pl-3">
          {currentPage.narrativeText.map((p, idx) => (
            <p key={idx} className="text-slate-200">
              {p}
            </p>
          ))}
        </div>

        {currentPage.dialogue.length > 0 && (
          <div className="flex items-start gap-3 pt-2 border-t border-slate-800">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${speaker.avatarBg} border p-2 flex items-center justify-center shrink-0 shadow-lg`}
              title={`${speaker.name} - ${speaker.title}`}
            >
              <CharacterIcon characterId={speaker.id} className="w-full h-full object-contain" />
            </div>

            <div className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 shadow-inner">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className="text-xs font-mono font-bold tracking-wider uppercase"
                  style={{ color: speaker.color }}
                >
                  {speaker.name} <span className="text-slate-500 text-[10px]">({speaker.title})</span>
                </span>

                {currentPage.dialogue.length > 1 && (
                  <div className="flex gap-1">
                    {currentPage.dialogue.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveDialogueIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === activeDialogueIndex ? 'bg-cyan-400 w-4' : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs lg:text-sm text-cyan-50 leading-relaxed font-sans">
                "{activeDialogue.text}"
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span className="text-cyan-400 font-bold">PAGE {currentPage.pageNumber} OF {totalPageCount}</span>
            <span>•</span>
            <span className="text-slate-300">{currentPage.title}</span>
          </div>

          <div className="flex items-center gap-2">
            {canAdvance ? (
              <button
                onClick={onAdvancePage}
                className="py-1.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all cursor-pointer animate-pulse"
              >
                <span>NEXT PAGE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>{currentPage.hintText || 'Type the command in the terminal to continue'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
