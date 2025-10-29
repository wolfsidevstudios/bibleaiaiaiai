import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenaiBlob } from '@google/genai';
import { ArrowLeft, Mic, Pause, PhoneOff } from 'lucide-react';
import VoiceVisualizer from '../components/VoiceVisualizer';

// Fix: Add webkitAudioContext to the Window interface to support older Safari versions.
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

// --- Audio & Base64 Helper Functions ---

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): GenaiBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}


const LiveAiPage: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [statusText, setStatusText] = useState('Initializing...');
    const [visualizerStream, setVisualizerStream] = useState<MediaStream | null>(null);

    const sessionPromiseRef = useRef<any>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    const aiRef = useRef<GoogleGenAI | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const isListeningRef = useRef(isListening);
    const navigate = useNavigate();

    useEffect(() => {
        isListeningRef.current = isListening;
    }, [isListening]);

    const stopSession = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then((session: any) => session.close());
            sessionPromiseRef.current = null;
        }

        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        setVisualizerStream(null);

        if (mediaStreamSourceRef.current && scriptProcessorRef.current) {
            mediaStreamSourceRef.current.disconnect(scriptProcessorRef.current);
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }

        inputAudioContextRef.current?.close().catch(console.error);
        outputAudioContextRef.current?.close().catch(console.error);
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;

        setIsListening(false);
        setStatusText('Session ended. Tap mic to start again.');
    }, []);


    const startSession = useCallback(async () => {
        if (!mediaStreamRef.current) {
            console.error("Mic stream not available.");
            setStatusText('Microphone not available.');
            return;
        }
        
        setStatusText('Connecting to Lexi...');
        aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        inputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });

        sessionPromiseRef.current = aiRef.current.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    setStatusText('Connection open. Speak now.');
                    const source = inputAudioContextRef.current!.createMediaStreamSource(mediaStreamRef.current!);
                    mediaStreamSourceRef.current = source;
                    const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current = scriptProcessor;

                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        if (!isListeningRef.current) return;
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        
                        sessionPromiseRef.current?.then((session: any) => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContextRef.current!.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                    if (base64EncodedAudioString && outputAudioContextRef.current) {
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                        const audioBuffer = await decodeAudioData(
                            decode(base64EncodedAudioString),
                            outputAudioContextRef.current,
                            24000,
                            1,
                        );
                        const source = outputAudioContextRef.current.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputAudioContextRef.current.destination);
                        source.addEventListener('ended', () => {
                            sourcesRef.current.delete(source);
                        });

                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
                        sourcesRef.current.add(source);
                    }

                    const interrupted = message.serverContent?.interrupted;
                    if (interrupted) {
                        for (const source of sourcesRef.current.values()) {
                            source.stop();
                            sourcesRef.current.delete(source);
                        }
                        nextStartTimeRef.current = 0;
                    }
                },
                onerror: (e: ErrorEvent) => {
                    console.error('Session error:', e);
                    setStatusText('An error occurred. Please try again.');
                    stopSession();
                },
                onclose: () => {
                    console.log('Session closed');
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
            },
        });
    }, [stopSession]);

    useEffect(() => {
        const getMic = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaStreamRef.current = stream;
                setVisualizerStream(stream);
                setStatusText('Tap mic to start conversation');
            } catch (err) {
                console.error("Error accessing microphone:", err);
                setStatusText('Microphone access denied.');
            }
        };
        getMic();

        return () => {
            stopSession();
        };
    }, [stopSession]);
    
    useEffect(() => {
        if (isListening) {
             if (!sessionPromiseRef.current) {
                startSession();
             } else {
                setStatusText("Listening...");
             }
        } else {
             if (sessionPromiseRef.current) {
                setStatusText("Paused. Tap mic to resume.");
             }
        }
    }, [isListening, startSession]);


    const handleToggleListening = () => {
        if (!mediaStreamRef.current) return;
        setIsListening(prev => !prev);
    };
    
    const handleEndCall = () => {
        stopSession();
    };
    
    const handleGoBack = () => {
      stopSession();
      navigate('/assistant');
    };

    return (
        <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-between p-6 overflow-hidden">
            <header className="w-full flex justify-start">
                <button onClick={handleGoBack} className="bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-colors">
                    <ArrowLeft size={24} />
                </button>
            </header>

            <main className="flex flex-col items-center justify-center text-center flex-grow">
                <VoiceVisualizer stream={visualizerStream} isPaused={!isListening} />
                <p className="mt-8 text-lg text-gray-300 h-8 transition-opacity duration-300">{statusText}</p>
            </main>

            <footer className="flex items-center space-x-6">
                <button
                    onClick={handleToggleListening}
                    className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                    disabled={!visualizerStream}
                >
                    {isListening ? <Pause size={36} className="fill-current" /> : <Mic size={36} />}
                </button>
                <button
                    onClick={handleEndCall}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                    disabled={!sessionPromiseRef.current}
                >
                    <PhoneOff size={28} />
                </button>
            </footer>
        </div>
    );
};

export default LiveAiPage;