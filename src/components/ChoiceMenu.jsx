const ChoiceMenu = ({ choices, onChoice }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col space-y-6 w-full max-w-2xl px-8">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={(e) => {
                 e.stopPropagation();
                 onChoice(index);
            }}
            className="
              group relative
              py-6 px-12
              border-2 border-red-900
              bg-black/80
              text-white text-xl md:text-2xl font-serif tracking-widest
              hover:bg-red-900/40 hover:border-red-500
              transition-all duration-300
              overflow-hidden
              uppercase
              shadow-[0_0_20px_rgba(0,0,0,0.8)]
            "
          >
            <span className="relative z-10 group-hover:text-red-200 transition-colors drop-shadow-md">
              {choice.label}
            </span>
            {/* Hover effect background */}
            <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/20 transform -skew-x-12 transition-all duration-300"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChoiceMenu;
