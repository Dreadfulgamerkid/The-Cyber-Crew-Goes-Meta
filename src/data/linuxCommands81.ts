export type LinuxCategory =
  | 'File and Directory Commands'
  | 'Networking Commands'
  | 'Process and System Monitoring Commands'
  | 'User and Permission Management Commands'
  | 'File Transfer and Synchronization Commands'
  | 'Text Processing Commands'
  | 'Shell Utilities and Shortcuts Commands';

export interface LinuxCommandDoc {
  id: string;
  command: string;
  category: LinuxCategory;
  syntax: string;
  description: string;
  reliabilityTip: string;
  isBeginner: boolean; // First 50 beginner commands
  orderIndex: number;
}

export const LINUX_CATEGORIES: LinuxCategory[] = [
  'File and Directory Commands',
  'Networking Commands',
  'Process and System Monitoring Commands',
  'User and Permission Management Commands',
  'File Transfer and Synchronization Commands',
  'Text Processing Commands',
  'Shell Utilities and Shortcuts Commands'
];

export const LINUX_COMMANDS_81: LinuxCommandDoc[] = [
  // --- First 50 Beginner-Friendly Commands (Episodes 1 - 50) ---
  {
    id: 'cmd-ls',
    command: 'ls',
    category: 'File and Directory Commands',
    syntax: 'ls [options] [path]',
    description: 'The most frequently used command in Linux to list files and directories.',
    reliabilityTip: 'Always verify file creation with "ls -la" to confirm timestamps and permissions.',
    isBeginner: true,
    orderIndex: 1
  },
  {
    id: 'cmd-pwd',
    command: 'pwd',
    category: 'File and Directory Commands',
    syntax: 'pwd',
    description: 'Print working directory command in Linux to confirm current location.',
    reliabilityTip: 'Run pwd before running scripts or destructive commands to avoid running in the wrong folder.',
    isBeginner: true,
    orderIndex: 2
  },
  {
    id: 'cmd-cd',
    command: 'cd',
    category: 'File and Directory Commands',
    syntax: 'cd [directory]',
    description: 'Linux command to navigate through directories in the virtual hierarchy.',
    reliabilityTip: 'Use "cd .." to move up one tier or "cd ~" to jump safely home to safety.',
    isBeginner: true,
    orderIndex: 3
  },
  {
    id: 'cmd-mkdir',
    command: 'mkdir',
    category: 'File and Directory Commands',
    syntax: 'mkdir [-p] <directory>',
    description: 'Command used to create directories in Linux for compartmentalized storage.',
    reliabilityTip: 'Use the -p flag (mkdir -p /vault/data) to automatically create missing parent directories without errors.',
    isBeginner: true,
    orderIndex: 4
  },
  {
    id: 'cmd-mv',
    command: 'mv',
    category: 'File and Directory Commands',
    syntax: 'mv <source> <destination>',
    description: 'Move or rename files and directories safely across the filesystem.',
    reliabilityTip: 'Never overwrite silently; check target folder existence before moving critical blueprints.',
    isBeginner: true,
    orderIndex: 5
  },
  {
    id: 'cmd-cp',
    command: 'cp',
    category: 'File and Directory Commands',
    syntax: 'cp [options] <source> <destination>',
    description: 'Similar usage as mv but creates exact replicas while preserving originals.',
    reliabilityTip: 'Debbie\'s Golden Rule: Always replicate critical data with cp before testing experimental modifications.',
    isBeginner: true,
    orderIndex: 6
  },
  {
    id: 'cmd-rm',
    command: 'rm',
    category: 'File and Directory Commands',
    syntax: 'rm [options] <file>',
    description: 'Delete files or directory trees from the storage system.',
    reliabilityTip: 'Be cautious: rm has no Recycle Bin. Prefer moving old files into an archive folder instead.',
    isBeginner: true,
    orderIndex: 7
  },
  {
    id: 'cmd-touch',
    command: 'touch',
    category: 'File and Directory Commands',
    syntax: 'touch <filename>',
    description: 'Create blank/empty files or update access and modification timestamps.',
    reliabilityTip: 'Useful for initializing sentinel flags or heartbeat log files without launching an editor.',
    isBeginner: true,
    orderIndex: 8
  },
  {
    id: 'cmd-ln',
    command: 'ln',
    category: 'File and Directory Commands',
    syntax: 'ln -s <target> <link_name>',
    description: 'Create symbolic links (shortcuts) or hard links to other files.',
    reliabilityTip: 'Always use absolute paths when creating symbolic links (-s) to prevent broken links upon directory shifts.',
    isBeginner: true,
    orderIndex: 9
  },
  {
    id: 'cmd-clear',
    command: 'clear',
    category: 'Shell Utilities and Shortcuts Commands',
    syntax: 'clear',
    description: 'Clear the terminal display screen to declutter telemetry readouts.',
    reliabilityTip: 'Use Ctrl + L as a fast shortcut to refresh your terminal viewport instantly.',
    isBeginner: true,
    orderIndex: 10
  },
  {
    id: 'cmd-cat',
    command: 'cat',
    category: 'File and Directory Commands',
    syntax: 'cat <filename>',
    description: 'Display file contents on the terminal or concatenate multiple files.',
    reliabilityTip: 'For large telemetry logs, avoid cat and use "less" to avoid scrolling past critical alarms.',
    isBeginner: true,
    orderIndex: 11
  },
  {
    id: 'cmd-echo',
    command: 'echo',
    category: 'Shell Utilities and Shortcuts Commands',
    syntax: 'echo [text]',
    description: 'Print any text that follows the command or pipe into config files.',
    reliabilityTip: 'Use single quotes to prevent premature shell variable expansion when printing commands.',
    isBeginner: true,
    orderIndex: 12
  },
  {
    id: 'cmd-less',
    command: 'less',
    category: 'File and Directory Commands',
    syntax: 'less <filename>',
    description: 'Linux command to display paged outputs in the terminal with search support.',
    reliabilityTip: 'Press "/" inside less to search for keywords and "q" to exit cleanly without leaving garbage on screen.',
    isBeginner: true,
    orderIndex: 13
  },
  {
    id: 'cmd-man',
    command: 'man',
    category: 'Shell Utilities and Shortcuts Commands',
    syntax: 'man <command>',
    description: 'Access official manual pages for all Linux commands and system calls.',
    reliabilityTip: 'Check the manual flags and return codes before executing unfamiliar utilities on production kernels.',
    isBeginner: true,
    orderIndex: 14
  },
  {
    id: 'cmd-uname',
    command: 'uname',
    category: 'Process and System Monitoring Commands',
    syntax: 'uname -a',
    description: 'Linux command to get basic information about the operating system and kernel.',
    reliabilityTip: 'Run uname -r to verify kernel patch level before executing hardware driver routines.',
    isBeginner: true,
    orderIndex: 15
  },
  {
    id: 'cmd-whoami',
    command: 'whoami',
    category: 'Process and System Monitoring Commands',
    syntax: 'whoami',
    description: 'Get the active username currently operating inside the shell session.',
    reliabilityTip: 'Check whoami before issuing privileged commands; never run untrusted scripts as root.',
    isBeginner: true,
    orderIndex: 16
  },
  {
    id: 'cmd-tar',
    command: 'tar',
    category: 'File and Directory Commands',
    syntax: 'tar -czvf <archive.tar.gz> <files>',
    description: 'Command to extract and compress files into consolidated tape archives.',
    reliabilityTip: 'Remember the flag order: -czvf creates and compresses, while -xzvf extracts safely.',
    isBeginner: true,
    orderIndex: 17
  },
  {
    id: 'cmd-grep',
    command: 'grep',
    category: 'File and Directory Commands',
    syntax: 'grep [options] <pattern> <file>',
    description: 'Search for a string or regex pattern within an output or file stream.',
    reliabilityTip: 'Combine with pipes ("ps aux | grep bot") to isolate specific process threads in an instant.',
    isBeginner: true,
    orderIndex: 18
  },
  {
    id: 'cmd-head',
    command: 'head',
    category: 'Text Processing Commands',
    syntax: 'head -n <lines> <file>',
    description: 'Return the specified number of lines from the top of a file or stream.',
    reliabilityTip: 'Use "head -n 10" to inspect blueprint file headers without loading gigabytes of raw data.',
    isBeginner: true,
    orderIndex: 19
  },
  {
    id: 'cmd-tail',
    command: 'tail',
    category: 'Text Processing Commands',
    syntax: 'tail -n <lines> [-f] <file>',
    description: 'Return the specified number of lines from the bottom of a file.',
    reliabilityTip: 'Use "tail -f /var/log/syslog" to monitor live incoming security and system events in real-time.',
    isBeginner: true,
    orderIndex: 20
  },
  {
    id: 'cmd-diff',
    command: 'diff',
    category: 'Text Processing Commands',
    syntax: 'diff -u <file1> <file2>',
    description: 'Find the differences between two files and highlight code deviations.',
    reliabilityTip: 'Always diff config files before deploying updates to spot unintended configuration drift.',
    isBeginner: true,
    orderIndex: 21
  },
  {
    id: 'cmd-cmp',
    command: 'cmp',
    category: 'Text Processing Commands',
    syntax: 'cmp <file1> <file2>',
    description: 'Allows you to check if two binary or text files are strictly byte-identical.',
    reliabilityTip: 'Ideal for binary and firmware image verification: returns exit status 0 if identical.',
    isBeginner: true,
    orderIndex: 22
  },
  {
    id: 'cmd-comm',
    command: 'comm',
    category: 'Text Processing Commands',
    syntax: 'comm <file1> <file2>',
    description: 'Combines functionality of diff and cmp, comparing two sorted files column by column.',
    reliabilityTip: 'Requires files to be sorted first ("sort file.txt") for valid column intersection calculations.',
    isBeginner: true,
    orderIndex: 23
  },
  {
    id: 'cmd-sort',
    command: 'sort',
    category: 'Text Processing Commands',
    syntax: 'sort [-r] [-n] <file>',
    description: 'Linux command to sort the contents of a file while streaming output.',
    reliabilityTip: 'Add "-u" to sort and eliminate duplicate records in one pass.',
    isBeginner: true,
    orderIndex: 24
  },
  {
    id: 'cmd-export',
    command: 'export',
    category: 'Shell Utilities and Shortcuts Commands',
    syntax: 'export <VAR>=<value>',
    description: 'Export environment variables to child processes and shells in Linux.',
    reliabilityTip: 'Verify exported values using "echo $VAR" or "env" to ensure child shells inherit properly.',
    isBeginner: true,
    orderIndex: 25
  },
  {
    id: 'cmd-zip',
    command: 'zip',
    category: 'Shell Utilities and Shortcuts Commands',
    syntax: 'zip -r <archive.zip> <folder>',
    description: 'Package and compress files into portable .zip archives across platforms.',
    reliabilityTip: 'Always pass the -r flag when archiving folders to include all nested subdirectories.',
    isBeginner: true,
    orderIndex: 26
  },
  {
    id: 'cmd-unzip',
    command: 'unzip',
    category: 'Shell Utilities and Shortcuts Commands',
    syntax: 'unzip <archive.zip> [-d <dest>]',
    description: 'Extract and unpack files from a compressed .zip archive.',
    reliabilityTip: 'Use "unzip -l archive.zip" to view archive contents before extracting to avoid clutter.',
    isBeginner: true,
    orderIndex: 27
  },
  {
    id: 'cmd-ssh',
    command: 'ssh',
    category: 'Networking Commands',
    syntax: 'ssh [user@]<host> [-p <port>]',
    description: 'Secure Shell command in Linux to encrypt and authenticate remote node access.',
    reliabilityTip: 'Always prefer public key authentication over passwords for production server access.',
    isBeginner: true,
    orderIndex: 28
  },
  {
    id: 'cmd-service',
    command: 'service',
    category: 'Process and System Monitoring Commands',
    syntax: 'service <name> <status|start|stop|restart>',
    description: 'Linux command to start, stop, restart, and inspect system service status.',
    reliabilityTip: 'Check "service <name> status" before restarting to diagnose root failure causes.',
    isBeginner: true,
    orderIndex: 29
  },
  {
    id: 'cmd-ps',
    command: 'ps',
    category: 'Process and System Monitoring Commands',
    syntax: 'ps [aux]',
    description: 'Display active running processes, CPU consumption, and process IDs.',
    reliabilityTip: 'Use "ps aux" to get a comprehensive view of all system daemons across all user accounts.',
    isBeginner: true,
    orderIndex: 30
  },
  {
    id: 'cmd-kill',
    command: 'kill',
    category: 'Process and System Monitoring Commands',
    syntax: 'kill [-signal] <pid>',
    description: 'Send termination signals to active processes by process ID (PID).',
    reliabilityTip: 'Try SIGTERM (kill <pid>) first to give processes a chance to save state, saving SIGKILL (-9) for emergencies.',
    isBeginner: true,
    orderIndex: 31
  },
  {
    id: 'cmd-killall',
    command: 'killall',
    category: 'Process and System Monitoring Commands',
    syntax: 'killall <process_name>',
    description: 'Kill all active processes matching the specified binary name.',
    reliabilityTip: 'Double check process names before firing killall so you do not accidentally terminate system-wide workers.',
    isBeginner: true,
    orderIndex: 32
  },
  {
    id: 'cmd-df',
    command: 'df',
    category: 'File and Directory Commands',
    syntax: 'df -h',
    description: 'Display disk filesystem space allocation and available capacity.',
    reliabilityTip: 'Always use "-h" for human-readable gigabyte and megabyte units.',
    isBeginner: true,
    orderIndex: 33
  },
  {
    id: 'cmd-mount',
    command: 'mount',
    category: 'File and Directory Commands',
    syntax: 'mount [-t <type>] <device> <mountpoint>',
    description: 'Mount an external storage volume or filesystem into the active hierarchy.',
    reliabilityTip: 'Never disconnect physical drives without unmounting first using umount.',
    isBeginner: true,
    orderIndex: 34
  },
  {
    id: 'cmd-chmod',
    command: 'chmod',
    category: 'File and Directory Commands',
    syntax: 'chmod <permissions> <file>',
    description: 'Change file access modes and permissions (read, write, execute).',
    reliabilityTip: 'Avoid blanket 777 permissions. Follow the principle of least privilege (+x or 755 for executables).',
    isBeginner: true,
    orderIndex: 35
  },
  {
    id: 'cmd-chown',
    command: 'chown',
    category: 'File and Directory Commands',
    syntax: 'chown <user>:<group> <file>',
    description: 'Change file and directory ownership and group assignments.',
    reliabilityTip: 'Ensure service daemons only own the specific directories they require for operation.',
    isBeginner: true,
    orderIndex: 36
  },
  {
    id: 'cmd-ifconfig',
    command: 'ifconfig',
    category: 'Networking Commands',
    syntax: 'ifconfig [interface]',
    description: 'Display and configure network interface parameters and IP addresses.',
    reliabilityTip: 'Inspect inet address and MTU to troubleshoot network packet loss.',
    isBeginner: true,
    orderIndex: 37
  },
  {
    id: 'cmd-traceroute',
    command: 'traceroute',
    category: 'Networking Commands',
    syntax: 'traceroute <host>',
    description: 'Trace the network hops and latency taken by packets to reach a host.',
    reliabilityTip: 'Look for asterisks (*) indicating firewall drops or unresponsive intermediate routers.',
    isBeginner: true,
    orderIndex: 38
  },
  {
    id: 'cmd-wget',
    command: 'wget',
    category: 'File Transfer and Synchronization Commands',
    syntax: 'wget [options] <url>',
    description: 'Download files directly and non-interactively from web endpoints.',
    reliabilityTip: 'Use "-c" to resume broken downloads over unstable long-distance satellite links.',
    isBeginner: true,
    orderIndex: 39
  },
  {
    id: 'cmd-ufw',
    command: 'ufw',
    category: 'Networking Commands',
    syntax: 'ufw [enable|allow|status]',
    description: 'Uncomplicated Firewall interface to manage host packet filtering.',
    reliabilityTip: 'Always allow your SSH port before enabling ufw ("ufw allow 22") to avoid locking yourself out!',
    isBeginner: true,
    orderIndex: 40
  },
  {
    id: 'cmd-iptables',
    command: 'iptables',
    category: 'Networking Commands',
    syntax: 'iptables -L [-v] [-n]',
    description: 'Configure and inspect low-level IPv4 packet filtering and NAT table rules.',
    reliabilityTip: 'Save rules with iptables-save so firewall policies persist across system reboots.',
    isBeginner: true,
    orderIndex: 41
  },
  {
    id: 'cmd-apt',
    command: 'apt',
    category: 'Shell Utilities and Shortcuts Commands',
    syntax: 'apt update && apt install <package>',
    description: 'Advanced package tool to install, update, and remove Debian/Ubuntu software.',
    reliabilityTip: 'Always run "apt update" before "apt install" to synchronize package index caches.',
    isBeginner: true,
    orderIndex: 42
  },
  {
    id: 'cmd-sudo',
    command: 'sudo',
    category: 'User and Permission Management Commands',
    syntax: 'sudo <command>',
    description: 'Execute commands with superuser root privileges and safety controls.',
    reliabilityTip: 'The Cyber Crew Motto: Root permissions ready to go, three, two, one... SUDO!',
    isBeginner: true,
    orderIndex: 43
  },
  {
    id: 'cmd-cal',
    command: 'cal',
    category: 'Shell Utilities and Shortcuts Commands',
    syntax: 'cal [-3] [-y]',
    description: 'Display an interactive visual calendar directly on the terminal screen.',
    reliabilityTip: 'Handy for coordinating maintenance windows and scheduled cron job schedules.',
    isBeginner: true,
    orderIndex: 44
  },
  {
    id: 'cmd-alias',
    command: 'alias',
    category: 'Shell Utilities and Shortcuts Commands',
    syntax: 'alias <name>=\'<command>\'',
    description: 'Create memorable custom shortcuts and aliases for complex commands.',
    reliabilityTip: 'Define permanent shortcuts in ~/.bashrc so they are available in every shell session.',
    isBeginner: true,
    orderIndex: 45
  },
  {
    id: 'cmd-dd',
    command: 'dd',
    category: 'Shell Utilities and Shortcuts Commands',
    syntax: 'dd if=<src> of=<dest> bs=4M status=progress',
    description: 'Convert and copy low-level raw blocks between files and physical drives.',
    reliabilityTip: 'Handle with extreme care: verify "of=" target path carefully to prevent disk overwrites.',
    isBeginner: true,
    orderIndex: 46
  },
  {
    id: 'cmd-whereis',
    command: 'whereis',
    category: 'Shell Utilities and Shortcuts Commands',
    syntax: 'whereis <command>',
    description: 'Locate binary executable, source code, and manual page locations.',
    reliabilityTip: 'Useful to verify which version of a utility is resolved in standard search paths.',
    isBeginner: true,
    orderIndex: 47
  },
  {
    id: 'cmd-whatis',
    command: 'whatis',
    category: 'Shell Utilities and Shortcuts Commands',
    syntax: 'whatis <command>',
    description: 'Display a concise one-line description from the command manual database.',
    reliabilityTip: 'Fast way to remind yourself of an obscure command\'s core purpose.',
    isBeginner: true,
    orderIndex: 48
  },
  {
    id: 'cmd-top',
    command: 'top',
    category: 'Process and System Monitoring Commands',
    syntax: 'top',
    description: 'Dynamic real-time viewer for active tasks, CPU load, and RAM usage.',
    reliabilityTip: 'Press "P" to sort by CPU usage or "M" to sort by memory consumption.',
    isBeginner: true,
    orderIndex: 49
  },
  {
    id: 'cmd-passwd',
    command: 'passwd',
    category: 'User and Permission Management Commands',
    syntax: 'passwd [username]',
    description: 'Update and set account authentication passwords securely in Linux.',
    reliabilityTip: 'Enforce strong passphrase lengths and entropy to prevent unauthorized terminal access.',
    isBeginner: true,
    orderIndex: 50
  },

  // --- Advanced & Specialized Commands (Commands 51 - 81) ---
  {
    id: 'cmd-du',
    command: 'du',
    category: 'File and Directory Commands',
    syntax: 'du -sh <directory>',
    description: 'Estimate directory and file space consumption recursively.',
    reliabilityTip: 'Use "du -sh *" to quickly locate disk hogs eating storage space.',
    isBeginner: false,
    orderIndex: 51
  },
  {
    id: 'cmd-rmdir',
    command: 'rmdir',
    category: 'File and Directory Commands',
    syntax: 'rmdir <empty_directory>',
    description: 'Remove empty directories safely without risking file deletion.',
    reliabilityTip: 'Fails automatically if directory contains files, preventing accidental data loss.',
    isBeginner: false,
    orderIndex: 52
  },
  {
    id: 'cmd-nano',
    command: 'nano',
    category: 'File and Directory Commands',
    syntax: 'nano <file>',
    description: 'Friendly, accessible command-line text editor with on-screen shortcuts.',
    reliabilityTip: 'Ctrl + O writes changes out to disk, and Ctrl + X exits cleanly.',
    isBeginner: false,
    orderIndex: 53
  },
  {
    id: 'cmd-vim',
    command: 'vim',
    category: 'File and Directory Commands',
    syntax: 'vim <file>',
    description: 'Powerful, modal screen terminal editor with vim keybindings.',
    reliabilityTip: 'Press "i" to enter insert mode, Escape to return to normal mode, and ":wq" to save and quit.',
    isBeginner: false,
    orderIndex: 54
  },
  {
    id: 'cmd-find',
    command: 'find',
    category: 'File and Directory Commands',
    syntax: 'find <path> -name "<pattern>"',
    description: 'Search for files in a directory hierarchy based on names, sizes, or dates.',
    reliabilityTip: 'Use "-type f" to limit results to regular files and avoid folder matches.',
    isBeginner: false,
    orderIndex: 55
  },
  {
    id: 'cmd-umount',
    command: 'umount',
    category: 'File and Directory Commands',
    syntax: 'umount <mountpoint>',
    description: 'Safely detach a mounted filesystem or storage partition.',
    reliabilityTip: 'Ensure no terminals or processes are inside the mount directory before unmounting.',
    isBeginner: false,
    orderIndex: 56
  },
  {
    id: 'cmd-ping',
    command: 'ping',
    category: 'Networking Commands',
    syntax: 'ping [-c <count>] <host>',
    description: 'Send ICMP ECHO_REQUEST packets to network nodes to test connectivity.',
    reliabilityTip: 'Always specify "-c 4" on Linux to prevent ping from running indefinitely.',
    isBeginner: false,
    orderIndex: 57
  },
  {
    id: 'cmd-netstat',
    command: 'netstat',
    category: 'Networking Commands',
    syntax: 'netstat -tuln',
    description: 'Print network connections, routing tables, and interface statistics.',
    reliabilityTip: 'Use "-tuln" to inspect all listening TCP and UDP ports without slow DNS lookups.',
    isBeginner: false,
    orderIndex: 58
  },
  {
    id: 'cmd-ss',
    command: 'ss',
    category: 'Networking Commands',
    syntax: 'ss -tulpn',
    description: 'Modern, high-performance socket statistics tool replacing netstat.',
    reliabilityTip: 'Faster and more informative than netstat when analyzing thousands of open sockets.',
    isBeginner: false,
    orderIndex: 59
  },
  {
    id: 'cmd-nc',
    command: 'nc',
    category: 'Networking Commands',
    syntax: 'nc -zv <host> <port>',
    description: 'Netcat utility for arbitrary TCP/UDP connections, listening, and port scanning.',
    reliabilityTip: 'The "Swiss army knife" of networking: test port availability in seconds with -zv.',
    isBeginner: false,
    orderIndex: 60
  },
  {
    id: 'cmd-tcpdump',
    command: 'tcpdump',
    category: 'Networking Commands',
    syntax: 'tcpdump -i <interface> -nn',
    description: 'Command-line packet analyzer and network sniffer.',
    reliabilityTip: 'Use filters like "port 80" or "icmp" to avoid flooding your terminal buffer.',
    isBeginner: false,
    orderIndex: 61
  },
  {
    id: 'cmd-nslookup',
    command: 'nslookup',
    category: 'Networking Commands',
    syntax: 'nslookup <domain> [dns_server]',
    description: 'Query DNS domain name servers to obtain hostname-to-IP resolution.',
    reliabilityTip: 'Specify a custom DNS server (e.g. 8.8.8.8) to troubleshoot DNS propagation delays.',
    isBeginner: false,
    orderIndex: 62
  },
  {
    id: 'cmd-htop',
    command: 'htop',
    category: 'Process and System Monitoring Commands',
    syntax: 'htop',
    description: 'Enhanced interactive process viewer with color-coded CPU and memory bars.',
    reliabilityTip: 'Use arrow keys and F9 to send signals directly to rogue processes with ease.',
    isBeginner: false,
    orderIndex: 63
  },
  {
    id: 'cmd-uptime',
    command: 'uptime',
    category: 'Process and System Monitoring Commands',
    syntax: 'uptime',
    description: 'Display how long the system has been active, user count, and load averages.',
    reliabilityTip: 'Check the 1, 5, and 15-minute load averages to evaluate system stress trends.',
    isBeginner: false,
    orderIndex: 64
  },
  {
    id: 'cmd-env',
    command: 'env',
    category: 'Process and System Monitoring Commands',
    syntax: 'env',
    description: 'Display active environment variables or run programs in modified scopes.',
    reliabilityTip: 'Check PATH and system environment settings when troubleshooting missing binaries.',
    isBeginner: false,
    orderIndex: 65
  },
  {
    id: 'cmd-strace',
    command: 'strace',
    category: 'Process and System Monitoring Commands',
    syntax: 'strace -e open <command>',
    description: 'Trace system calls and signals executed by an active process.',
    reliabilityTip: 'Invaluable for debugging: shows the exact file paths a program tries and fails to access.',
    isBeginner: false,
    orderIndex: 66
  },
  {
    id: 'cmd-systemctl',
    command: 'systemctl',
    category: 'Process and System Monitoring Commands',
    syntax: 'systemctl [status|start|restart] <service>',
    description: 'Control systemd system and service manager on modern Linux distributions.',
    reliabilityTip: 'Run "systemctl status <service>" to view recent log lines and process state together.',
    isBeginner: false,
    orderIndex: 67
  },
  {
    id: 'cmd-journalctl',
    command: 'journalctl',
    category: 'Process and System Monitoring Commands',
    syntax: 'journalctl -u <service> -e',
    description: 'Query and view logs generated by systemd-journald.',
    reliabilityTip: 'Use "-u <service> -f" to tail logs for a specific service in real-time.',
    isBeginner: false,
    orderIndex: 68
  },
  {
    id: 'cmd-free',
    command: 'free',
    category: 'Process and System Monitoring Commands',
    syntax: 'free -h',
    description: 'Display total amount of free and used physical memory and swap partition.',
    reliabilityTip: 'Look at the "available" column rather than "free" for the true available RAM.',
    isBeginner: false,
    orderIndex: 69
  },
  {
    id: 'cmd-vmstat',
    command: 'vmstat',
    category: 'Process and System Monitoring Commands',
    syntax: 'vmstat 1 5',
    description: 'Report virtual memory, process scheduling, swap, I/O, and CPU statistics.',
    reliabilityTip: 'High values in "si" and "so" indicate excessive disk swap thrashing.',
    isBeginner: false,
    orderIndex: 70
  },
  {
    id: 'cmd-iostat',
    command: 'iostat',
    category: 'Process and System Monitoring Commands',
    syntax: 'iostat -xz 1',
    description: 'Report CPU statistics and device input/output rates for storage drives.',
    reliabilityTip: 'A high %util indicates a storage drive saturated with read/write requests.',
    isBeginner: false,
    orderIndex: 71
  },
  {
    id: 'cmd-lsof',
    command: 'lsof',
    category: 'Process and System Monitoring Commands',
    syntax: 'lsof -i :<port>',
    description: 'List open files and network descriptors currently opened by active processes.',
    reliabilityTip: 'Use "lsof -i :80" to immediately identify which process is occupying port 80.',
    isBeginner: false,
    orderIndex: 72
  },
  {
    id: 'cmd-dmesg',
    command: 'dmesg',
    category: 'Process and System Monitoring Commands',
    syntax: 'dmesg -T',
    description: 'Print and control the kernel ring buffer diagnostic messages.',
    reliabilityTip: 'Run "dmesg -T | grep -i error" to detect hardware controller errors or OOM kills.',
    isBeginner: false,
    orderIndex: 73
  },
  {
    id: 'cmd-useradd',
    command: 'useradd',
    category: 'User and Permission Management Commands',
    syntax: 'useradd -m -s /bin/bash <username>',
    description: 'Create a new user account with home directory creation and default shell.',
    reliabilityTip: 'Always pass "-m" to guarantee creation of the user\'s home directory.',
    isBeginner: false,
    orderIndex: 74
  },
  {
    id: 'cmd-userdel',
    command: 'userdel',
    category: 'User and Permission Management Commands',
    syntax: 'userdel [-r] <username>',
    description: 'Delete a user account and remove credentials from the system.',
    reliabilityTip: 'Use "-r" only if you want to recursively wipe their home directory and mail spool.',
    isBeginner: false,
    orderIndex: 75
  },
  {
    id: 'cmd-usermod',
    command: 'usermod',
    category: 'User and Permission Management Commands',
    syntax: 'usermod -aG <group> <user>',
    description: 'Modify user account parameters, secondary groups, and shell configurations.',
    reliabilityTip: 'ALWAYS include the "-a" append flag with "-G" so you do not accidentally remove user from other groups!',
    isBeginner: false,
    orderIndex: 76
  },
  {
    id: 'cmd-groups',
    command: 'groups',
    category: 'User and Permission Management Commands',
    syntax: 'groups [username]',
    description: 'Show all security and privilege group memberships for an account.',
    reliabilityTip: 'Verify group membership before attempting privileged actions or hardware access.',
    isBeginner: false,
    orderIndex: 77
  },
  {
    id: 'cmd-chage',
    command: 'chage',
    category: 'User and Permission Management Commands',
    syntax: 'chage -l <username>',
    description: 'Change and inspect user account password expiration information.',
    reliabilityTip: 'Use "chage -l" to review account lockouts and password age policies.',
    isBeginner: false,
    orderIndex: 78
  },
  {
    id: 'cmd-id',
    command: 'id',
    category: 'User and Permission Management Commands',
    syntax: 'id [username]',
    description: 'Display real and effective user identity (UID) and group IDs (GID).',
    reliabilityTip: 'Fastest way to confirm if your shell has active sudo or wheel privileges.',
    isBeginner: false,
    orderIndex: 79
  },
  {
    id: 'cmd-newgrp',
    command: 'newgrp',
    category: 'User and Permission Management Commands',
    syntax: 'newgrp <group>',
    description: 'Log in to a new group during an active shell session without logging out.',
    reliabilityTip: 'Applies newly granted group permissions immediately in current subshell.',
    isBeginner: false,
    orderIndex: 80
  },
  {
    id: 'cmd-scp',
    command: 'scp',
    category: 'File Transfer and Synchronization Commands',
    syntax: 'scp <src> <user@host>:<dest>',
    description: 'Securely copy files between remote hosts using SSH encryption.',
    reliabilityTip: 'Ensure remote path ends with "/" when copying into directories to preserve filenames.',
    isBeginner: false,
    orderIndex: 81
  }
];
