import useStore from '../store';

const MainMenu = () => {
  const setView = useStore((state) => state.setView);
  const resetGame = useStore((state) => state.resetGame);
  const loadGame = useStore((state) => state.loadGame);
  const saveSlots = useStore((state) => state.saveSlots);

  const handleNewGame = () => {
    resetGame();
    // resetGame sets view to 'GAME' automatically in store, but we can be explicit if needed
  };

  const handleContinue = () => {
    if (saveSlots.auto_save) {
      loadGame('auto_save');
    }
  };

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center space-y-8 font-serif">
      <h1 className="text-6xl text-red-600 font-bold tracking-[0.5em] animate-pulse drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
        HORROR VN
      </h1>

      <div className="flex flex-col space-y-4 w-64">
        <button
          onClick={handleNewGame}
          className="px-6 py-3 border border-red-800 text-red-500 hover:bg-red-900/20 transition-all uppercase tracking-widest text-sm"
        >
          New Game
        </button>

        <button
          onClick={handleContinue}
          disabled={!saveSlots.auto_save}
          className={`px-6 py-3 border border-red-800 transition-all uppercase tracking-widest text-sm
            ${saveSlots.auto_save
              ? 'text-red-500 hover:bg-red-900/20'
              : 'text-gray-600 border-gray-800 cursor-not-allowed'
            }`}
        >
          Continue
        </button>

        <button
          onClick={() => setView('LOAD_MENU')}
          className="px-6 py-3 border border-red-800 text-red-500 hover:bg-red-900/20 transition-all uppercase tracking-widest text-sm"
        >
          Load Game
        </button>

        <button
          onClick={() => setView('GALLERY')}
          className="px-6 py-3 border border-red-800 text-red-500 hover:bg-red-900/20 transition-all uppercase tracking-widest text-sm"
        >
          Gallery
        </button>
      </div>

      <div className="absolute bottom-4 text-gray-600 text-xs tracking-widest">
        v2.0 - Horror Engine
      </div>
    </div>
  );
};

export default MainMenu;
