# Linux Commands Reference Guide

This reference guide organizes essential Linux commands by their respective functional categories, with duplicate entries consolidated.

## File and Directory Commands
* **ls**: List directory contents.
* **cd**: Change directory.
* **pwd**: Show current directory.
* **mkdir**: Create a new directory.
* **rmdir**: Remove an empty directory.
* **rm**: Delete files or directories.
* **touch**: Create an empty file.
* **cp**: Copy files or directories.
* **mv**: Move or rename files.
* **cat**: Display file contents.
* **nano / vim**: Edit files in terminal.
* **find**: Search for files in a directory hierarchy.
* **grep**: Search text using patterns.
* **tar**: Archive and compress files.
* **df**: Show disk usage of file systems.
* **du**: Show directory/file size.
* **chmod**: Change file permissions.
* **chown**: Change file owner.
* **mount**: Mount a filesystem.
* **umount**: Unmount a filesystem.

## Networking Commands
* **ping**: Test connectivity to a host.
* **ifconfig / ip a**: Display network interfaces.
* **netstat / ss**: Show network connections.
* **nc (Netcat)**: Network debugging and data transfer.
* **tcpdump**: Capture and analyze network packets.
* **iptables**: Configure firewall rules.
* **traceroute**: Trace the path packets take to a network host.
* **nslookup**: Query DNS to obtain domain name or IP address mapping.
* **ssh**: Securely connect to a remote host.

## Process and System Monitoring Commands
* **ps**: Show running processes.
* **top**: Dynamic process viewer.
* **htop**: Enhanced version of top.
* **kill**: Send a signal to a process.
* **killall**: Kill processes by name.
* **uptime**: System uptime and load.
* **whoami**: Current logged-in user.
* **env**: Display environment variables.
* **strace**: Trace system calls of a process.
* **systemctl**: Manage systemd services.
* **journalctl**: View system logs.
* **free**: Display memory usage.
* **vmstat**: Report virtual memory statistics.
* **iostat**: Report CPU and I/O statistics.
* **lsof**: List open files by processes.
* **dmesg**: Print kernel ring buffer messages.

## User and Permission Management Commands
* **passwd**: Change user password.
* **adduser / useradd**: Add a new user.
* **deluser / userdel**: Delete a user.
* **usermod**: Modify user account.
* **groups**: Show group memberships.
* **sudo**: Execute commands as root.
* **chage**: Change user password expiry information.
* **id**: Display user identity information.
* **newgrp**: Log in to a new group.

## File Transfer and Synchronization Commands
* **scp**: Securely copy files over SSH.
* **rsync**: Efficiently sync files and directories.
* **ftp**: Transfer files using the File Transfer Protocol.
* **sftp**: Securely transfer files using SSH File Transfer Protocol.
* **wget**: Download files from the web.
* **curl**: Transfer data from or to a server.

## Text Processing Commands
* **awk**: Pattern scanning and processing.
* **sed**: Stream editor for filtering/modifying text.
* **cut**: Remove sections from lines of text.
* **sort**: Sort lines of text.
* **wc**: Count words, lines, and characters.
* **paste**: Merge lines of files.
* **join**: Join lines of two files on a common field.
* **head**: Output the first part of files.
* **tail**: Output the last part of files.

## Shell Utilities and Shortcuts Commands
* **alias**: Create shortcuts for commands.
* **unalias**: Remove an alias.
* **history**: Show previously entered commands.
* **clear**: Clear the terminal screen.
* **reboot**: Reboot the system.
* **shutdown**: Power off the system.
* **date**: Display or set the system date and time.
* **echo**: Display a line of text.
* **sleep**: Delay for a specified amount of time.
* **time**: Measure the duration of command execution.
* **watch**: Execute a program periodically, showing output fullscreen.