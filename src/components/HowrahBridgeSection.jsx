import React from 'react';
import { Anchor, Train, Navigation2, Compass } from 'lucide-react';

export default function HowrahBridgeSection() {
  return (
    <section className="relative overflow-hidden py-14 bg-gradient-to-b from-[#12070a] via-[#1a0910] to-[#14080c] border-b border-festive-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-2 text-festive-lightgold text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-festive-maroon/60 border border-festive-gold/30">
            <Anchor className="w-3.5 h-3.5" />
            <span>Kolkata's Heritage Gateway</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-wide">
            From the Hooghly Waters to the Pandal Trails
          </h2>
          <p className="text-sm sm:text-base text-festive-cream/80">
            The iconic Howrah Bridge stands as the grand portal welcoming millions into Kolkata's festive heartland — bridging historic ghats, ferry crossings, suburban railways, and vibrant pandal circuits.
          </p>
        </div>

        {/* Visual Howrah Bridge & River Hooghly Diorama */}
        <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#0a0507] via-[#160a0f] to-[#0c131a] border border-festive-gold/30 shadow-2xl overflow-hidden p-6 sm:p-10">
          
          {/* Night Sky & Moon Stars */}
          <div className="absolute top-6 right-10 w-16 h-16 rounded-full bg-festive-sand/20 blur-md pointer-events-none" />
          <div className="absolute top-8 right-12 w-10 h-10 rounded-full bg-festive-ivory/80 shadow-[0_0_20px_#fef3c7] pointer-events-none" />

          {/* SVG Silhouette of Howrah Bridge */}
          <div className="relative w-full h-48 sm:h-64 z-10">
            <svg viewBox="0 0 1000 280" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bridgeSteel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="60%" stopColor="#991B1B" />
                  <stop offset="100%" stopColor="#1E1015" />
                </linearGradient>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
              </defs>

              {/* Distant City Skyline Silhouettes */}
              <path d="M 50 170 L 70 150 L 90 170 L 140 140 L 160 170 L 220 155 L 250 170 L 750 170 L 780 150 L 820 170 L 890 145 L 950 170 Z" fill="#201016" opacity="0.6" />

              {/* Howrah Bridge Cantilever Towers and Girders */}
              {/* West Tower (Howrah Side) */}
              <polygon points="120,180 140,50 160,50 180,180 165,180 150,70 135,180" fill="url(#bridgeSteel)" />
              <line x1="120" y1="180" x2="180" y2="50" stroke="#FBBF24" strokeWidth="2" opacity="0.75" />
              <line x1="180" y1="180" x2="120" y2="50" stroke="#FBBF24" strokeWidth="2" opacity="0.75" />

              {/* East Tower (Kolkata Side) */}
              <polygon points="820,180 840,50 860,50 880,180 865,180 850,70 835,180" fill="url(#bridgeSteel)" />
              <line x1="820" y1="180" x2="880" y2="50" stroke="#FBBF24" strokeWidth="2" opacity="0.75" />
              <line x1="880" y1="180" x2="820" y2="50" stroke="#FBBF24" strokeWidth="2" opacity="0.75" />

              {/* Main Suspended Arch Span */}
              <path d="M 150 50 Q 500 130 850 50" stroke="#F59E0B" strokeWidth="4" fill="none" />
              <path d="M 150 70 Q 500 150 850 70" stroke="#FBBF24" strokeWidth="2" fill="none" opacity="0.8" />

              {/* Main Deck Horizontal Roadway */}
              <line x1="20" y1="180" x2="980" y2="180" stroke="#FEF3C7" strokeWidth="6" />

              {/* Vertical Suspension Cables */}
              {[200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800].map((x, idx) => (
                <line key={idx} x1={x} y1="180" x2={x} y2={100 + Math.sin((x / 1000) * Math.PI) * 45} stroke="#F59E0B" strokeWidth="1.5" opacity="0.7" />
              ))}

              {/* Diagonal Trusses */}
              {[220, 320, 420, 520, 620, 720].map((x, idx) => (
                <line key={idx} x1={x} y1="180" x2={x + 60} y2="120" stroke="#D97706" strokeWidth="1.5" opacity="0.5" />
              ))}

              {/* Decorative Fairy Night Lights Along Deck */}
              {[...Array(30)].map((_, i) => (
                <circle key={i} cx={50 + i * 31} cy="178" r="2.5" fill={i % 2 === 0 ? '#FBBF24' : '#EF4444'} className="animate-flicker" style={{ animationDelay: `${(i % 5) * 0.3}s` }} />
              ))}
            </svg>

            {/* River Hooghly Water Surface with Waves */}
            <div className="absolute -bottom-2 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-[#020617] via-[#09152b] to-transparent overflow-hidden">
              <svg className="w-full h-full animate-river opacity-60" viewBox="0 0 1200 60" preserveAspectRatio="none">
                <path d="M0,20 C150,35 350,5 500,20 C650,35 850,5 1000,20 C1150,35 1200,20 1200,20 L1200,60 L0,60 Z" fill="#0369A1" />
                <path d="M0,30 C200,10 400,45 600,25 C800,10 1000,45 1200,30 L1200,60 L0,60 Z" fill="#0284C7" opacity="0.5" />
              </svg>

              {/* Animated River Ferry Boat Gliding Across */}
              <div className="absolute bottom-4 left-1/3 animate-ferry z-20 flex items-center space-x-1.5">
                <div className="relative">
                  {/* Ferry Silhouette */}
                  <svg width="65" height="26" viewBox="0 0 65 26">
                    {/* Hull */}
                    <path d="M 5 18 L 12 25 L 55 25 L 62 18 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                    {/* Cabin */}
                    <rect x="18" y="9" width="30" height="9" fill="#334155" rx="1.5" />
                    {/* Windows with warm light */}
                    <circle cx="24" cy="13" r="2" fill="#fef08a" />
                    <circle cx="32" cy="13" r="2" fill="#fef08a" />
                    <circle cx="40" cy="13" r="2" fill="#fef08a" />
                    {/* Chimney / Smoke */}
                    <rect x="28" y="4" width="4" height="5" fill="#64748b" />
                  </svg>
                  <div className="absolute -bottom-1 left-2 w-12 h-1 bg-cyan-400/30 blur-sm rounded-full" />
                </div>
                <span className="text-[10px] font-semibold text-festive-sand/90 hidden sm:inline-block bg-black/60 px-1.5 py-0.5 rounded border border-festive-gold/30">
                  Howrah ➔ Bagbazar Launch
                </span>
              </div>
            </div>
          </div>

          {/* Heritage & Transit Connectivity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 relative z-20">
            <div className="p-4 rounded-xl bg-festive-maroon/40 border border-festive-gold/20 flex items-start space-x-3">
              <Train className="w-5 h-5 text-festive-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-festive-lightgold">Howrah &amp; Sealdah Terminals</h4>
                <p className="text-xs text-festive-cream/70 mt-1">
                  Over 35 suburban special night local trains running 24x7 to connect pandal hoppers across Bengal.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-festive-maroon/40 border border-festive-gold/20 flex items-start space-x-3">
              <Anchor className="w-5 h-5 text-festive-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-festive-lightgold">Hooghly River Ferries</h4>
                <p className="text-xs text-festive-cream/70 mt-1">
                  Frequent river launches between Howrah Ghat, Bagbazar Ghat, Ahiritola Ghat, and Fairlie Place.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-festive-maroon/40 border border-festive-gold/20 flex items-start space-x-3">
              <Navigation2 className="w-5 h-5 text-festive-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-festive-lightgold">Green Line Underwater Metro</h4>
                <p className="text-xs text-festive-cream/70 mt-1">
                  Direct underwater transit connecting Howrah Station with Esplanade and Sealdah in under 11 minutes.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
