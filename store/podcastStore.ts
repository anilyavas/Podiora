import { create } from 'zustand';

export type Podcast = {
  id: string;
  title: string;
  author: string;
  artwork: string;
  feedUrl: string;
  category?: string;
};

type PodcastStore = {
  subscriptions: Podcast[];
  subscribe: (podcast: Podcast) => void;
  unsubscribe: (feedUrl: string) => void;
  isSubscribed: (feedUrl: string) => boolean;
};

export const usePodcastStore = create<PodcastStore>((set, get) => ({
  subscriptions: [],

  subscribe: (podcast) =>
    set((state) => ({
      subscriptions: [...state.subscriptions, podcast],
    })),

  unsubscribe: (feedUrl) =>
    set((state) => ({
      subscriptions: state.subscriptions.filter((p) => p.feedUrl !== feedUrl),
    })),

  isSubscribed: (feedUrl) => get().subscriptions.some((p) => p.feedUrl === feedUrl),
}));
