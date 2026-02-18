import { useState } from 'react';
import useStore from './store';
import MainMenu from './components/MainMenu';
import Gallery from './components/Gallery';
import SaveLoadMenu from './components/SaveLoadMenu';
import Game from './components/Game';
import Preloader from './components/Preloader';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const view = useStore((state) => state.view);

  if (!isLoaded) {
    return <Preloader onComplete={() => setIsLoaded(true)} />;
  }

  if (view === 'MAIN_MENU') return <MainMenu />;
  if (view === 'GALLERY') return <Gallery />;
  if (view === 'SAVE_MENU' || view === 'LOAD_MENU') return <SaveLoadMenu />;

  // Default to GAME view
  return <Game />;
}

export default App;
