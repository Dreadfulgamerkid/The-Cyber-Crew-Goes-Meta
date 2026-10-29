import { Character, CharacterId } from '../types';

export const CHARACTERS: Record<CharacterId, Character> = {
  kazz: {
    id: 'kazz',
    name: 'Kazz',
    title: 'Hardware & Recon Explorer',
    color: '#0ea5e9', // Kasm azure/cyan
    accentColor: '#38bdf8',
    avatarBg: 'from-sky-500/20 via-blue-500/20 to-slate-900/60 border-sky-400/50',
    tagline: 'Kasm Web powered explorer, fearless recon across every kernel.',
    gearDescription: 'Patchwork thermal parka, Kasm isolated workspace visor, and climbing harness.',
    personality: 'Bold, energetic, loves verifying files with ls and keeping the squad hyped.',
    avatarIcon: 'kazz'
  },
  windel: {
    id: 'windel',
    name: 'Windel',
    title: 'Systems Theorist & Data Scout',
    color: '#f59e0b', // amber
    accentColor: '#fbbf24',
    avatarBg: 'from-amber-500/20 via-yellow-500/20 to-slate-900/60 border-amber-400/50',
    tagline: 'Little paperclip scout with eyes on every command!',
    gearDescription: 'Bent wire silver paperclip body, expressive googly eyeballs, and yellow boots.',
    personality: 'Curious, bouncy, quick to recall commands like cp and mv, hyper-protective of blueprints.',
    avatarIcon: 'windel'
  },
  kali: {
    id: 'kali',
    name: 'Kali',
    title: 'Master Terminal Operator',
    color: '#06b6d4', // cyan
    accentColor: '#22d3ee',
    avatarBg: 'from-cyan-500/20 via-blue-500/20 to-slate-900/60 border-cyan-400/50',
    tagline: 'The hands on the floating terminal keyboard, wielding the Kali dragon.',
    gearDescription: 'Cybernetic headset, fingerless tactile gloves, and portable holographic terminal projector.',
    personality: 'Calm under pressure, precise typist, patient teacher of Linux principles.',
    avatarIcon: 'kali'
  },
  debbie: {
    id: 'debbie',
    name: 'Debbie',
    title: 'Site Reliability & Vault Architect',
    color: '#f43f5e', // Debian red swirl
    accentColor: '#fb7185',
    avatarBg: 'from-rose-500/20 via-red-500/20 to-slate-900/60 border-rose-400/50',
    tagline: 'Spiral notebook in hand, bearing the Debian red swirl of reliability.',
    gearDescription: 'Sturdy spiral-bound operations handbook, gel pen, and cryogenic seal validator.',
    personality: 'Methodical, organized, loves safe directories and closing her notebook with a crisp snap!',
    avatarIcon: 'debbie'
  },
  narrator: {
    id: 'narrator',
    name: 'System Log',
    title: 'Kernel Chronicle',
    color: '#818cf8',
    accentColor: '#a5b4fc',
    avatarBg: 'from-indigo-500/20 to-violet-500/20 border-indigo-400/40',
    tagline: 'The living story of Glacier Kernel and beyond.',
    gearDescription: 'Holographic narrative stream.',
    personality: 'Atmospheric, clear, guide to the adventure.',
    avatarIcon: 'narrator'
  }
};
