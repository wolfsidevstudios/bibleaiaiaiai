import React, { useEffect, useRef } from 'react';

interface VoiceVisualizerProps {
  stream: MediaStream | null;
  isPaused: boolean;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ stream, isPaused }) => {
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameId = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const numBars = 16;

  useEffect(() => {
    if (!stream) {
      analyserRef.current = null;
      return;
    };

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      animationFrameId.current = requestAnimationFrame(draw);

      if (!analyserRef.current || !dataArrayRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      barRefs.current.forEach((bar, i) => {
        if (!bar || !dataArrayRef.current) return;
        const dataIndex = Math.floor((i * analyserRef.current.frequencyBinCount) / numBars);
        const barHeight = isPaused ? 2 : Math.max(2, (dataArrayRef.current[dataIndex] / 255) * 100);
        bar.style.height = `${barHeight}%`;
      });
    };
    
    draw();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [stream]);
  
  // This effect handles the pause state separately to avoid re-creating the audio context
  useEffect(() => {
     if (isPaused) {
        barRefs.current.forEach(bar => {
            if (bar) bar.style.height = '2%';
        });
     }
  }, [isPaused]);


  return (
    <div className="flex items-center justify-center gap-1 h-[100px] w-[200px]">
      {Array.from({ length: numBars }).map((_, i) => (
        <div
          key={i}
          ref={el => barRefs.current[i] = el}
          className="w-2 bg-gradient-to-t from-yellow-500 to-bible-gold rounded-full"
          style={{ height: '2%', transition: 'height 0.1s ease-out' }}
        />
      ))}
    </div>
  );
};

export default VoiceVisualizer;
