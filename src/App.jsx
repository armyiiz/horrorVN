import useStore from './store';
import MainMenu from './components/MainMenu';
import Gallery from './components/Gallery';
import SaveLoadMenu from './components/SaveLoadMenu';
import Game from './components/Game';

function App() {
  const view = useStore((state) => state.view);

  if (view === 'MAIN_MENU') return <MainMenu />;
  if (view === 'GALLERY') return <Gallery />;
  if (view === 'SAVE_MENU' || view === 'LOAD_MENU') return <SaveLoadMenu />;

  // Default to GAME view
  return <Game />;
}

export default App;
