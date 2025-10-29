import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, SwitchCamera, Upload } from 'lucide-react';

const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'image' | 'video'>('image');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setupCamera = async (mode: 'user' | 'environment') => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
      });
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  useEffect(() => {
    setupCamera(facingMode);
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [facingMode]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  
  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    stream?.getTracks().forEach(track => track.stop());
    navigate('/edit', { state: { imageDataUrl } });
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        stream?.getTracks().forEach(track => track.stop());
        navigate('/edit', { state: { imageDataUrl } });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col">
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/10" />

      {/* Header */}
      <header className="relative z-10 p-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="bg-black/50 rounded-full p-2">
          <X size={24} />
        </button>
        <button onClick={toggleCamera} className="bg-black/50 rounded-full p-2">
          <SwitchCamera size={24} />
        </button>
      </header>
      
      {/* Footer */}
      <footer className="relative z-10 mt-auto p-6 flex flex-col items-center">
        <div className="bg-black/50 backdrop-blur-md p-1 rounded-full flex items-center gap-1 text-sm font-semibold mb-6">
          <button 
            onClick={() => alert('Video coming soon!')}
            className={`px-6 py-2 rounded-full transition-colors ${mode === 'video' ? 'bg-white text-black' : 'text-white'}`}
          >
            Video
          </button>
          <button 
            onClick={() => setMode('image')}
            className={`px-6 py-2 rounded-full transition-colors ${mode === 'image' ? 'bg-white text-black' : 'text-white'}`}
          >
            Image
          </button>
        </div>
        
        <div className="w-full flex justify-center items-center">
            <div className="flex-1 flex justify-end">
                {/* Spacer */}
            </div>
            <button onClick={handleCapture} className="w-20 h-20 rounded-full bg-white border-4 border-black/50 flex items-center justify-center">
                <Camera size={40} className="text-black"/>
            </button>
            <div className="flex-1 flex justify-end">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden"/>
                <button onClick={() => fileInputRef.current?.click()} className="w-14 h-14 bg-black/50 border-2 border-white/50 rounded-2xl flex items-center justify-center">
                    <Upload size={24} />
                </button>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default CreatePage;
