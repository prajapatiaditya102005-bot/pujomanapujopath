import React, { useState } from 'react';
import { Bus, Search, Filter, Train, Clock, CheckCircle2, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function TransportGuide({ transportData, pandals }) {
  const [regionFilter, setRegionFilter] = useState('All');
  const [busTypeFilter, setBusTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRoute, setExpandedRoute] = useState(null);

  if (!transportData || !transportData.bus_routes_master) return null;

  const routes = transportData.bus_routes_master;

  // Filter routes
  const filteredRoutes = routes.filter((r) => {
    const matchesRegion = regionFilter === 'All' || r.region === regionFilter;
    const matchesType = busTypeFilter === 'All' || r.type === busTypeFilter;
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      r.route.toLowerCase().includes(query) ||
      r.origin.toLowerCase().includes(query) ||
      r.destination.toLowerCase().includes(query) ||
      r.neighborhoods.some((nb) => nb.toLowerCase().includes(query));

    return matchesRegion && matchesType && matchesSearch;
  });

  return (
    <section id="transit" className="py-14 bg-[#14080c] border-b border-festive-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-2 text-festive-lightgold text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-festive-maroon/70 border border-festive-gold/30">
            <Bus className="w-3.5 h-3.5 text-festive-gold" />
            <span>Kolkata Public Transit Database</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-wide">
            Bus Routes &amp; Public Transport Guide
          </h2>
          <p className="text-sm sm:text-base text-festive-cream/80">
            Extract and organize every bus route number from the North, South, and Central Kolkata guides. Inspect neighborhood connections, verified WBTC timetables, and official service statuses.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#1b0c12] p-4 rounded-2xl border border-festive-gold/30 shadow-xl mb-8 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search by Route or Stop */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-festive-gold absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search route number (e.g. 240, S-9A, AC-1), stop, destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#12070a] text-white border border-festive-gold/30 rounded-xl focus:outline-none focus:border-festive-gold placeholder-festive-cream/40"
            />
          </div>

          {/* Region Filter */}
          <div className="md:col-span-3">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#12070a] text-white border border-festive-gold/30 rounded-xl focus:outline-none focus:border-festive-gold cursor-pointer"
            >
              <option value="All">All Regions</option>
              <option value="North Kolkata">North Kolkata</option>
              <option value="South Kolkata">South Kolkata</option>
              <option value="Central Kolkata">Central Kolkata</option>
            </select>
          </div>

          {/* Bus Type Filter */}
          <div className="md:col-span-3">
            <select
              value={busTypeFilter}
              onChange={(e) => setBusTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#12070a] text-white border border-festive-gold/30 rounded-xl focus:outline-none focus:border-festive-gold cursor-pointer"
            >
              <option value="All">All Bus Types</option>
              <option value="Private Bus">Private Buses</option>
              <option value="Government Bus">Government Buses (WBTC)</option>
              <option value="AC Bus">AC Express Buses</option>
            </select>
          </div>
        </div>

        {/* Bus Routes Table / Cards */}
        <div className="bg-[#1b0c12] rounded-2xl border border-festive-gold/30 shadow-2xl overflow-hidden mb-12">
          
          <div className="p-4 bg-black/40 border-b border-festive-gold/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-sm font-serif font-bold text-white">
              Cataloged Bus Corridors ({filteredRoutes.length} Available)
            </div>
            <div className="text-[11px] text-festive-sand/80 italic">
              ⚠️ Labeled as neighborhood-level connectivity extracted from source PDFs
            </div>
          </div>

          <div className="divide-y divide-festive-gold/15">
            {filteredRoutes.map((r, idx) => {
              const isExpanded = expandedRoute === r.route;

              return (
                <div key={idx} className="p-4 hover:bg-[#220f17]/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    
                    {/* Left: Route Number & Type */}
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-xl bg-festive-ruby text-white font-black font-mono text-base flex items-center justify-center border border-festive-gold/40 shadow shrink-0">
                        {r.route}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm sm:text-base">
                            {r.origin} ➔ {r.destination}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              r.type === 'Government Bus'
                                ? 'bg-blue-900/60 text-blue-300 border border-blue-500/40'
                                : r.type === 'AC Bus'
                                ? 'bg-amber-900/60 text-amber-300 border border-amber-500/40'
                                : 'bg-red-900/60 text-red-300 border border-red-500/40'
                            }`}
                          >
                            {r.type}
                          </span>
                        </div>

                        <div className="text-xs text-festive-sand/80 mt-1 flex flex-wrap gap-1.5 items-center">
                          <span className="text-festive-cream/60">Neighborhoods:</span>
                          {r.neighborhoods.map((nb, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-festive-sand border border-festive-gold/15">
                              {nb}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Service Status & Timetable Toggle */}
                    <div className="flex items-center space-x-3 self-end md:self-center">
                      <div className="text-right text-xs">
                        {r.has_timetable ? (
                          <>
                            <div className="text-emerald-400 font-semibold text-[11px] flex items-center justify-end space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{r.service_status}</span>
                            </div>
                            <div className="text-festive-cream/60 text-[10px]">
                              {r.first_service} – {r.last_service} ({r.frequency})
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-amber-300 text-[11px] font-medium flex items-center justify-end space-x-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Guide Record</span>
                            </div>
                            <div className="text-festive-cream/50 text-[10px]">
                              Exact timetable unavailable
                            </div>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => setExpandedRoute(isExpanded ? null : r.route)}
                        className="p-2 rounded-xl bg-festive-maroon/40 hover:bg-festive-maroon text-festive-sand border border-festive-gold/25"
                        title="Toggle schedule details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>

                  {/* Expanded Timetable Panel */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-festive-gold/20 bg-black/30 p-4 rounded-xl text-xs space-y-2 animate-in fade-in">
                      <div className="font-bold text-festive-lightgold uppercase tracking-wider text-[11px]">
                        Transit Specifications:
                      </div>

                      {r.has_timetable ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-festive-cream/90">
                          <div>
                            <span className="text-festive-sand block text-[10px]">First &amp; Last Service:</span>
                            <strong>{r.first_service}</strong> to <strong>{r.last_service}</strong>
                          </div>
                          <div>
                            <span className="text-festive-sand block text-[10px]">Operating Interval:</span>
                            <strong>Every {r.frequency}</strong>
                          </div>
                          <div>
                            <span className="text-festive-sand block text-[10px]">Authorized Source:</span>
                            <strong>{r.verified_agency}</strong>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5 text-amber-200/90 text-xs">
                          <p>
                            • “Bus route listed in the provided guide. Exact timetable not available.”
                          </p>
                          <p>
                            • “Live bus tracking unavailable.”
                          </p>
                        </div>
                      )}

                      <div className="pt-2 text-[10px] text-festive-cream/60 italic border-t border-festive-gold/10">
                        Data Source: Official Transit Master translated from {r.region} source documentation.
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

        {/* Metro Reference Grid */}
        <div className="bg-[#1b0c12] p-6 rounded-2xl border border-festive-gold/30 shadow-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <Train className="w-5 h-5 text-festive-gold" />
            <h3 className="text-xl font-serif font-black text-white">
              Kolkata Metro Stations &amp; Special Puja Night Services
            </h3>
          </div>
          <p className="text-xs text-festive-cream/70">
            During Durga Puja (Maha Saptami, Maha Ashtami, Maha Nabami), Kolkata Metro operates extended midnight services across the Blue Line (North-South) and Green Line (East-West Underwater).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {transportData.metro_stations.map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#12070a] border border-festive-gold/20 text-xs space-y-1">
                <div className="font-bold text-white text-sm flex items-center justify-between">
                  <span>{m.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
                    {m.line}
                  </span>
                </div>
                <div className="text-festive-sand text-[11px]">
                  <strong>Serves:</strong> {m.serves}
                </div>
                <div className="text-emerald-400 font-semibold text-[10px] pt-1">
                  🌙 {m.night_service}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
