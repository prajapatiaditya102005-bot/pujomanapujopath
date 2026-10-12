import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Bus, Download, Sparkles, ShieldCheck, Volume2 } from 'lucide-react';
import { dhakPlayer } from '../utils/dhakAudio';

export default function HeroDurga({ onExploreMap, onPlanRoute, onOpenGuides, onOpenTransit }) {
  const [dhakPlaying, setDhakPlaying] = useState(false);

  useEffect(() => {
    return dhakPlayer.subscribe((playing) => {
      setDhakPlaying(playing);
    });
  }, []);

  const handleToggleDhak = () => {
    dhakPlayer.toggle(20000);
  };
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24 bg-gradient-to-b from-[#14080b] via-[#1d0b11] to-[#12070a] border-b border-festive-gold/20">
      {/* Background Animated Particle Halo & Radiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-gradient-to-tr from-festive-crimson/25 via-festive-gold/15 to-festive-ruby/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute -top-10 left-10 w-72 h-72 bg-festive-gold/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-festive-ruby/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand, Tagline, Value Proposition, Action CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-festive-maroon/80 border border-festive-gold/40 shadow-inner">
              <Sparkles className="w-4 h-4 text-festive-lightgold animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-festive-sand">
                Official Durga Puja Travel Companion 2026
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-serif font-black tracking-tight leading-tight text-white drop-shadow-md">
                Pujo Mana{' '}
                <span className="bg-gradient-to-r from-festive-sand via-festive-gold to-yellow-300 bg-clip-text text-transparent underline decoration-festive-crimson decoration-wavy decoration-2">
                  PujoPath
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-serif font-bold text-festive-sand tracking-wide">
                Celebrate Maa Durga. Explore Kolkata. Get Stuck Less.
              </p>
            </div>

            <p className="text-sm sm:text-base text-festive-cream/85 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              The definitive Durga Puja travel guide for Kolkata, West Bengal. Discover legendary pandals across 
              <strong className="text-festive-lightgold font-semibold"> North, South, and Central Kolkata</strong>, explore bus &amp; metro transit schedules, and plan optimal routes with our embedded interactive map.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={onExploreMap}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-festive-ruby via-festive-crimson to-festive-maroon hover:from-red-700 hover:to-festive-ruby text-white font-semibold text-sm sm:text-base shadow-lg shadow-festive-crimson/30 border border-festive-gold/50 flex items-center space-x-2.5 transform active:scale-95 transition-all"
              >
                <MapPin className="w-4 h-4 text-festive-gold" />
                <span>Explore Interactive Map</span>
              </button>

              <button
                onClick={onPlanRoute}
                className="px-5 py-3 rounded-xl bg-[#2a131a] hover:bg-[#381a23] text-festive-sand font-semibold text-sm sm:text-base border border-festive-gold/40 flex items-center space-x-2.5 transform active:scale-95 transition-all shadow-md"
              >
                <Navigation className="w-4 h-4 text-festive-gold" />
                <span>Plan My Puja Night</span>
              </button>

              <button
                onClick={onOpenTransit}
                className="px-4 py-3 rounded-xl bg-festive-night/80 hover:bg-[#200e14] text-festive-cream text-xs sm:text-sm font-medium border border-festive-gold/25 flex items-center space-x-2 transition-all"
              >
                <Bus className="w-4 h-4 text-festive-gold" />
                <span>60+ Bus Routes</span>
              </button>

              <button
                onClick={onOpenGuides}
                className="px-4 py-3 rounded-xl bg-festive-night/80 hover:bg-[#200e14] text-festive-cream text-xs sm:text-sm font-medium border border-festive-gold/25 flex items-center space-x-2 transition-all"
              >
                <Download className="w-4 h-4 text-festive-gold" />
                <span>Download Translated PDFs</span>
              </button>
            </div>

            {/* Trust and Feature Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left border-t border-festive-gold/20">
              <div className="p-2.5 rounded-lg bg-festive-maroon/30 border border-festive-gold/15">
                <div className="text-xl sm:text-2xl font-serif font-bold text-festive-gold">47+</div>
                <div className="text-[11px] text-festive-sand/80 font-medium">Iconic Pandals</div>
              </div>
              <div className="p-2.5 rounded-lg bg-festive-maroon/30 border border-festive-gold/15">
                <div className="text-xl sm:text-2xl font-serif font-bold text-festive-gold">64+</div>
                <div className="text-[11px] text-festive-sand/80 font-medium">Bus Routes Cataloged</div>
              </div>
              <div className="p-2.5 rounded-lg bg-festive-maroon/30 border border-festive-gold/15">
                <div className="text-xl sm:text-2xl font-serif font-bold text-festive-gold">12+</div>
                <div className="text-[11px] text-festive-sand/80 font-medium">Metro Interchanges</div>
              </div>
              <div className="p-2.5 rounded-lg bg-festive-maroon/30 border border-festive-gold/15">
                <div className="text-xl sm:text-2xl font-serif font-bold text-festive-gold flex items-center justify-center sm:justify-start space-x-1">
                  <span>100%</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 inline" />
                </div>
                <div className="text-[11px] text-festive-sand/80 font-medium">Real Coordinates</div>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Maa Durga Deity Visual Artwork */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              
              {/* Outer Golden Aura Mandala Rings */}
              <div className="absolute inset-0 rounded-full border border-festive-gold/25 animate-spin" style={{ animationDuration: '50s' }} />
              <div className="absolute inset-4 rounded-full border border-dashed border-festive-gold/40 animate-spin" style={{ animationDuration: '35s', animationDirection: 'reverse' }} />
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-festive-ruby/30 via-festive-maroon/40 to-festive-night border-2 border-festive-gold/60 shadow-2xl flex items-center justify-center overflow-hidden">
                
                {/* Radiant Ray Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 400 400">
                  {[...Array(16)].map((_, i) => (
                    <line
                      key={i}
                      x1="200"
                      y1="200"
                      x2={200 + 190 * Math.cos((i * Math.PI) / 8)}
                      y2={200 + 190 * Math.sin((i * Math.PI) / 8)}
                      stroke="#F59E0B"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>

                {/* Central Maa Durga Iconic Sacred Motif (Trinayan + Trishul + Mukut) */}
                <svg className="w-64 h-64 sm:w-72 sm:h-72 relative z-10 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]" viewBox="0 0 200 200" fill="none">
                  {/* Ornate Mukut (Crown) */}
                  <path d="M70 65 L100 22 L130 65 Q115 55 100 58 Q85 55 70 65 Z" fill="url(#crownGold)" stroke="#FEF3C7" strokeWidth="1.5" />
                  <circle cx="100" cy="22" r="4" fill="#DC2626" stroke="#FBBF24" strokeWidth="1" />
                  <path d="M85 58 Q100 45 115 58" stroke="#DC2626" strokeWidth="2" fill="none" />

                  {/* Golden Trishul (Trident) extending upwards */}
                  <g className="animate-glow-pulse">
                    <line x1="100" y1="15" x2="100" y2="185" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                    <path d="M100 40 C75 40 70 20 70 16 C70 34 85 62 100 68" stroke="#FBBF24" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M100 40 C125 40 130 20 130 16 C130 34 115 62 100 68" stroke="#FBBF24" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <circle cx="100" cy="68" r="4.5" fill="#B91C1C" stroke="#F59E0B" strokeWidth="1.5" />
                  </g>

                  {/* Divine Trinayan (Third Eye on Forehead) */}
                  <g>
                    <path d="M82 85 Q100 70 118 85 Q100 100 82 85 Z" fill="#FBBF24" stroke="#B91C1C" strokeWidth="2" />
                    <ellipse cx="100" cy="85" rx="5" ry="5.5" fill="#7F1D1D" />
                    <circle cx="100" cy="74" r="3.5" fill="#DC2626" />
                  </g>

                  {/* Traditional Eyes of Maa Durga */}
                  {/* Left Eye */}
                  <g className="animate-flicker">
                    <path d="M52 110 Q75 90 95 112 Q72 122 52 110 Z" fill="#FFFDF7" stroke="#991B1B" strokeWidth="2" />
                    <ellipse cx="74" cy="110" rx="7" ry="7" fill="#1C1014" />
                    <circle cx="75" cy="108" r="2.5" fill="#FFFFFF" />
                    <path d="M45 106 Q72 80 97 106" stroke="#4C0519" strokeWidth="2.5" fill="none" />
                  </g>

                  {/* Right Eye */}
                  <g className="animate-flicker">
                    <path d="M105 112 Q125 90 148 110 Q128 122 105 112 Z" fill="#FFFDF7" stroke="#991B1B" strokeWidth="2" />
                    <ellipse cx="126" cy="110" rx="7" ry="7" fill="#1C1014" />
                    <circle cx="127" cy="108" r="2.5" fill="#FFFFFF" />
                    <path d="M103 106 Q128 80 155 106" stroke="#4C0519" strokeWidth="2.5" fill="none" />
                  </g>

                  {/* Red Chandan Bindi & Ornate Motifs */}
                  <circle cx="100" cy="98" r="4" fill="#DC2626" />
                  <path d="M88 128 Q100 138 112 128" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  
                  {/* Traditional Nose Ring (Nath) */}
                  <circle cx="95" cy="124" r="7" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                  <circle cx="91" cy="128" r="1.5" fill="#DC2626" />

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="crownGold" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FBBF24" />
                      <stop offset="50%" stopColor="#D97706" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                </svg>

              </div>

              {/* Floating Animated Diya Lamps with Flickering Glow */}
              <div className="absolute -bottom-3 left-6 bg-festive-maroon/90 p-2.5 rounded-full border border-festive-gold/60 shadow-lg flex items-center space-x-2 animate-float-slow">
                <span className="text-xl">🪔</span>
                <span className="text-[11px] font-semibold text-festive-sand">Subho Utsav</span>
              </div>

              <button
                type="button"
                onClick={handleToggleDhak}
                className={`absolute -top-2 right-4 p-2.5 rounded-full border shadow-xl flex items-center space-x-2 transition-all cursor-pointer z-20 ${
                  dhakPlaying
                    ? 'bg-festive-ruby border-festive-gold text-yellow-300 animate-bounce shadow-festive-crimson/60 scale-105'
                    : 'bg-festive-maroon/90 hover:bg-festive-ruby/80 border-festive-gold/60 text-festive-sand animate-float-slow hover:scale-105'
                }`}
                style={{ animationDelay: '1.5s' }}
                title={dhakPlaying ? 'Click to stop music' : 'Click to play festive music'}
                aria-label="Toggle festive music"
              >
                <span className="text-xl">🪘</span>
                <span className="text-[11px] font-bold text-festive-sand">
                  {dhakPlaying ? 'Playing' : 'Festive Beats'}
                </span>
                {dhakPlaying && (
                  <span className="flex space-x-0.5 items-end h-3">
                    <span className="w-0.5 h-3 bg-yellow-300 animate-ping"></span>
                    <span className="w-0.5 h-2 bg-yellow-400 animate-pulse"></span>
                  </span>
                )}
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
