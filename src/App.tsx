import React, { useState, useEffect, useMemo } from 'react';
import { Book, Adventure } from './types';
import {
  loadStoredBooks,
  saveStoredBooks,
  loadCompletedEpisodes,
  saveCompletedEpisode,
  generateNext5Books
} from './data/bookGenerator';
import { VirtualFileSystem } from './utils/vfs';
import { sound } from './utils/audio';
import { TopBar } from './components/TopBar';
import { StoryVisualizer } from './components/StoryVisualizer';
import { CollapsibleTerminal } from './components/CollapsibleTerminal';
import { DebbiesNotebook } from './components/DebbiesNotebook';
import { CheerCelebration } from './components/CheerCelebration';
import { WindelsLibrary } from './components/WindelsLibrary';
import { KazzIsolateModal } from './components/KazzIsolateModal';
import { Award, Sparkles, ChevronRight, CheckCircle2, BookOpen } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState<Book[]>(() => loadStoredBooks());
  const [completedEpisodeIds, setCompletedEpisodeIds] = useState<string[]>(() => loadCompletedEpisodes());
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isGeneratingBooks, setIsGeneratingBooks] = useState<boolean>(false);

  // Flattened list of all episodes from all books
  const allAdventures = useMemo(() => {
    return books.flatMap(b => b.episodes);
  }, [books]);

  const [activeAdventureId, setActiveAdventureId] = useState<string>(() => {
    return books[0]?.episodes[0]?.id || 'ep-1-1';
  });

  const [pageIndex, setPageIndex] = useState<number>(0);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState<boolean>(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState<boolean>(false);
  const [isKazzIsolateOpen, setIsKazzIsolateOpen] = useState<boolean>(false);
  const [showCheerCelebration, setShowCheerCelebration] = useState<boolean>(false);

  // Mastered commands starts EMPTY (0 mastered initially) and requires 20 executions
  const [masteredCommands, setMasteredCommands] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('CYBER_CREW_MASTERED_COMMANDS_V2');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  });

  const [commandExecutionCounts, setCommandExecutionCounts] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem('CYBER_CREW_CMD_COUNTS_V2');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
  });

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [badgeToast, setBadgeToast] = useState<{ command: string; title: string } | null>(null);
  const [vfsVersion, setVfsVersion] = useState<number>(0);

  // Track command usage toward 20-use mastery
  const trackCommandExecution = (rawCmd: string) => {
    let clean = rawCmd.trim().toLowerCase();
    if (clean.startsWith('sudo ')) {
      clean = clean.slice(5).trim();
    }
    const baseCmd = clean.split(/\s+/)[0];
    if (!baseCmd) return;

    setCommandExecutionCounts(prev => {
      const newCount = (prev[baseCmd] || 0) + 1;
      const updated = { ...prev, [baseCmd]: newCount };
      try {
        localStorage.setItem('CYBER_CREW_CMD_COUNTS_V2', JSON.stringify(updated));
      } catch (e) {}

      // Once a command has been used 20 times correctly, officially register as mastered!
      if (newCount >= 20) {
        setMasteredCommands(mPrev => {
          if (!mPrev.includes(baseCmd)) {
            const mUpdated = [...mPrev, baseCmd];
            try {
              localStorage.setItem('CYBER_CREW_MASTERED_COMMANDS_V2', JSON.stringify(mUpdated));
            } catch (e) {}
            sound.playCheerFanfare();
            showBadgeNotification(
              baseCmd.toUpperCase(),
              `OFFICIAL MASTERY: ${baseCmd.toUpperCase()} executed 20 times! DreadfulSolutions Certified!`
            );
            return mUpdated;
          }
          return mPrev;
        });
      } else if (newCount % 5 === 0) {
        showBadgeNotification(
          baseCmd.toUpperCase(),
          `Field Progress: ${baseCmd} used ${newCount}/20 times (${20 - newCount} to Mastery)`
        );
      }
      return updated;
    });
  };

  // Active adventure
  const currentAdventure = useMemo(() => {
    return allAdventures.find(a => a.id === activeAdventureId) || allAdventures[0];
  }, [allAdventures, activeAdventureId]);

  // Virtual file system instance
  const [vfs, setVfs] = useState<VirtualFileSystem>(() => {
    return new VirtualFileSystem(
      JSON.parse(JSON.stringify(currentAdventure.initialFs)),
      currentAdventure.initialCwd
    );
  });

  // Re-seed VFS when switching adventures
  useEffect(() => {
    setPageIndex(0);
    setVfs(
      new VirtualFileSystem(
        JSON.parse(JSON.stringify(currentAdventure.initialFs)),
        currentAdventure.initialCwd
      )
    );
    setVfsVersion(v => v + 1);
  }, [activeAdventureId, currentAdventure]);

  const currentPage = currentAdventure.pages[pageIndex] || currentAdventure.pages[0];
  const isLastPage = pageIndex === currentAdventure.pages.length - 1;

  // Cheer Trigger
  const triggerCheer = () => {
    setShowCheerCelebration(true);
  };

  const handleCheerFinished = () => {
    setShowCheerCelebration(false);
    if (pageIndex === 0) {
      setPageIndex(1);
    }
  };

  // When command succeeds
  const handleCommandSuccess = (cmd: string, updatedVfs: VirtualFileSystem) => {
    // Cheer on page 1
    if (currentPage.isCheerPage) {
      triggerCheer();
      return;
    }

    // Track command execution towards 20-use mastery
    trackCommandExecution(cmd);

    if (currentPage.pageNumber === 3) {
      sound.playPing();
      setVfsVersion(v => v + 1);
      setTimeout(() => {
        setPageIndex(3); // Go to Page 4: Verify
      }, 900);
      return;
    }

    if (currentPage.pageNumber === 4) {
      sound.playSuccess();
      setVfsVersion(v => v + 1);
      setTimeout(() => {
        setPageIndex(4); // Go to Page 5: Make The Vault And Move It
      }, 800);
      return;
    }

    if (currentPage.pageNumber === 5) {
      if (cmd.startsWith('mkdir') || cmd.startsWith('touch') || cmd.startsWith('echo')) {
        sound.playSuccess();
        setVfsVersion(v => v + 1);
      }
      if (
        cmd.startsWith('mv') ||
        cmd.startsWith('chmod') ||
        (currentPage.targetCommand && cmd.trim() === currentPage.targetCommand.trim())
      ) {
        sound.playWhoosh();
        setVfsVersion(v => v + 1);
        setTimeout(() => {
          sound.playVaultLock();
          // Mark episode completed!
          saveCompletedEpisode(currentAdventure.id);
          setCompletedEpisodeIds(loadCompletedEpisodes());

          setTimeout(() => {
            setPageIndex(5); // Go to Page 6: Safe!
          }, 800);
        }, 300);
      }
      return;
    }

    setVfsVersion(v => v + 1);
    sound.playSuccess();
    if (pageIndex < currentAdventure.pages.length - 1) {
      setTimeout(() => {
        setPageIndex(prev => prev + 1);
      }, 700);
    }
  };

  const showBadgeNotification = (command: string, title: string) => {
    setBadgeToast({ command, title });
    setTimeout(() => {
      setBadgeToast(null);
    }, 4500);
  };

  const advancePage = () => {
    if (pageIndex < currentAdventure.pages.length - 1) {
      sound.playSuccess();
      setPageIndex(prev => prev + 1);
      if (pageIndex + 1 === currentAdventure.pages.length - 1) {
        saveCompletedEpisode(currentAdventure.id);
        setCompletedEpisodeIds(loadCompletedEpisodes());
      }
    }
  };

  const resetAdventure = () => {
    sound.playNotebookSnap();
    setPageIndex(0);
    setVfs(
      new VirtualFileSystem(
        JSON.parse(JSON.stringify(currentAdventure.initialFs)),
        currentAdventure.initialCwd
      )
    );
    setVfsVersion(v => v + 1);
  };

  const toggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // CHECK OUT 5 MORE BOOKS HANDLER (20 new episodes!)
  const handleCheckoutMoreBooks = async () => {
    setIsGeneratingBooks(true);
    sound.playNotebookSnap();
    try {
      const nextBatch = await generateNext5Books(books.length + 1);
      const updated = [...books, ...nextBatch];
      setBooks(updated);
      saveStoredBooks(updated);
      sound.playCheerFanfare();
      showBadgeNotification('5 BOOKS', 'Checked out 5 new books! 20 brand-new episodes added!');
    } catch (e) {
      console.error('Failed to checkout more books:', e);
    } finally {
      setIsGeneratingBooks(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header Navigation */}
      <TopBar
        currentAdventure={currentAdventure}
        adventuresList={allAdventures}
        totalBooksCount={books.length}
        onSelectAdventure={setActiveAdventureId}
        currentPageNumber={pageIndex + 1}
        totalPageCount={currentAdventure.pages.length}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenKazzIsolate={() => setIsKazzIsolateOpen(true)}
        isKazzIsolateOpen={isKazzIsolateOpen}
        masteredCount={masteredCommands.length}
        onResetAdventure={resetAdventure}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onToggleTerminal={() => setIsTerminalCollapsed(!isTerminalCollapsed)}
        isTerminalCollapsed={isTerminalCollapsed}
      />

      {/* Main Adventure Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Story Visualizer Stage */}
        <StoryVisualizer
          currentPage={currentPage}
          totalPageCount={currentAdventure.pages.length}
          onAdvancePage={advancePage}
          canAdvance={!currentPage.targetCommand || currentPage.pageNumber === 6}
          onTriggerCheer={triggerCheer}
          vfs={vfs}
        />

        {/* Collapsible Linux Terminal */}
        <CollapsibleTerminal
          vfs={vfs}
          currentPage={currentPage}
          onCommandSuccess={handleCommandSuccess}
          onCommandExecuted={(cmd) => trackCommandExecution(cmd)}
          isCollapsed={isTerminalCollapsed}
          setIsCollapsed={setIsTerminalCollapsed}
        />
      </main>

      {/* Command Mastered Badge Toast Notification */}
      {badgeToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-slate-950 p-4 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.7)] border-2 border-emerald-300 flex items-center gap-3 animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-slate-950 text-emerald-400 flex items-center justify-center font-mono font-black text-xs shadow text-center p-1">
            {badgeToast.command}
          </div>
          <div>
            <div className="text-[10px] font-mono font-black tracking-widest text-emerald-950 uppercase">
              {badgeToast.title}
            </div>
            <div className="font-mono text-sm font-black text-white">
              [Command Mastered: {badgeToast.command}]
            </div>
          </div>
        </div>
      )}

      {/* Debbie's System Reliability Notebook Slide-Over */}
      <DebbiesNotebook
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        vfs={vfs}
        masteredCommands={masteredCommands}
        commandExecutionCounts={commandExecutionCounts}
      />

      {/* Windel's Linux Library Modal (Catalog of Books & Episodes) */}
      <WindelsLibrary
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        books={books}
        currentAdventureId={currentAdventure.id}
        onSelectAdventure={setActiveAdventureId}
        onCheckoutMoreBooks={handleCheckoutMoreBooks}
        isGenerating={isGeneratingBooks}
        completedEpisodeIds={completedEpisodeIds}
      />

      {/* Kazz's Kasm VNC Isolate Modal (Ephemeral Command Sandbox & AI Memory Coach) */}
      <KazzIsolateModal
        isOpen={isKazzIsolateOpen}
        onClose={() => setIsKazzIsolateOpen(false)}
        currentPage={currentPage}
        adventureTitle={currentAdventure.title}
      />

      {/* Cheer Ritual Animation (Page 1) */}
      <CheerCelebration
        show={showCheerCelebration}
        onFinish={handleCheerFinished}
      />
    </div>
  );
}
