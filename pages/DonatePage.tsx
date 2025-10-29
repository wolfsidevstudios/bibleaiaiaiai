import React, { useState } from 'react';
import { Minus, Plus, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DonatePage: React.FC = () => {
  const [step, setStep] = useState<'setup' | 'spin'>('setup');
  const [wheelAmounts, setWheelAmounts] = useState<number[]>([10, 25, 50, 100]);
  const [newAmount, setNewAmount] = useState('');
  const [currentDonation, setCurrentDonation] = useState<number>(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();

  const handleAddAmount = () => {
    const amount = parseInt(newAmount, 10);
    if (!isNaN(amount) && amount > 0 && !wheelAmounts.includes(amount)) {
      setWheelAmounts([...wheelAmounts, amount].sort((a, b) => a - b));
      setNewAmount('');
    }
  };

  const handleRemoveAmount = (amountToRemove: number) => {
    setWheelAmounts(wheelAmounts.filter(amount => amount !== amountToRemove));
  };
  
  const handleStart = () => {
    if (wheelAmounts.length > 0) {
        setCurrentDonation(wheelAmounts[Math.floor(Math.random() * wheelAmounts.length)]);
        setStep('spin');
    } else {
        alert("Please add at least one amount to the wheel.");
    }
  };

  const handleSpin = () => {
    if (isSpinning || wheelAmounts.length < 1) return;
    setIsSpinning(true);

    const spinDuration = 2000; // 2 seconds
    const intervalTime = 50;
    const spinInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * wheelAmounts.length);
        setCurrentDonation(wheelAmounts[randomIndex]);
    }, intervalTime);

    setTimeout(() => {
        clearInterval(spinInterval);
        const finalIndex = Math.floor(Math.random() * wheelAmounts.length);
        setCurrentDonation(wheelAmounts[finalIndex]);
        setIsSpinning(false);
    }, spinDuration);
  };
  
  const handleAmountChange = (delta: number) => {
      setCurrentDonation(prev => Math.max(1, prev + delta));
  };

  const venmoLink = `https://venmo.com/rocioramirezpena?txn=pay&amount=${currentDonation}&note=${encodeURIComponent("Donation to Lexi Bible AI")}`;

  const commonWrapperClasses = "fixed inset-0 z-50 h-screen w-screen bg-[#FEFBF4] text-[#333] flex flex-col p-6 font-sans";

  if (step === 'setup') {
    return (
      <div className={commonWrapperClasses}>
        <header className="flex justify-between items-center">
            <h1 className="text-xl font-bold">GiveDirectly</h1>
            <button onClick={() => navigate(-1)} className="p-2 -m-2"><X size={24} /></button>
        </header>
        <main className="flex-grow flex flex-col justify-center text-center">
            <h2 className="text-3xl font-bold mb-4">Set Donation Amounts</h2>
            <p className="text-gray-600 mb-8">Enter amounts for the donation wheel.</p>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {wheelAmounts.map(amount => (
                    <div key={amount} className="bg-gray-200 rounded-full px-4 py-2 flex items-center gap-2">
                        <span>${amount}</span>
                        <button onClick={() => handleRemoveAmount(amount)} className="text-gray-500 hover:text-red-500">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddAmount(); }} className="flex gap-2 mb-8 max-w-sm mx-auto">
                <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="e.g., 20"
                    className="w-full bg-white border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-yellow-500"
                />
                <button type="submit" className="bg-yellow-500 text-black font-bold p-3 rounded-lg flex-shrink-0">Add</button>
            </form>
            
            <button 
                onClick={handleStart} 
                disabled={wheelAmounts.length === 0}
                className="w-full max-w-sm mx-auto bg-black text-white font-bold py-4 px-6 rounded-xl disabled:bg-gray-400">
                Start
            </button>
        </main>
      </div>
    );
  }

  return (
    <div className={`${commonWrapperClasses} items-center justify-between overflow-hidden`}>
        <header className="w-full flex justify-between items-center">
            <button onClick={() => navigate('/')} className="p-2 -m-2 text-[#333]">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">GiveDirectly</h1>
            <div className="w-10"></div> {/* Spacer to keep title centered */}
        </header>

        <main className="flex flex-col items-center justify-center flex-grow relative w-full -mt-16">
            {/* Decoration particles */}
            <div className="absolute top-[10%] left-[10%] w-2 h-2 bg-black/50 rounded-full animate-pulse"></div>
            <div className="absolute top-[25%] right-[15%] w-3 h-3 bg-black/50 rounded-full animate-pulse delay-500"></div>
            <div className="absolute bottom-[30%] left-[20%] w-2 h-2 bg-black/50 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-[15%] right-[10%] w-4 h-4 bg-black/50 rounded-full animate-pulse delay-750"></div>


            <div className="relative mb-8 h-24 w-48">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48">
                    <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
                        <p className="text-4xl font-bold">${currentDonation}</p>
                        <p className="text-gray-500 text-sm">Your Donation</p>
                    </div>
                    {/* Speech bubble pointer */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[99%] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-white"></div>
                </div>
            </div>

            <div className="relative">
                {/* Pin */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-8 bg-orange-400 rounded-t-full rounded-b-sm flex items-center justify-center z-10">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                 <a
                    href={venmoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-64 h-64 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold text-center shadow-2xl shadow-orange-500/50"
                >
                    <div className="absolute inset-0 animate-pulse rounded-full border-4 border-yellow-300 opacity-50"></div>
                    {/* Radial lines */}
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-2 bg-yellow-300 rounded-full"
                            style={{
                                transform: `rotate(${i * 15}deg) translate(140px)`,
                                transformOrigin: '0 0',
                                top: '50%',
                                left: '50%',
                            }}
                        ></div>
                    ))}
                    <span style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>DONATE NOW</span>
                </a>
            </div>
        </main>
        
        <footer className="w-full flex justify-center items-center gap-4">
            <button onClick={() => handleAmountChange(-10)} className="w-14 h-14 bg-[#333] text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg" aria-label="Decrease donation amount by 10">
                -
            </button>
            <button onClick={handleSpin} disabled={isSpinning || wheelAmounts.length < 1} className="bg-[#333] text-white font-semibold py-4 px-8 rounded-full shadow-lg disabled:bg-gray-500">
                SPIN AGAIN
            </button>
            <button onClick={() => handleAmountChange(10)} className="w-14 h-14 bg-[#333] text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg" aria-label="Increase donation amount by 10">
                +
            </button>
        </footer>
    </div>
  );
};

export default DonatePage;