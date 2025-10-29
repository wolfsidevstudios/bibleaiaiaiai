import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, MoreVertical, User } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { SupabaseClip } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../contexts/AuthContext';


const UserClipCard: React.FC<{ clip: SupabaseClip }> = ({ clip }) => {
    const [isLiked, setIsLiked] = useState(false);
    
    return (
        <div className="relative w-full h-screen snap-center flex-shrink-0">
            <img
                src={clip.image_url}
                alt={clip.title || 'User clip'}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                    {clip.user_profile_picture ? (
                        <img src={clip.user_profile_picture} className="w-10 h-10 rounded-full border-2 border-white" alt={clip.user_name}/>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                            <User size={20} />
                        </div>
                    )}
                    <p className="font-bold">{clip.user_name || 'Anonymous'}</p>
                </div>
                <p className="text-sm">{clip.title}</p>
                {clip.verse_references && clip.verse_references.length > 0 && (
                     <div className="mt-2 text-xs bg-black/50 p-2 rounded-lg border border-white/20">
                        <p className="font-bold text-yellow-300">{clip.verse_references[0].reference}</p>
                        <p className="italic">"{clip.verse_references[0].text}"</p>
                     </div>
                )}
            </div>
            
            {/* Side Actions */}
            <div className="absolute bottom-24 right-2 flex flex-col items-center space-y-5">
                <button onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center text-white">
                    <Heart size={32} className={`transition-colors duration-300 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                    <span className="text-xs font-semibold mt-1">Like</span>
                </button>
                <button className="flex flex-col items-center text-white">
                    <MessageCircle size={32} />
                    <span className="text-xs font-semibold mt-1">Comment</span>
                </button>
                <button className="flex flex-col items-center text-white">
                    <Share2 size={32} />
                    <span className="text-xs font-semibold mt-1">Share</span>
                </button>
            </div>
        </div>
    );
};


const ClipsPage: React.FC = () => {
  const [clips, setClips] = useState<SupabaseClip[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchClips = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('clips')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching clips:', error);
      } else if (data) {
        setClips(data as SupabaseClip[]);
      }
      setLoading(false);
    };

    fetchClips();
  }, []);
  
  const welcomeClip: SupabaseClip = {
      id: 'welcome-clip',
      created_at: new Date().toISOString(),
      user_id: 'lexi-ai',
      image_url: 'https://images.pexels.com/photos/372327/pexels-photo-372327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: 'Welcome to the new Clips feed! Create and share your own inspirational content.',
      user_name: 'Lexi AI',
      user_profile_picture: '/logo.png',
      is_ai_generated: true,
      verse_references: [{text: "As iron sharpens iron, so one person sharpens another.", reference: "Proverbs 27:17"}]
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden">
        <header className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
            <Link to="/search" className="text-white bg-black/40 rounded-full p-2">
                <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold text-white" style={{textShadow: '1px 1px 3px #000'}}>Clips</h1>
            <div className="w-10"></div>
        </header>

        <div className="h-full w-full overflow-y-auto snap-y snap-mandatory">
            {loading ? (
                <div className="h-screen w-full flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : clips.length > 0 ? (
                <>
                  <UserClipCard clip={welcomeClip} />
                  {clips.map((clip) => <UserClipCard key={clip.id} clip={clip} />)}
                </>
            ) : (
                 <div className="h-screen w-full flex-shrink-0 snap-center flex flex-col items-center justify-center text-white text-center p-8">
                    <UserClipCard clip={welcomeClip} />
                </div>
            )}
        </div>
    </div>
  );
};

export default ClipsPage;