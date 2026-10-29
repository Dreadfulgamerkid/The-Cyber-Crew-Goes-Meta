// Kazz's Memory Bank: High-energy mnemonics, tactical container isolation, and offline coaching
export interface KazzCoachData {
  greeting: string;
  mnemonic: string;
  explanation: string;
  sandboxTip: string;
  flagsToKnow: Array<{ flag: string; meaning: string }>;
  funFact: string;
  practiceChallenge: string;
}

export const KAZZ_COMMAND_MEMORIES: Record<string, KazzCoachData> = {
  cp: {
    greeting: "Yo crewmate! Kazz here, streaming from my Kasm sandbox pod! Let's duplicate without fear!",
    mnemonic: "CP = Carbon Paper / Copy Paste! Take the original, produce an exact clone, and keep the source pristine!",
    explanation: "cp takes a source file and writes an exact twin at your destination. Debbie always reminds us: never test directly on the only blueprint in Glacier Kernel!",
    sandboxTip: "Always list your files with 'ls' right after running cp to verify the clone materialized properly.",
    flagsToKnow: [
      { flag: "-r", meaning: "Recursive: Copies entire directories and all files inside them" },
      { flag: "-i", meaning: "Interactive: Asks for confirmation before overwriting an existing file" },
      { flag: "-p", meaning: "Preserve: Keeps original file timestamps, ownership, and mode" }
    ],
    funFact: "In container isolation, we duplicate base image layers using copy-on-write so cloning thousands of workspaces happens in milliseconds!",
    practiceChallenge: "Try typing: cp heater_core.cad heater_backup.cad"
  },
  mkdir: {
    greeting: "What's up explorer! Kazz locked into the sandbox. Time to build a new compartment!",
    mnemonic: "MKDIR = MaKe DIRectory! Think of building an empty frost vault locker before sliding anything inside!",
    explanation: "mkdir carves out a brand-new directory folder in your file system. You can't store items in a vault that doesn't exist yet!",
    sandboxTip: "Use the -p flag whenever you want to create nested paths in a single strike without errors.",
    flagsToKnow: [
      { flag: "-p", meaning: "Parents: Creates parent folders automatically if they don't exist yet" },
      { flag: "-v", meaning: "Verbose: Prints a confirmation message for every created directory" }
    ],
    funFact: "Every container in Kasm creates ephemeral mount directories on the fly that disappear completely once you disconnect!",
    practiceChallenge: "Try typing: mkdir -p /frost_vault/emergency_cache"
  },
  mv: {
    greeting: "Locked and loaded in the Kasm container! Kazz here to help you relocate files safely!",
    mnemonic: "MV = MoVe or More Variance (Rename)! It either changes where a file lives, or gives it a brand-new name!",
    explanation: "mv transfers a file from one path to another, OR renames it if the target is in the same directory. No duplicate is left behind!",
    sandboxTip: "Be careful moving files into directories! If the destination folder doesn't exist, mv will rename your file to that folder name instead!",
    flagsToKnow: [
      { flag: "-i", meaning: "Interactive: Warns you if you are about to overwrite an existing file" },
      { flag: "-n", meaning: "No-clobber: Prevents overwriting any existing destination file" },
      { flag: "-u", meaning: "Update: Moves only when the source is newer than the destination" }
    ],
    funFact: "Moving a file on the same disk filesystem doesn't rewrite the data bits at all—it simply points the inode pointer to the new directory label!",
    practiceChallenge: "Try typing: mv heater_core_backup.cad /frost_vault/"
  },
  ls: {
    greeting: "Hey squad! Kazz's favorite recon command is on deck! Let's scan our surroundings!",
    mnemonic: "LS = Laser Scanner / List Stuff! Look around and inspect every entity in your current room!",
    explanation: "ls reveals all visible files and folders inside your directory. It's the ultimate recon tool to confirm what just happened.",
    sandboxTip: "Pair with -la to spot hidden dotfiles (like .bashrc or .cad_config) and check file sizes.",
    flagsToKnow: [
      { flag: "-l", meaning: "Long format: Shows permissions, owner, file size, and timestamp" },
      { flag: "-a", meaning: "All: Shows hidden files that start with a period (.)" },
      { flag: "-h", meaning: "Human-readable: Displays sizes in KB, MB, and GB instead of raw bytes" }
    ],
    funFact: "Linux hides files simply by starting their name with a period. In recon work, hidden config files are where the coolest secrets hide!",
    practiceChallenge: "Try typing: ls -lah /home/kali"
  },
  cat: {
    greeting: "Kazz streaming live! Ready to inspect text telemetry? Let's crack it open!",
    mnemonic: "CAT = conCATenate! Pours file contents straight onto your terminal screen like a waterfall of data!",
    explanation: "cat dumps the contents of a text file directly onto your terminal. Perfect for reading blueprints, logs, and sensor printouts quickly.",
    sandboxTip: "If a file is hundreds of lines long, cat will scroll past in a blur! Use 'less' or 'head' when dealing with huge log files.",
    flagsToKnow: [
      { flag: "-n", meaning: "Number: Adds line numbers to every line of output" },
      { flag: "-E", meaning: "Show Ends: Displays a '$' at the end of each line to catch hidden whitespace" }
    ],
    funFact: "cat was originally designed to stitch multiple text files together into one stream (concatenate), but everyone uses it as an instant file reader!",
    practiceChallenge: "Try typing: cat heater_core.cad"
  },
  grep: {
    greeting: "Recon radar calibrated! Kazz here to filter the noise from the signal!",
    mnemonic: "GREP = Grab Relevant Exact Phrases! Like a searchlight picking out one exact serial number in an avalanche of code!",
    explanation: "grep scans lines of text or files for a specific search pattern and prints only the lines that match.",
    sandboxTip: "Always use the -i flag if you aren't sure whether the text is capitalized or lowercase.",
    flagsToKnow: [
      { flag: "-i", meaning: "Ignore Case: Matches both UPPERCASE and lowercase words" },
      { flag: "-r", meaning: "Recursive: Searches through all files in subdirectories" },
      { flag: "-v", meaning: "Invert Match: Prints lines that DO NOT match the search keyword" },
      { flag: "-n", meaning: "Line Number: Prints the line number where the match occurred" }
    ],
    funFact: "GREP stands for 'Global Regular Expression Print' from the legendary ed text editor of Unix history!",
    practiceChallenge: "Try typing: grep -i 'temperature' telemetry.log"
  },
  pwd: {
    greeting: "GPS coordinates locked! Kazz here to pinpoint our exact coordinate anchor!",
    mnemonic: "PWD = Pinpoint Where Domiciled / Print Working Directory! Tells you where you are standing in the system!",
    explanation: "pwd prints the absolute directory path from the root (/) to your current shell location.",
    sandboxTip: "When you get disoriented in deeply nested folders, pwd is your north star compass.",
    flagsToKnow: [
      { flag: "-P", meaning: "Physical: Resolves all symbolic links to show the real physical path" }
    ],
    funFact: "In container runtimes, pwd might show /home/kasm-user even though the physical container is isolated inside /var/lib/docker/overlay2!",
    practiceChallenge: "Try typing: pwd"
  },
  chmod: {
    greeting: "Security protocol alert! Kazz here to lock down permissions with the crew!",
    mnemonic: "CHMOD = CHange MODe! Control who can Read (r), Write (w), or Execute (x) your critical scripts!",
    explanation: "chmod configures read, write, and execute permissions on files. Essential for making shell scripts runnable or locking blueprints.",
    sandboxTip: "chmod +x is the golden ticket to make any script executable. Avoid chmod 777 unless you want the entire world editing your files!",
    flagsToKnow: [
      { flag: "+x", meaning: "Execute: Allows the file to be run as an active program or script" },
      { flag: "+w", meaning: "Write: Grants permission to modify or overwrite the file" },
      { flag: "-R", meaning: "Recursive: Changes permissions on all files inside a folder" }
    ],
    funFact: "Permissions are stored as binary octal numbers (4=Read, 2=Write, 1=Execute). 7 means 4+2+1 = all permissions!",
    practiceChallenge: "Try typing: chmod +x thermal_sensor.sh"
  },
  sudo: {
    greeting: "Root permissions ready to go! Three, two, one... SUDO! Kazz hyped with the master key!",
    mnemonic: "SUDO = Super User DO! Elevates your normal account to Root administrator privileges for high-level operations!",
    explanation: "sudo executes a command as the root superuser. In The Cyber Crew, it's also our canonical cheer of unity and readiness!",
    sandboxTip: "With great power comes great responsibility! Never run destructive commands with sudo unless you've double-checked the path.",
    flagsToKnow: [
      { flag: "-i", meaning: "Interactive: Starts a root login shell session" },
      { flag: "-u", meaning: "User: Runs command as a specific specified user account" }
    ],
    funFact: "sudo originally meant 'Superuser Do', but it also allows fine-grained delegation so you don't have to share root passwords!",
    practiceChallenge: "Try typing: sudo cheer"
  },
  touch: {
    greeting: "Blank canvas ready! Kazz here to spawn new files in the sandbox!",
    mnemonic: "TOUCH = Tap an Outstanding Unique Creation Here! Creates a brand-new blank file instantly!",
    explanation: "touch creates empty files if they don't exist yet, or updates their last modified timestamp if they already exist.",
    sandboxTip: "Fastest way to create a placeholder blueprint or config file before adding content.",
    flagsToKnow: [
      { flag: "-c", meaning: "No create: Does not create a file if it doesn't already exist" }
    ],
    funFact: "Forensics investigators check timestamps modified by touch to see if files were tampered with!",
    practiceChallenge: "Try typing: touch sensor_grid.cfg"
  },
  clear: {
    greeting: "Screen declutter protocol active! Kazz here to give your eyes a fresh view!",
    mnemonic: "CLEAR = Clean Layout, Erase All Residue! Sweeps the terminal screen clean like fresh snow!",
    explanation: "clear wipes the terminal view so you have a fresh empty prompt, without deleting your history.",
    sandboxTip: "You can also press Ctrl+L on your keyboard anytime as an instant shortcut for clear!",
    flagsToKnow: [],
    funFact: "clear doesn't actually delete your terminal scrollback; it just pushes earlier output up past the visible viewport!",
    practiceChallenge: "Try typing: clear"
  }
};

export function getKazzFallbackAdvice(
  command: string,
  adventureTitle: string = 'Cyber Adventure',
  userQuestion?: string
): KazzCoachData {
  const cleanCmd = command.toLowerCase().trim().replace(/^sudo\s+/, '').split(/\s+/)[0] || 'ls';

  if (KAZZ_COMMAND_MEMORIES[cleanCmd]) {
    const base = KAZZ_COMMAND_MEMORIES[cleanCmd];
    if (userQuestion) {
      return {
        ...base,
        greeting: `Yo explorer! Analyzing your question in isolated sandbox pod #01: "${userQuestion}"`,
        explanation: `${base.explanation} Regarding your question: in this ${adventureTitle} mission, we keep everything contained in Kasm so you can test '${cleanCmd}' without any risk to the main grid!`
      };
    }
    return base;
  }

  // Generic fallback for any other Linux command
  return {
    greeting: `Yo crewmate! Kazz locked into the Kasm VNC stream. Isolating command [${cleanCmd}]!`,
    mnemonic: `${cleanCmd.toUpperCase()} = Key Command! Remember its core objective in the system and practice it in isolation!`,
    explanation: `The '${cleanCmd}' command plays a vital role in system maintenance and recon during our adventures in ${adventureTitle}. In container isolation, you can test flags without fear of breaking Glacier Kernel.`,
    sandboxTip: `Always run '${cleanCmd} --help' or 'man ${cleanCmd}' inside an isolated sandbox to see full operational parameters.`,
    flagsToKnow: [
      { flag: "--help", meaning: "Display built-in usage options and manual flags" },
      { flag: "-v", meaning: "Verbose output for step-by-step diagnostic feedback" }
    ],
    funFact: `Inside Kasm Web workspaces, every command runs in its own lightweight Docker container with dedicated memory namespaces!`,
    practiceChallenge: `Try typing: ${cleanCmd} --help in the sandbox shell!`
  };
}
