import React, { useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

const GOOGLE_CLIENT_ID = '127898517822-51krks83ufsu7i9ur23hpcmigu1ja9ff.apps.googleusercontent.com';

// Fix: Declare the google object on the window to satisfy TypeScript and fix errors on lines 14, 24, and 30.
declare global {
  interface Window {
    google: any;
  }
}

const AuthPage: React.FC = () => {
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof window.google === 'undefined') {
            console.error("Google Identity Services script not loaded.");
            return;
        }

        const handleCredentialResponse = (response: any) => {
            auth?.login(response.credential);
            navigate('/', { replace: true });
        };

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
        });

        if (googleButtonRef.current) {
            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                { theme: "outline", size: "large", type: "standard", text: "continue_with", shape: "pill" } 
            );
        }
    }, [auth, navigate]);


    return (
        <div className="bg-black text-white min-h-screen flex flex-col items-center p-6">
            <header className="flex flex-col items-center space-y-4 my-16">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                    <BookOpen size={36} className="text-black" />
                </div>
                <h1 className="text-2xl font-bold">Lexi Bible AI</h1>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center w-full max-w-sm text-center">
                <h2 className="text-3xl font-bold">Create Account</h2>
                <p className="text-gray-400 mt-2 mb-12">
                    To create an account, please sign in with your Google account.
                </p>

                <div ref={googleButtonRef} className="flex justify-center"></div>

            </main>

            <footer className="py-4">
                <p className="text-gray-400">
                    Already have an account?{' '}
                    <span className="font-bold text-white cursor-pointer" onClick={() => googleButtonRef.current?.querySelector('div')?.click()}>
                        Log In
                    </span>
                </p>
            </footer>
        </div>
    );
};

export default AuthPage;