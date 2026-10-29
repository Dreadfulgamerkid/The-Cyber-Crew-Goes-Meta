export type CharacterId = 'kazz' | 'windel' | 'kali' | 'debbie' | 'narrator';

export interface Character {
  id: CharacterId;
  name: string;
  title: string;
  color: string;
  accentColor: string;
  avatarBg: string;
  tagline: string;
  gearDescription: string;
  personality: string;
  avatarIcon: string;
}

export interface FileItem {
  name: string;
  type: 'file' | 'dir';
  content?: string;
  exec?: boolean;
  hidden?: boolean;
  size?: number;
  updatedAt?: string;
  permissions?: string;
  owner?: string;
}

export interface VFSNode {
  type: 'file' | 'dir';
  content?: string;
  exec?: boolean;
  hidden?: boolean;
  permissions?: string;
  owner?: string;
  children?: Record<string, VFSNode>;
}

export interface DialogueEntry {
  speaker: CharacterId;
  text: string;
  emotion?: 'neutral' | 'excited' | 'thinking' | 'proud' | 'urgent' | 'smiling';
}

export interface VisualState {
  environment: 'arctic' | 'sandstorm' | 'dam' | 'volcano' | 'lake' | 'station' | 'canopy' | 'reef' | 'orbit' | 'cavern';
  auroraActive?: boolean;
  waterRipplesActive?: boolean;
  vehicleArrived?: boolean;
  vehicleType?: 'rover' | 'submarine' | 'drone' | 'crawler' | 'glider';
  vehicleLabel?: string;
  roverArrived?: boolean; // backwards compatibility
  roverHasCapsule?: boolean;
  containerShape?: 'capsule' | 'cylinder' | 'crystal';
  capsules: Array<{
    id: string;
    filename: string;
    label: string;
    isBackup: boolean;
    inVault: boolean;
    color: 'gold' | 'cyan' | 'emerald' | 'amber';
  }>;
  vaultExists?: boolean;
  vaultName?: string;
  vaultLocked?: boolean;
  cheerDone?: boolean;
  stormActive?: boolean;
  drainActive?: boolean;
  botRunning?: boolean;
}

export interface StoryPage {
  pageNumber: number;
  title: string;
  subtitle?: string;
  narrativeText: string[];
  dialogue: DialogueEntry[];
  visualState: VisualState;
  
  // Interactive command requirement
  isCheerPage?: boolean;
  requiredCommandDesc?: string;
  targetCommand?: string; // e.g. "cp solar_engine.cad solar_engine_backup.cad"
  targetCommandRegex?: RegExp;
  alternateValidCommands?: string[];
  hintText: string;
  expectedOutput?: string;
  commandMastered?: string;
  commandExplanation?: string;
}

export interface Adventure {
  id: string;
  number: number; // Episode number within book (1-4) or global
  globalNumber?: number;
  bookId?: string;
  bookNumber?: number;
  title: string;
  subtitle: string;
  catchphrase: string;
  environmentName: string;
  badge: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    bgGradient: string;
  };
  initialCwd: string;
  initialFs: Record<string, any>;
  pages: StoryPage[];
  masterySummary: {
    command: string;
    description: string;
    syntax: string;
    proTip: string;
  };
}

export interface Book {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  themeName: string;
  description: string;
  coverGradient: string;
  accentColor: string;
  badgeIcon: string;
  episodes: Adventure[];
}

export interface TerminalEntry {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'success';
  command?: string;
  cwd?: string;
  content: string;
  timestamp: string;
}

export interface CommandDoc {
  command: string;
  description: string;
  syntax: string;
  example: string;
  explanation: string;
  category: 'core' | 'navigation' | 'files' | 'processes' | 'security';
  masteredByAdventure?: string;
}
