import { create } from 'zustand';
import { SCRIPT_DATA } from './data/scriptData';

const useStore = create((set, get) => ({
  currentLineIndex: 0,
  history: [],
  flags: {},
  isQteActive: false,
  qteProgress: 0,
  qteSuccess: false,
  isAnimating: false,

  setAnimating: (status) => set({ isAnimating: status }),

  advanceScript: () => {
    const { currentLineIndex, isQteActive } = get();
    if (isQteActive) return; // Block if QTE is active

    const currentNode = SCRIPT_DATA[currentLineIndex];
    if (!currentNode) return;

    // Logic to move to next node (either next index or via next_scene_id)
    let nextIndex = currentLineIndex + 1;
    if (currentNode.next_scene_id) {
       const foundIndex = SCRIPT_DATA.findIndex(node => node.id === currentNode.next_scene_id);
       if (foundIndex !== -1) nextIndex = foundIndex;
    }

    // Check bounds (allow going one past end to trigger "The End")
    if (nextIndex <= SCRIPT_DATA.length) {
      set({
        currentLineIndex: nextIndex,
        history: [...get().history, currentNode.id],
        isAnimating: true // Reset animation for new line
      });

      // If next node exists and is QTE, activate it
      if (nextIndex < SCRIPT_DATA.length) {
        const nextNode = SCRIPT_DATA[nextIndex];
        if (nextNode.type === 'qte_event') {
          set({ isQteActive: true, qteProgress: 0, qteSuccess: false });
        }
      }
    }
  },

  startQte: () => set({ isQteActive: true, qteProgress: 0, qteSuccess: false }),
  endQte: (success) => {
    set({ isQteActive: false, qteSuccess: success });
    if (success) {
      get().advanceScript();
    }
  },
  updateQteProgress: (amount) => set((state) => ({ qteProgress: Math.min(state.qteProgress + amount, 100) })),

  setFlag: (key, value) => set((state) => ({ flags: { ...state.flags, [key]: value } })),

  resetGame: () => set({
    currentLineIndex: 0,
    history: [],
    flags: {},
    isQteActive: false,
    qteProgress: 0,
    qteSuccess: false,
    isAnimating: true
  })
}));

export default useStore;
