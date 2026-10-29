import { Book, Adventure, StoryPage, VisualState } from '../types';
import { LINUX_COMMANDS_81, LinuxCommandDoc } from './linuxCommands81';

export function createEpisodePages(params: {
  settingName: string;
  locationDescription: string;
  platformName: string;
  perilDescription: string;
  vehicleType: 'rover' | 'submarine' | 'drone' | 'crawler' | 'glider';
  vehicleName: string;
  containerShape: 'capsule' | 'cylinder' | 'crystal';
  blueprintFile: string;
  backupFile: string;
  vaultPath: string; // e.g. "/archive_vault"
  vaultDirName: string; // e.g. "archive_vault"
  environment: VisualState['environment'];
  waterActive?: boolean;
  command?: string;
  badge?: string;
  commandTarget?: string;
  commandExplanation?: string;
}): StoryPage[] {
  const {
    settingName,
    locationDescription,
    platformName,
    perilDescription,
    vehicleType,
    vehicleName,
    containerShape,
    blueprintFile,
    backupFile,
    vaultPath,
    vaultDirName,
    environment,
    waterActive
  } = params;

  const primaryCmd = (params.command || params.badge || 'cp').toLowerCase();
  const cmdDoc = LINUX_COMMANDS_81.find(c => c.command.toLowerCase() === primaryCmd);

  // Customized Page 3 command details depending on command
  let page3Title = `Page 3 - The ${primaryCmd.toUpperCase()} Command`;
  let page3TargetCommand = `cp ${blueprintFile} ${backupFile}`;
  let page3AlternateCommands: string[] = [`cp ${blueprintFile} ${backupFile}`, `cp -p ${blueprintFile} ${backupFile}`];
  let page3Explanation = cmdDoc?.description || `${primaryCmd} is an essential Linux field operations tool.`;
  let page3NarrativeKali = `We must operate with system precision. Who knows our brand-new command: ${primaryCmd}?`;
  let page3NarrativeWindel = `It's short, simple, and reliable... That's right! ${primaryCmd}!`;
  let page3ActionEffect = `Ping! Kali executed ${primaryCmd} with root precision, securing ${blueprintFile} in the active node!`;
  let page3ExpectedOutput = '';

  if (primaryCmd === 'ls') {
    page3Title = `Page 3 - Sweep Directory With LS`;
    page3TargetCommand = `ls -la`;
    page3AlternateCommands = ['ls', 'ls -la', 'ls -l', 'ls -a'];
    page3Explanation = 'ls inspects directory contents and reveals timestamps and permissions.';
    page3NarrativeKali = `Before we touch anything, we need to inspect all loaded mission files in our working directory. What command do we use?`;
    page3NarrativeWindel = `List contents... That's right! ls!`;
    page3ActionEffect = `RADAR! All active directory files illuminated on screen in vivid turquoise!`;
  } else if (primaryCmd === 'pwd') {
    page3Title = `Page 3 - Verify Coordinates With PWD`;
    page3TargetCommand = `pwd`;
    page3AlternateCommands = ['pwd'];
    page3Explanation = 'pwd prints the absolute working directory path to confirm exact coordinates.';
    page3NarrativeKali = `In this intricate network of directory branches, we must verify our exact location before proceeding. What is our path command?`;
    page3NarrativeWindel = `Print working directory... That's right! pwd!`;
    page3ActionEffect = `GPS LOCK! The terminal output displayed the full absolute path of our current node!`;
    page3ExpectedOutput = `/home/kali`;
  } else if (primaryCmd === 'cd') {
    page3Title = `Page 3 - Navigate Node With CD`;
    page3TargetCommand = `cd ${vaultPath}`;
    page3AlternateCommands = [`cd ${vaultPath}`, `cd ${vaultDirName}`, `cd ..`, `cd ~`];
    page3Explanation = 'cd navigates between directory branches in the filesystem tree.';
    page3NarrativeKali = `We need to navigate directly into our secure containment vault. Who knows our traversal command?`;
    page3NarrativeWindel = `Change directory... That's right! cd!`;
    page3ActionEffect = `WHOOSH! The terminal prompt shifted focus directly into ${vaultPath}!`;
  } else if (primaryCmd === 'mkdir') {
    page3Title = `Page 3 - Vault Creation With MKDIR`;
    page3TargetCommand = `mkdir ${vaultPath}`;
    page3AlternateCommands = [`mkdir ${vaultPath}`, `mkdir -p ${vaultPath}`, `mkdir ${vaultDirName}`];
    page3Explanation = 'mkdir creates dedicated directory folders for secure compartmentalization.';
    page3NarrativeKali = `We cannot leave files unprotected in the common path. We must construct a dedicated archive vault! Who knows our directory maker?`;
    page3NarrativeWindel = `Make directory... That's right! mkdir!`;
    page3ActionEffect = `CLANK! A reinforced heavy-duty cyber-vault materialized in the directory tree at ${vaultPath}!`;
  } else if (primaryCmd === 'mv') {
    page3Title = `Page 3 - Archive Relocation With MV`;
    page3TargetCommand = `mv ${backupFile} ${vaultPath}/`;
    page3AlternateCommands = [`mv ${backupFile} ${vaultPath}/`, `mv ${backupFile} ${vaultPath}`, `mv ${blueprintFile} ${vaultPath}/`];
    page3Explanation = 'mv relocates or renames files safely into target storage chambers.';
    page3NarrativeKali = `The payload is prepared! Now we must transfer it safely into our dedicated vault. Who knows our mover command?`;
    page3NarrativeWindel = `Two letters, swift and clean... That's right! mv!`;
    page3ActionEffect = `WHOOSH! The glowing ${containerShape} glided smoothly across the terminal gantry into ${vaultPath}/!`;
  } else if (primaryCmd === 'cp') {
    page3Title = `Page 3 - The CP Copy Command`;
    page3TargetCommand = `cp ${blueprintFile} ${backupFile}`;
    page3AlternateCommands = [`cp ${blueprintFile} ${backupFile}`, `cp -p ${blueprintFile} ${backupFile}`];
    page3Explanation = 'cp creates an exact duplicate of a file while leaving the original intact.';
    page3NarrativeKali = `We don't just move files around—we make duplicates so we always have a safety net. Who knows our brand-new command for making an exact copy?`;
    page3NarrativeWindel = `It's short, simple, and stands for copy... That's right! cp!`;
    page3ActionEffect = `Ping! A second glowing ${containerShape} identical to the first materialized right beside the original.`;
  } else if (primaryCmd === 'rm') {
    page3Title = `Page 3 - Clean Redundant Cache With RM`;
    page3TargetCommand = `rm ${blueprintFile}.old`;
    page3AlternateCommands = [`rm ${blueprintFile}.old`, `rm -f ${blueprintFile}.old`, `rm temp_cache.log`];
    page3Explanation = 'rm purges stale, corrupt, or obsolete files from storage.';
    page3NarrativeKali = `An outdated temporary cache is clogging the telemetry channel. Who knows our clean-up remover command?`;
    page3NarrativeWindel = `Remove file... That's right! rm!`;
    page3ActionEffect = `ZAP! The corrupt temporary file vanished cleanly, freeing up terminal buffers!`;
  } else if (primaryCmd === 'touch') {
    page3Title = `Page 3 - Initialize Sensor With TOUCH`;
    page3TargetCommand = `touch ${blueprintFile}`;
    page3AlternateCommands = [`touch ${blueprintFile}`];
    page3Explanation = 'touch initializes blank files or updates timestamp metadata instantly.';
    page3NarrativeKali = `We need to initialize a fresh, zero-byte sensor beacon file to log incoming telemetry pulses. Who knows our file creator?`;
    page3NarrativeWindel = `A gentle keystroke... That's right! touch!`;
    page3ActionEffect = `PING! A new crystal sensor beacon registered instantly in the filesystem table!`;
  } else if (primaryCmd === 'ln') {
    page3Title = `Page 3 - Symbolic Shortcut With LN`;
    page3TargetCommand = `ln -s ${blueprintFile} ${blueprintFile}.link`;
    page3AlternateCommands = [`ln -s ${blueprintFile} ${blueprintFile}.link`, `ln ${blueprintFile} link`];
    page3Explanation = 'ln creates symbolic links or shortcuts to access files from other nodes.';
    page3NarrativeKali = `We need a rapid shortcut link from the root terminal to this blueprint. Who knows our link command?`;
    page3NarrativeWindel = `Link files... That's right! ln!`;
    page3ActionEffect = `BEAM! An optic-fiber symbolic link bridged the gap between folders!`;
  } else if (primaryCmd === 'clear') {
    page3Title = `Page 3 - Terminal Declutter With CLEAR`;
    page3TargetCommand = `clear`;
    page3AlternateCommands = ['clear'];
    page3Explanation = 'clear wipes visual clutter from the screen to provide maximum focus.';
    page3NarrativeKali = `Telemetry data is overflowing the terminal buffer! We must refresh the screen. What command wipes the display?`;
    page3NarrativeWindel = `Clear the view... That's right! clear!`;
    page3ActionEffect = `SHINE! The terminal screen flashed pristine black, clean and ready!`;
  } else if (primaryCmd === 'cat') {
    page3Title = `Page 3 - Inspect With CAT`;
    page3TargetCommand = `cat ${blueprintFile}`;
    page3AlternateCommands = [`cat ${blueprintFile}`, `head ${blueprintFile}`];
    page3Explanation = 'cat prints file contents directly to the terminal for rapid telemetry inspection.';
    page3NarrativeKali = `Before we archive or relocate the file, we must inspect its internal telemetry. Who knows our display command?`;
    page3NarrativeWindel = `Concatenate and display... That's right! cat!`;
    page3ActionEffect = `CHIME! The internal schematics of ${blueprintFile} projected in luminous glyphs!`;
    page3ExpectedOutput = `[CYBER_BLUEPRINT: ${blueprintFile.toUpperCase()}]\nSTATUS: ONLINE & VERIFIED`;
  } else if (primaryCmd === 'grep') {
    page3Title = `Page 3 - Filter With GREP`;
    page3TargetCommand = `grep CRITICAL ${blueprintFile}`;
    page3AlternateCommands = [`grep CRITICAL ${blueprintFile}`, `grep -i critical ${blueprintFile}`];
    page3Explanation = 'grep scans files for matching patterns and filters out sensor noise.';
    page3NarrativeKali = `This sensor stream is massive! We must isolate the critical frequency alarm pattern immediately. Who knows our pattern scanner?`;
    page3NarrativeWindel = `Global regular expression print... That's right! grep!`;
    page3ActionEffect = `BEEP! The critical alarm frequency isolated on screen with amber highlights!`;
    page3ExpectedOutput = `CRITICAL: Frequency deviation in ${blueprintFile} - immediate containment required!`;
  } else if (primaryCmd === 'chmod') {
    page3Title = `Page 3 - Permissions With CHMOD`;
    page3TargetCommand = `chmod +x ${blueprintFile}`;
    page3AlternateCommands = [`chmod +x ${blueprintFile}`, `chmod 755 ${blueprintFile}`];
    page3Explanation = 'chmod changes file permissions, enabling executable script rights.';
    page3NarrativeKali = `The emergency shield routine is locked in read-only mode! We must grant execute rights. Who knows our mode changer?`;
    page3NarrativeWindel = `Change mode bits... That's right! chmod!`;
    page3ActionEffect = `FLASH! The permission flags switched to executable (-rwxr-xr-x) with a green aura!`;
  } else if (primaryCmd === 'ps') {
    page3Title = `Page 3 - Process Monitor With PS`;
    page3TargetCommand = `ps aux`;
    page3AlternateCommands = ['ps', 'ps aux', 'ps -ef'];
    page3Explanation = 'ps inspects currently running tasks, PIDs, and resource consumption.';
    page3NarrativeKali = `Sensors indicate a rogue background task consuming excessive CPU cycles! What command lists active processes?`;
    page3NarrativeWindel = `Process status... That's right! ps!`;
    page3ActionEffect = `SCAN! All active process threads and PIDs displayed on the diagnostic terminal!`;
  } else if (primaryCmd === 'kill' || primaryCmd === 'killall') {
    page3Title = `Page 3 - Terminate Task With KILL`;
    page3TargetCommand = `kill 404`;
    page3AlternateCommands = ['kill 404', 'kill -9 404', 'killall rogue_bot'];
    page3Explanation = 'kill sends termination signals to rogue processes by process ID.';
    page3NarrativeKali = `PID 404 is spinning out of control! We must cleanly terminate this task before system crash. Who knows the terminator command?`;
    page3NarrativeWindel = `Send termination signal... That's right! kill!`;
    page3ActionEffect = `ZAP! Process 404 halted instantly, stabilizing thermal readings!`;
  } else if (primaryCmd === 'df') {
    page3Title = `Page 3 - Storage Capacity With DF`;
    page3TargetCommand = `df -h`;
    page3AlternateCommands = ['df', 'df -h'];
    page3Explanation = 'df displays disk filesystem space allocation and remaining capacity.';
    page3NarrativeKali = `We must verify free disk capacity before transmitting massive blueprint archives. What command checks disk free space?`;
    page3NarrativeWindel = `Disk filesystem free... That's right! df!`;
    page3ActionEffect = `GAUGE! Storage partition readouts reported 76% available clean capacity!`;
  } else {
    // Dynamic universal generator for any Linux command
    page3Title = `Page 3 - Execute With ${primaryCmd.toUpperCase()}`;
    page3TargetCommand = cmdDoc?.syntax.split('\n')[0] || `${primaryCmd} ${blueprintFile}`;
    if (page3TargetCommand.includes('<file>') || page3TargetCommand.includes('<filename>')) {
      page3TargetCommand = `${primaryCmd} ${blueprintFile}`;
    }
    page3AlternateCommands = [page3TargetCommand, `${primaryCmd}`, `sudo ${page3TargetCommand}`];
    page3Explanation = cmdDoc?.description || `Mastering ${primaryCmd} ensures total reliability in cyber operations.`;
    page3NarrativeKali = `For this mission, we need to leverage Linux ${primaryCmd}. Who knows our reliability command?`;
    page3NarrativeWindel = `Essential command ready... That's right! ${primaryCmd}!`;
    page3ActionEffect = `PING! ${primaryCmd.toUpperCase()} executed successfully across the terminal bus!`;
  }

  return [
    {
      pageNumber: 1,
      title: 'Page 1 - The Cheer',
      subtitle: `${settingName} Morning Synchronize`,
      isCheerPage: true,
      narrativeText: [
        `The morning sunlight danced across ${locationDescription}. Kazz, Windel, Kali, and Debbie gathered on ${platformName}, eager for their next challenge.`,
        'They locked hands in the center of the circle, looked up, and cheered in unison: "Root permissions, ready to go! Three, two, one... SUDO!" A bright emerald terminal window popped open with a pleasant chime.'
      ],
      dialogue: [
        { speaker: 'kazz', text: 'Another day, another challenge to solve! Let\'s synchronize!', emotion: 'excited' },
        { speaker: 'windel', text: 'Specs adjusted, boots locked, ready for action!', emotion: 'smiling' },
        { speaker: 'debbie', text: 'Spiral notebook ready. On three!', emotion: 'proud' },
        { speaker: 'kali', text: 'Three, two, one... SUDO!', emotion: 'excited' }
      ],
      visualState: {
        environment,
        waterRipplesActive: waterActive,
        auroraActive: environment === 'arctic',
        cheerDone: false,
        capsules: []
      },
      hintText: 'Click the cheer button or type "sudo cheer" to launch the adventure!'
    },
    {
      pageNumber: 2,
      title: 'Page 2 - Special Delivery',
      subtitle: `The Golden Blueprint: ${blueprintFile}`,
      narrativeText: [
        `Suddenly, a tiny delivery ${vehicleType} (${vehicleName}) arrived beside ${platformName}. It carried a single, glowing ${containerShape} containing a rare golden blueprint named ${blueprintFile}.`,
        `"Special delivery!" Windel gasped, pushing his square glasses up his nose. "It's the only copy of the town's backup plan! But what if ${perilDescription}? If we only have one copy, we could lose it forever!"`,
        `"He is right," Debbie said, flipping to a clean page in her spiral notebook. "A system without a backup is a system waiting to fail. We must master ${primaryCmd} and ensure this data is protected."`
      ],
      dialogue: [
        { speaker: 'windel', text: `Special delivery! It's the only copy of ${blueprintFile}! What if a disaster strikes?`, emotion: 'urgent' },
        { speaker: 'debbie', text: 'He is right. A system without a backup is a system waiting to fail. We must safeguard and verify this data.', emotion: 'thinking' },
        { speaker: 'kazz', text: 'Look at that blueprint shimmer. Let\'s make sure we handle it safely!', emotion: 'excited' },
        { speaker: 'kali', text: `Open the floating terminal — we're going to master ${primaryCmd}!`, emotion: 'smiling' }
      ],
      visualState: {
        environment,
        waterRipplesActive: waterActive,
        auroraActive: environment === 'arctic',
        vehicleArrived: true,
        vehicleType,
        vehicleLabel: vehicleName,
        containerShape,
        capsules: [
          { id: 'orig', filename: blueprintFile, label: blueprintFile, isBackup: false, inVault: false, color: 'gold' }
        ]
      },
      hintText: 'Inspect the blueprint delivery, then open the terminal to execute the command!'
    },
    {
      pageNumber: 3,
      title: page3Title,
      subtitle: `Running ${page3TargetCommand}`,
      narrativeText: [
        `Kali smiled, stepping up to the floating terminal. "${page3NarrativeKali}"`,
        `Windel bounced on his yellow sneakers, looking right out at the reader. "${page3NarrativeWindel}"`,
        `Kali entered the command into the terminal: ${page3TargetCommand}`,
        page3ActionEffect
      ],
      dialogue: [
        { speaker: 'kali', text: page3NarrativeKali, emotion: 'smiling' },
        { speaker: 'windel', text: page3NarrativeWindel, emotion: 'excited' },
        { speaker: 'kali', text: `Type: ${page3TargetCommand} into the terminal!`, emotion: 'neutral' }
      ],
      visualState: {
        environment,
        waterRipplesActive: waterActive,
        auroraActive: environment === 'arctic',
        vehicleArrived: true,
        vehicleType,
        containerShape,
        capsules: [
          { id: 'orig', filename: blueprintFile, label: blueprintFile, isBackup: false, inVault: false, color: 'gold' },
          ...(primaryCmd === 'cp' ? [{ id: 'backup', filename: backupFile, label: backupFile, isBackup: true, inVault: false, color: 'cyan' as const }] : [])
        ]
      },
      requiredCommandDesc: `Execute ${page3TargetCommand}`,
      targetCommand: page3TargetCommand,
      alternateValidCommands: page3AlternateCommands,
      hintText: `Type: ${page3TargetCommand}`,
      expectedOutput: page3ExpectedOutput,
      commandMastered: primaryCmd,
      commandExplanation: page3Explanation
    },
    {
      pageNumber: 4,
      title: 'Page 4 - Verify With LS',
      subtitle: 'Listing & Inspecting Directory',
      narrativeText: [
        '"Perfect!" Kazz said, his bright jacket shimmering. "Now let\'s verify our directory contents."',
        '"What command do we use to list everything in our current folder?"',
        `"ls!" Kazz replied. Kali typed ls, and the terminal showed:`,
        `ls\n${blueprintFile}${primaryCmd === 'cp' ? `\n${backupFile}` : ''}`
      ],
      dialogue: [
        { speaker: 'kazz', text: 'Now let\'s verify everything in our folder!', emotion: 'excited' },
        { speaker: 'windel', text: 'What command do we use to list everything in our current folder?', emotion: 'thinking' },
        { speaker: 'kazz', text: 'ls!', emotion: 'smiling' },
        { speaker: 'kali', text: 'Type ls in the terminal to inspect the directory contents!', emotion: 'neutral' }
      ],
      visualState: {
        environment,
        waterRipplesActive: waterActive,
        auroraActive: environment === 'arctic',
        vehicleArrived: true,
        vehicleType,
        containerShape,
        capsules: [
          { id: 'orig', filename: blueprintFile, label: blueprintFile, isBackup: false, inVault: false, color: 'gold' },
          { id: 'backup', filename: backupFile, label: backupFile, isBackup: true, inVault: false, color: 'cyan' }
        ]
      },
      requiredCommandDesc: 'List the files to verify directory state',
      targetCommand: 'ls',
      alternateValidCommands: ['ls -l', 'ls -la', 'ls -a'],
      hintText: 'Type: ls',
      expectedOutput: `${blueprintFile}  ${backupFile}`,
      commandMastered: 'ls',
      commandExplanation: 'ls displays directory contents so you can confirm file existence.'
    },
    {
      pageNumber: 5,
      title: 'Page 5 - Make The Vault And Move It',
      subtitle: `mkdir ${vaultPath} & mv`,
      narrativeText: [
        `"Now, let's create a dedicated backup folder so they don't get mixed up," Debbie suggested. Kali typed: mkdir ${vaultPath}`,
        `"And finally, let's move only the backup into the new vault using our mover command: mv!" Windel cheered. Kali executed the final line: mv ${backupFile} ${vaultPath}/`,
        `WHOOSH! The duplicate ${containerShape} glided smoothly into the sturdy vault, locking safely into place with a warm green checkmark.`,
        `Terminal showed:\n$ mkdir ${vaultPath}\n$ mv ${backupFile} ${vaultPath}/\n$`
      ],
      dialogue: [
        { speaker: 'debbie', text: `Now, let's create a dedicated backup folder so they don't get mixed up. Type: mkdir ${vaultPath}`, emotion: 'thinking' },
        { speaker: 'windel', text: 'And finally, let\'s move only the backup into the new vault using our mover command: mv!', emotion: 'excited' },
        { speaker: 'kali', text: `Step 1: mkdir ${vaultPath}\nStep 2: mv ${backupFile} ${vaultPath}/`, emotion: 'smiling' }
      ],
      visualState: {
        environment,
        waterRipplesActive: waterActive,
        auroraActive: environment === 'arctic',
        vehicleArrived: true,
        vehicleType,
        vaultExists: true,
        vaultName: vaultDirName,
        vaultLocked: true,
        containerShape,
        capsules: [
          { id: 'orig', filename: blueprintFile, label: blueprintFile, isBackup: false, inVault: false, color: 'gold' },
          { id: 'backup', filename: backupFile, label: backupFile, isBackup: true, inVault: true, color: 'cyan' }
        ]
      },
      requiredCommandDesc: `Create ${vaultPath} and move ${backupFile} inside`,
      targetCommand: `mkdir ${vaultPath}`,
      alternateValidCommands: [
        `mkdir ${vaultPath}`,
        `mv ${backupFile} ${vaultPath}/`,
        `mv ${backupFile} ${vaultPath}`
      ],
      hintText: `Step 1: Type "mkdir ${vaultPath}". Step 2: Type "mv ${backupFile} ${vaultPath}/".`,
      expectedOutput: '',
      commandMastered: 'mv',
      commandExplanation: 'mkdir creates dedicated folders, and mv moves files safely into target archives.'
    },
    {
      pageNumber: 6,
      title: 'Page 6 - Safe!',
      subtitle: `Mission Accomplished: [${primaryCmd.toUpperCase()}] Mastered`,
      narrativeText: [
        'Debbie closed her notebook with a satisfying snap. "Backup created, original preserved, directory safe."',
        `The four friends lined up along ${platformName}, smiling proudly.`,
        `"You just learned ${primaryCmd}—one of the most powerful safety tools in the entire system," Kali said with a warm grin. "Practice it 20 times in field terminal operations to earn official DreadfulSolutions certification!"`,
        `[Command Mission Complete: ${primaryCmd}]`
      ],
      dialogue: [
        { speaker: 'debbie', text: 'Backup created, original preserved, directory safe.', emotion: 'proud' },
        { speaker: 'kazz', text: `${settingName} data is 100% secured!`, emotion: 'excited' },
        { speaker: 'windel', text: `I love ${primaryCmd}! Essential cyber tool in action!`, emotion: 'smiling' },
        { speaker: 'kali', text: `You just used ${primaryCmd}. Keep practicing to master it in Debbie's log!`, emotion: 'smiling' }
      ],
      visualState: {
        environment,
        waterRipplesActive: waterActive,
        auroraActive: environment === 'arctic',
        vehicleArrived: true,
        vehicleType,
        vaultExists: true,
        vaultName: vaultDirName,
        vaultLocked: true,
        containerShape,
        capsules: [
          { id: 'orig', filename: blueprintFile, label: `${blueprintFile} (Preserved)`, isBackup: false, inVault: false, color: 'gold' },
          { id: 'backup', filename: backupFile, label: `${backupFile} (Vault Secured)`, isBackup: true, inVault: true, color: 'emerald' }
        ]
      },
      hintText: `Mission Complete! Execute ${primaryCmd} across field adventures to reach 20 uses and officially master it!`,
      commandMastered: primaryCmd
    }
  ];
}

export function buildStandardEpisode(params: {
  id: string;
  number: number;
  globalNumber: number;
  bookId: string;
  bookNumber: number;
  title: string;
  subtitle: string;
  settingName: string;
  locationDescription: string;
  platformName: string;
  perilDescription: string;
  vehicleType: 'rover' | 'submarine' | 'drone' | 'crawler' | 'glider';
  vehicleName: string;
  containerShape: 'capsule' | 'cylinder' | 'crystal';
  blueprintFile: string;
  vaultName: string;
  environment: VisualState['environment'];
  waterActive?: boolean;
  command?: string;
  badge?: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    bgGradient: string;
  };
}): Adventure {
  const primaryCmd = params.command || params.badge || 'cp';
  const backupFile = params.blueprintFile.includes('.')
    ? params.blueprintFile.replace(/\.([a-z0-9]+)$/i, '_backup.$1')
    : `${params.blueprintFile}_backup.cad`;
  const vaultPath = `/${params.vaultName}`;

  let fileContent = `CYBER_BLUEPRINT [${params.blueprintFile.toUpperCase()}]\nAuthor: The Cyber Crew\nStatus: VALIDATED.`;
  if (primaryCmd === 'cat') {
    fileContent = `[CYBER_BLUEPRINT: ${params.blueprintFile.toUpperCase()}]\nFREQUENCY: 1420.405 MHz\nSTATUS: ONLINE & STABLE\nPOWER: 100% NOMINAL\nENCRYPTION: SHA-256 VALIDATED`;
  } else if (primaryCmd === 'grep') {
    fileContent = `[TELEMETRY LOG STREAM: ${params.blueprintFile.toUpperCase()}]\nINFO: Sensor node initialized\nCRITICAL: Frequency deviation in ${params.blueprintFile} - immediate containment required!\nINFO: Packet retry rate: 0.01%`;
  } else if (primaryCmd === 'chmod') {
    fileContent = `#!/bin/bash\n# Emergency Defense Shield Controller\necho "SHIELD ACTIVATED"\nexit 0`;
  }

  return {
    id: params.id,
    number: params.number,
    globalNumber: params.globalNumber,
    bookId: params.bookId,
    bookNumber: params.bookNumber,
    title: params.title,
    subtitle: params.subtitle,
    catchphrase: 'ROOT PERMISSIONS READY TO GO, THREE, TWO, ONE... SUDO!',
    environmentName: params.settingName,
    badge: primaryCmd,
    theme: params.theme,
    initialCwd: '/home/kali',
    initialFs: {
      home: {
        type: 'dir',
        children: {
          kali: {
            type: 'dir',
            children: {
              [params.blueprintFile]: {
                type: 'file',
                content: fileContent,
                exec: primaryCmd === 'chmod' ? false : undefined
              },
              ...(primaryCmd === 'diff'
                ? {
                    [backupFile]: {
                      type: 'file',
                      content: fileContent.replace('1420.405', '1420.499')
                    }
                  }
                : {})
            }
          }
        }
      }
    },
    masterySummary: {
      command: primaryCmd,
      description: `The Linux ${primaryCmd} command. Essential for cyber safety operations.`,
      syntax: `${primaryCmd} ${params.blueprintFile}`,
      proTip: `Execute ${primaryCmd} 20 times in the field to earn Debbie's official DreadfulSolutions seal!`
    },
    pages: createEpisodePages({
      settingName: params.settingName,
      locationDescription: params.locationDescription,
      platformName: params.platformName,
      perilDescription: params.perilDescription,
      vehicleType: params.vehicleType,
      vehicleName: params.vehicleName,
      containerShape: params.containerShape,
      blueprintFile: params.blueprintFile,
      backupFile,
      vaultPath,
      vaultDirName: params.vaultName,
      environment: params.environment,
      waterActive: params.waterActive,
      command: primaryCmd,
      badge: primaryCmd
    })
  };
}

// 16 Thematic Worlds mapped to the 81 Linux commands
// First 50 commands = Books 1 to 10 (each book has 5 episodes, total 50 episodes)
// Remaining 31 commands = Books 11 to 16 (Books 11-15 have 5 episodes, Book 16 has 6 episodes)
// MIN EPISODES PER BOOK = 4, MAX EPISODES PER BOOK = 7!
interface BookThemeDef {
  bookNumber: number;
  title: string;
  subtitle: string;
  themeName: string;
  description: string;
  coverGradient: string;
  accentColor: string;
  badgeIcon: string;
  environment: VisualState['environment'];
  vehicleType: 'rover' | 'submarine' | 'drone' | 'crawler' | 'glider';
  placeName: string;
  locationDesc: string;
  platformName: string;
  vaultPrefix: string;
  perils: string[];
  files: string[];
}

const BOOK_THEMES: BookThemeDef[] = [
  {
    bookNumber: 1,
    title: 'Book 1: The Glacier Kernel Chronicles',
    subtitle: 'Foundations of Navigation & Filesystems',
    themeName: 'Glacier Kernel (Sub-Zero Outpost)',
    description: 'The Cyber Crew braves the sub-zero snowfields of Glacier Kernel to master essential directory and storage operations.',
    coverGradient: 'from-cyan-900 via-sky-950 to-slate-950',
    accentColor: '#06b6d4',
    badgeIcon: '❄️',
    environment: 'arctic',
    vehicleType: 'rover',
    placeName: 'Outpost Zero',
    locationDesc: 'the sparkling snowfields of Glacier Kernel',
    platformName: 'the frozen platform',
    vaultPrefix: 'frost_vault',
    perils: ['a sudden blizzard hits the outpost', 'sub-zero temperatures freeze cooling pipes', 'an ice-crevasse opens near the perimeter', 'aurora interference disrupts sensors', 'thermal dissipation drops below threshold'],
    files: ['heater_core.cad', 'outpost_status.txt', 'kernel_nodes.conf', 'glacier_route.map', 'sensor_beacon.dat']
  },
  {
    bookNumber: 2,
    title: 'Book 2: The Frost-Proof Backup Archives',
    subtitle: 'Replication, Linkages & Clean Terminals',
    themeName: 'Glacier Kernel Deep Vaults',
    description: 'Deep in the sub-surface ice caverns, Debbie and Kali set up redundant backup capsules and clean telemetry links.',
    coverGradient: 'from-blue-900 via-slate-950 to-slate-950',
    accentColor: '#38bdf8',
    badgeIcon: '🧊',
    environment: 'arctic',
    vehicleType: 'rover',
    placeName: 'Deep Glacier Archive',
    locationDesc: 'the crystalline ice needles of Deep Archive',
    platformName: 'the reinforced steel gantry',
    vaultPrefix: 'archive_vault',
    perils: ['seismic ice tremors rattle the datacenter', 'frost build-up threatens optical couplings', 'stale cache blocks memory buffers', 'broken symbolic links confuse the rover', 'frozen conduit lines need immediate flush'],
    files: ['deep_vault_key.pem', 'ice_floe_mesh.cad', 'subzero_link.conf', 'frost_backup.iso', 'terminal_buffer.log']
  },
  {
    bookNumber: 3,
    title: 'Book 3: The Aquatic Nodes of Lake Binary',
    subtitle: 'Telemetry Streaming & System Discovery',
    themeName: 'Lake Binary Sub-Aquatic Station',
    description: 'Submerged research outposts require live text inspection, paged reading, and operating system kernel telemetry verification.',
    coverGradient: 'from-teal-900 via-cyan-950 to-slate-950',
    accentColor: '#14b8a6',
    badgeIcon: '🌊',
    environment: 'lake',
    vehicleType: 'submarine',
    placeName: 'Sub-Surface Biosphere',
    locationDesc: 'the illuminated azure currents of Lake Binary',
    platformName: 'the submerged observation deck',
    vaultPrefix: 'aqua_vault',
    perils: ['underwater currents shake hydro-sensors', 'high pressure builds against dome glass', 'divergent hydro-turbine telemetry detected', 'hydro-acoustic pulses drift out of phase', 'sub-aquatic oxygen pump telemetry needs manual check'],
    files: ['sonar_grid.cad', 'hydro_stream.log', 'lake_pumps.conf', 'sub_manual.txt', 'kernel_firmware.bin']
  },
  {
    bookNumber: 4,
    title: 'Book 4: The Submerged Sonar Array',
    subtitle: 'Archiving, Search Patterns & Head Analysis',
    themeName: 'Lake Binary Abyssal Trench',
    description: 'Navigating deep thermal vents requires searching massive sensor logs with grep and packaging bundle archives.',
    coverGradient: 'from-emerald-900 via-slate-950 to-slate-950',
    accentColor: '#10b981',
    badgeIcon: '🐙',
    environment: 'lake',
    vehicleType: 'submarine',
    placeName: 'Abyssal Sonar Tower',
    locationDesc: 'the glowing trench hydrothermal vents',
    platformName: 'the trench mooring platform',
    vaultPrefix: 'trench_vault',
    perils: ['geothermal bubbles disrupt sonar relays', 'massive data logs overflow transmission pipes', 'high particulate buildup in intake valves', 'trailing anomalies found in sensor logs', 'unverified identity pulses detected in the deep'],
    files: ['trench_sonar.cad', 'hydro_archive.tar', 'abyssal_telemetry.log', 'header_stream.dat', 'trailing_echoes.txt']
  },
  {
    bookNumber: 5,
    title: 'Book 5: The Silicon Sandstorm of Dune Directory',
    subtitle: 'Differential Analysis & Text Sorting',
    themeName: 'Dune Directory (Outpost Solar)',
    description: 'High particulate dust storms demand line-by-line file comparison, byte checks, and sorted environmental telemetry.',
    coverGradient: 'from-amber-900 via-orange-950 to-slate-950',
    accentColor: '#f59e0b',
    badgeIcon: '🏜️',
    environment: 'sandstorm',
    vehicleType: 'crawler',
    placeName: 'Solar Ridge Array',
    locationDesc: 'the sun-scorched amber dunes of Dune Directory',
    platformName: 'the heat-shielded crawler ramp',
    vaultPrefix: 'dune_vault',
    perils: ['a 60-knot silicon sandstorm approaches', 'sensor telemetry reports drift between twin arrays', 'unsorted sensor logs scramble navigation', 'environment variable corruption in sand sensors', 'corrupt bytecode reported in memory banks'],
    files: ['weather_telemetry.txt', 'sensor_drift.cad', 'sorted_frequencies.dat', 'sand_shield.conf', 'env_config.sh']
  },
  {
    bookNumber: 6,
    title: 'Book 6: The Solar Relay Network',
    subtitle: 'Archive Compression, SSH & Process Oversight',
    themeName: 'Dune Directory High Ridge',
    description: 'Long-range solar relays need encrypted remote shells, zip compression, and background service diagnostics.',
    coverGradient: 'from-yellow-900 via-stone-900 to-slate-950',
    accentColor: '#eab308',
    badgeIcon: '☀️',
    environment: 'sandstorm',
    vehicleType: 'glider',
    placeName: 'High Solar Relay',
    locationDesc: 'the reflective mirrors of High Solar Ridge',
    platformName: 'the solar gantry deck',
    vaultPrefix: 'solar_vault',
    perils: ['mirror alignment motor stalls', 'uncompressed packages drop packets over remote radio', 'unsecured remote login attempts detected', 'solar tracking service halted unprompted', 'background process consuming excessive solar battery'],
    files: ['mirror_sync.zip', 'relay_keys.pem', 'solar_service.conf', 'high_ridge.cad', 'process_map.log']
  },
  {
    bookNumber: 7,
    title: 'Book 7: The Magma Mount Geothermal Foundry',
    subtitle: 'Process Termination & Filesystem Permissions',
    themeName: 'Magma Mount (Volcanic Core)',
    description: 'Superheated turbines must be controlled by regulating active PIDs, inspecting storage mounts, and setting permissions.',
    coverGradient: 'from-rose-900 via-red-950 to-slate-950',
    accentColor: '#f43f5e',
    badgeIcon: '🌋',
    environment: 'volcano',
    vehicleType: 'crawler',
    placeName: 'Foundry Core',
    locationDesc: 'the bubbling obsidian rivers of Magma Mount',
    platformName: 'the heat-resistant titanium bridge',
    vaultPrefix: 'foundry_vault',
    perils: ['turbines overheat from runaway clock speeds', 'rogue PID overclocks cooling pumps', 'partition storage reaches 99% capacity', 'unmounted storage prevents pressure venting', 'restricted script permissions lock emergency valves'],
    files: ['molten_valve.sh', 'core_temp.log', 'foundry_mount.conf', 'heat_shield.bin', 'turbine_drain.cad']
  },
  {
    bookNumber: 8,
    title: 'Book 8: The Magma Thermal Core Station',
    subtitle: 'Ownership, Network Routes & Packet Firewalls',
    themeName: 'Magma Mount Deep Forge',
    description: 'Protecting the geothermal magma forge requires routing telemetry, file ownership changes, and establishing tight host packet rules.',
    coverGradient: 'from-orange-900 via-stone-950 to-slate-950',
    accentColor: '#ea580c',
    badgeIcon: '🔥',
    environment: 'volcano',
    vehicleType: 'crawler',
    placeName: 'Deep Magma Forge',
    locationDesc: 'the basalt pillars of the lower lava chamber',
    platformName: 'the magma catwalk',
    vaultPrefix: 'forge_vault',
    perils: ['file ownership mismatch halts root safety daemon', 'network interface drops packet heartbeat', 'traceroute detects latency spike at junction 4', 'external firmware download interrupted', 'firewall port scan detected from outer perimeter'],
    files: ['forge_owner.cad', 'interface_eth0.conf', 'route_hops.log', 'firmware_update.bin', 'firewall_policy.conf']
  },
  {
    bookNumber: 9,
    title: 'Book 9: The Orbital Ring & Solar Outpost',
    subtitle: 'Advanced Firewalls, Package Management & Sudo',
    themeName: 'Orbital Ring Space Platform',
    description: 'High-orbit satellites maintain defensive packet filtering, software package updates, and root execution rituals.',
    coverGradient: 'from-indigo-900 via-violet-950 to-slate-950',
    accentColor: '#8b5cf6',
    badgeIcon: '🛰️',
    environment: 'station',
    vehicleType: 'drone',
    placeName: 'Zenith Orbital Ring',
    locationDesc: 'the glittering starlight over Earth\'s upper orbit',
    platformName: 'the micro-gravity airlock gantry',
    vaultPrefix: 'orbital_vault',
    perils: ['cosmic rays flip packet filter rules', 'package manager database reports stale locks', 'sudo permission challenge locks airlock mechanism', 'chronometer drift desynchronizes solar panels', 'command alias confusion slows emergency responses'],
    files: ['iptables_defense.rules', 'satellite_apt.conf', 'root_clearance.key', 'orbital_calendar.dat', 'alias_map.sh']
  },
  {
    bookNumber: 10,
    title: 'Book 10: The Deep Space Telemetry Hub',
    subtitle: 'Raw Block I/O, Command Lookups & Authentication',
    themeName: 'Orbital Deep Space Array',
    description: 'Deep space communications demand byte-accurate storage copies with dd and secure credential administration.',
    coverGradient: 'from-purple-900 via-slate-950 to-slate-950',
    accentColor: '#a855f7',
    badgeIcon: '🌌',
    environment: 'station',
    vehicleType: 'drone',
    placeName: 'Deep Space Receiver',
    locationDesc: 'the silent vacuum of outer orbital space',
    platformName: 'the antenna array array-deck',
    vaultPrefix: 'cosmos_vault',
    perils: ['raw block storage corruption threatens flight data', 'missing binary path delays booster ignition', 'manual documentation desynchronized from kernel', 'CPU spike in telemetry thread', 'unauthorized password attempts logged'],
    files: ['block_image.dd', 'binary_locator.txt', 'manual_summary.doc', 'cpu_monitor.log', 'shadow_auth.cad']
  },
  {
    bookNumber: 11,
    title: 'Book 11: The Neon Canopy & Fiber Forest',
    subtitle: 'Disk Usage Auditing, Terminal Editors & Deep Finds',
    themeName: 'Neon Canopy Bioluminescent Sequoia',
    description: 'Gigantic fiber-optic trees require disk space analysis, terminal file authoring, and hierarchical searches.',
    coverGradient: 'from-emerald-950 via-teal-950 to-slate-950',
    accentColor: '#2dd4bf',
    badgeIcon: '🌲',
    environment: 'canopy',
    vehicleType: 'glider',
    placeName: 'Canopy Crown Station',
    locationDesc: 'the glowing bioluminescent sequoia canopy',
    platformName: 'the suspension bridge platform',
    vaultPrefix: 'canopy_vault',
    perils: ['tree growth swallows fiber-optic junction', 'empty folders cluttering optical switchboard', 'quick config editing needed on-site', 'modal editor keystrokes needed for emergency patch', 'sensor lost in deep forest folder hierarchy'],
    files: ['canopy_usage.dat', 'stale_branch.dir', 'nano_patch.conf', 'vim_macro.vim', 'lost_probe.cad']
  },
  {
    bookNumber: 12,
    title: 'Book 12: The Chrono Clocktower & Temporal Relays',
    subtitle: 'Safe Unmounting, Pings & Network Sockets',
    themeName: 'Chrono Clocktower Citadel',
    description: 'Precision clockwork mechanisms require testing network latency and monitoring active TCP socket pipelines.',
    coverGradient: 'from-amber-950 via-yellow-950 to-slate-950',
    accentColor: '#d97706',
    badgeIcon: '🕰️',
    environment: 'station',
    vehicleType: 'crawler',
    placeName: 'Great Clockwork Hub',
    locationDesc: 'the massive brass gearworks of Chrono Tower',
    platformName: 'the pendulum observation platform',
    vaultPrefix: 'chrono_vault',
    perils: ['pendulum drive cannot unmount storage cleanly', 'network ping latency stalls escapement gear', 'stale network sockets hold open clock relays', 'socket statistics show buffer congestion', 'netcat test pipe drops connection'],
    files: ['pendulum_mount.conf', 'ping_stats.log', 'socket_table.txt', 'ss_dump.dat', 'netcat_test.pipe']
  },
  {
    bookNumber: 13,
    title: 'Book 13: The Crystal Caverns & Quantum Prism',
    subtitle: 'Packet Captures, DNS Lookups & Environment Scopes',
    themeName: 'Crystal Caverns Under-Grid',
    description: 'Subterranean quartz formations amplify network packets that must be captured with tcpdump and verified via DNS.',
    coverGradient: 'from-fuchsia-950 via-purple-950 to-slate-950',
    accentColor: '#c084fc',
    badgeIcon: '💎',
    environment: 'cavern',
    vehicleType: 'crawler',
    placeName: 'Prism Under-Chamber',
    locationDesc: 'the refracting amethyst and quartz caverns',
    platformName: 'the crystal ledge platform',
    vaultPrefix: 'crystal_vault',
    perils: ['crystal resonance floods packet traffic', 'DNS server lookup fails across subterranean cable', 'process viewer displays runaway quartz thread', 'system uptime load average climbs past 4.0', 'missing environment variables scramble refractor'],
    files: ['packet_sniff.pcap', 'dns_query.txt', 'htop_snapshot.log', 'uptime_drift.dat', 'crystal_env.sh']
  },
  {
    bookNumber: 14,
    title: 'Book 14: The Biolab Deep Sea Trench',
    subtitle: 'System Call Traces, Daemons & Memory Telemetry',
    themeName: 'Abyssal Biolab Facility',
    description: 'Deep oceanic pressure requires tracking system calls with strace, managing systemd units, and auditing RAM.',
    coverGradient: 'from-cyan-950 via-blue-950 to-slate-950',
    accentColor: '#0ea5e9',
    badgeIcon: '🧪',
    environment: 'lake',
    vehicleType: 'submarine',
    placeName: 'Trench Biolab Core',
    locationDesc: 'the deep-sea pressurized biolab chambers',
    platformName: 'the submersible docking ring',
    vaultPrefix: 'biolab_vault',
    perils: ['bio-sensor system call hangs indefinitely', 'systemctl service enters failed state', 'journalctl reports memory overflow in centrifuge', 'free RAM drops under critical threshold', 'virtual memory swapping slows life support'],
    files: ['strace_output.log', 'biolab_systemd.service', 'journal_events.txt', 'memory_usage.dat', 'vmstat_metrics.csv']
  },
  {
    bookNumber: 15,
    title: 'Book 15: The Cybernetic Sky Citadel',
    subtitle: 'Device I/O Analytics, Open Files & User Account Control',
    themeName: 'Sky Citadel Cloud Fortress',
    description: 'Floating airborne laboratories depend on disk I/O metrics, open file inspection, and multi-user administration.',
    coverGradient: 'from-sky-950 via-slate-900 to-slate-950',
    accentColor: '#38bdf8',
    badgeIcon: '☁️',
    environment: 'orbit',
    vehicleType: 'glider',
    placeName: 'Citadel Flight Deck',
    locationDesc: 'the sweeping cloudscapes of Sky Citadel',
    platformName: 'the anti-gravity runway',
    vaultPrefix: 'citadel_vault',
    perils: ['storage drive I/O saturation stalls gyroscopes', 'lsof shows locked open file preventing updates', 'dmesg reports kernel ring buffer warning', 'new pilot account creation requested', 'former contractor account requires safe cleanup'],
    files: ['iostat_report.log', 'open_descriptors.lsof', 'dmesg_kernel.log', 'new_pilot.auth', 'retire_user.sh']
  },
  {
    bookNumber: 16,
    title: 'Book 16: The Quantum Singularity & Void Core',
    subtitle: 'Group Authorizations, Password Aging & Encrypted Copies',
    themeName: 'Quantum Singularity Event Horizon',
    description: 'The final frontier of system reliability: configuring user security groups, password aging, and encrypted SCP sync.',
    coverGradient: 'from-violet-950 via-slate-950 to-black',
    accentColor: '#818cf8',
    badgeIcon: '⚛️',
    environment: 'station',
    vehicleType: 'drone',
    placeName: 'Singularity Gate',
    locationDesc: 'the warped gravitational lensing of the Void Core',
    platformName: 'the tachyon stabilization ring',
    vaultPrefix: 'void_vault',
    perils: ['user permissions lack secondary quantum group', 'group identity token expired across horizon', 'password aging lockout imminent on main console', 'effective UID mismatch denies tachyon pulse', 'subshell session needs new group login', 'remote secure copy across event horizon required'],
    files: ['usermod_groups.conf', 'group_memberships.txt', 'chage_expiry.dat', 'id_verification.key', 'newgrp_session.conf', 'remote_singularity.scp']
  }
];

// 81 Unique, highly creative sci-fi adventure episode titles & subtitles
// Loosened naming style: no rigid repetitive "The [Place] [CMD] Protocol" formulas!
export const COMMAND_81_EPISODE_TITLES: Record<string, { title: string; subtitle: string }> = {
  // Book 1: ls, pwd, cd, mkdir, mv (Glacier Kernel - Sub-Zero Outpost)
  ls: {
    title: 'The Arctic Kernel Freeze',
    subtitle: 'Surveying Glacial Data Banks Before the Deep Frost'
  },
  pwd: {
    title: 'The Great Compass Calibration',
    subtitle: 'Pinpointing True North on the Sub-Zero Coordinate Grid'
  },
  cd: {
    title: 'Descent into the Permafrost Vault',
    subtitle: 'Navigating Deep Ice Shafts to Glacier Core'
  },
  mkdir: {
    title: 'Carving the Sub-Zero Safehouse',
    subtitle: 'Constructing Hermetic Partitions in the Ice Wall'
  },
  mv: {
    title: 'The Frost-Glider Relocation Run',
    subtitle: 'Hauling the Primary Thermal Core Across the Crevasse'
  },

  // Book 2: cp, rm, touch, ln, clear (Glacier Kernel Deep Vaults)
  cp: {
    title: 'The Quest for the Golden Replica',
    subtitle: 'Duplicating the Critical Heating Matrix Before the Blizzard'
  },
  rm: {
    title: 'Purging the Corrupted Ice Clusters',
    subtitle: 'Scrapping Glitched Firmware from the Glacier Antenna'
  },
  touch: {
    title: 'Sparking the Sentinel Beacon',
    subtitle: 'Planting Fresh Timestamp Flags in the Drifting Snow'
  },
  ln: {
    title: 'The Crystalline Shortcut',
    subtitle: 'Forging a High-Speed Optical Link Across Frozen Sectors'
  },
  clear: {
    title: 'Sweeping the Glass Terminal',
    subtitle: 'Wiping Blizzard Static for the Deep Glacier Descent'
  },

  // Book 3: cat, echo, less, man, uname (Lake Binary Sub-Surface Biosphere)
  cat: {
    title: 'The Abyssal Blueprint Reveal',
    subtitle: 'Streaming Raw Schematics from the Sunken Recon Drone'
  },
  echo: {
    title: 'Echoes in the Azure Trench',
    subtitle: 'Bouncing Acoustic Sonar Through the Deep Kelp Forest'
  },
  less: {
    title: 'The Endless Submarine Scroll',
    subtitle: 'Paging Through Miles of Hydro-Turbine Diagnostics'
  },
  man: {
    title: "Windel's Lost Submersible Manual",
    subtitle: 'Consulting the Ancient Engineering Tomes of the Deep'
  },
  uname: {
    title: 'Secrets of the Hydro-Kernel',
    subtitle: "Probing the Submerged Station's Hardware Architecture"
  },

  // Book 4: whoami, tar, grep, head, tail (Lake Binary Abyssal Trench)
  whoami: {
    title: 'Identity Crisis at 20,000 Leagues',
    subtitle: 'Verifying Deep-Diver Clearance at the Abyssal Airlock'
  },
  tar: {
    title: 'The Great Mariana Bundle',
    subtitle: 'Packing Deep-Sea Sensor Archives into a Waterproof Crate'
  },
  grep: {
    title: 'Hunting the Phantom Frequency',
    subtitle: 'Filtering Terabytes of Oceanic Murmur for the Lost Ping'
  },
  head: {
    title: 'Peeking Over the Thermal Vent',
    subtitle: 'Snagging the Top Five Warning Signals Before Eruption'
  },
  tail: {
    title: 'The Final Echo in the Abyss',
    subtitle: 'Listening to Trailing Acoustic Ripples in the Mariana Trench'
  },

  // Book 5: diff, cmp, comm, sort, export (Dune Directory Outpost Solar)
  diff: {
    title: 'The Tale of Two Weather Sensors',
    subtitle: 'Pinpointing Subtle Discrepancies in the Solar Telemetry'
  },
  cmp: {
    title: 'Byte-by-Byte in the Sandstorm',
    subtitle: 'Rapid Microsecond Integrity Check on Inverter Code'
  },
  comm: {
    title: 'Cross-Referencing the Dune Catalogs',
    subtitle: 'Sorting Common Frequencies Between Twin Solar Outposts'
  },
  sort: {
    title: 'Taming the Scrambled Frequency Gale',
    subtitle: 'Organizing Wild Sandstorm Readings from Lowest to Highest'
  },
  export: {
    title: 'Broadcasting to the Sand Fleet',
    subtitle: 'Setting Global Atmospheric Variables for the Rover Caravan'
  },

  // Book 6: zip, unzip, ssh, service, ps (Dune Directory High Ridge)
  zip: {
    title: 'The Shrinking Solar Schematic',
    subtitle: 'Compressing High-Res Mirror Blueprints for Weak Radio Links'
  },
  unzip: {
    title: 'Unboxing the High-Ridge Firmware',
    subtitle: 'Unpacking the Emergency Heliostat Tracking Drivers'
  },
  ssh: {
    title: 'Tunnelling Through the Heat Haze',
    subtitle: 'Establishing an Encrypted Remote Bridge to the High Antenna'
  },
  service: {
    title: 'Reviving the Slumbering Heliostat',
    subtitle: 'Restarting the Stalled Solar Tracker Motor Daemon'
  },
  ps: {
    title: 'Unmasking the Rogue Sand Process',
    subtitle: 'Tracking Down the Mystery Task Draining Solar Batteries'
  },

  // Book 7: kill, killall, df, mount, chmod (Foundry Core)
  kill: {
    title: 'Emergency Core Meltdown Scram',
    subtitle: 'Terminating the Runaway Overclocking PID in Nick of Time'
  },
  killall: {
    title: 'The Great Valve Shutdown',
    subtitle: 'Stopping Every Overheating Pump with a Single Sweep'
  },
  df: {
    title: 'The Lava Basin Storage Panic',
    subtitle: 'Measuring Basalt Storage Partitions Before the Magma Surge'
  },
  mount: {
    title: 'Bridging the Obsidian Data Drive',
    subtitle: 'Latching the Heavy Titanium Storage Block into the Tree'
  },
  chmod: {
    title: 'The Golden Permissions Key',
    subtitle: 'Unlocking Read-Write Rights on the Coolant Valve Script'
  },

  // Book 8: chown, ifconfig, traceroute, wget, ufw (Deep Magma Forge)
  chown: {
    title: 'Claiming the Titanium Foundry',
    subtitle: 'Handing Operational Control to the Disaster Response Team'
  },
  ifconfig: {
    title: 'Igniting the Basalt Network Link',
    subtitle: 'Configuring the Heat-Shielded Gigabit Interface'
  },
  traceroute: {
    title: 'The Long Trail Through Lava Tubes',
    subtitle: 'Mapping Packet Hops Across the Subterranean Fiber Grid'
  },
  wget: {
    title: 'Snatching the Coolant Firmware',
    subtitle: 'Pulling Emergency Patches Across the Volcanic Data Pipe'
  },
  ufw: {
    title: 'Raising the Magma Firewall',
    subtitle: 'Erecting an Uncomplicated Barrier Against Rogue Seismic Probes'
  },

  // Book 9: iptables, apt, sudo, cal, alias (Zenith Orbital Ring)
  iptables: {
    title: 'The Cosmic Ray Packet Sieve',
    subtitle: 'Filtering Solar Flare Noise with Precision Orbital Rules'
  },
  apt: {
    title: 'Orbital Supply Drop via Satellite',
    subtitle: 'Upgrading Celestial Navigation Modules from Earth Mirrors'
  },
  sudo: {
    title: 'The Ultimate Root Elevation',
    subtitle: 'Invoking Superuser Clearance to Release the Jammed Airlock'
  },
  cal: {
    title: 'Aligning the Lunar Ephemeris',
    subtitle: 'Checking the Orbital Calendar to Predict the Next Eclipse'
  },
  alias: {
    title: "Windel's Speedy Space Shortcuts",
    subtitle: 'Crafting Lightning-Fast Macro Commands for Thruster Burns'
  },

  // Book 10: dd, whereis, whatis, top, useradd (Deep Space Receiver)
  dd: {
    title: 'The Byte-for-Byte Cosmic Mirror',
    subtitle: 'Cloning a Flawless Deep Space Drive Block by Raw Block'
  },
  whereis: {
    title: 'The Hunt for the Booster Binary',
    subtitle: 'Locating the Lost Ion Drive Executable Across System Paths'
  },
  whatis: {
    title: 'The Quick Cosmic Cheat-Sheet',
    subtitle: 'One-Line Telemetry Summaries for Puzzled Astronauts'
  },
  top: {
    title: 'The Swirling Satellite CPU Gale',
    subtitle: 'Live Resource Stalking on the Primary Navigation Node'
  },
  useradd: {
    title: 'Welcoming the Starship Navigator',
    subtitle: 'Provisioning a New User Profile in the Orbital Crew Roster'
  },

  // Book 11: du, rmdir, nano, vi, find (Canopy Crown Station)
  du: {
    title: 'Weighing the Giant Sequoia Data',
    subtitle: 'Auditing Massive Disk Usage in the Optical Canopy'
  },
  rmdir: {
    title: 'Pruning the Hollow Branches',
    subtitle: 'Trimming Abandoned Directory Twigs from the Fiber Grid'
  },
  nano: {
    title: 'The Treehouse Emergency Patch',
    subtitle: 'Quick Terminal Code Edits 500 Feet Above the Forest Floor'
  },
  vi: {
    title: 'Master of the Modal High-Wire',
    subtitle: 'Escaping Insert Mode While Balancing on Bioluminescent Vines'
  },
  find: {
    title: 'Lost in the Digital Rainforest',
    subtitle: 'Searching Thousands of Deep Foliage Folders for the Fallen Probe'
  },

  // Book 12: umount, ping, netstat, ss, nc (Great Clockwork Hub)
  umount: {
    title: 'The Pendulum Safe Ejection',
    subtitle: 'Detaching the Great Brass Drive Without Stripping Clock Gears'
  },
  ping: {
    title: 'Ringing the Brass Chimes',
    subtitle: 'Measuring Millisecond Echo Latency Across Clockwork Cables'
  },
  netstat: {
    title: 'Listening to the Ticking Sockets',
    subtitle: 'Auditing Every Listening Port in the Clockwork Citadel'
  },
  ss: {
    title: 'The Lightning Fast Escapement Audit',
    subtitle: 'Dumping Modern Socket Statistics Before the Gear Strikes Twelve'
  },
  nc: {
    title: 'The Swiss Army Pipe of Time',
    subtitle: 'Opening Raw Netcat Streams to Harmonize the Temporal Escapement'
  },

  // Book 13: tcpdump, nslookup, htop, uptime, env (Prism Under-Chamber)
  tcpdump: {
    title: 'Capturing the Amethyst Data Streams',
    subtitle: 'Sniffing Raw Packet Pulses Bouncing Between Crystal Pillars'
  },
  nslookup: {
    title: 'Interrogating the Quartz DNS Oracle',
    subtitle: 'Resolving Subterranean Hostnames Through the Crystal Lattice'
  },
  htop: {
    title: 'The Technicolor Process Symphony',
    subtitle: 'Monitoring Core Affinity and CPU Graphs Deep Underground'
  },
  uptime: {
    title: 'The Thousand-Hour Quartz Vigil',
    subtitle: 'Calculating System Load Average Since the Cavern Outpost Awoke'
  },
  env: {
    title: 'The Quantum Resonance Atmosphere',
    subtitle: 'Inspecting the Active Variable Atmosphere Powering the Prism'
  },

  // Book 14: strace, systemctl, journalctl, free, vmstat (Trench Biolab Core)
  strace: {
    title: 'Stethoscope on the Submersible Kernel',
    subtitle: 'Intercepting Every System Call from the Suspended Bio-Centrifuge'
  },
  systemctl: {
    title: 'Awakening the Trench Life-Support Unit',
    subtitle: 'Starting and Enabling the Abyssal Oxygen Service'
  },
  journalctl: {
    title: 'Reading the Submersible Black Box',
    subtitle: 'Investigating Panic Logs in the Trench Systemd Journal'
  },
  free: {
    title: 'The Deep-Pressure RAM Squeeze',
    subtitle: 'Checking Available Megabytes of Hydro-Computer Memory'
  },
  vmstat: {
    title: 'The Oceanic Paging Rhythm',
    subtitle: 'Watching Virtual Memory Swap IO Breathe with the Tides'
  },

  // Book 15: iostat, lsof, dmesg, adduser, userdel (Citadel Flight Deck)
  iostat: {
    title: 'The Cloud Turbofan Disk Gauge',
    subtitle: 'Diagnosing Storage Throughput Chokepoints at 30,000 Feet'
  },
  lsof: {
    title: 'The Mystery Ghost-File Lock',
    subtitle: 'Finding Which Process is Gripping the Air-Rudder Device'
  },
  dmesg: {
    title: 'Echoes from the Kernel Ring Buffer',
    subtitle: 'Reading Raw Kernel Hardware Whispers from the Flight Deck'
  },
  adduser: {
    title: 'Enlisting the Stratospheric Co-Pilot',
    subtitle: 'Interactive User Onboarding for the Atmospheric Fortress'
  },
  userdel: {
    title: 'The Clean Retirement Fly-Away',
    subtitle: 'Safely Decommissioning Retired Pilot Profiles and Storage'
  },

  // Book 16: usermod, groupadd, chage, id, newgrp, scp (Singularity Gate)
  usermod: {
    title: 'The Quantum Clearance Upgrade',
    subtitle: 'Adding Kali and Windel to the Tachyon Engineers Group'
  },
  groupadd: {
    title: 'Founding the Void Explorers Guild',
    subtitle: 'Establishing a New Security Group at the Event Horizon'
  },
  chage: {
    title: 'The Clock is Ticking on Your Password',
    subtitle: 'Inspecting Credential Expiration Dates Before Crossing the Rift'
  },
  id: {
    title: 'Proof of Existence in the Void',
    subtitle: 'Verifying UID, GID, and Security Context Under Cosmic Gravity'
  },
  newgrp: {
    title: 'Switching Phase in the Event Horizon',
    subtitle: 'Activating the Graviton Group Subshell for the Final Pulse'
  },
  scp: {
    title: 'The Encrypted Leap Across the Void',
    subtitle: 'Tunneling the Master Singularity Archive Safely Back to Earth'
  }
};

export function build81CommandCatalog(): Book[] {
  const books: Book[] = [];
  let globalEpCounter = 1;

  for (let bIdx = 0; bIdx < BOOK_THEMES.length; bIdx++) {
    const theme = BOOK_THEMES[bIdx];
    const bookNumber = theme.bookNumber;
    const bookId = `book-${bookNumber}`;

    // Determine slice of 81 commands for this book
    // Books 1-15 have 5 commands; Book 16 has 6 commands (5*15 + 6 = 81!)
    const startCmdIdx = bIdx < 15 ? bIdx * 5 : 75;
    const endCmdIdx = bIdx < 15 ? startCmdIdx + 5 : 81;
    const assignedCommands = LINUX_COMMANDS_81.slice(startCmdIdx, endCmdIdx);

    const episodes: Adventure[] = [];

    for (let eIdx = 0; eIdx < assignedCommands.length; eIdx++) {
      const cmdDoc = assignedCommands[eIdx];
      const epNum = eIdx + 1;
      const globalNum = globalEpCounter++;
      const epId = `ep-${bookNumber}-${epNum}`;

      const blueprint = theme.files[eIdx] || `${cmdDoc.command}_system_core.cad`;
      const peril = theme.perils[eIdx] || 'an unexpected frequency deviation threatens the main grid';

      // Rich, creative, non-generic title & subtitle from the dedicated 81-command adventure lore
      const customStory = COMMAND_81_EPISODE_TITLES[cmdDoc.command];
      const epTitle = customStory?.title || `The ${cmdDoc.command.toUpperCase()} Odyssey`;
      const epSubtitle = customStory?.subtitle || `Field Mission: Calibrating ${cmdDoc.command} in ${theme.placeName}`;

      episodes.push(
        buildStandardEpisode({
          id: epId,
          number: epNum,
          globalNumber: globalNum,
          bookId,
          bookNumber,
          title: epTitle,
          subtitle: epSubtitle,
          settingName: `${theme.themeName} - ${theme.placeName}`,
          locationDescription: theme.locationDesc,
          platformName: theme.platformName,
          perilDescription: peril,
          vehicleType: theme.vehicleType,
          vehicleName: `${theme.vehicleType.toUpperCase()}-${bookNumber}0${epNum}`,
          containerShape: eIdx % 2 === 0 ? 'capsule' : 'crystal',
          blueprintFile: blueprint,
          vaultName: `${theme.vaultPrefix}_${epNum}`,
          environment: theme.environment,
          waterActive: theme.environment === 'lake',
          command: cmdDoc.command,
          badge: cmdDoc.command,
          theme: {
            primary: theme.accentColor,
            secondary: '#38bdf8',
            accent: '#f59e0b',
            bgGradient: 'from-slate-950 via-slate-900 to-slate-950'
          }
        })
      );
    }

    books.push({
      id: bookId,
      number: bookNumber,
      title: theme.title,
      subtitle: theme.subtitle,
      themeName: theme.themeName,
      description: theme.description,
      coverGradient: theme.coverGradient,
      accentColor: theme.accentColor,
      badgeIcon: theme.badgeIcon,
      episodes
    });
  }

  return books;
}

export const INITIAL_BOOKS: Book[] = build81CommandCatalog();

// Procedural settings for infinite generation when checking out 5 more books
export async function generateNext5Books(startBookNum: number): Promise<Book[]> {
  try {
    const res = await fetch('/api/generate-books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startBookNumber: startBookNum })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.books) && data.books.length > 0) {
        const hydratedBooks: Book[] = data.books.map((b: any, bIdx: number) => {
          const bookNumber = startBookNum + bIdx;
          const bookId = `book-${bookNumber}`;
          const episodes: Adventure[] = (b.episodes || []).slice(0, 5).map((ep: any, eIdx: number) => {
            const epNum = eIdx + 1;
            const globalNum = (bookNumber - 1) * 5 + epNum;
            const epId = `ep-${bookNumber}-${epNum}`;
            const epCmd = ep.command || ep.badge || 'cp';

            return buildStandardEpisode({
              id: epId,
              number: epNum,
              globalNumber: globalNum,
              bookId,
              bookNumber,
              title: ep.title || `Mission ${epNum}: Cyber Investigation`,
              subtitle: ep.subtitle || `Executing ${epCmd} Operations`,
              settingName: ep.environmentName || b.themeName || 'Cyber Territory',
              locationDescription: `the cyber horizons of ${ep.environmentName || b.themeName}`,
              platformName: 'the tech platform',
              perilDescription: ep.peril || 'a sudden system error threatens the node',
              vehicleType: ep.vehicleType || 'rover',
              vehicleName: `${ep.vehicleType || 'Rover'}-${bookNumber}0${epNum}`,
              containerShape: ep.containerShape || 'cylinder',
              blueprintFile: ep.blueprintFile || `system_core_${epNum}.cad`,
              vaultName: ep.vaultName || `archive_vault_${epNum}`,
              environment: ep.environment || 'station',
              command: epCmd,
              badge: epCmd,
              theme: ep.theme || {
                primary: b.accentColor || '#06b6d4',
                secondary: '#3b82f6',
                accent: '#eab308',
                bgGradient: 'from-slate-950 via-sky-950 to-slate-900'
              }
            });
          });

          return {
            id: bookId,
            number: bookNumber,
            title: b.title || `Book ${bookNumber}: The ${b.themeName || 'Cyber'} Odyssey`,
            subtitle: b.subtitle || 'Expanded Linux Adventures',
            themeName: b.themeName || 'Cyber Territory',
            description: b.description || 'New exciting chapters for The Cyber Crew.',
            coverGradient: b.coverGradient || 'from-indigo-900 via-slate-950 to-slate-950',
            accentColor: b.accentColor || '#6366f1',
            badgeIcon: b.badgeIcon || '📚',
            episodes
          };
        });

        if (hydratedBooks.length === 5) {
          return hydratedBooks;
        }
      }
    }
  } catch (e) {
    console.log('Using client procedural synthesizer for 5 new books:', e);
  }

  // Guaranteed procedural generator with loosened parameters and creative sci-fi adventure names
  const newBooks: Book[] = [];
  const environments: VisualState['environment'][] = ['arctic', 'lake', 'sandstorm', 'volcano', 'canopy', 'station', 'cavern', 'orbit', 'reef', 'dam'];

  // Rich vocabulary for creative sci-fi story generation
  const adventurousTitlePrefixes = [
    'The Mystery of the', 'Escape from the', 'The Secret of the', 'The Phantom',
    'Rendezvous with the', 'The Lost Signal of', 'Into the Heart of the', 'The Midnight',
    'Showdown at the', 'Operation', 'The Legend of the', 'Flight of the', 'Whispers from the'
  ];

  const sciFiCoreNouns = [
    'Plasma Dynamo', 'Silicon Monolith', 'Quantum Beacon', 'Nebula Relay',
    'Superluminal Drive', 'Cryo Matrix', 'Sub-Orbital Array', 'Tachyon Turbine',
    'Bioluminescent Conduit', 'Obsidian Forge', 'Pulse Generator', 'Gravity Anchor',
    'Phosphor Cascade', 'Solar Flare Gate', 'Vapor Singularity', 'Ionized Spire'
  ];

  const missionSubActions = [
    'Isolating rogue telemetry spikes before',
    'Rerouting emergency backup power across',
    'Synchronizing high-speed datalinks within',
    'Decrypting mission-critical coordinates near',
    'Stabilizing harmonic oscillations through',
    'Safeguarding vital sensor telemetry against',
    'Flushing corrupted memory buffers inside',
    'Calibrating long-range transceivers across'
  ];

  const hazardSettings = [
    'the magnetic distortion field',
    'the impending solar flash',
    'the uncalibrated quantum surge',
    'the runaway orbital decay',
    'the high-voltage power cascade',
    'the seismic energy rupture',
    'the sub-space interference wavefront',
    'the thermal dissipation drop'
  ];

  for (let i = 0; i < 5; i++) {
    const bookNumber = startBookNum + i;
    const bookId = `book-${bookNumber}`;
    const env = environments[(bookNumber - 1) % environments.length];
    const episodes: Adventure[] = [];

    // 5 episodes per book
    for (let e = 0; e < 5; e++) {
      const epNum = e + 1;
      const globalNum = (bookNumber - 1) * 5 + epNum;
      const randomCmd = LINUX_COMMANDS_81[(bookNumber * 5 + e) % LINUX_COMMANDS_81.length].command;

      // Loose creative naming combinations
      const prefix = adventurousTitlePrefixes[(bookNumber * 3 + e * 7) % adventurousTitlePrefixes.length];
      const noun = sciFiCoreNouns[(bookNumber * 5 + e * 3) % sciFiCoreNouns.length];
      const action = missionSubActions[(bookNumber * 2 + e * 5) % missionSubActions.length];
      const hazard = hazardSettings[(bookNumber * 4 + e * 2) % hazardSettings.length];

      const epTitle = `${prefix} ${noun}`;
      const epSubtitle = `${action} ${hazard}`;

      episodes.push(
        buildStandardEpisode({
          id: `ep-${bookNumber}-${epNum}`,
          number: epNum,
          globalNumber: globalNum,
          bookId,
          bookNumber,
          title: epTitle,
          subtitle: epSubtitle,
          settingName: `Outpost Delta-${bookNumber}`,
          locationDescription: `the expansive terrains of Outpost Delta-${bookNumber}`,
          platformName: 'the forward observation gantry',
          perilDescription: `${action.toLowerCase()} ${hazard}`,
          vehicleType: e % 2 === 0 ? 'rover' : 'drone',
          vehicleName: `SCOUT-${bookNumber}0${epNum}`,
          containerShape: e % 2 === 0 ? 'capsule' : 'crystal',
          blueprintFile: `subsystem_blueprint_${epNum}.cad`,
          vaultName: `delta_vault_${bookNumber}_${epNum}`,
          environment: env,
          waterActive: env === 'lake' || env === 'reef',
          command: randomCmd,
          badge: randomCmd,
          theme: {
            primary: '#06b6d4',
            secondary: '#38bdf8',
            accent: '#f59e0b',
            bgGradient: 'from-slate-950 via-slate-900 to-slate-950'
          }
        })
      );
    }

    newBooks.push({
      id: bookId,
      number: bookNumber,
      title: `Book ${bookNumber}: The Galactic Sector ${bookNumber} Expeditions`,
      subtitle: `5 Advanced Command Challenges in Sector ${bookNumber}`,
      themeName: `Sector ${bookNumber} Deep Field`,
      description: `The Cyber Crew pushes forward into Sector ${bookNumber}, mastering critical Linux commands across unexplored territory.`,
      coverGradient: 'from-indigo-900 via-slate-950 to-slate-950',
      accentColor: '#6366f1',
      badgeIcon: '🚀',
      episodes
    });
  }

  return newBooks;
}

// Local storage management with versioning V6 (bumping clears stale formulaic titles)
const STORAGE_BOOKS_KEY = 'CYBER_CREW_BOOKS_CATALOG_V6';
const STORAGE_COMPLETED_KEY = 'CYBER_CREW_COMPLETED_EPISODES_V6';

export function loadStoredBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_BOOKS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 16) {
        return parsed;
      }
    }
  } catch (e) {}

  saveStoredBooks(INITIAL_BOOKS);
  return INITIAL_BOOKS;
}

export function saveStoredBooks(books: Book[]): void {
  try {
    localStorage.setItem(STORAGE_BOOKS_KEY, JSON.stringify(books));
  } catch (e) {}
}

export function loadCompletedEpisodes(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_COMPLETED_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // Backward compatibility: migrate completed episodes from prior versions so user progress is never lost
    const legacyKeys = [
      'CYBER_CREW_COMPLETED_EPISODES_V5',
      'CYBER_CREW_COMPLETED_EPISODES_V4',
      'CYBER_CREW_COMPLETED_EPISODES_V3',
      'CYBER_CREW_COMPLETED_EPISODES_V2',
      'CYBER_CREW_COMPLETED_EPISODES'
    ];
    for (const key of legacyKeys) {
      const legacyRaw = localStorage.getItem(key);
      if (legacyRaw) {
        const parsed = JSON.parse(legacyRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(parsed));
          return parsed;
        }
      }
    }
  } catch (e) {}
  return ['ep-1-1'];
}

export function saveCompletedEpisode(episodeId: string): void {
  try {
    const list = loadCompletedEpisodes();
    if (!list.includes(episodeId)) {
      list.push(episodeId);
      localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(list));
    }
  } catch (e) {}
}
