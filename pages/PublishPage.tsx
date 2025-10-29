import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { AuthContext } from '../contexts/AuthContext';
import { ArrowLeft, MapPin, Sparkle, Tag } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const IMAGE_HOST_API_KEY = '309a8874be3e44b98aa71f2a63d406eb';

async function uploadImage(imageDataUrl: string): Promise<string | null> {
    try {
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('image', blob);

        const uploadResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMAGE_HOST_API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) {
            console.error('Image upload failed:', await uploadResponse.text());
            return null;
        }

        const result = await uploadResponse.json();
        
        if (result.success && result.data && result.data.url) {
            return result.data.url;
        } else {
            console.error('Image upload failed. API response:', result);
            return null;
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}


const PublishPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useContext(AuthContext);
    const { imageDataUrl } = (location.state as { imageDataUrl: string }) || {};

    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!imageDataUrl) {
        React.useEffect(() => navigate('/create'), [navigate]);
        return null;
    }

    const handlePublish = async () => {
        if (!auth?.user?.id) {
            alert('You must be logged in to publish.');
            return;
        }
        setIsLoading(true);

        const imageUrl = await uploadImage(imageDataUrl);
        if (!imageUrl) {
            alert('Failed to upload image. Please try again.');
            setIsLoading(false);
            return;
        }

        const { error } = await supabase.from('clips').insert({
            user_id: auth.user.id,
            title: title,
            image_url: imageUrl,
            user_name: auth.user.name,
            user_profile_picture: auth.user.picture,
        });

        setIsLoading(false);
        if (error) {
            console.error('Error publishing clip:', error);
            alert(`Failed to publish clip. Ensure you have run the provided SQL script in your Supabase project, including the Row Level Security policies. Error: ${error.message}`);
        } else {
            alert('Published successfully!');
            navigate('/clips');
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-900 text-white flex flex-col">
            <header className="p-4 flex items-center gap-4 border-b border-gray-800">
                <button onClick={() => navigate(-1)} className="text-white">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">New Post</h1>
            </header>
            
            <main className="flex-grow p-4 space-y-4">
                <div className="flex gap-4">
                    <img src={imageDataUrl} alt="Preview" className="w-24 h-32 object-cover rounded-lg" />
                    <textarea 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Write a title..."
                        className="w-full h-32 bg-gray-800 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                    />
                </div>

                <button className="w-full flex items-center gap-3 p-3 bg-gray-800 rounded-lg text-left">
                    <MapPin className="text-gray-400"/>
                    <span>Add Location</span>
                </button>
                 <button className="w-full flex items-center gap-3 p-3 bg-gray-800 rounded-lg text-left">
                    <Sparkle className="text-gray-400"/>
                    <span>Made with AI</span>
                </button>
                 <button className="w-full flex items-center gap-3 p-3 bg-gray-800 rounded-lg text-left">
                    <Tag className="text-gray-400"/>
                    <span>Tag Bible Verses</span>
                </button>
            </main>

            <footer className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/')}
                        disabled={isLoading}
                        className="w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handlePublish}
                        disabled={isLoading}
                        className="w-full bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg disabled:bg-gray-600 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <LoadingSpinner className="border-black"/> : 'Publish'}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default PublishPage;