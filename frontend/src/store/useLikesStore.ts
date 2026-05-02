import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface LikesState {
  likedItems: string[];
  toggleLike: (itemId: string) => Promise<void>;
}

export const useLikesStore = create<LikesState>()(
  persist(
    (set, get) => ({
      likedItems: [],
      toggleLike: async (itemId: string) => {
        const { likedItems } = get();
        const isLiked = likedItems.includes(itemId);
        const newLiked = isLiked
          ? likedItems.filter((id) => id !== itemId)
          : [...likedItems, itemId];

        // Optimistic UI update
        set({ likedItems: newLiked });

        try {
          await api.likeMenuItem(itemId, !isLiked);
        } catch (err) {
          console.error('Failed to toggle like:', err);
          // Revert on failure
          set({ likedItems });
        }
      },
    }),
    {
      name: 'menova_liked_items',
    }
  )
);
