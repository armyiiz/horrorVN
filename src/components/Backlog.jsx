import { useEffect, useRef } from 'react';
import { SCRIPT_DATA } from '../data/scriptData';

const Backlog = ({ history, onClose }) => {
  const scrollRef = useRef(null);

  // Filter only dialogue and narration nodes that have text
  const historyScenes = history
    .map(id => SCRIPT_DATA.find(s => s.id === id))
    .filter(s => s && (s.type === 'dialogue' || s.type === 'narration') && s.text);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col font-serif text-white animate-fade-in p-4 md:p-8 overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-6 border-b border-red-900 pb-4 shrink-0">
        <h2 className="text-3xl text-red-600 font-bold tracking-[0.2em] drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">LOG</h2>
        <button
          onClick={onClose}
          className="text-red-500 hover:text-white transition-colors text-sm font-bold px-6 py-2 border border-red-900 hover:bg-red-900/20 tracking-widest uppercase"
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 md:pr-4 space-y-6 custom-scrollbar">
        {historyScenes.length === 0 ? (
          <p className="text-gray-600 text-center italic mt-10">No history available yet.</p>
        ) : (
          historyScenes.map((scene, idx) => (
            <div key={`${scene.id}-${idx}`} className="border-l-2 border-gray-800 pl-4 py-2 hover:border-red-900 transition-colors group">
              {scene.speaker && (
                <div className="text-red-400 font-bold text-sm tracking-wider mb-1 uppercase group-hover:text-red-300 transition-colors">
                  {scene.speaker}
                </div>
              )}
              <p className="text-gray-400 group-hover:text-gray-200 leading-relaxed whitespace-pre-line transition-colors">
                {scene.text}
              </p>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default Backlog;
