import React, { useState } from 'react';
import { Search, MapPin, Bus, Train, Plus, Check, Info, Sparkles, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function PandalDirectory({
  pandals,
  selectedRegion,
  setSelectedRegion,
  onSelectPandalOnMap,
  onOpenDetailsModal,
  onAddToItinerary,
  itineraryStops
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All');
  const [selectedMetroFilter, setSelectedMetroFilter] = useState('All');

  // Filter pandals
  const filteredPandals = pandals.filter((p) => {
    const matchesRegion = selectedRegion === 'All Kolkata' || p.region === selectedRegion;
    const matchesNeighborhood = selectedNeighborhood === 'All' || p.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase());
    const matchesMetro = selectedMetroFilter === 'All' || (p.nearby_metro && p.nearby_metro.toLowerCase().includes(selectedMetroFilter.toLowerCase()));

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      p.name.toLowerCase().includes(query) ||
      p.bengali_name.includes(query) ||
      p.neighborhood.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query) ||
      (p.nearby_metro && p.nearby_metro.toLowerCase().includes(query)) ||
      (p.nearby_railway && p.nearby_railway.toLowerCase().includes(query)) ||
      (p.bus_routes && p.bus_routes.private_buses && p.bus_routes.private_buses.some((b) => b.includes(query))) ||
      (p.bus_routes && p.bus_routes.government_buses && p.bus_routes.government_buses.some((b) => b.includes(query)));

    return matchesRegion && matchesNeighborhood && matchesMetro && matchesSearch;
  });

  // Extract unique neighborhoods for filtering
  const neighborhoods = [
    'All',
    ...Array.from(
      new Set(
        pandals
          .filter((p) => selectedRegion === 'All Kolkata' || p.region === selectedRegion)
          .map((p) => p.neighborhood.split('/')[0].trim())
      )
    )
  ];

  // Extract unique Metro stations
  const metroStations = [
    'All',
    ...Array.from(
      new Set(
        pandals
          .filter((p) => selectedRegion === 'All Kolkata' || p.region === selectedRegion)
          .map((p) => p.nearby_metro.split('(')[0].trim())
      )
    )
  ];

  return (
    <section id="pandals" className="py-14 bg-[#14080c] border-b border-festive-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-festive-lightgold text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-festive-maroon/70 border border-festive-gold/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-festive-gold" />
              <span>Complete Bengali-Translated Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-wide">
              Kolkata Durga Puja Pandals Directory
            </h2>
            <p className="text-sm text-festive-cream/80 max-w-2xl mt-1">
              Explore every cataloged pandal with original Bengali name, verified address, nearest Metro and local railway connections, and exact source guide page.
            </p>
          </div>

          <div className="text-right">
            <span className="text-sm font-semibold text-festive-sand">
              Showing <strong className="text-festive-lightgold">{filteredPandals.length}</strong> Pandals
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#1b0c12] p-4 rounded-2xl border border-festive-gold/30 shadow-xl mb-8 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-festive-gold absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pandal, bus (e.g. 240, S-9A), metro, railway..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#12070a] text-white border border-festive-gold/30 rounded-xl focus:outline-none focus:border-festive-gold placeholder-festive-cream/40"
            />
          </div>

          {/* Region Tabs / Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#12070a] text-white border border-festive-gold/30 rounded-xl focus:outline-none focus:border-festive-gold cursor-pointer"
            >
              <option value="All Kolkata">All Kolkata</option>
              <option value="North Kolkata">North Kolkata</option>
              <option value="South Kolkata">South Kolkata</option>
              <option value="Central Kolkata">Central Kolkata</option>
            </select>
          </div>

          {/* Neighborhood Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#12070a] text-white border border-festive-gold/30 rounded-xl focus:outline-none focus:border-festive-gold cursor-pointer"
            >
              {neighborhoods.map((nb) => (
                <option key={nb} value={nb}>
                  {nb === 'All' ? 'All Neighborhoods' : nb}
                </option>
              ))}
            </select>
          </div>

          {/* Metro Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedMetroFilter}
              onChange={(e) => setSelectedMetroFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#12070a] text-white border border-festive-gold/30 rounded-xl focus:outline-none focus:border-festive-gold cursor-pointer"
            >
              {metroStations.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'All Metro Stations' : m}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Pandals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPandals.map((pandal) => {
            const isAdded = itineraryStops.some((s) => s.id === pandal.id);

            return (
              <div
                key={pandal.id}
                className="rounded-2xl bg-gradient-to-b from-[#200e15] to-[#160a0f] border border-festive-gold/30 hover:border-festive-gold/70 shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  {/* Card Header: Region & Pandal Number */}
                  <div className="p-4 border-b border-festive-gold/15 flex items-center justify-between bg-black/20">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        pandal.region === 'North Kolkata'
                          ? 'bg-red-900/60 text-red-200 border border-red-500/40'
                          : pandal.region === 'South Kolkata'
                          ? 'bg-pink-900/60 text-pink-200 border border-pink-500/40'
                          : 'bg-amber-900/60 text-amber-200 border border-amber-500/40'
                      }`}
                    >
                      {pandal.region}
                    </span>
                    <span className="text-xs font-mono font-semibold text-festive-sand/80">
                      #{pandal.pandal_number} • {pandal.source_pdf.replace('.pdf', '')}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-serif font-black text-white group-hover:text-festive-lightgold transition-colors leading-tight">
                        {pandal.name}
                      </h3>
                      <p className="text-sm font-bengali font-semibold text-festive-gold/90 mt-0.5">
                        {pandal.bengali_name}
                      </p>
                      <p className="text-xs font-medium text-festive-sand/80 mt-1">
                        📍 {pandal.neighborhood}
                      </p>
                    </div>

                    {/* Address & Verified Badge */}
                    <div className="p-2.5 rounded-lg bg-festive-night/60 border border-festive-gold/15 text-xs text-festive-cream/80 space-y-1">
                      <div>{pandal.address}</div>
                      <div className="flex items-center space-x-1.5 text-emerald-400 text-[10px] font-medium pt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{pandal.verification_status}</span>
                      </div>
                    </div>

                    {/* Transit Highlights */}
                    <div className="space-y-1.5 text-xs pt-1">
                      <div className="flex items-start space-x-2 text-festive-cream/70">
                        <Train className="w-3.5 h-3.5 text-festive-gold shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{pandal.nearby_metro}</span>
                      </div>
                      <div className="flex items-start space-x-2 text-festive-cream/70">
                        <Bus className="w-3.5 h-3.5 text-festive-gold shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          Buses: {(pandal.bus_routes.private_buses || []).slice(0, 5).join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Highlights Quote */}
                    <p className="text-xs text-festive-cream/75 italic line-clamp-2 pt-1">
                      "{pandal.highlights}"
                    </p>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-black/30 border-t border-festive-gold/15 flex items-center gap-2">
                  <button
                    onClick={() => onSelectPandalOnMap(pandal)}
                    className="flex-1 py-2 px-3 rounded-xl bg-festive-ruby/30 hover:bg-festive-ruby/60 text-festive-sand border border-festive-gold/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5 text-festive-gold" />
                    <span>View on Map</span>
                  </button>

                  <button
                    onClick={() => onAddToItinerary(pandal)}
                    className={`p-2 rounded-xl border transition-all ${
                      isAdded
                        ? 'bg-emerald-800/40 border-emerald-500 text-emerald-300'
                        : 'bg-festive-maroon/60 hover:bg-festive-maroon border-festive-gold/40 text-festive-gold'
                    }`}
                    title={isAdded ? 'Added to Itinerary' : 'Add to Route'}
                  >
                    {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onOpenDetailsModal(pandal)}
                    className="p-2 rounded-xl bg-[#261219] hover:bg-[#381a24] border border-festive-gold/30 text-festive-sand"
                    title="Detailed Info"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {filteredPandals.length === 0 && (
          <div className="text-center py-16 bg-[#1a0c12] rounded-2xl border border-festive-gold/25 p-8">
            <p className="text-lg font-serif font-bold text-white mb-2">No pandals matched your search</p>
            <p className="text-xs text-festive-cream/70 mb-4">
              Try searching with another keyword, or reset the filters.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedNeighborhood('All'); setSelectedMetroFilter('All'); setSelectedRegion('All Kolkata'); }}
              className="px-4 py-2 bg-festive-ruby text-white text-xs font-semibold rounded-xl border border-festive-gold/40"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
