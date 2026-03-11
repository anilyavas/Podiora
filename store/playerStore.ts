import { create } from 'zustand';

export type Episode = {
  id: string;
  title: string;
  audioUrl: string;
  artwork: string;
  podcastTitle: string;
  duration: number;
};

type PlayerStore = {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  position: number;
  duration: number;

  play: (episode: Episode) => void;
  pause: () => void;
  resume: () => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  skipForward: () => void;
  skipBackward: () => void;
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentEpisode: null,
  isPlaying: false,
  position: 0,
  duration: 0,

  play: (episode) => set({ currentEpisode: episode, isPlaying: true, position: 0 }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),

  skipForward: () => {
    const { position, duration } = get();
    set({ position: Math.min(position + 30, duration) });
  },

  skipBackward: () => {
    const { position } = get();
    set({ position: Math.max(position - 15, 0) });
  },
}));
