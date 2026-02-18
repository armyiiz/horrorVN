import { useState, useEffect, useRef } from 'react';

const Typewriter = ({ text, onComplete, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText('');

    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const typeChar = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
        // Randomize speed slightly for realism
        const currentSpeed = speed + (Math.random() * 20 - 10);
        timeoutRef.current = setTimeout(typeChar, currentSpeed);
      } else {
        if (onComplete) onComplete();
      }
    };

    timeoutRef.current = setTimeout(typeChar, speed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, onComplete]);

  return (
    <>
      {displayedText}
      <span className="inline-block w-2.5 h-6 bg-red-600 ml-1 animate-pulse align-middle shadow-[0_0_10px_red]"></span>
    </>
  );
};

export default Typewriter;
