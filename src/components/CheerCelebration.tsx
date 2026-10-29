import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import { CHARACTERS } from '../data/characters';
import { CharacterIcon } from './CharacterIcon';
import { Sparkles, Terminal } from 'lucide-react';

interface CheerCelebrationProps {
  show: boolean;
  onFinish: () => void;
}

export const CheerCelebration: React.FC<CheerCelebrationProps> = ({ show, onFinish }) => {
  useEffect(() => {
    if (show) {
      sound.playCheerFanfare();
      const timer = setTimeout(() => {
        onFinish();
      }, 3400);
      return () => clearTimeout(timer);
    }
  }, [show, onFinish]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg">
        {/* Particle and Aura Explosion */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/30 via-emerald-500/30 to-amber-500/30 rounded-full blur-3xl animate-pulse" />
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-lg w-full bg-slate-900 border-2 border-cyan-400 rounded-3xl p-6 lg:p-8 text-center shadow-[0_0_80px_rgba(6,182,212,0.6)] flex flex-col items-center"
        >
          {/* Holographic Glowing Header */}
          <div className="w-16 h-16 rounded-2xl bg-cyan-400/20 border-2 border-cyan-400 flex items-center justify-center text-3xl shadow-[0_0_20px_#06b6d4] mb-4">
            <Sparkles className="w-8 h-8 text-cyan-300 animate-spin" style={{ animationDuration: '4s' }} />
          </div>

          <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-2">
            Cyber Crew Synchronization Ritual
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug mb-4">
            “ROOT PERMISSIONS READY TO GO, THREE, TWO, ONE...{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 animate-pulse">
              SUDO!”
            </span>
          </h2>

          {/* The Four Friends Circle Visual */}
          <div className="flex items-center justify-center gap-4 my-4">
            {['kazz', 'windel', 'kali', 'debbie'].map((id, index) => {
              const char = CHARACTERS[id as keyof typeof CHARACTERS];
              return (
                <motion.div
                  key={id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: [0, -6, 0], opacity: 1 }}
                  transition={{
                    y: { repeat: Infinity, duration: 1.5, delay: index * 0.15 },
                    opacity: { duration: 0.3, delay: index * 0.1 }
                  }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${char.avatarBg} border-2 p-2.5 flex items-center justify-center shadow-lg`}
                  >
                    <CharacterIcon characterId={char.id} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-200 mt-1">
                    {char.name}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <p className="text-xs text-slate-300 font-sans mt-2 max-w-sm">
            Terminal energized with root permissions! Glacier Kernel platform online.
          </p>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-6">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.2, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
