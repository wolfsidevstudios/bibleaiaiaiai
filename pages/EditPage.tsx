import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { X, Type, Sticker, BookOpen } from 'lucide-react';

const EditPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageDataUrl } = (location.state as { imageDataUrl: string }) || {};

  if (!imageDataUrl) {
    // Redirect if no image data is present
    React.useEffect(() => {
      navigate('/create');
    }, [navigate]);
    return null;
  }

  const handleNext = () => {
    navigate('/publish', { state: { imageDataUrl } });
  };
  
  const handleToolClick = (tool: string) => {
      alert(`${tool} functionality is coming soon!`);
  }

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <header className="absolute top-0 left-0 p-4 z-10">
        <Link to="/create" className="bg-black/50 rounded-full p-2">
          <X size={24} />
        </Link>
      </header>
      
      <main className="flex-grow flex items-center justify-center w-full my-16">
        <img src={imageDataUrl} alt="User content to edit" className="max-w-full max-h-full rounded-lg object-contain" />
      </main>

      <footer className="w-full flex flex-col items-center gap-4">
        {/* Toolbar */}
        <div className="bg-black/50 backdrop-blur-md p-2 rounded-full flex items-center gap-2 text-sm font-semibold">
           <button onClick={() => handleToolClick('Text')} className="px-4 py-2 flex items-center gap-2 hover:bg-white/10 rounded-full"><Type size={16}/> Text</button>
           <button onClick={() => handleToolClick('Stickers')} className="px-4 py-2 flex items-center gap-2 hover:bg-white/10 rounded-full"><Sticker size={16}/> Stickers</button>
           <button onClick={() => handleToolClick('Verse')} className="px-4 py-2 flex items-center gap-2 hover:bg-white/10 rounded-full"><BookOpen size={16}/> Verse</button>
        </div>
        
        {/* Next Button */}
        <button onClick={handleNext} className="w-full max-w-sm bg-white text-black font-bold py-3 px-6 rounded-full">
          Next
        </button>
      </footer>
    </div>
  );
};

export default EditPage;
