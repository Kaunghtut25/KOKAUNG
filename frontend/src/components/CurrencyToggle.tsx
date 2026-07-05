'use client';

import React from 'react';

interface CurrencyToggleProps {
  activeCurrency: 'MMK' | 'USD';
  onToggle: (currency: 'MMK' | 'USD') => void;
}

export default function CurrencyToggle({ activeCurrency, onToggle }: CurrencyToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-gold/30 overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle('MMK')}
        className={`px-4 py-2 text-xs font-semibold transition-all duration-200 ${
          activeCurrency === 'MMK'
            ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 shadow-sm'
            : 'bg-transparent text-gold hover:bg-gold/10'
        }`}
      >
        MMK
      </button>
      <button
        type="button"
        onClick={() => onToggle('USD')}
        className={`px-4 py-2 text-xs font-semibold transition-all duration-200 ${
          activeCurrency === 'USD'
            ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 shadow-sm'
            : 'bg-transparent text-gold hover:bg-gold/10'
        }`}
      >
        USD
      </button>
    </div>
  );
}
