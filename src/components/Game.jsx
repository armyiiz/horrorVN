import { useEffect, useState } from 'react';
import useStore from '../store';
import { SCRIPT_DATA } from '../data/scriptData';

const Game = () => {
  const currentLineIndex = useStore((state) => state.currentLineIndex);
  const history = useStore((state) => state.history);
  const advanceScript = useStore((state) => state.advanceScript);
  const isQteActive = useStore((state) => state.isQteActive);
  const qteProgress = useStore((state) => state.qteProgress);
  const qteSuccess = useStore((state) => state.qteSuccess);
  const updateQteProgress = useStore((state) => state.updateQteProgress);
  const decayQte = useStore((state) => state.decayQte);
  const endQte = useStore((state) => state.endQte);
  const setView = useStore((state) => state.setView);

  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(false);

  const currentScene = SCRIPT_DATA[currentLineIndex];

  // Fade In Effect (when entering a scene)
  useEffect(() => {
    // Check if the previous scene had a fade_black effect
    if (history.length > 0) {
      if (history.length >= 2) {
        const prevSceneId = history[history.length - 2];
        const prevScene = SCRIPT_DATA.find(n => n.id === prevSceneId);
        if (prevScene && prevScene.vfx === 'fade_black') {
          setIsFadingIn(true);
          const timer = setTimeout(() => setIsFadingIn(false), 1000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [currentLineIndex, history]);

  // QTE Logic: Decay over time
  useEffect(() => {
    let interval;
    if (isQteActive) {
      interval = setInterval(() => {
        decayQte();
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isQteActive, decayQte]);

  if (!currentScene) {
    return (
      <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center font-serif">
        <h1 className="text-6xl mb-8 text-red-600 font-bold tracking-[0.5em] animate-pulse">THE END</h1>
        <button
          onClick={() => setView('MAIN_MENU')}
          className="px-8 py-3 border border-red-800 text-red-500 hover:bg-red-900/20 transition-all uppercase tracking-widest text-sm"
        >
          Return to Title
        </button>
      </div>
    );
  }

  // Game Over Screen
  if (currentScene.type === 'qte_event' && !isQteActive && !qteSuccess) {
     return (
      <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center font-serif animate-fade-in">
        <h1 className="text-8xl mb-4 text-red-600 font-black tracking-widest animate-shake">DEAD END</h1>
        <p className="text-red-800 text-xl tracking-[0.5em] mb-12">YOU HESITATED</p>
        <button
          onClick={() => setView('MAIN_MENU')}
          className="px-8 py-3 border border-red-800 text-red-500 hover:bg-red-900/20 transition-all uppercase tracking-widest text-sm"
        >
          Return to Title
        </button>
      </div>
    );
  }

  // Part Break Screen
  if (currentScene.type === 'part_break') {
     return (
      <div
        className="h-screen w-full bg-black text-white flex flex-col items-center justify-center font-serif animate-fade-in relative overflow-hidden"
      >
        {/* Optional Background for Part Break */}
        <div className="absolute inset-0 opacity-30 bg-[url('/assets/ui/part_break.jpg')] bg-cover bg-center"></div>

        <div className="z-10 text-center">
            <h1 className="text-6xl md:text-8xl mb-8 text-white font-bold tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {currentScene.text || "END OF PART"}
            </h1>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-12"></div>
            <button
            onClick={() => advanceScript()}
            className="px-12 py-4 border-2 border-white/20 hover:border-red-600 text-white hover:text-red-500 hover:bg-black/50 transition-all uppercase tracking-[0.2em] text-lg backdrop-blur-sm"
            >
            Continue to Next Part
            </button>
        </div>
      </div>
    );
  }

  // Determine VFX behavior
  let containerVfx = '';
  let overlayVfx = null;

  if (currentScene.vfx === 'shake') {
    containerVfx = 'animate-shake';
  } else if (currentScene.vfx === 'flash') {
    overlayVfx = 'animate-flash bg-white mix-blend-overlay';
  }

  // Transition Overlay
  let transitionOverlay = null;
  if (isFadingOut) {
      transitionOverlay = <div className="absolute inset-0 bg-black z-[100] animate-fade-in pointer-events-none"></div>;
  } else if (isFadingIn) {
      transitionOverlay = <div className="absolute inset-0 bg-black z-[100] animate-fade-out pointer-events-none"></div>;
  }

  // Determine Background Image
  const bgPath = `/assets/bg/${currentScene.bg_image}`;

  // Determine Character Sprite
  let charPath = null;
  if (currentScene.char_image) {
    charPath = `/assets/chars/${currentScene.char_image}`;
  } else if (currentScene.speaker) {
    const speaker = currentScene.speaker.toLowerCase();
    const expression = currentScene.expression ? currentScene.expression.toLowerCase() : 'neutral';
    charPath = `/assets/chars/${speaker}/${expression}.png`;
  }

  const handleTransition = () => {
     if (currentScene.vfx === 'fade_black') {
         setIsFadingOut(true);
         setTimeout(() => {
             advanceScript();
             setIsFadingOut(false);
         }, 1000);
     } else {
         advanceScript();
     }
  };

  const handleClick = () => {
    if (!isQteActive && !isFadingOut) { // Prevent clicks during fade out
      handleTransition();
    }
  };

  const handleQteClick = (e) => {
    e.stopPropagation();
    if (isQteActive) {
      updateQteProgress(8);
    }
  };

  return (
    <div
      className={`relative h-screen w-full overflow-hidden flex flex-col justify-between font-serif select-none transition-colors duration-1000 bg-black ${containerVfx}`}
      onClick={handleClick}
    >
      {/* Background Image Layer */}
      <img
        src={bgPath}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 -z-10"
      />

      {/* Character Sprite Layer */}
      {charPath && (
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-0">
           <img
             src={charPath}
             alt={currentScene.speaker}
             className="h-[80%] object-contain animate-fade-in drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
           />
        </div>
      )}

      {/* Overlay VFX Layer */}
      {overlayVfx && (
        <div className={`absolute inset-0 pointer-events-none ${overlayVfx}`}></div>
      )}

      {/* Transition Overlay */}
      {transitionOverlay}

      {/* UI Overlay (Save/Load/Menu) */}
      <div className="absolute top-4 right-4 z-40 flex space-x-4">
        <button
          onClick={(e) => { e.stopPropagation(); setView('SAVE_MENU'); }}
          className="bg-black/50 text-white px-4 py-1 border border-gray-600 hover:bg-red-900/50 text-xs tracking-widest uppercase backdrop-blur-sm"
        >
          Save
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setView('LOAD_MENU'); }}
          className="bg-black/50 text-white px-4 py-1 border border-gray-600 hover:bg-red-900/50 text-xs tracking-widest uppercase backdrop-blur-sm"
        >
          Load
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setView('MAIN_MENU'); }}
          className="bg-black/50 text-white px-4 py-1 border border-gray-600 hover:bg-red-900/50 text-xs tracking-widest uppercase backdrop-blur-sm"
        >
          Menu
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow"></div>

      {/* QTE Overlay */}
      {isQteActive && (
         <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={handleQteClick}
         >
           <div className="animate-pulse-red w-full max-w-2xl text-center p-8 border-4 border-red-600 bg-black shadow-[0_0_50px_red] transform hover:scale-105 transition-transform duration-75">
             <h2 className="text-red-500 font-black text-6xl md:text-8xl tracking-tighter drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] animate-shake mb-8">
               TAP QUICKLY!
             </h2>

             {/* Progress Bar Container */}
             <div className="w-full h-12 bg-gray-900 border-2 border-red-800 relative overflow-hidden animate-shake">
               {/* Progress Bar Fill */}
               <div
                 className="h-full bg-red-600 transition-all duration-75 ease-out shadow-[0_0_20px_red]"
                 style={{ width: `${qteProgress}%` }}
               ></div>
             </div>

             <p className="mt-4 text-red-400 font-mono text-xl animate-bounce">
               {Math.max(0, Math.floor(qteProgress))}%
             </p>
           </div>
         </div>
      )}

      {/* Dialogue Box */}
      <div className="z-10 w-full p-4 md:p-8 md:pb-12 pointer-events-none">
        <div
          className="
            relative
            bg-black/85
            backdrop-blur-sm
            border-y-2 border-red-900/30
            p-6 md:p-8
            min-h-[180px]
            shadow-[0_0_50px_rgba(0,0,0,0.8)]
            max-w-5xl mx-auto
            pointer-events-auto
          "
        >
          {/* Speaker Tag */}
          {currentScene.speaker && (
            <div className="
              absolute -top-4 left-0 md:left-8
              bg-gradient-to-r from-red-900 to-black
              border-l-4 border-red-600
              px-6 py-1
              shadow-lg
            ">
              <span className="text-red-100 font-bold tracking-[0.2em] text-sm uppercase">
                {currentScene.speaker}
              </span>
            </div>
          )}

          {/* Dialogue Text */}
          <p className="
            text-xl md:text-2xl
            text-gray-200
            leading-relaxed
            tracking-wide
            font-medium
            drop-shadow-md
            mt-2
            text-shadow
          ">
            {currentScene.text}
            {/* Typewriter Cursor */}
            <span className="inline-block w-2.5 h-6 bg-red-600 ml-1 animate-pulse align-middle shadow-[0_0_10px_red]"></span>
          </p>

          {/* Continue Indicator */}
          {!isQteActive && !isFadingOut && (
             <div className="absolute bottom-4 right-6 text-red-500/50 animate-bounce">
               ▼
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
