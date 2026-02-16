import useStore from '../store';
import { SCRIPT_DATA } from '../data/scriptData';

const Gallery = () => {
  const setView = useStore((state) => state.setView);
  const unlockedGallery = useStore((state) => state.unlockedGallery);

  // Extract all CGs from SCRIPT_DATA
  const cgList = SCRIPT_DATA.filter((node) => node.cg_id).reduce((acc, curr) => {
    // Avoid duplicates
    if (!acc.find((item) => item.cg_id === curr.cg_id)) {
      acc.push({
        id: curr.cg_id,
        image: curr.bg_image,
        title: curr.cg_id.replace('cg_', '').replace(/_/g, ' ').toUpperCase()
      });
    }
    return acc;
  }, []);

  return (
    <div className="h-screen w-full bg-black text-white p-8 font-serif overflow-auto">
      <div className="flex justify-between items-center mb-8 border-b border-red-900 pb-4">
        <h2 className="text-4xl text-red-600 font-bold tracking-widest uppercase">
          Gallery
        </h2>
        <button
          onClick={() => setView('MAIN_MENU')}
          className="px-6 py-2 border border-red-800 text-red-500 hover:bg-red-900/20 transition-all uppercase tracking-widest text-sm"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cgList.map((cg) => {
          const isUnlocked = unlockedGallery.includes(cg.id);
          return (
            <div
              key={cg.id}
              className={`relative aspect-video border-2 transition-all duration-500 group
                ${isUnlocked
                  ? 'border-red-900 hover:border-red-500 hover:scale-105'
                  : 'border-gray-900 bg-gray-950'
                }`}
            >
              {isUnlocked ? (
                <>
                  <img
                    src={`/assets/bg/${cg.image}`}
                    alt={cg.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-black/70 p-2 text-center">
                    <span className="text-red-400 text-sm tracking-widest">{cg.title}</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-800">
                  <span className="text-4xl animate-pulse">🔒</span>
                </div>
              )}
            </div>
          );
        })}

        {cgList.length === 0 && (
          <div className="col-span-3 text-center text-gray-500 italic mt-12">
            No CGs found in script data yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
