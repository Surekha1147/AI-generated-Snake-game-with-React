import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-magenta-neon/50 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="noise-overlay" />
      <div className="crt-lines" />
      
      <motion.header 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12 text-center relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-pixel tracking-tighter uppercase mb-4 glitch-text" data-text="VOID_PROTOCOL">
          VOID_PROTOCOL
        </h1>
        <div className="flex items-center justify-center gap-4 text-cyan-neon font-mono text-lg tracking-[0.5em] uppercase">
          <span className="animate-pulse">[ STATUS: UNSTABLE ]</span>
          <span className="text-magenta-neon">//</span>
          <span>SYS_ID: 7S3QP54</span>
        </div>
      </motion.header>

      <main className="flex flex-col lg:flex-row items-center justify-center gap-16 relative z-10 w-full max-w-7xl">
        <motion.div 
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="order-2 lg:order-1 border-4 border-magenta-neon p-2 bg-black shadow-[10px_10px_0px_0px_rgba(255,0,255,1)]"
        >
          <MusicPlayer />
        </motion.div>

        <motion.div 
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="order-1 lg:order-2 border-4 border-cyan-neon p-2 bg-black shadow-[10px_10px_0px_0px_rgba(0,255,255,1)]"
        >
          <SnakeGame />
        </motion.div>

        <motion.div 
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden xl:flex flex-col gap-6 w-72 order-3 font-mono"
        >
          <div className="p-6 border-2 border-white/20 bg-black/80">
            <h4 className="text-magenta-neon uppercase tracking-widest mb-4 border-b border-magenta-neon pb-2">DATA_LOGS</h4>
            <div className="space-y-4 text-sm">
              {[
                { id: 'X-01', val: 'DECRYPTED' },
                { id: 'X-02', val: 'CORRUPTED' },
                { id: 'X-03', val: 'STABLE' },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-cyan-neon">NODE_{s.id}</span>
                  <span className="text-white font-bold">{s.val}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 border-2 border-cyan-neon bg-black/80">
            <h4 className="text-cyan-neon uppercase tracking-widest mb-2">NEURAL_LINK</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-magenta-neon animate-ping" />
              <span className="text-xs text-white">UPLINK_ESTABLISHED_...</span>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="mt-16 text-magenta-neon font-mono text-xs tracking-[1em] uppercase relative z-10 bg-black px-4 py-1 border border-magenta-neon">
        TERMINAL_SESSION_0x42_ACTIVE
      </footer>
    </div>
  );
}
