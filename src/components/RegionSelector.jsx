import React from 'react';
import { Compass, Sparkles, MapPin, Bus, Flame, Landmark } from 'lucide-react';

export default function RegionSelector({ selectedRegion, setSelectedRegion, northCount, southCount, centralCount }) {
  const regions = [
    {
      id: 'All Kolkata',
      title: 'All Kolkata',
      bengaliTitle: 'সমগ্র কলকাতা',
      tagline: 'Complete City-Wide Durga Puja Guide',
      count: northCount + southCount + centralCount,
      gradient: 'from-amber-600/30 via-red-950/60 to-black',
      borderActive: 'border-festive-gold shadow-festive-gold/30',
      badgeColor: 'bg-festive-gold text-festive-night',
      accentColor: '#F59E0B',
      icon: Compass,
      description: 'Explore the full spectrum of Kolkata festivities across every historic alleyway, waterfront ghat, and modern mega-pandal.',
      neighborhoods: ['Shyambazar', 'Gariahat', 'College St', 'Kalighat', 'Kumartuli', 'Bowbazar']
    },
    {
      id: 'North Kolkata',
      title: 'North Kolkata',
      bengaliTitle: 'উত্তর কলকাতা',
      tagline: 'Aristocratic Heritage & Traditional Barowari',
      count: northCount,
      gradient: 'from-red-800/40 via-red-950/70 to-black',
      borderActive: 'border-red-500 shadow-red-500/30',
      badgeColor: 'bg-red-600 text-white',
      accentColor: '#EF4444',
      icon: Landmark,
      description: 'Home of timeless Ekchala idols, Daaker Saaj, the artisans of Kumartuli, century-old Rajbari pujas, and narrow nostalgic lanes.',
      neighborhoods: ['Bagbazar', 'Kumartuli', 'Sovabazar', 'Hatibagan', 'Maniktala', 'Ultadanga', 'Lake Town', 'Belgachia'],
      sourcePdf: 'NORTH_KOLKATA.pdf'
    },
    {
      id: 'South Kolkata',
      title: 'South Kolkata',
      bengaliTitle: 'দক্ষিণ কলকাতা',
      tagline: 'Monumental Themes & Architectural Marvels',
      count: southCount,
      gradient: 'from-rose-900/40 via-purple-950/60 to-black',
      borderActive: 'border-pink-500 shadow-pink-500/30',
      badgeColor: 'bg-pink-600 text-white',
      accentColor: '#EC4899',
      icon: Sparkles,
      description: 'Renowned for sprawling themed installations, avant-garde contemporary art, massive cultural addas, and high-energy circuits.',
      neighborhoods: ['Gariahat', 'Ballygunge', 'Deshapriya Park', 'Kalighat', 'Chetla', 'New Alipore', 'Naktala', 'Dhakuria', 'Behala'],
      sourcePdf: 'SOUTH_KOLKATA.pdf'
    },
    {
      id: 'Central Kolkata',
      title: 'Central Kolkata',
      bengaliTitle: 'মধ্য কলকাতা',
      tagline: 'Lakeside Illuminations & Historic Squares',
      count: centralCount,
      gradient: 'from-amber-700/40 via-orange-950/60 to-black',
      borderActive: 'border-amber-500 shadow-amber-500/30',
      badgeColor: 'bg-amber-500 text-black',
      accentColor: '#F59E0B',
      icon: Flame,
      description: 'Epic lakeside water reflections, grand replica structures, vibrant university squares, and crucial railway terminal connectivity.',
      neighborhoods: ['MG Road', 'College Street', 'Bowbazar', 'Sealdah', 'Girish Park', 'Amherst St', 'Janbazar', 'Entally'],
      sourcePdf: 'CENTRAL _KOLKATA.pdf'
    }
  ];

  return (
    <section id="regions" className="py-14 bg-gradient-to-b from-[#14080c] via-[#1a0a10] to-[#14080c] border-b border-festive-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 text-festive-lightgold text-xs font-semibold uppercase tracking-widest px-3.5 py-1 rounded-full bg-festive-maroon/70 border border-festive-gold/30">
            <Compass className="w-3.5 h-3.5 text-festive-gold" />
            <span>Interactive Regional Navigator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-wide">
            Explore Durga Puja Across Kolkata
          </h2>
          <p className="text-sm sm:text-base text-festive-cream/80">
            Select your preferred region to instantly filter pandals, update map markers, and surface dedicated bus and transit connections without reloading the application.
          </p>
        </div>

        {/* 4 Interactive Region Cards (All, North, South, Central) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {regions.map((reg) => {
            const isSelected = selectedRegion === reg.id;
            const Icon = reg.icon;

            return (
              <div
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                className={`relative rounded-2xl cursor-pointer p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                  isSelected
                    ? `bg-gradient-to-b ${reg.gradient} border-2 ${reg.borderActive} shadow-xl scale-[1.02]`
                    : 'bg-[#1c0d13]/90 hover:bg-[#25121a] border border-festive-gold/25 hover:border-festive-gold/60'
                }`}
              >
                {/* Active Indicator Ribbon */}
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-festive-gold text-festive-night text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow">
                    Active View
                  </div>
                )}

                <div>
                  {/* Top Bar: Icon & Count */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-md"
                      style={{
                        backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(153, 27, 27, 0.25)',
                        borderColor: isSelected ? reg.accentColor : 'rgba(245, 158, 11, 0.3)'
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: reg.accentColor }} />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${reg.badgeColor}`}>
                      {reg.count} Pandals
                    </span>
                  </div>

                  {/* Title & Bengali Title */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-serif font-black text-white group-hover:text-festive-lightgold transition-colors">
                      {reg.title}
                    </h3>
                    <p className="text-sm font-bengali font-semibold text-festive-gold/90">
                      {reg.bengaliTitle}
                    </p>
                  </div>

                  {/* Subtitle / Tagline */}
                  <p className="text-xs font-medium text-festive-sand/90 mt-2 mb-3">
                    {reg.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-festive-cream/70 leading-relaxed mb-4">
                    {reg.description}
                  </p>
                </div>

                {/* Neighborhood Chips */}
                <div>
                  <div className="text-[11px] font-semibold text-festive-sand/80 uppercase tracking-wider mb-2 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-festive-gold" />
                    <span>Key Neighborhoods:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {reg.neighborhoods.slice(0, 4).map((nb) => (
                      <span
                        key={nb}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-festive-maroon/60 text-festive-cream/80 border border-festive-gold/15"
                      >
                        {nb}
                      </span>
                    ))}
                    {reg.neighborhoods.length > 4 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md text-festive-gold font-medium">
                        +{reg.neighborhoods.length - 4} more
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
