import useStore from '../store';

const SaveLoadMenu = () => {
  const view = useStore((state) => state.view);
  const previousView = useStore((state) => state.previousView);
  const setView = useStore((state) => state.setView);
  const saveSlots = useStore((state) => state.saveSlots);
  const saveGame = useStore((state) => state.saveGame);
  const loadGame = useStore((state) => state.loadGame);

  const isSaveMode = view === 'SAVE_MENU';
  const slots = ['slot_1', 'slot_2', 'slot_3'];

  const handleSlotClick = (slotId) => {
    if (isSaveMode) {
      saveGame(slotId);
      // Optional: Add visual feedback "Saved!"
      alert('Game Saved!'); // Simple feedback for now
    } else {
      if (saveSlots[slotId]) {
        loadGame(slotId);
      }
    }
  };

  const handleBack = () => {
    if (previousView) {
      setView(previousView);
    } else {
      setView('MAIN_MENU'); // Fallback
    }
  };

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center p-8 font-serif">
      <h2 className="text-4xl text-red-600 font-bold tracking-widest uppercase mb-8 animate-pulse">
        {isSaveMode ? 'Save Progress' : 'Load Game'}
      </h2>

      <div className="flex flex-col space-y-4 w-full max-w-2xl">
        {slots.map((slotId) => {
          const slotData = saveSlots[slotId];
          const isEmpty = !slotData;

          return (
            <button
              key={slotId}
              onClick={() => handleSlotClick(slotId)}
              className={`
                relative
                flex flex-col items-start
                p-6 border-2
                transition-all duration-300
                group
                bg-gray-950/80
                ${isSaveMode
                  ? 'border-red-900 hover:border-red-500 hover:bg-red-900/10'
                  : isEmpty
                    ? 'border-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                    : 'border-green-900 hover:border-green-500 hover:bg-green-900/10 cursor-pointer'
                }
              `}
              disabled={!isSaveMode && isEmpty}
            >
              <div className="flex justify-between w-full mb-2">
                <span className="text-sm tracking-widest uppercase text-gray-400 group-hover:text-white transition-colors">
                  {slotId.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  {isEmpty ? '---' : new Date(slotData.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="text-lg font-medium text-gray-300 truncate w-full text-left">
                {isEmpty ? 'Empty Slot' : slotData.previewText}
              </div>

              {/* Hover Effect Line */}
              <div className={`absolute bottom-0 left-0 h-1 transition-all duration-300 w-0 group-hover:w-full ${isSaveMode ? 'bg-red-600' : 'bg-green-600'}`}></div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleBack}
        className="mt-8 px-8 py-2 border border-gray-700 text-gray-400 hover:text-white hover:border-white transition-all uppercase tracking-widest text-sm"
      >
        Back
      </button>
    </div>
  );
};

export default SaveLoadMenu;
