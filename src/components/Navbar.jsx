import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Bus, Calendar, AlertTriangle, Download, Menu, X, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { dhakPlayer } from '../utils/dhakAudio';

export default function Navbar({ activeSection, setActiveSection, selectedRegion, setSelectedRegion, onOpenGuides }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Auto-play for 20 seconds when user opens the website
  useEffect(() => {
    // Subscribe to player state changes
    const unsubscribe = dhakPlayer.subscribe((playing) => {
      setAudioPlaying(playing);
    });

    const triggerPlay = () => {
      dhakPlayer.play(20000).catch(() => {});
    };

    // Attempt autoplay immediately
    triggerPlay();

    // Many browsers block sound until the first user click/tap/gesture on the website.
    // Listen for the first interaction to start the 20-second festive music automatically.
    const handleFirstGesture = () => {
      if (!dhakPlayer.isPlaying) {
        triggerPlay();
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    return () => {
      unsubscribe();
      dhakPlayer.stop();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  // Music symbol toggle handler (stops if playing, plays for 20s if stopped)
  const toggleFestiveAudio = () => {
    dhakPlayer.toggle(20000);
  };

  const navLinks = [
    { id: 'pandals', label: 'Pandals', icon: Sparkles },
    { id: 'map', label: 'Interactive Map', icon: MapPin },
    { id: 'transit', label: 'Bus & Transit Guide', icon: Bus },
    { id: 'planner', label: 'Plan My Puja Night', icon: Calendar },
    { id: 'travel-smarter', label: 'Traffic & Alerts', icon: AlertTriangle },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#160a0e]/95 backdrop-blur-md border-b border-festive-gold/25 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official Website Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-festive-ruby via-festive-crimson to-festive-maroon border-2 border-festive-gold flex items-center justify-center shadow-md shadow-festive-crimson/40">
              <span className="text-festive-gold font-serif font-black text-xl">ॐ</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-serif font-black tracking-wide bg-gradient-to-r from-festive-sand via-festive-gold to-yellow-200 bg-clip-text text-transparent">
                  Pujo Mana PujoPath
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-festive-ruby/40 text-festive-lightgold border border-festive-gold/30 rounded-full">
                  Kolkata Guide
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-festive-sand/80 italic font-medium">
                Celebrate Maa Durga. Explore Kolkata. Get Stuck Less.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    const el = document.getElementById(link.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3 py-2 text-xs xl:text-sm font-medium text-festive-cream/90 hover:text-festive-gold hover:bg-festive-ruby/20 rounded-lg transition-colors flex items-center space-x-1.5"
                >
                  <Icon className="w-4 h-4 text-festive-gold" />
                  <span>{link.label}</span>
                </button>
              );
            })}

           

            {/* Audio Toggle (Music Symbol Only) */}
            <button
              onClick={toggleFestiveAudio}
              className={`p-2.5 rounded-full border transition-all shadow-md flex items-center justify-center ${
                audioPlaying
                  ? 'bg-festive-ruby border-festive-gold text-yellow-300 shadow-festive-crimson/50'
                  : 'bg-festive-night/85 hover:bg-[#220d15] border-festive-gold/30 text-festive-gold hover:text-white'
              }`}
              title={audioPlaying ? 'Click to stop music' : 'Click to play Durga Puja music'}
              aria-label="Toggle festive music"
            >
              {audioPlaying ? (
                <div className="flex items-center space-x-1">
                  <Volume2 className="w-5 h-5 text-yellow-300 animate-pulse" />
                  <span className="flex space-x-0.5 items-end h-3">
                    <span className="w-0.5 h-3 bg-yellow-300 animate-pulse"></span>
                    <span className="w-0.5 h-2 bg-yellow-400 animate-ping"></span>
                    <span className="w-0.5 h-3 bg-yellow-300 animate-pulse"></span>
                  </span>
                </div>
              ) : (
                <VolumeX className="w-5 h-5 text-festive-gold" />
              )}
            </button>
          </nav>

          {/* Mobile Menu & Audio Music Symbol Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleFestiveAudio}
              className={`p-2 rounded-lg border text-xs flex items-center justify-center transition-all ${
                audioPlaying
                  ? 'bg-festive-ruby text-yellow-300 border-festive-gold shadow-md'
                  : 'text-festive-gold bg-festive-ruby/20 border-festive-gold/30 hover:bg-festive-ruby/40'
              }`}
              title={audioPlaying ? 'Stop music' : 'Play music'}
              aria-label="Toggle festive music"
            >
              {audioPlaying ? (
                <Volume2 className="w-4 h-4 text-yellow-300 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-festive-gold" />
              )}
            </button>

            <button
              onClick={onOpenGuides}
              className="p-2 text-festive-gold bg-festive-ruby/20 border border-festive-gold/30 rounded-lg text-xs flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[11px]">Guides</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-festive-gold hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1f0c13] border-b border-festive-gold/30 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  const el = document.getElementById(link.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-festive-cream hover:bg-festive-ruby/30 rounded-lg flex items-center space-x-2.5"
              >
                <Icon className="w-4 h-4 text-festive-gold" />
                <span>{link.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-festive-gold/20 flex justify-between items-center gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenGuides(); }}
              className="px-3 py-2 text-xs font-semibold text-festive-sand bg-festive-ruby/40 border border-festive-gold/40 rounded-lg flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-festive-gold" />
              <span>Download Guides</span>
            </button>
            <button
              onClick={toggleFestiveAudio}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all ${
                audioPlaying
                  ? 'bg-festive-ruby border-festive-gold text-yellow-300'
                  : 'text-festive-gold border-festive-gold/30 hover:bg-festive-ruby/30'
              }`}
              title={audioPlaying ? 'Click to stop music' : 'Click to play music'}
              aria-label="Toggle festive music"
            >
              {audioPlaying ? (
                <Volume2 className="w-5 h-5 text-yellow-300 animate-pulse" />
              ) : (
                <VolumeX className="w-5 h-5 text-festive-gold" />
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
