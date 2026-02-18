import { useEffect, useState } from 'react';
import { SCRIPT_DATA } from '../data/scriptData';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const imagesToLoad = new Set();

    SCRIPT_DATA.forEach(scene => {
      // Backgrounds
      if (scene.bg_image) {
        imagesToLoad.add(`/assets/bg/${scene.bg_image}`);
      }

      // Characters
      if (scene.char_image) {
        imagesToLoad.add(`/assets/chars/${scene.char_image}`);
      } else if (scene.speaker) {
        // Only preload character sprites for single speakers to avoid complex logic issues
        // In a real app we might want a more robust way to list all assets
        if (!scene.speaker.includes('&')) {
            const speaker = scene.speaker.toLowerCase();
            const expression = scene.expression ? scene.expression.toLowerCase() : 'neutral';
            imagesToLoad.add(`/assets/chars/${speaker}/${expression}.webp`);
        }
      }

      // CGs
      if (scene.cg_id) {
           imagesToLoad.add(`/assets/cg/${scene.cg_id}.webp`);
      }
    });

    const totalImages = imagesToLoad.size;
    if (totalImages === 0) {
      onComplete();
      return;
    }

    let loadedCount = 0;
    const updateProgress = () => {
      loadedCount++;
      const percentage = Math.floor((loadedCount / totalImages) * 100);
      setProgress(percentage);
      if (loadedCount >= totalImages) {
        setTimeout(onComplete, 500);
      }
    };

    imagesToLoad.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = updateProgress;
      img.onerror = (e) => {
          console.warn(`Failed to preload: ${src}`, e);
          updateProgress();
      };
    });

  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[999] flex flex-col items-center justify-center font-serif text-white">
      <h2 className="text-2xl mb-4 tracking-widest text-red-600 animate-pulse">LOADING RESOURCES</h2>
      <div className="w-64 h-2 bg-gray-900 border border-red-900 overflow-hidden">
        <div
          className="h-full bg-red-600 transition-all duration-300 ease-out shadow-[0_0_10px_red]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-red-500 font-mono text-xs">{progress}%</p>
    </div>
  );
};

export default Preloader;
