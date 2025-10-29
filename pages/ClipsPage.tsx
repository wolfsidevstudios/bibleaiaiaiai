import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchPhotos } from '../services/pexelsService';
import { Clip } from '../types';
import { CLIP_VERSES } from '../data/clipVerses';
import ClipCard from '../components/ClipCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ClipsPage: React.FC = () => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver>();
  const lastClipElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadClips = useCallback(async () => {
    setLoading(true);
    const data = await fetchPhotos(page);
    if (data && data.photos.length > 0) {
      const newClips = data.photos.map((photo, index) => {
        const verseIndex = (clips.length + index) % CLIP_VERSES.length;
        return {
          id: `${photo.id}-${verseIndex}`,
          photo: photo,
          verse: CLIP_VERSES[verseIndex]
        };
      });
      setClips(prev => [...prev, ...newClips]);
      setHasMore(data.photos.length > 0);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  }, [page, clips.length]);

  useEffect(() => {
    loadClips();
  }, [page]); // Removed loadClips from dependency array as it causes infinite loop with useCallback

  return (
    <div className="relative h-screen bg-black overflow-hidden">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
            <Link to="/search" className="text-white bg-black/40 rounded-full p-2">
                <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold text-white" style={{textShadow: '1px 1px 3px #000'}}>Clips</h1>
            <div className="w-10"></div>
        </header>

        {/* Feed Container */}
        <div className="h-full w-full overflow-y-auto snap-y snap-mandatory rounded-xl">
            {clips.map((clip, index) => {
                if (clips.length === index + 1) {
                    return (
                        <div ref={lastClipElementRef} key={clip.id}>
                            <ClipCard clip={clip} />
                        </div>
                    );
                }
                return <ClipCard key={clip.id} clip={clip} />;
            })}
             {loading && (
                <div className="h-screen w-full flex-shrink-0 snap-center flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            )}
            {!hasMore && clips.length > 0 &&(
                 <div className="h-screen w-full flex-shrink-0 snap-center flex flex-col items-center justify-center text-white">
                    <p className="text-lg font-semibold">You've reached the end</p>
                    <p className="text-gray-400">Come back later for more inspiration.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ClipsPage;
