import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, VolumeX, Music } from 'lucide-react';
import { motion } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'VOID_SIGNAL_01',
    artist: 'UNKNOWN_ENTITY',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/glitch1/400/400',
  },
  {
    id: '2',
    title: 'VOID_SIGNAL_02',
    artist: 'UNKNOWN_ENTITY',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/glitch2/400/400',
  },
  {
    id: '3',
    title: 'VOID_SIGNAL_03',
    artist: 'UNKNOWN_ENTITY',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/glitch3/400/400',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-sm bg-black p-6 flex flex-col gap-8 border-2 border-magenta-neon">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
      
      <div className="flex flex-col gap-4 items-center">
        <div className="relative w-48 h-48 border-4 border-cyan-neon">
          <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover grayscale contrast-150" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-magenta-neon/20 mix-blend-screen pointer-events-none" />
          {isPlaying && <div className="absolute inset-0 noise-overlay opacity-20" />}
        </div>
        
        <div className="text-center">
          <h3 className="text-cyan-neon font-pixel text-sm truncate uppercase mb-1">{currentTrack.title}</h3>
          <p className="text-magenta-neon text-xs font-mono tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-4 w-full bg-white/10 border border-white/20 relative">
          <motion.div 
            className="h-full bg-magenta-neon"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-pixel text-white mix-blend-difference">
            STREAM_PROGRESS: {Math.round(progress)}%
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-4">
        <button onClick={handlePrev} className="text-cyan-neon hover:text-white transition-colors">
          <SkipBack size={32} />
        </button>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 border-4 border-magenta-neon flex items-center justify-center text-magenta-neon hover:bg-magenta-neon hover:text-black transition-all"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        
        <button onClick={handleNext} className="text-cyan-neon hover:text-white transition-colors">
          <SkipForward size={32} />
        </button>
      </div>

      <div className="flex items-center gap-4 text-white/40 font-mono text-[10px]">
        <VolumeX size={14} />
        <span className="tracking-[0.5em]">AUDIO_OUTPUT_STABLE</span>
        <Music size={14} className="ml-auto animate-bounce" />
      </div>
    </div>
  );
};
