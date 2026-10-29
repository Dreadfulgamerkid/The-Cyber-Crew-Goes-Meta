import { Adventure } from '../types';

export const ADVENTURES: Adventure[] = [
  {
    id: 'arctic-freeze',
    number: 1,
    title: 'The Cyber Crew and the Arctic Kernel Freeze',
    subtitle: 'The Quest for the Frost-Proof Backup',
    catchphrase: 'ROOT PERMISSIONS READY TO GO, THREE, TWO, ONE... SUDO!',
    environmentName: 'Glacier Kernel - Outpost Zero',
    badge: 'cp',
    theme: {
      primary: '#06b6d4',
      secondary: '#3b82f6',
      accent: '#eab308',
      bgGradient: 'from-slate-950 via-sky-950 to-slate-900'
    },
    initialCwd: '/home/kali',
    initialFs: {
      home: {
        type: 'dir',
        children: {
          kali: {
            type: 'dir',
            children: {
              'heater_core.cad': {
                type: 'file',
                content: 'GLACIER_KERNEL_HEAT_BLUEPRINT_v4.2\n[CORE_HEATER_CIRCUITS_VALIDATED]\nBackup Plan: Arctic thermal mesh redundancy.'
              }
            }
          }
        }
      }
    },
    masterySummary: {
      command: 'cp',
      description: 'The Linux copy command. Creates exact replicas of files to protect critical data against loss or hardware failure.',
      syntax: 'cp [source_file] [destination_file]',
      proTip: 'Always verify backups immediately using ls or diff to confirm integrity before touching originals!'
    },
    pages: [
      {
        pageNumber: 1,
        title: 'Page 1 - The Cheer',
        subtitle: 'Glacier Kernel Morning Aurora',
        isCheerPage: true,
        narrativeText: [
          'The morning aurora shimmered across the sparkling snowfields of Glacier Kernel. Kazz, Windel, Kali, and Debbie gathered on the frozen platform, eager for their next challenge.',
          'They locked hands in the center of the circle, looked up, and cheered in unison:'
        ],
        dialogue: [
          { speaker: 'kazz', text: 'Lock in, team! Another freezing morning, another kernel to master!', emotion: 'excited' },
          { speaker: 'windel', text: 'My boots are warm, my specs are clean, let\'s synchronize our permissions!', emotion: 'smiling' },
          { speaker: 'debbie', text: 'All system checks verified. On three!', emotion: 'proud' },
          { speaker: 'kali', text: 'Three... two... one...', emotion: 'excited' }
        ],
        visualState: {
          environment: 'arctic',
          auroraActive: true,
          cheerDone: false,
          capsules: []
        },
        hintText: 'Click the cheer button below or type "sudo cheer" in the terminal to lock hands and initiate the adventure!'
      },
      {
        pageNumber: 2,
        title: 'Page 2 - Special Delivery',
        subtitle: 'The Rare Golden Blueprint',
        narrativeText: [
          'Suddenly, a tiny delivery snow-rover crunched to a stop beside the platform. It carried a single, glowing frost-proof capsule containing a rare golden blueprint named heater_core.cad.',
          '"Special delivery!" Windel gasped, pushing his square glasses up his nose. "It\'s the only copy of the town\'s backup heat plan! But what if a blizzard hits the camp? If we only have one copy, we could lose it forever!"',
          '"He is right," Debbie said, flipping to a clean page in her spiral notebook. "A system without a backup is a system waiting to fail. We must make an exact replica to store in our archive."'
        ],
        dialogue: [
          { speaker: 'windel', text: 'Special delivery! It\'s the only copy of the town\'s backup heat plan! But what if a blizzard hits the camp?', emotion: 'urgent' },
          { speaker: 'debbie', text: 'He is right. A system without a backup is a system waiting to fail. We must make an exact replica to store in our archive.', emotion: 'thinking' },
          { speaker: 'kazz', text: 'Look at that capsule glow. We cannot afford to lose this file!', emotion: 'excited' },
          { speaker: 'kali', text: 'Don\'t worry team. Open the terminal — we have the perfect command for this.', emotion: 'smiling' }
        ],
        visualState: {
          environment: 'arctic',
          auroraActive: true,
          roverArrived: true,
          roverHasCapsule: true,
          capsules: [
            { id: 'orig', filename: 'heater_core.cad', label: 'heater_core.cad', isBackup: false, inVault: false, color: 'gold' }
          ]
        },
        hintText: 'Read the team discussion and expand the terminal when you are ready to create the backup!'
      },
      {
        pageNumber: 3,
        title: 'Page 3 - The Copy Command',
        subtitle: 'Materializing the Duplicate',
        narrativeText: [
          'Kali smiled, stepping up to the floating terminal. "We don\'t just move files around — we make duplicates so we always have a safety net. Who knows our brand-new command for making an exact copy?"',
          'Windel bounced in his yellow snow boots. "It\'s short, simple, and stands for copy... That\'s right! cp!"',
          'Kali entered the command into the terminal: cp heater_core.cad heater_core_backup.cad',
          'Ping! A second glowing capsule identical to the first materialized right beside the original.'
        ],
        dialogue: [
          { speaker: 'kali', text: 'We don\'t just move files around — we make duplicates so we always have a safety net. Who knows our brand-new command for making an exact copy?', emotion: 'smiling' },
          { speaker: 'windel', text: 'It\'s short, simple, and stands for copy... That\'s right! cp!', emotion: 'excited' },
          { speaker: 'kali', text: 'Type: cp heater_core.cad heater_core_backup.cad into the terminal!', emotion: 'neutral' }
        ],
        visualState: {
          environment: 'arctic',
          auroraActive: true,
          roverArrived: true,
          capsules: [
            { id: 'orig', filename: 'heater_core.cad', label: 'heater_core.cad', isBackup: false, inVault: false, color: 'gold' }
          ]
        },
        requiredCommandDesc: 'Make an exact copy of heater_core.cad named heater_core_backup.cad',
        targetCommand: 'cp heater_core.cad heater_core_backup.cad',
        hintText: 'Type: cp heater_core.cad heater_core_backup.cad',
        expectedOutput: '',
        commandMastered: 'cp',
        commandExplanation: 'cp creates a duplicate of a source file at the specified destination without altering the original.'
      },
      {
        pageNumber: 4,
        title: 'Page 4 - Verify With LS',
        subtitle: 'Seeing is Believing in Linux',
        narrativeText: [
          '"Perfect!" Kazz said, his bright patchwork parka shimmering. "Now let\'s verify both copies are here."',
          'Windel looked at the terminal window. "What command do we use to list everything in our current folder?"',
          '"ls!" Kazz replied. Kali typed ls, and the terminal showed:',
          'ls\nheater_core.cad\nheater_core_backup.cad'
        ],
        dialogue: [
          { speaker: 'kazz', text: 'Perfect! Now let\'s verify both copies are here.', emotion: 'excited' },
          { speaker: 'windel', text: 'What command do we use to list everything in our current folder?', emotion: 'thinking' },
          { speaker: 'kazz', text: 'ls!', emotion: 'smiling' },
          { speaker: 'kali', text: 'Let\'s check our directory right now. Type ls in your terminal!', emotion: 'neutral' }
        ],
        visualState: {
          environment: 'arctic',
          auroraActive: true,
          roverArrived: true,
          capsules: [
            { id: 'orig', filename: 'heater_core.cad', label: 'heater_core.cad', isBackup: false, inVault: false, color: 'gold' },
            { id: 'backup', filename: 'heater_core_backup.cad', label: 'heater_core_backup.cad', isBackup: true, inVault: false, color: 'cyan' }
          ]
        },
        requiredCommandDesc: 'List the files in the current folder to verify both copies exist',
        targetCommand: 'ls',
        alternateValidCommands: ['ls -l', 'ls -la', 'ls -a'],
        hintText: 'Type: ls to list all files in the current directory.',
        expectedOutput: 'heater_core.cad  heater_core_backup.cad',
        commandMastered: 'ls',
        commandExplanation: 'ls lists directory contents so you can inspect files and folders.'
      },
      {
        pageNumber: 5,
        title: 'Page 5 - Make The Vault And Move It',
        subtitle: 'mkdir and mv In Action',
        narrativeText: [
          '"Now, let\'s create a dedicated backup folder so they don\'t get mixed up," Debbie suggested. Kali typed: mkdir /frost_vault',
          '"And finally, let\'s move only the backup into the new vault using our mover command: mv!" Windel cheered. Kali executed the final line: mv heater_core_backup.cad /frost_vault/',
          'WHOOSH! The duplicate capsule glided smoothly into the sturdy ice-vault, locking safely into place with a warm green checkmark.',
          'Terminal showed:\n$ mkdir /frost_vault\n$ mv heater_core_backup.cad /frost_vault/\n$'
        ],
        dialogue: [
          { speaker: 'debbie', text: 'Now, let\'s create a dedicated backup folder so they don\'t get mixed up. Type: mkdir /frost_vault', emotion: 'thinking' },
          { speaker: 'windel', text: 'And finally, let\'s move only the backup into the new vault using our mover command: mv!', emotion: 'excited' },
          { speaker: 'kali', text: 'First run: mkdir /frost_vault\nThen run: mv heater_core_backup.cad /frost_vault/', emotion: 'smiling' }
        ],
        visualState: {
          environment: 'arctic',
          auroraActive: true,
          roverArrived: true,
          vaultExists: true,
          vaultLocked: true,
          capsules: [
            { id: 'orig', filename: 'heater_core.cad', label: 'heater_core.cad', isBackup: false, inVault: false, color: 'gold' },
            { id: 'backup', filename: 'heater_core_backup.cad', label: 'heater_core_backup.cad', isBackup: true, inVault: true, color: 'cyan' }
          ]
        },
        requiredCommandDesc: 'Create the /frost_vault directory, then move the backup capsule inside',
        targetCommand: 'mkdir /frost_vault',
        alternateValidCommands: [
          'mkdir /frost_vault',
          'mv heater_core_backup.cad /frost_vault/',
          'mv heater_core_backup.cad /frost_vault'
        ],
        hintText: 'Step 1: Type "mkdir /frost_vault" to create the folder. Step 2: Type "mv heater_core_backup.cad /frost_vault/" to move it.',
        expectedOutput: '',
        commandMastered: 'mv',
        commandExplanation: 'mkdir creates a new directory, and mv moves files safely into target folders.'
      },
      {
        pageNumber: 6,
        title: 'Page 6 - Safe!',
        subtitle: 'Mission Accomplished: Command Mastered',
        narrativeText: [
          'Debbie closed her notebook with a satisfying snap. "Backup created, original preserved, directory safe."',
          'The four friends lined up along the snowy platform, smiling proudly.',
          '"You just learned cp — one of the most powerful safety tools in the entire system," Kali said with a warm grin. "Always protect your data, and we\'ll see you on the next adventure!"',
          '[Command Mastered: cp]'
        ],
        dialogue: [
          { speaker: 'debbie', text: 'Backup created, original preserved, directory safe.', emotion: 'proud' },
          { speaker: 'kazz', text: 'Glacier Kernel is warm and secured against the blizzard!', emotion: 'excited' },
          { speaker: 'windel', text: 'I love cp and mv! Best team in the system!', emotion: 'smiling' },
          { speaker: 'kali', text: 'You just learned cp — one of the most powerful safety tools in the entire system. Always protect your data!', emotion: 'smiling' }
        ],
        visualState: {
          environment: 'arctic',
          auroraActive: true,
          roverArrived: true,
          vaultExists: true,
          vaultLocked: true,
          capsules: [
            { id: 'orig', filename: 'heater_core.cad', label: 'heater_core.cad (Preserved)', isBackup: false, inVault: false, color: 'gold' },
            { id: 'backup', filename: 'heater_core_backup.cad', label: 'heater_core_backup.cad (Vault Secured)', isBackup: true, inVault: true, color: 'emerald' }
          ]
        },
        hintText: 'Congratulations! You mastered cp, ls, mkdir, and mv. Review Debbie\'s notebook or advance to Adventure 2!',
        commandMastered: 'cp'
      }
    ]
  },
  {
    id: 'silicon-sandstorm',
    number: 2,
    title: 'The Cyber Crew and the Silicon Sandstorm',
    subtitle: 'The Lost Telemetry Sensor Log',
    catchphrase: 'ROOT PERMISSIONS READY TO GO, THREE, TWO, ONE... SUDO!',
    environmentName: 'Dune Directory - Outpost Solar',
    badge: 'grep',
    theme: {
      primary: '#f59e0b',
      secondary: '#ef4444',
      accent: '#06b6d4',
      bgGradient: 'from-amber-950 via-stone-900 to-slate-950'
    },
    initialCwd: '/home/kali',
    initialFs: {
      home: {
        type: 'dir',
        children: {
          kali: {
            type: 'dir',
            children: {
              'mission_brief.txt': {
                type: 'file',
                content: 'DUNE TELEMETRY STATION:\nHigh particulate warning. Check /telemetry/weather_log.txt for CRITICAL errors.'
              }
            }
          }
        }
      },
      telemetry: {
        type: 'dir',
        children: {
          'weather_log.txt': {
            type: 'file',
            content: `[08:00] Solar arrays tracking sun angle.\n[08:14] Wind velocity: 18 knots.\n[08:22] SENSOR-3: Micro-dust buildup detected.\n[08:35] CRITICAL: Sand-shield valve 04 jam at sector 9!\n[08:40] Alert relayed to Cyber Crew Outpost.`
          }
        }
      }
    },
    masterySummary: {
      command: 'grep',
      description: 'The search powerhouse of Linux. Fast global regular expression print used to filter needle-in-a-haystack log lines.',
      syntax: 'grep [options] [pattern] [file]',
      proTip: 'Use grep -i to ignore case sensitivity, and grep -r to search across entire directory trees!'
    },
    pages: [
      {
        pageNumber: 1,
        title: 'Page 1 - The Cheer in the Dunes',
        subtitle: 'Solar Node Morning Warmth',
        isCheerPage: true,
        narrativeText: [
          'Golden sand danced over the solar relays of the Dune Directory. The Cyber Crew stood beneath the towering solar umbrella, ready to inspect the desert perimeter.',
          'They locked hands tightly, yellow dust swirling around Windel\'s boots, and shouted the crew creed:'
        ],
        dialogue: [
          { speaker: 'kazz', text: 'Sand storm season is here! Time to scan the dunes!', emotion: 'excited' },
          { speaker: 'windel', text: 'Sensors on, goggles locked!', emotion: 'smiling' },
          { speaker: 'debbie', text: 'Telemetry logs ready for analysis.', emotion: 'proud' },
          { speaker: 'kali', text: 'Ready crew? Three, two, one...', emotion: 'excited' }
        ],
        visualState: {
          environment: 'sandstorm',
          stormActive: false,
          cheerDone: false,
          capsules: []
        },
        hintText: 'Click the cheer button or type "sudo cheer" to launch into Adventure 2!'
      },
      {
        pageNumber: 2,
        title: 'Page 2 - The Sensor Glitch',
        subtitle: 'Red Warning on the Solar Relay',
        narrativeText: [
          'A screeching siren echoed from the solar tower. The telemetry relay flashed amber!',
          '"A particulate storm is sweeping in from Sector 9!" Windel reported, tapping his datapad. "Somewhere in the giant log file, there\'s a critical error telling us which valve is jammed!"',
          '"We don\'t have time to read thousands of lines manually," Debbie observed, flipping her spiral notebook open. "We need Linux pattern search to pinpoint the exact alert."'
        ],
        dialogue: [
          { speaker: 'windel', text: 'The sand-shield didn\'t deploy! There are hundreds of lines in /telemetry/weather_log.txt!', emotion: 'urgent' },
          { speaker: 'debbie', text: 'Never scroll through gigabytes of logs by hand. Linux gives us laser-sharp search tools.', emotion: 'thinking' },
          { speaker: 'kali', text: 'Let\'s inspect where we are first, then navigate straight to the telemetry folder!', emotion: 'smiling' }
        ],
        visualState: {
          environment: 'sandstorm',
          stormActive: true,
          capsules: []
        },
        hintText: 'Check your current directory with pwd!'
      },
      {
        pageNumber: 3,
        title: 'Page 3 - Navigate with CD',
        subtitle: 'Moving to the Telemetry Directory',
        narrativeText: [
          '"First, let\'s see where we are currently standing," Kali said. She ran pwd.',
          'Next, Windel suggested: "Let\'s switch our working folder into the /telemetry directory so we can examine the log directly!"',
          'Kali typed: cd /telemetry',
          'The prompt changed from ~ to /telemetry, putting the team right next to the weather sensor logs.'
        ],
        dialogue: [
          { speaker: 'kali', text: 'Let\'s change directory right to the telemetry hub. Type: cd /telemetry', emotion: 'neutral' },
          { speaker: 'windel', text: 'cd stands for Change Directory — our compass across the filesystem!', emotion: 'smiling' }
        ],
        visualState: {
          environment: 'sandstorm',
          stormActive: true,
          capsules: []
        },
        requiredCommandDesc: 'Change your working directory to /telemetry',
        targetCommand: 'cd /telemetry',
        hintText: 'Type: cd /telemetry',
        expectedOutput: '',
        commandMastered: 'cd',
        commandExplanation: 'cd changes your current working directory to the target path.'
      },
      {
        pageNumber: 4,
        title: 'Page 4 - Search with Grep',
        subtitle: 'Finding the Critical Jam',
        narrativeText: [
          '"Now for the detective command," Debbie smiled, pen poised. "Who knows how to search for the word CRITICAL inside weather_log.txt?"',
          '"GREP!" Windel shouted. "Global Regular Expression Print!"',
          'Kali stepped up and typed: grep CRITICAL weather_log.txt',
          'The terminal illuminated with a bright red hit:\nCRITICAL: Sand-shield valve 04 jam at sector 9!'
        ],
        dialogue: [
          { speaker: 'debbie', text: 'Use grep to search specifically for the word "CRITICAL".', emotion: 'thinking' },
          { speaker: 'kali', text: 'Type: grep CRITICAL weather_log.txt into the terminal!', emotion: 'smiling' },
          { speaker: 'kazz', text: 'Sector 9! Valve 04! That is where the team needs to send the repair rover!', emotion: 'excited' }
        ],
        visualState: {
          environment: 'sandstorm',
          stormActive: true,
          capsules: []
        },
        requiredCommandDesc: 'Search for the CRITICAL message in weather_log.txt',
        targetCommand: 'grep CRITICAL weather_log.txt',
        alternateValidCommands: ['grep -i critical weather_log.txt', 'grep "CRITICAL" weather_log.txt'],
        hintText: 'Type: grep CRITICAL weather_log.txt',
        expectedOutput: 'CRITICAL: Sand-shield valve 04 jam at sector 9!',
        commandMastered: 'grep',
        commandExplanation: 'grep scans text files line-by-line and outputs only matching patterns.'
      },
      {
        pageNumber: 5,
        title: 'Page 5 - The Fix & Safe Camp',
        subtitle: 'Sand-Shield Engaged',
        narrativeText: [
          'Armed with the exact valve location, Kazz pressed the remote override for Valve 04. CLANK! The heavy titanium shield slammed into place, deflecting the howling sand wall with a resounding thud.',
          'Debbie made a neat notation in her notebook: "Anomaly isolated via grep. Valve cleared. Solar array 100% operational."',
          '"Command mastered: grep!" cheering echoed across the dunes as the crew high-fived under the glowing shield.'
        ],
        dialogue: [
          { speaker: 'kazz', text: 'Valve 04 reset! The shield is down and the camp is safe!', emotion: 'excited' },
          { speaker: 'debbie', text: 'Notebook logged: grep found in seconds what would have taken hours to read.', emotion: 'proud' },
          { speaker: 'windel', text: 'Another victory for the Cyber Crew!', emotion: 'smiling' },
          { speaker: 'kali', text: 'Grep is a superpower for every sysadmin and developer. Well done!', emotion: 'smiling' }
        ],
        visualState: {
          environment: 'sandstorm',
          stormActive: false,
          capsules: []
        },
        hintText: 'Congratulations on mastering grep and cd! Proceed to Adventure 3 or practice in the sandbox.',
        commandMastered: 'grep'
      }
    ]
  },
  {
    id: 'hydro-dam',
    number: 3,
    title: 'The Cyber Crew and the Neon Hydro-Dam',
    subtitle: 'The Read-Only Valve Crisis',
    catchphrase: 'ROOT PERMISSIONS READY TO GO, THREE, TWO, ONE... SUDO!',
    environmentName: 'Cascade Kernel - Sluice Control',
    badge: 'chmod',
    theme: {
      primary: '#10b981',
      secondary: '#06b6d4',
      accent: '#ec4899',
      bgGradient: 'from-emerald-950 via-teal-950 to-slate-950'
    },
    initialCwd: '/home/kali',
    initialFs: {
      home: {
        type: 'dir',
        children: {
          kali: {
            type: 'dir',
            children: {
              'emergency_drain.sh': {
                type: 'file',
                exec: false,
                permissions: '-rw-r--r--',
                content: '#!/bin/bash\necho "[CYBER DRAIN ENGAGED] Flushing reservoir to safe levels..."'
              }
            }
          }
        }
      }
    },
    masterySummary: {
      command: 'chmod',
      description: 'Change file mode bits and execution permissions. Gives or revokes run, read, and write privileges.',
      syntax: 'chmod [+-=][rwx] [file]  OR  chmod 755 [file]',
      proTip: 'chmod +x allows you to execute shell scripts and binaries directly with ./'
    },
    pages: [
      {
        pageNumber: 1,
        title: 'Page 1 - The Cheer at the Dam',
        subtitle: 'Cascade Kernel Waterfalls',
        isCheerPage: true,
        narrativeText: [
          'High above the roaring turquoise waters of Cascade Kernel, the Cyber Crew stood on the metal catwalk of the Great Hydro-Dam.',
          'They joined hands as spray misted their jackets, greeting the rushing river with their trademark cheer:'
        ],
        dialogue: [
          { speaker: 'kazz', text: 'Hear that thunder? The water turbines are running hot today!', emotion: 'excited' },
          { speaker: 'windel', text: 'Three, two, one...', emotion: 'smiling' },
          { speaker: 'debbie', text: 'Root permissions ready to go!', emotion: 'proud' },
          { speaker: 'kali', text: 'SUDO!', emotion: 'excited' }
        ],
        visualState: {
          environment: 'dam',
          drainActive: false,
          cheerDone: false,
          capsules: []
        },
        hintText: 'Cheer with the crew to begin Adventure 3!'
      },
      {
        pageNumber: 2,
        title: 'Page 2 - Sluice Gate Lockdown',
        subtitle: 'Permission Denied!',
        narrativeText: [
          'BEEP BEEP BEEP! The flood gauge hit the red line! The emergency drainage script emergency_drain.sh had been downloaded, but when Kali tried to run it:',
          'bash: ./emergency_drain.sh: Permission denied',
          '"Wait, why won\'t it run?" Windel asked. Debbie turned her notebook to a page labeled Permissions: "In Linux, newly created text files do not have execute rights by default. We have to grant execution with chmod +x!"'
        ],
        dialogue: [
          { speaker: 'windel', text: 'Permission denied? But it\'s our script!', emotion: 'urgent' },
          { speaker: 'debbie', text: 'Linux protects systems by making new scripts non-executable until a human explicitly grants permission.', emotion: 'thinking' },
          { speaker: 'kali', text: 'Let\'s check the permissions with ls -l, then use chmod +x!', emotion: 'smiling' }
        ],
        visualState: {
          environment: 'dam',
          drainActive: false,
          capsules: []
        },
        hintText: 'Check permissions first with: ls -l'
      },
      {
        pageNumber: 3,
        title: 'Page 3 - Inspecting with ls -l',
        subtitle: 'Understanding -rw-r--r--',
        narrativeText: [
          'Kali typed: ls -l',
          'The terminal printed:\n-rw-r--r-- 1 kali crew 1024 Oct 28 09:00 emergency_drain.sh',
          '"Notice there is no x in the permissions," Debbie explained. "x stands for eXecute. Without it, the kernel treats it merely as a text document, not a runnable program."'
        ],
        dialogue: [
          { speaker: 'kazz', text: 'I see it! -rw-r--r--! No "x" anywhere!', emotion: 'excited' },
          { speaker: 'kali', text: 'Let\'s list it with ls -l to see the file bits!', emotion: 'neutral' }
        ],
        visualState: {
          environment: 'dam',
          drainActive: false,
          capsules: []
        },
        requiredCommandDesc: 'List detailed file permissions with ls -l',
        targetCommand: 'ls -l',
        hintText: 'Type: ls -l',
        expectedOutput: '-rw-r--r-- 1 kali crew 1024 Oct 28 09:00 emergency_drain.sh',
        commandMastered: 'ls -l',
        commandExplanation: 'ls -l displays detailed file metadata including permissions, ownership, size, and timestamp.'
      },
      {
        pageNumber: 4,
        title: 'Page 4 - Granting Execute Bits',
        subtitle: 'chmod +x emergency_drain.sh',
        narrativeText: [
          '"Time to make it runnable!" Windel cheered, tapping his yellow boots.',
          'Kali entered: chmod +x emergency_drain.sh',
          'Instantly, the permission string transformed to -rwxr-xr-x! The terminal colored the script green, indicating full execution capability.'
        ],
        dialogue: [
          { speaker: 'kali', text: 'chmod +x adds the executable bit. Type: chmod +x emergency_drain.sh', emotion: 'smiling' },
          { speaker: 'windel', text: 'Change Mode... + x! Beautiful!', emotion: 'excited' }
        ],
        visualState: {
          environment: 'dam',
          drainActive: false,
          capsules: []
        },
        requiredCommandDesc: 'Make emergency_drain.sh executable with chmod +x',
        targetCommand: 'chmod +x emergency_drain.sh',
        alternateValidCommands: ['chmod 755 emergency_drain.sh'],
        hintText: 'Type: chmod +x emergency_drain.sh',
        expectedOutput: '',
        commandMastered: 'chmod',
        commandExplanation: 'chmod modifies permission mode flags for users, groups, and others.'
      },
      {
        pageNumber: 5,
        title: 'Page 5 - Running The Script',
        subtitle: './emergency_drain.sh',
        narrativeText: [
          '"Now execute!" Kazz called out. Kali ran: ./emergency_drain.sh',
          'KAPOW! Hydraulic gates 1, 2, and 3 swung open with a hiss of steam. 12,000 gallons per minute surged safely through the overflow canals.',
          'The reservoir warning lights turned from flashing scarlet to calm cyber blue. The dam was saved!'
        ],
        dialogue: [
          { speaker: 'kali', text: 'Run it now! Type: ./emergency_drain.sh', emotion: 'excited' },
          { speaker: 'kazz', text: 'The sluice gates are opening! Water pressure dropping to normal!', emotion: 'excited' },
          { speaker: 'debbie', text: 'Snap! Logged: chmod +x mastered. Dam secure.', emotion: 'proud' }
        ],
        visualState: {
          environment: 'dam',
          drainActive: true,
          capsules: []
        },
        requiredCommandDesc: 'Run the executable script: ./emergency_drain.sh',
        targetCommand: './emergency_drain.sh',
        hintText: 'Type: ./emergency_drain.sh',
        expectedOutput: '[CYBER DRAIN ENGAGED] Flushing reservoir to safe levels...',
        commandMastered: 'chmod',
        commandExplanation: './ runs an executable file residing in your current directory.'
      }
    ]
  },
  {
    id: 'volcano-node',
    number: 4,
    title: 'The Cyber Crew and the Magma Overclock Bot',
    subtitle: 'The Rogue Process in the Core',
    catchphrase: 'ROOT PERMISSIONS READY TO GO, THREE, TWO, ONE... SUDO!',
    environmentName: 'Magma Mount - Geothermal Substation',
    badge: 'ps & kill',
    theme: {
      primary: '#ef4444',
      secondary: '#f97316',
      accent: '#8b5cf6',
      bgGradient: 'from-rose-950 via-zinc-950 to-slate-950'
    },
    initialCwd: '/home/kali',
    initialFs: {
      home: {
        type: 'dir',
        children: {
          kali: {
            type: 'dir',
            children: {
              'thermal_status.txt': {
                type: 'file',
                content: 'GEOTHERMAL CORE: Overheating! Rogue daemon running on CPU core 0.'
              }
            }
          }
        }
      }
    },
    masterySummary: {
      command: 'ps & kill',
      description: 'Process monitoring and termination. Inspect running jobs with ps, then cleanly halt runaway programs with kill.',
      syntax: 'ps [options]  |  kill [PID]',
      proTip: 'Use ps aux to see processes from all users with memory and CPU percentages!'
    },
    pages: [
      {
        pageNumber: 1,
        title: 'Page 1 - Magma Mount Cheer',
        subtitle: 'Subterranean Heat',
        isCheerPage: true,
        narrativeText: [
          'Crimson lava tubes cast dancing reflections along the obsidian platform of Magma Mount. Despite the intense heat, the Cyber Crew was focused and ready.',
          'They joined hands above the cooling grill, their voices rising above the rumble:'
        ],
        dialogue: [
          { speaker: 'kazz', text: 'It\'s hot down here, but our terminal stays ice cool!', emotion: 'excited' },
          { speaker: 'windel', text: 'Checking thermal readouts... Root permissions ready!', emotion: 'smiling' },
          { speaker: 'debbie', text: 'Ready, set...', emotion: 'proud' },
          { speaker: 'kali', text: 'Three, two, one... SUDO!', emotion: 'excited' }
        ],
        visualState: {
          environment: 'volcano',
          botRunning: true,
          cheerDone: false,
          capsules: []
        },
        hintText: 'Cheer to initiate Adventure 4!'
      },
      {
        pageNumber: 2,
        title: 'Page 2 - The Rogue Overclock Daemon',
        subtitle: 'Process ID 404 Rampage',
        narrativeText: [
          'Warning klaxons sounded through the geothermal cavern! "A runaway simulation bot is looping infinitely, maxing out CPU heat!" Windel yelled.',
          '"We don\'t pull the plug on the server and crash the whole grid," Debbie instructed. "In Linux, every program has a Process ID — a PID. We list processes with ps, find the runaway bot, and terminate only that PID."'
        ],
        dialogue: [
          { speaker: 'windel', text: 'Temperatures are at 94°C and climbing! The pumps are shaking!', emotion: 'urgent' },
          { speaker: 'debbie', text: 'Open the process table with ps to identify the culprit\'s PID.', emotion: 'thinking' },
          { speaker: 'kali', text: 'Type ps in your terminal to see all running processes!', emotion: 'smiling' }
        ],
        visualState: {
          environment: 'volcano',
          botRunning: true,
          capsules: []
        },
        requiredCommandDesc: 'List active processes using ps',
        targetCommand: 'ps',
        alternateValidCommands: ['ps aux', 'ps -ef'],
        hintText: 'Type: ps',
        expectedOutput: '404 ? 00:04:12 rogue_bot_overclock',
        commandMastered: 'ps',
        commandExplanation: 'ps snapshots all running processes and displays their unique PIDs.'
      },
      {
        pageNumber: 3,
        title: 'Page 3 - Target Locked: PID 404',
        subtitle: 'Terminating the Runaway Daemon',
        narrativeText: [
          '"Look at PID 404!" Kazz pointed. "rogue_bot_overclock --max-turbos is burning through 100% CPU!"',
          'Windel adjusted his glasses. "What command terminates a rogue process by its PID?"',
          '"kill!" Debbie smiled.',
          'Kali entered: kill 404'
        ],
        dialogue: [
          { speaker: 'kazz', text: 'Target identified: PID 404! Stop that bot!', emotion: 'excited' },
          { speaker: 'windel', text: 'Type: kill 404 to send the termination signal!', emotion: 'smiling' },
          { speaker: 'kali', text: 'Entering: kill 404', emotion: 'neutral' }
        ],
        visualState: {
          environment: 'volcano',
          botRunning: true,
          capsules: []
        },
        requiredCommandDesc: 'Halt the rogue process with kill 404',
        targetCommand: 'kill 404',
        alternateValidCommands: ['sudo kill 404', 'kill -9 404'],
        hintText: 'Type: kill 404',
        expectedOutput: '[+] Terminated PID 404 (rogue_bot_overclock). Temperature sensors returning to normal!',
        commandMastered: 'kill',
        commandExplanation: 'kill sends signals (such as SIGTERM or SIGKILL) to stop malfunctioning processes.'
      },
      {
        pageNumber: 4,
        title: 'Page 4 - Core Cool and Safe',
        subtitle: 'Geothermal Stabilized',
        narrativeText: [
          'SHHHHHHH... The deafening roar of the runaway overclock vanished. The geothermal cooling fluid flowed smoothly once more, and temperature gauges plunged back to a comfortable 42°C.',
          'Debbie made her final note and snapped her spiral book shut with that unmistakable satisfying click.',
          '"Another crisis averted with Linux power," Kali said with a grin. "Process management mastered!"'
        ],
        dialogue: [
          { speaker: 'kazz', text: 'Temperatures nominal! Geothermal grid is green!', emotion: 'excited' },
          { speaker: 'debbie', text: 'Snap! Process 404 terminated cleanly without dropping critical system services.', emotion: 'proud' },
          { speaker: 'windel', text: 'We mastered ps and kill! High five, Cyber Crew!', emotion: 'smiling' },
          { speaker: 'kali', text: 'You are now a true terminal explorer. Glacier Kernel, the dunes, the dam, and the magma node are all safe because of you!', emotion: 'smiling' }
        ],
        visualState: {
          environment: 'volcano',
          botRunning: false,
          capsules: []
        },
        hintText: 'All adventures completed! You are now an honorary Cyber Crew Terminal Commander!',
        commandMastered: 'kill'
      }
    ]
  }
];

export const COMMAND_MANUAL: Array<{
  command: string;
  category: string;
  syntax: string;
  description: string;
  adventureOrigin: string;
}> = [
  { command: 'cp', category: 'File Operations', syntax: 'cp [source] [destination]', description: 'Create an exact duplicate of a file while preserving original.', adventureOrigin: 'Adventure 1: Arctic Kernel Freeze' },
  { command: 'mv', category: 'File Operations', syntax: 'mv [source] [target_folder/]', description: 'Move or rename files and directories.', adventureOrigin: 'Adventure 1: Arctic Kernel Freeze' },
  { command: 'ls', category: 'Inspection', syntax: 'ls [-a] [-l]', description: 'List files and directories in current working folder.', adventureOrigin: 'Adventure 1: Arctic Kernel Freeze' },
  { command: 'mkdir', category: 'Directory Ops', syntax: 'mkdir [directory_name]', description: 'Create a new directory or dedicated vault.', adventureOrigin: 'Adventure 1: Arctic Kernel Freeze' },
  { command: 'cd', category: 'Navigation', syntax: 'cd [path]', description: 'Change current working directory.', adventureOrigin: 'Adventure 2: Silicon Sandstorm' },
  { command: 'pwd', category: 'Navigation', syntax: 'pwd', description: 'Print working directory to know exactly where you are.', adventureOrigin: 'Adventure 2: Silicon Sandstorm' },
  { command: 'grep', category: 'Search', syntax: 'grep [pattern] [file]', description: 'Search text files line by line for matching patterns.', adventureOrigin: 'Adventure 2: Silicon Sandstorm' },
  { command: 'chmod', category: 'Permissions', syntax: 'chmod [+x] [file]', description: 'Modify file permissions to make scripts executable.', adventureOrigin: 'Adventure 3: Neon Hydro-Dam' },
  { command: 'ps', category: 'Processes', syntax: 'ps [aux]', description: 'Snapshot all running processes with their unique PIDs.', adventureOrigin: 'Adventure 4: Magma Mount' },
  { command: 'kill', category: 'Processes', syntax: 'kill [PID]', description: 'Send termination signal to stop rogue or runaway processes.', adventureOrigin: 'Adventure 4: Magma Mount' }
];
