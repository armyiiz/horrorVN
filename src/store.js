import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SCRIPT_DATA } from './data/scriptData';

const useStore = create(
  persist(
    (set, get) => ({
      // Navigation State
      view: 'MAIN_MENU', // 'MAIN_MENU', 'GAME', 'GALLERY', 'SAVE_MENU', 'LOAD_MENU'
      previousView: null,

      // Game State
      currentLineIndex: 0,
      history: [],
      flags: {},
      isQteActive: false,
      qteProgress: 0,
      qteSuccess: false,
      isAnimating: false,

      // Persistent Data
      unlockedGallery: [], // Array of cg_ids
      saveSlots: {
        auto_save: null,
        slot_1: null,
        slot_2: null,
        slot_3: null
      },

      // Actions
      setView: (view) => set((state) => ({ view, previousView: state.view })),

      setAnimating: (status) => set({ isAnimating: status }),

      advanceScript: () => {
        const { currentLineIndex, isQteActive } = get();
        if (isQteActive) return; // Block if QTE is active

        const currentNode = SCRIPT_DATA[currentLineIndex];
        if (!currentNode) return;

        // Logic to move to next node
        let nextIndex = currentLineIndex + 1;

        // Support both next_scene_id and next_id (for part_break)
        const targetId = currentNode.next_scene_id || currentNode.next_id;

        if (targetId) {
           const foundIndex = SCRIPT_DATA.findIndex(node => node.id === targetId);
           if (foundIndex !== -1) nextIndex = foundIndex;
        }

        // Check bounds
        if (nextIndex <= SCRIPT_DATA.length) {
          // Unlock CG if present
          if (currentNode.cg_id) {
            get().unlockCg(currentNode.cg_id);
          }

          set({
            currentLineIndex: nextIndex,
            history: [...get().history, currentNode.id],
            isAnimating: true
          });

          // Auto-save logic
          get().saveGame('auto_save');

          // If next node exists and is QTE, activate it
          if (nextIndex < SCRIPT_DATA.length) {
            const nextNode = SCRIPT_DATA[nextIndex];
            if (nextNode.type === 'qte_event') {
              get().startQte();
            }
          }
        }
      },

      startQte: () => set({ isQteActive: true, qteProgress: 20, qteSuccess: false }),

      endQte: (success) => {
        set({ isQteActive: false, qteSuccess: success });
        if (success) {
          get().advanceScript();
        }
      },

      updateQteProgress: (amount) => {
        const { qteProgress, endQte } = get();
        let newProgress = qteProgress + amount;

        // Clamp values
        if (newProgress >= 100) {
          newProgress = 100;
          endQte(true);
        } else if (newProgress <= 0) {
          newProgress = 0;
          endQte(false);
        }

        set({ qteProgress: newProgress });
      },

      decayQte: () => {
        get().updateQteProgress(-0.5);
      },

      setFlag: (key, value) => set((state) => ({ flags: { ...state.flags, [key]: value } })),

      resetGame: () => set({
        currentLineIndex: 0,
        history: [],
        flags: {},
        isQteActive: false,
        qteProgress: 0,
        qteSuccess: false,
        isAnimating: true,
        view: 'GAME'
      }),

      // Persistence Actions
      saveGame: (slotId) => {
        const { currentLineIndex, history, flags } = get();
        const timestamp = new Date().toISOString();
        const snapshot = {
          currentLineIndex,
          history,
          flags,
          timestamp,
          previewText: SCRIPT_DATA[currentLineIndex]?.text?.substring(0, 30) + "..." || "End of Game"
        };

        set((state) => ({
          saveSlots: {
            ...state.saveSlots,
            [slotId]: snapshot
          }
        }));
      },

      loadGame: (slotId) => {
        const slotData = get().saveSlots[slotId];
        if (slotData) {
          set({
            currentLineIndex: slotData.currentLineIndex,
            history: slotData.history,
            flags: slotData.flags,
            isQteActive: false,
            view: 'GAME'
          });
        }
      },

      unlockCg: (cgId) => {
        const { unlockedGallery } = get();
        if (!unlockedGallery.includes(cgId)) {
          set({ unlockedGallery: [...unlockedGallery, cgId] });
        }
      }
    }),
    {
      name: 'horror-vn-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({
        unlockedGallery: state.unlockedGallery,
        saveSlots: state.saveSlots
      }), // Only persist these fields
    }
  )
);

export default useStore;
