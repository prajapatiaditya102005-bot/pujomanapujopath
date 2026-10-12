import React from 'react';
import { Sparkles } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0507] text-white">
      {/* Radiant Glowing Emblem */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-festive-ruby via-festive-crimson to-festive-maroon border-2 border-festive-gold flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.5)] animate-pulse">
          <span className="text-festive-gold font-serif font-black text-4xl">ॐ</span>
        </div>
        <div className="absolute -inset-2 rounded-full border border-dashed border-festive-gold/60 animate-spin" style={{ animationDuration: '10s' }} />
      </div>

      <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-festive-sand via-festive-gold to-yellow-200">
        Pujo Mana PujoPath
      </h1>

      <p className="text-sm font-serif italic text-festive-sand font-medium mt-2">
        Celebrate Maa Durga. Explore Kolkata. Get Stuck Less.
      </p>

      {/* Loading Bar with Festive Gold Pulsing */}
      <div className="w-56 h-1.5 bg-festive-maroon/60 rounded-full mt-6 overflow-hidden border border-festive-gold/30">
        <div className="w-full h-full bg-gradient-to-r from-festive-ruby via-festive-gold to-yellow-300 rounded-full animate-wave" />
      </div>

      <div className="mt-4 flex items-center space-x-1.5 text-xs text-festive-cream/70">
        <Sparkles className="w-3.5 h-3.5 text-festive-gold animate-spin" style={{ animationDuration: '3s' }} />
        <span>Loading Kolkata Durga Puja Pandals &amp; Transit Routes...</span>
      </div>
    </div>
  );
}
