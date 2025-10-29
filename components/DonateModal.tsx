import React, { useState } from 'react';
import { X } from 'lucide-react';

interface DonateModalProps {
  onClose: () => void;
}

const DonateModal: React.FC<DonateModalProps> = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('Supporting Lexi Bible AI!');
  const venmoUser = 'rocioramirezpena';

  const venmoLink = `https://venmo.com/${venmoUser}?txn=pay&amount=${amount}&note=${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-gray-700 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center mb-2">Support Lexi Bible AI</h2>
        <p className="text-gray-400 text-center text-sm mb-6">Your donation helps cover our AI and database costs. Thank you for your support!</p>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 5.00"
            className="w-full bg-gray-800 text-white p-3 rounded-lg border-2 border-gray-700 focus:border-yellow-500 focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message (optional)</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="w-full bg-gray-800 text-white p-3 rounded-lg border-2 border-gray-700 focus:border-yellow-500 focus:outline-none resize-none"
          />
        </div>

        <a
          href={amount ? venmoLink : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full text-center font-bold py-3 px-6 rounded-lg transition-opacity ${!amount ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-400'}`}
          onClick={(e) => { if (!amount) e.preventDefault(); }}
        >
          Donate with Venmo
        </a>
      </div>
    </div>
  );
};

export default DonateModal;
