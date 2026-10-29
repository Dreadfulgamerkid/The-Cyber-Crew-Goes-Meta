import { VFSNode, FileItem } from '../types';

export class VirtualFileSystem {
  private root: VFSNode;
  private cwd: string[]; // e.g. ['home', 'kali']
  private history: string[] = [];

  constructor(initialTree?: VFSNode | Record<string, any>, initialCwd: string = '/home/kali') {
    if (initialTree) {
      if (initialTree.type === 'dir' && initialTree.children) {
        this.root = initialTree as VFSNode;
      } else {
        this.root = {
          type: 'dir',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          children: (initialTree.children ? initialTree.children : initialTree) as Record<string, VFSNode>
        };
      }
    } else {
      this.root = this.getDefaultTree();
    }

    if (!this.root.type) this.root.type = 'dir';
    if (!this.root.children) this.root.children = {};
    if (!this.root.permissions) this.root.permissions = 'drwxr-xr-x';
    if (!this.root.owner) this.root.owner = 'root';

    this.cwd = this.parsePath(initialCwd);
  }

  public getCwd(): string {
    if (this.cwd.length === 0) return '/';
    return '/' + this.cwd.join('/');
  }

  public getCwdDisplay(): string {
    const p = this.getCwd();
    if (p === '/home/kali') return '~';
    if (p.startsWith('/home/kali/')) return '~/' + p.slice('/home/kali/'.length);
    return p;
  }

  public getHistory(): string[] {
    return this.history;
  }

  public addHistory(cmd: string) {
    if (cmd.trim()) {
      this.history.push(cmd);
    }
  }

  private parsePath(pathStr: string): string[] {
    if (!pathStr || pathStr === '/') return [];
    let p = pathStr.trim();
    if (p.startsWith('~/')) {
      p = '/home/kali/' + p.slice(2);
    } else if (p === '~') {
      p = '/home/kali';
    }

    let parts: string[];
    if (p.startsWith('/')) {
      parts = p.split('/').filter(Boolean);
    } else {
      parts = [...this.cwd, ...p.split('/').filter(Boolean)];
    }

    const resolved: string[] = [];
    for (const part of parts) {
      if (part === '.' || part === '') continue;
      if (part === '..') {
        resolved.pop();
      } else {
        resolved.push(part);
      }
    }
    return resolved;
  }

  public getNode(pathSegments: string[]): VFSNode | null {
    if (!pathSegments || pathSegments.length === 0) {
      return this.root;
    }
    let current = this.root;
    for (const seg of pathSegments) {
      if (!current || current.type !== 'dir' || !current.children || !current.children[seg]) {
        return null;
      }
      current = current.children[seg];
    }
    return current;
  }

  public getNodeByPath(pathStr: string): VFSNode | null {
    return this.getNode(this.parsePath(pathStr));
  }

  public listFiles(pathStr: string = '.'): FileItem[] | null {
    const targetPath = this.parsePath(pathStr);
    const node = this.getNode(targetPath);
    if (!node || node.type !== 'dir' || !node.children) return null;

    return Object.entries(node.children).map(([name, item]) => ({
      name,
      type: item.type,
      content: item.content,
      exec: item.exec,
      hidden: name.startsWith('.'),
      permissions: item.permissions || (item.type === 'dir' ? 'drwxr-xr-x' : (item.exec ? '-rwxr-xr-x' : '-rw-r--r--')),
      owner: item.owner || 'kali'
    }));
  }

  public executeCommand(rawCommand: string): { output: string; success: boolean; error?: string } {
    const raw = rawCommand.trim();
    if (!raw) return { output: '', success: true };

    this.addHistory(raw);

    // Check for pipes
    if (raw.includes('|')) {
      const parts = raw.split('|').map(s => s.trim());
      let lastOutput = '';
      for (let i = 0; i < parts.length; i++) {
        const seg = parts[i];
        const res = this.executeSingle(seg, lastOutput);
        if (!res.success) return res;
        lastOutput = res.output;
      }
      return { output: lastOutput, success: true };
    }

    return this.executeSingle(raw);
  }

  private executeSingle(raw: string, pipeInput?: string): { output: string; success: boolean; error?: string } {
    let clean = raw.trim();
    let isSudo = false;
    if (clean.startsWith('sudo ')) {
      isSudo = true;
      clean = clean.slice(5).trim();
    }

    // Check for redirection > or >>
    let redirectTarget: string | null = null;
    let append = false;
    const redirMatch = clean.match(/^(.*?)(>{1,2})\s*(\S+)\s*$/);
    if (redirMatch && !clean.startsWith('echo') && redirMatch[1].trim()) {
      clean = redirMatch[1].trim();
      append = redirMatch[2] === '>>';
      redirectTarget = redirMatch[3];
    } else if (clean.startsWith('echo') && clean.includes('>')) {
      const em = clean.match(/^echo\s+(.*?)\s*(>{1,2})\s*(\S+)\s*$/);
      if (em) {
        clean = 'echo ' + em[1];
        append = em[2] === '>>';
        redirectTarget = em[3];
      }
    }

    // Tokenize arguments handling quotes
    const tokens = clean.match(/"[^"]*"|'[^']*'|\S+/g) || [];
    if (tokens.length === 0) return { output: '', success: true };

    const cmd = tokens[0] || '';
    const args = tokens.slice(1).map(a => a.replace(/^["']|["']$/g, ''));

    let result = this.dispatchCommand(cmd, args, isSudo, pipeInput);

    if (redirectTarget) {
      const destPath = this.parsePath(redirectTarget);
      if (destPath.length === 0) {
        return { output: 'bash: /: Is a directory', success: false };
      }
      const parentPath = destPath.slice(0, -1);
      const filename = destPath[destPath.length - 1];
      const parentNode = this.getNode(parentPath);
      if (!parentNode || parentNode.type !== 'dir' || !parentNode.children) {
        return { output: `bash: ${redirectTarget}: No such file or directory`, success: false };
      }

      const existing = parentNode.children[filename];
      const textToWrite = result.output;
      if (existing && existing.type === 'file' && append) {
        existing.content = (existing.content || '') + '\n' + textToWrite;
      } else {
        parentNode.children[filename] = {
          type: 'file',
          content: textToWrite,
          permissions: '-rw-r--r--'
        };
      }
      return { output: '', success: true };
    }

    return result;
  }

  private dispatchCommand(cmd: string, args: string[], isSudo: boolean, pipeInput?: string): { output: string; success: boolean; error?: string } {
    switch (cmd) {
      case 'pwd':
        return { output: this.getCwd(), success: true };

      case 'whoami':
        return { output: isSudo ? 'root' : 'kali', success: true };

      case 'clear':
        return { output: '__CLEAR__', success: true };

      case 'history':
        return { output: this.history.map((h, i) => `  ${i + 1}  ${h}`).join('\n'), success: true };

      case 'date':
        return { output: new Date().toUTCString(), success: true };

      case 'echo':
        return { output: args.join(' '), success: true };

      case 'ls':
        return this.cmdLs(args);

      case 'cd':
        return this.cmdCd(args);

      case 'cp':
        return this.cmdCp(args);

      case 'mv':
        return this.cmdMv(args);

      case 'mkdir':
        return this.cmdMkdir(args);

      case 'rm':
        return this.cmdRm(args);

      case 'cat':
        return this.cmdCat(args, pipeInput);

      case 'grep':
        return this.cmdGrep(args, pipeInput);

      case 'chmod':
        return this.cmdChmod(args);

      case 'touch':
        return this.cmdTouch(args);

      case 'ps':
        return this.cmdPs(args);

      case 'kill':
      case 'killall':
        return this.cmdKill(args, isSudo);

      case 'df':
        return {
          output: `Filesystem     1K-blocks    Used Available Use% Mounted on\n/dev/glacier0    1048576  245760    802816  24% /\ntmpfs             131072    4096    126976   4% /tmp`,
          success: true
        };

      case 'uname':
        return { output: args.includes('-a') ? 'Linux glacier-kernel 6.12.0-cybercrew x86_64 GNU/Linux' : 'Linux', success: true };

      case 'top':
      case 'htop':
        return {
          output: `top - 14:02:11 up 42 days, 3 users, load average: 0.12, 0.08, 0.05\nTasks: 104 total, 1 running, 103 sleeping\n%Cpu(s):  1.2 us,  0.8 sy,  0.0 ni, 98.0 id\nMiB Mem :   8192.0 total,   4120.4 free,   2180.2 used\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n  104 root      20   0  145220  24500  12400 S   0.5   0.3   0:14.22 life_support\n  230 kali      20   0   18420   4200   3100 S   0.0   0.1   0:00.12 bash`,
          success: true
        };

      case 'uptime':
        return { output: ' 14:05:32 up 42 days,  3 users,  load average: 0.10, 0.08, 0.05', success: true };

      case 'free':
        return {
          output: `               total        used        free      shared  buff/cache   available\nMem:         8192000     2180000     4120000       45000     1892000     5967000\nSwap:        2097152           0     2097152`,
          success: true
        };

      case 'ping':
        return { output: `PING ${args[0] || 'localhost'} (127.0.0.1) 56(84) bytes of data.\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms\n64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.038 ms\n--- ${args[0] || 'localhost'} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss`, success: true };

      case 'ifconfig':
        return {
          output: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.42  netmask 255.255.255.0  broadcast 192.168.1.255\n        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>\n        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)\n        RX packets 24102  bytes 18923400 (18.0 MB)\n        TX packets 19401  bytes 12401200 (11.8 MB)\n\nlo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n        inet 127.0.0.1  netmask 255.0.0.0`,
          success: true
        };

      case 'traceroute':
        return {
          output: `traceroute to ${args[0] || 'glacier-hub'} (192.168.1.1), 30 hops max, 60 byte packets\n 1  gateway.local (192.168.1.1)  0.312 ms  0.285 ms  0.244 ms\n 2  glacier-hub.kernel (10.0.0.1)  1.214 ms  1.189 ms  1.140 ms`,
          success: true
        };

      case 'wget':
      case 'curl':
        return { output: `[+] Transferred resource successfully: 100% [===================>] 4.2 MB in 0.4s (10.5 MB/s)`, success: true };

      case 'ufw':
        return { output: `Status: active\nLogging: on (low)\nDefault: deny (incoming), allow (outgoing), disabled (routed)\nTo                         Action      From\n--                         ------      ----\n22/tcp                     ALLOW IN    Anywhere\n80/tcp                     ALLOW IN    Anywhere`, success: true };

      case 'iptables':
        return { output: `Chain INPUT (policy ACCEPT 142 packets, 11400 bytes)\n pkts bytes target     prot opt in     out     source               destination         \n 1200  980K ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0           \nChain FORWARD (policy ACCEPT 0 packets, 0 bytes)\nChain OUTPUT (policy ACCEPT 190 packets, 18200 bytes)`, success: true };

      case 'apt':
      case 'apt-get':
        return { output: `Reading package lists... Done\nBuilding dependency tree... Done\nCalculating upgrade... Done\nAll cyber packages are up to date!`, success: true };

      case 'cal': {
        const d = new Date();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return { output: `    ${monthNames[d.getMonth()]} ${d.getFullYear()}   \nSu Mo Tu We Th Fr Sa\n 1  2  3  4  5  6  7\n 8  9 10 11 12 13 14\n15 16 17 18 19 20 21\n22 23 24 25 26 27 28\n29 30 31`, success: true };
      }

      case 'alias':
        return { output: `alias ll='ls -alF'\nalias la='ls -A'\nalias l='ls -CF'`, success: true };

      case 'dd':
        return { output: `1024+0 records in\n1024+0 records out\n4194304 bytes (4.2 MB, 4.0 MiB) copied, 0.0214 s, 196 MB/s`, success: true };

      case 'whereis':
      case 'which':
        return { output: `${args[0] || 'bash'}: /bin/${args[0] || 'bash'} /usr/share/man/man1/${args[0] || 'bash'}.1.gz`, success: true };

      case 'whatis':
        return { output: `${args[0] || 'ls'} (1) - list directory contents`, success: true };

      case 'passwd':
        return { output: `passwd: password updated successfully for user kali`, success: true };

      case 'du':
        return { output: `4.0K    ./heater_core.cad\n12K     ./frost_vault\n24K     .`, success: true };

      case 'rmdir': {
        const target = args[0];
        if (!target) return { output: 'rmdir: missing operand', success: false };
        const p = this.parsePath(target);
        const node = this.getNode(p);
        if (!node) return { output: `rmdir: failed to remove '${target}': No such file or directory`, success: false };
        if (node.type !== 'dir') return { output: `rmdir: failed to remove '${target}': Not a directory`, success: false };
        if (node.children && Object.keys(node.children).length > 0) {
          return { output: `rmdir: failed to remove '${target}': Directory not empty`, success: false };
        }
        const parent = this.getNode(p.slice(0, -1));
        if (parent && parent.children) {
          delete parent.children[p[p.length - 1]];
        }
        return { output: '', success: true };
      }

      case 'find':
        return { output: `./heater_core.cad\n./heater_core_backup.cad\n./frost_vault`, success: true };

      case 'netstat':
      case 'ss':
        return { output: `State      Recv-Q Send-Q Local Address:Port               Peer Address:Port\nLISTEN     0      128    0.0.0.0:22                      0.0.0.0:*\nLISTEN     0      511    0.0.0.0:80                      0.0.0.0:*`, success: true };

      case 'nc':
        return { output: `Connection to ${args[0] || '127.0.0.1'} 22 port [tcp/ssh] succeeded!`, success: true };

      case 'tcpdump':
        return { output: `14:10:02.124010 IP 192.168.1.42.54210 > 192.168.1.1.53: 4120+ A? glacier.kernel. (32)\n14:10:02.126402 IP 192.168.1.1.53 > 192.168.1.42.54210: 4120 1/0/0 A 10.0.0.1 (48)\n2 packets captured`, success: true };

      case 'nslookup':
        return { output: `Server:         192.168.1.1\nAddress:        192.168.1.1#53\n\nName:   ${args[0] || 'glacier.kernel'}\nAddress: 10.0.0.1`, success: true };

      case 'env':
        return { output: `USER=kali\nHOME=/home/kali\nSHELL=/bin/bash\nTERM=xterm-256color\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin`, success: true };

      case 'systemctl':
      case 'service':
        return { output: `● ${args[1] || args[0] || 'service'}.service - Cyber Operations Daemon\n     Loaded: loaded (/lib/systemd/system/${args[1] || args[0] || 'service'}.service; enabled)\n     Active: active (running) since Wed 2026-10-28 12:00:00 UTC`, success: true };

      case 'journalctl':
      case 'dmesg':
        return { output: `[    0.000000] Linux version 6.12.0-cybercrew (glacier-kernel)\n[    0.412014] ACPI: Core subsystems initialized\n[    1.204510] Cyber thermal sensors: ONLINE`, success: true };

      case 'ssh':
        return { output: `The authenticity of host '${args[0] || 'remote'}' can't be established.\nECDSA key fingerprint is SHA256:4aB9Z... Connected to ${args[0] || 'remote'}.`, success: true };

      case 'tar':
        return { output: `[+] Archive package generated successfully.`, success: true };

      case 'head':
      case 'tail': {
        const target = args.find(a => !a.startsWith('-')) || 'heater_core.cad';
        const node = this.getNode(this.parsePath(target));
        if (node && node.content) {
          const lines = node.content.split('\n');
          const subset = cmd === 'head' ? lines.slice(0, 10) : lines.slice(-10);
          return { output: subset.join('\n'), success: true };
        }
        return { output: `[TELEMETRY STREAM: ${target}]\nSTATUS: NOMINAL & OPERATIONAL`, success: true };
      }

      case 'diff':
      case 'cmp':
        return { output: `Files ${args[0] || 'file1'} and ${args[1] || 'file2'} verified. Differential checksum: MATCH [0 drift].`, success: true };

      case 'comm':
      case 'sort':
        return { output: `alpha_sensor.cad\nbeta_mesh.cad\nheater_core.cad\nzeta_relay.cad`, success: true };

      case 'export':
        return { output: ``, success: true };

      case 'zip':
      case 'unzip':
        return { output: `  inflating: heater_core.cad\n  inflating: telemetry_log.txt\nArchive successfully extracted!`, success: true };

      case 'mount':
        return { output: `/dev/sda1 on / type ext4 (rw,relatime)\n/dev/sdb1 on /frost_vault type ext4 (rw,relatime)`, success: true };

      case 'umount':
        return { output: `[+] Unmounted volume successfully.`, success: true };

      case 'chown':
        return { output: ``, success: true };

      case 'ln':
        return { output: ``, success: true };

      case 'nano':
      case 'vim':
        return { output: `[Editor simulated: file edited and saved cleanly with 0 syntax errors.]`, success: true };

      case 'useradd':
      case 'usermod':
      case 'userdel':
      case 'groups':
      case 'chage':
      case 'id':
      case 'newgrp':
        return { output: `uid=1000(kali) gid=1000(kali) groups=1000(kali),27(sudo),100(users)`, success: true };

      case 'scp':
      case 'rsync':
        return { output: `sending incremental file list\nheater_core.cad\n\nsent 4,210 bytes  received 35 bytes  8,490.00 bytes/sec\ntotal size is 4,120  speedup is 0.97`, success: true };

      case 'help':
        return {
          output: `Cyber Crew Linux Shell — available commands:
  cp <src> <dest>     Make an exact replica of a file
  ls [-a] [-l]        List files and folders in directory
  mkdir [-p] <dir>    Create a new directory
  mv <src> <dest>     Move or rename a file or directory
  cd <dir>            Change current working directory
  pwd                 Print current working directory
  cat <file>          Print contents of a file
  grep <pattern> <f>  Search for patterns in files
  chmod <mode> <file> Change file access permissions (e.g. +x)
  ps [aux]            List active processes
  kill <pid>          Terminate a process
  touch <file>        Create an empty file
  rm [-r] <file>      Remove files or directories
  whoami              Print current user name
  clear               Wipe terminal screen`,
          success: true
        };

      case 'man': {
        const target = args[0];
        if (!target) return { output: 'What manual page do you want? Try: man cp', success: false };
        const manuals: Record<string, string> = {
          cp: 'CP(1) - Copy files and directories.\nUsage: cp SOURCE DEST\nCopy SOURCE to DEST, creating a duplicate file while preserving the original.',
          mv: 'MV(1) - Move (rename) files.\nUsage: mv SOURCE DEST\nRename SOURCE to DEST, or move SOURCE(s) into DIRECTORY.',
          ls: 'LS(1) - List directory contents.\nUsage: ls [OPTION]... [FILE]...\nList information about the FILEs (the current directory by default). Options: -a (all), -l (long format).',
          mkdir: 'MKDIR(1) - Make directories.\nUsage: mkdir [OPTION]... DIRECTORY...\nCreate the DIRECTORY(ies), if they do not already exist.',
          chmod: 'CHMOD(1) - Change file mode bits.\nUsage: chmod [OPTION]... MODE[,MODE]... FILE...\nChange the mode of each FILE to MODE. Example: chmod +x script.sh makes it executable.',
          grep: 'GREP(1) - Print lines matching a pattern.\nUsage: grep [OPTION]... PATTERNS [FILE]...\nSearch for PATTERNS in each FILE. Option -i ignores case sensitivity.',
          ps: 'PS(1) - Report a snapshot of the current processes.\nUsage: ps [aux]\nShows process ID (PID), command name, and resource usage.',
          kill: 'KILL(1) - Send a signal to a process.\nUsage: kill [-s SIGNAL | -SIGNAL] PID...\nTerminate or signal the specified process ID.'
        };
        return { output: manuals[target] || `No manual entry for ${target}. Type 'help' for available commands.`, success: true };
      }

      default:
        // Check if executable file like ./emergency_drain.sh
        if (cmd.startsWith('./') || cmd.endsWith('.sh')) {
          return this.cmdExecuteScript(cmd, args, isSudo);
        }
        return { output: `bash: ${cmd}: command executed successfully with status 0.`, success: true };
    }
  }

  private cmdLs(args: string[]): { output: string; success: boolean } {
    let showAll = false;
    let longFormat = false;
    let targetPath: string = '.';

    for (const a of args) {
      if (a.startsWith('-')) {
        if (a.includes('a')) showAll = true;
        if (a.includes('l')) longFormat = true;
      } else {
        targetPath = a;
      }
    }

    const items = this.listFiles(targetPath);
    if (!items) {
      return { output: `ls: cannot access '${targetPath}': No such file or directory`, success: false };
    }

    const filtered = showAll ? items : items.filter(i => !i.hidden);

    if (filtered.length === 0) {
      return { output: '', success: true };
    }

    if (longFormat) {
      const lines = filtered.map(item => {
        const perm = item.permissions || (item.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--');
        const size = item.type === 'dir' ? 4096 : (item.content ? item.content.length : 1024);
        const owner = item.owner || 'kali';
        const nameDisplay = item.type === 'dir' ? `${item.name}/` : item.name;
        return `${perm} 1 ${owner} crew ${size.toString().padStart(6, ' ')} Oct 28 09:00 ${nameDisplay}`;
      });
      return { output: lines.join('\n'), success: true };
    }

    // Standard columns
    const names = filtered.map(i => i.type === 'dir' ? `${i.name}/` : i.name);
    return { output: names.join('  '), success: true };
  }

  private cmdCd(args: string[]): { output: string; success: boolean } {
    const dest = args[0] || '~';
    const targetPath = this.parsePath(dest);
    const node = this.getNode(targetPath);

    if (!node) {
      return { output: `bash: cd: ${dest}: No such file or directory`, success: false };
    }
    if (node.type !== 'dir') {
      return { output: `bash: cd: ${dest}: Not a directory`, success: false };
    }

    this.cwd = targetPath;
    return { output: '', success: true };
  }

  private ensureDirectories(pathSegments: string[]): void {
    let current = this.root;
    for (const seg of pathSegments) {
      if (!current.children) current.children = {};
      if (!current.children[seg] || current.children[seg].type !== 'dir') {
        current.children[seg] = {
          type: 'dir',
          permissions: 'drwxr-xr-x',
          owner: 'kali',
          children: {}
        };
      }
      current = current.children[seg];
    }
  }

  private cmdMkdir(args: string[]): { output: string; success: boolean } {
    const isP = args.some(a => a === '-p' || a === '-pv');
    const target = args.find(a => !a.startsWith('-'));
    if (!target) {
      return { output: 'mkdir: missing operand\nTry \'mkdir --help\' for more information.', success: false };
    }

    const targetPath = this.parsePath(target);
    if (targetPath.length === 0) {
      return { output: 'mkdir: cannot create directory \'/\': File exists', success: false };
    }

    const parentPath = targetPath.slice(0, -1);
    const dirName = targetPath[targetPath.length - 1];

    let parentNode = this.getNode(parentPath);
    if (parentPath.length === 0) {
      parentNode = this.root;
      if (!parentNode.children) parentNode.children = {};
    } else if (!parentNode || parentNode.type !== 'dir' || !parentNode.children) {
      this.ensureDirectories(parentPath);
      parentNode = this.getNode(parentPath);
      if (!parentNode || parentNode.type !== 'dir' || !parentNode.children) {
        return { output: `mkdir: cannot create directory '${target}': No such file or directory`, success: false };
      }
    }

    if (parentNode.children[dirName]) {
      if (isP) return { output: '', success: true };
      return { output: `mkdir: cannot create directory '${target}': File exists`, success: false };
    }

    parentNode.children[dirName] = {
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'kali',
      children: {}
    };

    return { output: '', success: true };
  }

  private cmdCp(args: string[]): { output: string; success: boolean } {
    const cleanArgs = args.filter(a => !a.startsWith('-'));
    if (cleanArgs.length < 2) {
      return { output: 'cp: missing destination file operand after \'' + (cleanArgs[0] || '') + '\'', success: false };
    }

    const srcPath = this.parsePath(cleanArgs[0]);
    const srcNode = this.getNode(srcPath);
    if (!srcNode) {
      return { output: `cp: cannot stat '${cleanArgs[0]}': No such file or directory`, success: false };
    }

    const destPath = this.parsePath(cleanArgs[1]);
    const destNode = this.getNode(destPath);

    // If destination is an existing directory
    if (destNode && destNode.type === 'dir' && destNode.children) {
      const srcFilename = srcPath[srcPath.length - 1];
      destNode.children[srcFilename] = JSON.parse(JSON.stringify(srcNode));
      return { output: '', success: true };
    }

    // Destination is a file path
    const destParentPath = destPath.slice(0, -1);
    const destFilename = destPath[destPath.length - 1];
    const destParentNode = this.getNode(destParentPath);

    if (!destParentNode || destParentNode.type !== 'dir' || !destParentNode.children) {
      return { output: `cp: cannot create regular file '${cleanArgs[1]}': No such file or directory`, success: false };
    }

    destParentNode.children[destFilename] = JSON.parse(JSON.stringify(srcNode));
    return { output: '', success: true };
  }

  private cmdMv(args: string[]): { output: string; success: boolean } {
    const cleanArgs = args.filter(a => !a.startsWith('-'));
    if (cleanArgs.length < 2) {
      return { output: 'mv: missing destination file operand', success: false };
    }

    const srcPath = this.parsePath(cleanArgs[0]);
    const srcNode = this.getNode(srcPath);
    if (!srcNode) {
      return { output: `mv: cannot stat '${cleanArgs[0]}': No such file or directory`, success: false };
    }

    const srcParentPath = srcPath.slice(0, -1);
    const srcFilename = srcPath[srcPath.length - 1];
    const srcParentNode = this.getNode(srcParentPath);

    const destPath = this.parsePath(cleanArgs[1]);
    const destNode = this.getNode(destPath);

    // If destination is a directory
    if (destNode && destNode.type === 'dir' && destNode.children) {
      destNode.children[srcFilename] = JSON.parse(JSON.stringify(srcNode));
      if (srcParentNode && srcParentNode.children) {
        delete srcParentNode.children[srcFilename];
      }
      return { output: '', success: true };
    }

    // Destination is a new file or directory name
    const destParentPath = destPath.slice(0, -1);
    const destFilename = destPath[destPath.length - 1];
    const destParentNode = this.getNode(destParentPath);

    if (!destParentNode || destParentNode.type !== 'dir' || !destParentNode.children) {
      return { output: `mv: cannot move to '${cleanArgs[1]}': No such file or directory`, success: false };
    }

    destParentNode.children[destFilename] = JSON.parse(JSON.stringify(srcNode));
    if (srcParentNode && srcParentNode.children) {
      delete srcParentNode.children[srcFilename];
    }

    return { output: '', success: true };
  }

  private cmdRm(args: string[]): { output: string; success: boolean } {
    const isRecursive = args.some(a => a.includes('r') || a.includes('R'));
    const targets = args.filter(a => !a.startsWith('-'));
    if (targets.length === 0) {
      return { output: 'rm: missing operand', success: false };
    }

    for (const t of targets) {
      const targetPath = this.parsePath(t);
      const node = this.getNode(targetPath);
      if (!node) {
        return { output: `rm: cannot remove '${t}': No such file or directory`, success: false };
      }
      if (node.type === 'dir' && !isRecursive) {
        return { output: `rm: cannot remove '${t}': Is a directory (try rm -r)`, success: false };
      }
      const parentPath = targetPath.slice(0, -1);
      const filename = targetPath[targetPath.length - 1];
      const parentNode = this.getNode(parentPath);
      if (parentNode && parentNode.children) {
        delete parentNode.children[filename];
      }
    }
    return { output: '', success: true };
  }

  private cmdCat(args: string[], pipeInput?: string): { output: string; success: boolean } {
    if (args.length === 0 && pipeInput !== undefined) {
      return { output: pipeInput, success: true };
    }
    if (args.length === 0) {
      return { output: 'cat: missing file operand', success: false };
    }

    const outputs: string[] = [];
    for (const arg of args) {
      const path = this.parsePath(arg);
      const node = this.getNode(path);
      if (!node) {
        return { output: `cat: ${arg}: No such file or directory`, success: false };
      }
      if (node.type === 'dir') {
        return { output: `cat: ${arg}: Is a directory`, success: false };
      }
      outputs.push(node.content || '');
    }

    return { output: outputs.join('\n'), success: true };
  }

  private cmdGrep(args: string[], pipeInput?: string): { output: string; success: boolean } {
    let ignoreCase = false;
    let pattern: string | null = null;
    let targetFile: string | null = null;

    for (const a of args) {
      if (a.startsWith('-')) {
        if (a.includes('i')) ignoreCase = true;
      } else if (!pattern) {
        pattern = a;
      } else if (!targetFile) {
        targetFile = a;
      }
    }

    if (!pattern) {
      return { output: 'grep: missing search pattern', success: false };
    }

    let sourceText = '';
    if (targetFile) {
      const path = this.parsePath(targetFile);
      const node = this.getNode(path);
      if (!node) return { output: `grep: ${targetFile}: No such file or directory`, success: false };
      if (node.type === 'dir') return { output: `grep: ${targetFile}: Is a directory`, success: false };
      sourceText = node.content || '';
    } else if (pipeInput !== undefined) {
      sourceText = pipeInput;
    } else {
      return { output: 'grep: missing target file or piped input', success: false };
    }

    const lines = sourceText.split('\n');
    const matched = lines.filter(line => {
      if (ignoreCase) {
        return line.toLowerCase().includes(pattern!.toLowerCase());
      }
      return line.includes(pattern!);
    });

    return { output: matched.join('\n'), success: true };
  }

  private cmdChmod(args: string[]): { output: string; success: boolean } {
    const cleanArgs = args.filter(a => !a.startsWith('-') || a.includes('+') || a.includes('-'));
    if (cleanArgs.length < 2) {
      return { output: 'chmod: missing operand after \'' + (cleanArgs[0] || '') + '\'', success: false };
    }

    const mode = cleanArgs[0];
    const target = cleanArgs[1];
    const path = this.parsePath(target);
    const node = this.getNode(path);

    if (!node) {
      return { output: `chmod: cannot access '${target}': No such file or directory`, success: false };
    }

    if (mode.includes('+x') || mode === '755' || mode === '777') {
      node.exec = true;
      node.permissions = '-rwxr-xr-x';
    } else if (mode.includes('-x')) {
      node.exec = false;
      node.permissions = '-rw-r--r--';
    }

    return { output: '', success: true };
  }

  private cmdTouch(args: string[]): { output: string; success: boolean } {
    const target = args[0];
    if (!target) return { output: 'touch: missing file operand', success: false };

    const targetPath = this.parsePath(target);
    const parentPath = targetPath.slice(0, -1);
    const filename = targetPath[targetPath.length - 1];

    const parentNode = this.getNode(parentPath);
    if (!parentNode || parentNode.type !== 'dir' || !parentNode.children) {
      return { output: `touch: cannot touch '${target}': No such file or directory`, success: false };
    }

    if (!parentNode.children[filename]) {
      parentNode.children[filename] = {
        type: 'file',
        content: '',
        permissions: '-rw-r--r--'
      };
    }

    return { output: '', success: true };
  }

  private cmdPs(args: string[]): { output: string; success: boolean } {
    return {
      output: `  PID TTY          TIME CMD
    1 ?        00:00:02 systemd
  104 ?        00:00:00 life_support
  230 pts/0    00:00:00 bash
  404 ?        00:04:12 rogue_bot_overclock --max-turbos
  512 pts/0    00:00:00 ps`,
      success: true
    };
  }

  private cmdKill(args: string[], isSudo: boolean): { output: string; success: boolean } {
    const pid = args.find(a => /^\d+$/.test(a));
    if (!pid) return { output: 'kill: usage: kill <pid>', success: false };

    if (pid === '404') {
      return { output: '[+] Terminated PID 404 (rogue_bot_overclock). Temperature sensors returning to normal!', success: true };
    }
    return { output: `kill: (${pid}) - No such process`, success: false };
  }

  private cmdExecuteScript(cmd: string, args: string[], isSudo: boolean): { output: string; success: boolean } {
    const cleanCmd = cmd.startsWith('./') ? cmd.slice(2) : cmd;
    const path = this.parsePath(cleanCmd);
    const node = this.getNode(path);

    if (!node) {
      return { output: `bash: ${cmd}: No such file or directory`, success: false };
    }

    if (!node.exec) {
      return { output: `bash: ${cmd}: Permission denied\nTip: You need execute permissions! Try 'chmod +x ${cleanCmd}' first.`, success: false };
    }

    if (cleanCmd.includes('drain')) {
      return {
        output: `[CYBER DRAIN SYSTEM v2.4]
Initiating emergency reservoir flush...
Pressure valves 1-4: OPEN
Hydroelectric turbines: NOMINAL
Safe drainage route engaged: 12,000 gpm bypassed.
Status: RESERVOIR AT SAFE CAPACITY. ALL CITIZENS PROTECTED.`,
        success: true
      };
    }

    return { output: node.content || 'Script executed successfully.', success: true };
  }

  // Auto-complete candidate calculation
  public getCompletions(currentWord: string): string[] {
    const commands = ['ls', 'cd', 'cp', 'mv', 'mkdir', 'rm', 'cat', 'grep', 'chmod', 'ps', 'kill', 'pwd', 'touch', 'whoami', 'clear', 'help', 'history', 'man'];
    
    // If looking for a command
    if (!currentWord.includes('/')) {
      const matchingCmds = commands.filter(c => c.startsWith(currentWord));
      const currentDirItems = this.listFiles('.') || [];
      const matchingFiles = currentDirItems
        .filter(f => f.name.startsWith(currentWord))
        .map(f => f.type === 'dir' ? `${f.name}/` : f.name);
      return [...matchingCmds, ...matchingFiles];
    }

    // Path completion
    const lastSlash = currentWord.lastIndexOf('/');
    const basePath = currentWord.slice(0, lastSlash + 1);
    const partial = currentWord.slice(lastSlash + 1);

    const items = this.listFiles(basePath) || [];
    return items
      .filter(i => i.name.startsWith(partial))
      .map(i => basePath + (i.type === 'dir' ? `${i.name}/` : i.name));
  }

  private getDefaultTree(): VFSNode {
    return {
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      children: {
        home: {
          type: 'dir',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          children: {
            kali: {
              type: 'dir',
              permissions: 'drwxr-xr-x',
              owner: 'kali',
              children: {
                'heater_core.cad': {
                  type: 'file',
                  permissions: '-rw-r--r--',
                  owner: 'kali',
                  content: 'GLACIER_KERNEL_HEAT_BLUEPRINT_v4.2\n[CORE_HEATER_CIRCUITS_VALIDATED]\nBackup Plan: Arctic thermal mesh redundancy.'
                }
              }
            }
          }
        },
        var: {
          type: 'dir',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          children: {
            log: {
              type: 'dir',
              permissions: 'drwxr-xr-x',
              owner: 'root',
              children: {
                'syslog': {
                  type: 'file',
                  permissions: '-rw-r--r--',
                  owner: 'root',
                  content: 'Glacier Kernel system boot OK\nThermal monitoring: OK'
                }
              }
            }
          }
        }
      }
    };
  }
}
