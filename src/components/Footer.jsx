import React from 'react';
import { Heart, Compass, Shield, PhoneCall, Sparkles, MapPin } from 'lucide-react';

export default function Footer({ onOpenGuides }) {
  return (
    <footer className="bg-[#0b0406] border-t-2 border-festive-gold/30 text-festive-cream/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid: Branding, Quick Links, Emergency Helplines */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-festive-ruby to-festive-maroon border-2 border-festive-gold flex items-center justify-center">
                <span className="text-festive-gold font-serif font-black text-lg">ॐ</span>
              </div>
              <span className="text-2xl font-serif font-black tracking-wide bg-gradient-to-r from-festive-sand via-festive-gold to-yellow-200 bg-clip-text text-transparent">
                Pujo Mana PujoPath
              </span>
            </div>
            
            <p className="text-sm font-serif italic text-festive-sand font-medium">
              Celebrate Maa Durga. Explore Kolkata. Get Stuck Less.
            </p>
            
            <p className="text-xs text-festive-cream/70 max-w-md leading-relaxed">
              Your official, intelligent Durga Puja companion for Kolkata, West Bengal. Discover North, South, and Central Kolkata pandals, explore translated Bengali transport guides, and navigate with our embedded interactive map.
            </p>
            
            <div className="pt-2 text-xs text-festive-gold/80 flex items-center space-x-1">
              <span>Made with devotion for the City of Joy</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-festive-gold uppercase tracking-wider text-sm">
              Explore Pujo Mana PujoPath
            </h4>
            <ul className="space-y-2 text-festive-cream/70">
              <li>
                <a href="#regions" className="hover:text-festive-lightgold transition-colors">
                  Explore North, South &amp; Central Kolkata
                </a>
              </li>
              <li>
                <a href="#map" className="hover:text-festive-lightgold transition-colors">
                  Embedded Leaflet Interactive Map
                </a>
              </li>
              <li>
                <a href="#transit" className="hover:text-festive-lightgold transition-colors">
                  60+ Bus Routes &amp; Metro Timetables
                </a>
              </li>
              <li>
                <a href="#planner" className="hover:text-festive-lightgold transition-colors">
                  Plan My Puja Night Smart Itinerary
                </a>
              </li>
              <li>
                <a href="#travel-smarter" className="hover:text-festive-lightgold transition-colors">
                  Kolkata Police Traffic &amp; Road Closures
                </a>
              </li>
              <li>
                <button onClick={onOpenGuides} className="hover:text-festive-lightgold transition-colors text-left">
                  Download Translated PDF Guides
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Official Kolkata Helplines */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-festive-gold uppercase tracking-wider text-sm flex items-center space-x-1.5">
              <PhoneCall className="w-4 h-4 text-festive-gold" />
              <span>Puja Emergency Helplines</span>
            </h4>
            <div className="space-y-1.5 text-festive-cream/80">
              <div className="p-2 rounded bg-festive-maroon/30 border border-festive-gold/20 flex justify-between">
                <span>Kolkata Police Control:</span>
                <strong className="text-white">100 / 112</strong>
              </div>
              <div className="p-2 rounded bg-festive-maroon/30 border border-festive-gold/20 flex justify-between">
                <span>Traffic Police Helpline:</span>
                <strong className="text-white">1073</strong>
              </div>
              <div className="p-2 rounded bg-festive-maroon/30 border border-festive-gold/20 flex justify-between">
                <span>Medical / Ambulance:</span>
                <strong className="text-white">102 / 108</strong>
              </div>
              <div className="p-2 rounded bg-festive-maroon/30 border border-festive-gold/20 flex justify-between">
                <span>Women Helpline:</span>
                <strong className="text-white">1091</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer & Attribution */}
        <div className="pt-8 border-t border-festive-gold/20 text-[11px] text-festive-cream/60 space-y-2">
          <p>
            <strong>Data Integrity Statement:</strong> All Durga Puja pandal names, neighborhood groupings, and public bus route numbers are translated from official Kolkata guide documents (<code>NORTH_KOLKATA.pdf</code>, <code>SOUTH_KOLKATA.pdf</code>, and <code>CENTRAL _KOLKATA.pdf</code>). Bus schedules are indexed from official West Bengal Transport Corporation (WBTC) records. Where exact departure schedules or live telemetry are unavailable, notices are explicitly displayed without artificial fabrication.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-2 text-festive-sand/80">
            <div>
              &copy; 2026 <strong>Pujo Mana PujoPath</strong>. All rights reserved.
            </div>
            <div className="font-mono text-[10px]">
              Subho Sarodotsav • Kolkata, West Bengal
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
