import React, { useState, useEffect } from 'react';
import { Heart, Bookmark, Share2 } from 'lucide-react';
import { Clip } from '../types';
import { addClipBookmark, removeClipBookmark, isClipBookmarked } from '../services/storageService';

interface ClipCardProps {
  clip: Clip;
}

const ClipCard: React.FC<ClipCardProps> = ({ clip }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
    setIsSaved(isClipBookmarked(clip.id));
  }, [clip.id]);
  
  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering double tap
    if (isSaved) {
      removeClipBookmark(clip.id);
    } else {
      addClipBookmark(clip);
    }
    setIsSaved(!isSaved);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };
  
  const handleDoubleClick = () => {
      if(!isLiked) setIsLiked(true);
      
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
  };

  return (
    <div 
        className="relative w-full h-screen snap-center flex-shrink-0"
        onClick={handleDoubleClick}
    >
      <img
        src={clip.photo.src.large2x}
        alt={clip.photo.alt}
        className="w-full h-full object-cover rounded-xl"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10 rounded-xl" />
      
      {/* Centered Verse */}
      <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
        <div className="text-center">
            <p className="text-white text-4xl font-serif font-bold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
              “{clip.verse.text}”
            </p>
            <p className="text-yellow-300 text-lg mt-4" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
              {clip.verse.reference}
            </p>
        </div>
      </div>
      
      {/* Double Tap Heart Animation */}
      {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart size={100} className="text-white/80 animate-ping" style={{ animationDuration: '0.8s' }} />
          </div>
      )}

      {/* Side Actions */}
      <div className="absolute bottom-24 right-2 flex flex-col items-center space-y-5">
        <button onClick={handleToggleLike} className="flex flex-col items-center text-white">
          <Heart size={32} className={`transition-colors duration-300 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
          <span className="text-xs font-semibold mt-1">Like</span>
        </button>
        <button onClick={handleToggleBookmark} className="flex flex-col items-center text-white">
          <Bookmark size={32} className={`transition-colors duration-300 ${isSaved ? 'text-yellow-400 fill-current' : ''}`} />
          <span className="text-xs font-semibold mt-1">Save</span>
        </button>
        <button className="flex flex-col items-center text-white">
          <Share2 size={32} />
          <span className="text-xs font-semibold mt-1">Share</span>
        </button>
      </div>

       {/* Photographer Credit */}
      <div className="absolute bottom-4 left-4 text-white text-xs bg-black/50 px-2 py-1 rounded-full">
        Photo by <a href={clip.photo.photographer_url} target="_blank" rel="noopener noreferrer" className="underline">{clip.photo.photographer}</a> on Pexels
      </div>
    </div>
  );
};

export default ClipCard;
