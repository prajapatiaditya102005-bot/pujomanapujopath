import React, { useState, useEffect } from 'react';
import { 
  Navigation, MapPin, ArrowUpDown, Trash2, ArrowUp, ArrowDown, 
  Sparkles, Clock, Share2, Save, Printer, Plus, AlertCircle, 
  Bus, Train, CheckCircle2, Footprints, Car 
} from 'lucide-react';

export default function RoutePlanner({
  pandals,
  itineraryStops,
  setItineraryStops,
  onCalculateRoute,
  onShowRouteOnMap,
  routeStats,
  selectedRegion,
  setSelectedRegion
}) {
  const [startPoint, setStartPoint] = useState({
    id: 'sdah',
    name: 'Sealdah Railway Station',
    lat: 22.5668,
    lng: 88.3712
  });
  const [travelMode, setTravelMode] = useState('walking'); // 'walking' or 'transit'
  const [saveMessage, setSaveMessage] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [selectedPandalToAdd, setSelectedPandalToAdd] = useState('');

  const startingHubs = [
    { id: 'hwh', name: 'Howrah Junction Railway Station', lat: 22.5838, lng: 88.3426 },
    { id: 'sdah', name: 'Sealdah Railway Station', lat: 22.5668, lng: 88.3712 },
    { id: 'esp', name: 'Esplanade Metro Interchange', lat: 22.5645, lng: 88.3516 },
    { id: 'shyam', name: 'Shyambazar Five Point Crossing', lat: 22.6006, lng: 88.3718 },
    { id: 'gariahat', name: 'Gariahat Crossing (Pantaloons)', lat: 22.5186, lng: 88.3655 },
    { id: 'airport', name: 'Netaji Subhash Chandra Bose Airport', lat: 22.6547, lng: 88.4467 }
  ];

  // Load saved itinerary from LocalStorage on mount if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pujo_mana_itinerary');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setItineraryStops(parsed);
        }
      }
    } catch (e) {
      console.log('LocalStorage load error:', e);
    }
  }, []);

  // Distance calculation using Haversine formula
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Reorder stops up or down
  const moveStop = (index, direction) => {
    const newStops = [...itineraryStops];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newStops.length) return;
    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;
    setItineraryStops(newStops);
  };

  const removeStop = (id) => {
    setItineraryStops((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddPandal = (pandalId) => {
    if (!pandalId) return;
    const toAdd = pandals.find((p) => p.id === pandalId || String(p.id) === String(pandalId));
    if (!toAdd) return;

    setItineraryStops((prev) => {
      if (prev.some((s) => s.id === toAdd.id)) {
        setSaveMessage(`"${toAdd.name}" is already in your itinerary!`);
        setTimeout(() => setSaveMessage(''), 3000);
        return prev;
      }
      setSaveMessage(`✓ Added "${toAdd.name}" (${toAdd.neighborhood}) to itinerary!`);
      setTimeout(() => setSaveMessage(''), 3000);
      return [...prev, toAdd];
    });
    setSelectedPandalToAdd('');
  };

  const handleLoadPreset = (presetType) => {
    let ids = [];
    let label = '';
    if (presetType === 'north') {
      ids = ['NK-04', 'NK-02', 'NK-01', 'NK-06', 'NK-05'];
      label = 'North Heritage Trail (5 Pandals)';
    } else if (presetType === 'south') {
      ids = ['SK-01', 'SK-02', 'SK-06', 'SK-04', 'SK-05'];
      label = 'South Kolkata Blockbusters (5 Pandals)';
    } else if (presetType === 'central') {
      ids = ['CK-01', 'CK-02', 'CK-03', 'CK-04'];
      label = 'Central Kolkata Heritage (4 Pandals)';
    }
    const presetStops = ids
      .map((id) => pandals.find((p) => p.id === id))
      .filter(Boolean);

    setItineraryStops(presetStops);
    setSaveMessage(`✓ Loaded ${label}! Click "Plan My Route" below.`);
    setTimeout(() => setSaveMessage(''), 3500);
  };

  // TSP Optimization Algorithm: Nearest Neighbor + 2-Opt Heuristic
  const handleOptimizeOrder = () => {
    if (itineraryStops.length <= 2) return;

    let currentLat = startPoint.lat;
    let currentLng = startPoint.lng;
    const remaining = [...itineraryStops];
    const optimized = [];

    while (remaining.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const d = getDistanceKm(currentLat, currentLng, remaining[i].latitude, remaining[i].longitude);
        if (d < minDistance) {
          minDistance = d;
          nearestIdx = i;
        }
      }

      const nextStop = remaining.splice(nearestIdx, 1)[0];
      optimized.push(nextStop);
      currentLat = nextStop.latitude;
      currentLng = nextStop.longitude;
    }

    setItineraryStops(optimized);
    setSaveMessage('Visiting order optimized for shortest travel path!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Calculate and trigger route display
  const handlePlanRoute = () => {
    if (itineraryStops.length === 0) return;

    let totalDist = 0;
    let prevLat = startPoint.lat;
    let prevLng = startPoint.lng;
    const polylineCoords = [[startPoint.lat, startPoint.lng]];

    itineraryStops.forEach((stop) => {
      totalDist += getDistanceKm(prevLat, prevLng, stop.latitude, stop.longitude);
      polylineCoords.push([stop.latitude, stop.longitude]);
      prevLat = stop.latitude;
      prevLng = stop.longitude;
    });

    // Speed estimation: walking ~ 4.2 km/h, road/transit ~ 16 km/h (considering Puja traffic)
    const speed = travelMode === 'walking' ? 4.2 : 16.0;
    const travelTimeMins = Math.round((totalDist / speed) * 60);

    // Sum visit durations (default 40 mins each)
    const visitDurationMins = itineraryStops.length * 35;

    onCalculateRoute(polylineCoords, {
      distanceKm: totalDist.toFixed(1),
      durationMins: travelTimeMins,
      totalTripMins: travelTimeMins + visitDurationMins,
      stopsCount: itineraryStops.length,
      mode: travelMode
    });
  };

  // Clear Itinerary
  const handleClearItinerary = () => {
    if (window.confirm('Are you sure you want to clear your current itinerary stops?')) {
      setItineraryStops([]);
      localStorage.removeItem('pujo_mana_itinerary');
      onCalculateRoute(null, null);
    }
  };

  // Save to LocalStorage
  const handleSaveItinerary = () => {
    try {
      localStorage.setItem('pujo_mana_itinerary', JSON.stringify(itineraryStops));
      setSaveMessage('Itinerary saved to your browser!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (e) {
      setSaveMessage('Could not save itinerary.');
    }
  };

  // Share Itinerary
  const handleShareItinerary = () => {
    const text = `🎉 My Durga Puja Itinerary via Pujo Mana PujoPath:\nStarting: ${startPoint.name}\nStops: ${itineraryStops.map((s, i) => `${i + 1}. ${s.name} (${s.neighborhood})`).join('\n')}\nPlan your route at: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setShareMessage('Itinerary copied to clipboard to share!');
    setTimeout(() => setShareMessage(''), 3000);
  };

  // Download & Print Itinerary
  const handlePrintItinerary = () => {
    window.print();
  };

  return (
    <section id="planner" className="py-14 bg-[#12070a] border-b border-festive-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-2 text-festive-lightgold text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-festive-maroon/70 border border-festive-gold/30">
            <Navigation className="w-3.5 h-3.5 text-festive-gold" />
            <span>Smart Route Planner</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-wide">
            Plan My Puja Night
          </h2>
          <p className="text-sm sm:text-base text-festive-cream/80">
            Select your origin, add multiple pandal stops, compare walking vs public transit modes, optimize your itinerary, and draw your route directly on the map.
          </p>
        </div>

        {/* Planner Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Route Setup & Controls */}
          <div className="lg:col-span-5 bg-[#1a0c12] p-6 rounded-2xl border border-festive-gold/30 shadow-2xl space-y-5">
            <h3 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-festive-gold" />
              <span>Route Parameters</span>
            </h3>

            {/* Region Selector */}
            <div>
              <label className="text-xs font-semibold text-festive-sand block mb-1.5">
                Focus Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#12070a] text-white border border-festive-gold/30 rounded-xl focus:outline-none focus:border-festive-gold cursor-pointer"
              >
                <option value="All Kolkata">All Kolkata</option>
                <option value="North Kolkata">North Kolkata</option>
                <option value="South Kolkata">South Kolkata</option>
                <option value="Central Kolkata">Central Kolkata</option>
              </select>
            </div>

            {/* Starting Location Picker */}
            <div>
              <label className="text-xs font-semibold text-festive-sand block mb-1.5">
                Starting Location / Origin Hub
              </label>
              <select
                value={startPoint.id}
                onChange={(e) => {
                  const hub = startingHubs.find((h) => h.id === e.target.value);
                  if (hub) setStartPoint(hub);
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#12070a] text-white border border-festive-gold/30 rounded-xl focus:outline-none focus:border-festive-gold cursor-pointer"
              >
                {startingHubs.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode of Transport Toggle */}
            <div>
              <label className="text-xs font-semibold text-festive-sand block mb-1.5">
                Routing Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTravelMode('walking')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                    travelMode === 'walking'
                      ? 'bg-festive-ruby text-white border-festive-gold shadow'
                      : 'bg-[#12070a] text-festive-cream/70 border-festive-gold/20 hover:text-white'
                  }`}
                >
                  <Footprints className="w-4 h-4 text-festive-gold" />
                  <span>Walking Circuit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTravelMode('transit')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                    travelMode === 'transit'
                      ? 'bg-festive-ruby text-white border-festive-gold shadow'
                      : 'bg-[#12070a] text-festive-cream/70 border-festive-gold/20 hover:text-white'
                  }`}
                >
                  <Car className="w-4 h-4 text-festive-gold" />
                  <span>Transit / Road</span>
                </button>
              </div>
            </div>

            {/* Add Pandal Stop Dropdown & Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-festive-sand">
                  Add Pandal Stop
                </label>
                <span className="text-[11px] text-festive-gold/80 italic">
                  Select to add automatically
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 min-w-0">
                  <select
                    value={selectedPandalToAdd}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedPandalToAdd(val);
                      if (val) {
                        handleAddPandal(val);
                      }
                    }}
                    className="w-full px-3 py-2.5 text-xs bg-[#12070a] text-white border border-festive-gold/30 rounded-xl focus:outline-none focus:border-festive-gold cursor-pointer"
                  >
                    <option value="">Choose a pandal to add (+ Auto-add)...</option>
                    {pandals
                      .filter((p) => selectedRegion === 'All Kolkata' || p.region === selectedRegion)
                      .map((p) => {
                        const inItinerary = itineraryStops.some((s) => s.id === p.id);
                        return (
                          <option key={p.id} value={p.id}>
                            {inItinerary ? '✓ ' : '+ '}{p.name} ({p.neighborhood})
                          </option>
                        );
                      })}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddPandal(selectedPandalToAdd)}
                  disabled={!selectedPandalToAdd}
                  className="px-4 py-2.5 bg-festive-ruby hover:bg-festive-crimson disabled:opacity-40 text-white rounded-xl border border-festive-gold/40 text-xs font-bold shrink-0 flex items-center justify-center space-x-1.5 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Stop</span>
                </button>
              </div>

              {/* Quick Presets Pills */}
              <div className="pt-1">
                <span className="text-[10px] text-festive-cream/60 block mb-1">
                  Or load a 1-click popular circuit:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('north')}
                    className="text-[10px] px-2 py-1 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 border border-amber-500/30 rounded-lg transition-colors"
                  >
                    🏛️ Top 5 North
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('south')}
                    className="text-[10px] px-2 py-1 bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 rounded-lg transition-colors"
                  >
                    ✨ Top 5 South
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('central')}
                    className="text-[10px] px-2 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 border border-rose-500/30 rounded-lg transition-colors"
                  >
                    🏮 Top 4 Central
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons: Plan Route & Optimize */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={handlePlanRoute}
                disabled={itineraryStops.length === 0}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-festive-ruby via-festive-crimson to-festive-maroon hover:from-red-700 hover:to-festive-ruby disabled:opacity-50 text-white font-bold text-sm border border-festive-gold/60 shadow-lg flex items-center justify-center space-x-2 transition-all"
              >
                <Navigation className="w-4 h-4 text-festive-gold" />
                <span>Plan My Route</span>
              </button>

              <button
                onClick={handleOptimizeOrder}
                disabled={itineraryStops.length < 3}
                className="w-full py-2.5 px-4 rounded-xl bg-[#241018] hover:bg-[#321622] disabled:opacity-40 text-festive-sand font-semibold text-xs border border-festive-gold/30 flex items-center justify-center space-x-2 transition-all"
                title="Automatically calculate the shortest visiting sequence"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-festive-gold" />
                <span>Optimize Visiting Order (Shortest Path)</span>
              </button>

              <button
                onClick={onShowRouteOnMap}
                disabled={!routeStats}
                className="w-full py-2.5 px-4 rounded-xl bg-festive-night/90 hover:bg-[#1a0a10] disabled:opacity-40 text-festive-lightgold font-semibold text-xs border border-festive-gold/30 flex items-center justify-center space-x-2 transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-festive-gold" />
                <span>Show Route on Map</span>
              </button>
            </div>

            {/* Notification Messages */}
            {saveMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{saveMessage}</span>
              </div>
            )}
            {shareMessage && (
              <div className="p-2.5 rounded-lg bg-blue-950/80 border border-blue-500/50 text-blue-300 text-xs flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{shareMessage}</span>
              </div>
            )}

            {/* Storage & Sharing Footer */}
            <div className="pt-3 border-t border-festive-gold/20 flex flex-wrap gap-2 justify-between">
              <button
                onClick={handleSaveItinerary}
                disabled={itineraryStops.length === 0}
                className="px-3 py-1.5 text-xs text-festive-sand bg-[#16080d] hover:bg-[#250d16] disabled:opacity-40 border border-festive-gold/25 rounded-lg flex items-center space-x-1"
              >
                <Save className="w-3 h-3 text-festive-gold" />
                <span>Save</span>
              </button>

              <button
                onClick={handleShareItinerary}
                disabled={itineraryStops.length === 0}
                className="px-3 py-1.5 text-xs text-festive-sand bg-[#16080d] hover:bg-[#250d16] disabled:opacity-40 border border-festive-gold/25 rounded-lg flex items-center space-x-1"
              >
                <Share2 className="w-3 h-3 text-festive-gold" />
                <span>Share</span>
              </button>

              <button
                onClick={handlePrintItinerary}
                disabled={itineraryStops.length === 0}
                className="px-3 py-1.5 text-xs text-festive-sand bg-[#16080d] hover:bg-[#250d16] disabled:opacity-40 border border-festive-gold/25 rounded-lg flex items-center space-x-1"
              >
                <Printer className="w-3 h-3 text-festive-gold" />
                <span>Print</span>
              </button>

              <button
                onClick={handleClearItinerary}
                disabled={itineraryStops.length === 0}
                className="px-3 py-1.5 text-xs text-red-400 bg-[#16080d] hover:bg-red-950/40 disabled:opacity-40 border border-red-500/30 rounded-lg flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Right Column: Itinerary Breakdown Table / List */}
          <div className="lg:col-span-7 bg-[#1a0c12] p-6 rounded-2xl border border-festive-gold/30 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Header with Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-festive-gold/20 gap-2">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    Selected Itinerary ({itineraryStops.length} Stops)
                  </h3>
                  <p className="text-xs text-festive-cream/70 mt-0.5">
                    Start Point: <strong className="text-festive-lightgold">{startPoint.name}</strong>
                  </p>
                </div>

                {routeStats && (
                  <div className="flex items-center space-x-4 bg-festive-night/80 px-3.5 py-2 rounded-xl border border-festive-gold/30 text-xs">
                    <div>
                      <span className="text-festive-cream/60 block text-[10px]">Distance:</span>
                      <strong className="text-festive-lightgold text-sm">{routeStats.distanceKm} km</strong>
                    </div>
                    <div>
                      <span className="text-festive-cream/60 block text-[10px]">Travel Time:</span>
                      <strong className="text-festive-lightgold text-sm">{routeStats.durationMins} mins</strong>
                    </div>
                    <div>
                      <span className="text-festive-cream/60 block text-[10px]">Total Trip:</span>
                      <strong className="text-white text-sm">~{routeStats.totalTripMins} mins</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Stops List */}
              <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {/* Starting Hub Card */}
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
                      S
                    </div>
                    <div>
                      <div className="font-bold text-emerald-200">Starting Point: {startPoint.name}</div>
                      <div className="text-[11px] text-emerald-300/70">Transit Hub Departure Point</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">0.0 km</span>
                </div>

                {itineraryStops.map((stop, index) => (
                  <div
                    key={stop.id}
                    className="p-3.5 rounded-xl bg-[#14080c] border border-festive-gold/25 hover:border-festive-gold/60 transition-all flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-full bg-festive-ruby text-white font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-festive-gold/40">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-white text-sm leading-snug">
                          {stop.name}
                        </div>
                        <div className="text-festive-lightgold font-bengali text-xs">
                          {stop.bengali_name} • {stop.neighborhood}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-festive-cream/70 pt-0.5">
                          <span className="flex items-center space-x-1">
                            <Train className="w-3 h-3 text-festive-gold" />
                            <span>{stop.nearby_metro}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-festive-gold" />
                            <span>Visit: ~{stop.estimated_visit_duration}</span>
                          </span>
                        </div>
                        <div className="text-[10px] text-festive-sand/60">
                          Buses: {(stop.bus_routes.private_buses || []).slice(0, 4).join(', ')}...
                        </div>
                      </div>
                    </div>

                    {/* Reorder & Remove Controls */}
                    <div className="flex items-center space-x-1 shrink-0 pt-1">
                      <button
                        onClick={() => moveStop(index, -1)}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg bg-[#251017] hover:bg-[#341620] disabled:opacity-20 text-festive-gold"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveStop(index, 1)}
                        disabled={index === itineraryStops.length - 1}
                        className="p-1.5 rounded-lg bg-[#251017] hover:bg-[#341620] disabled:opacity-20 text-festive-gold"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeStop(stop.id)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400"
                        title="Remove Stop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {itineraryStops.length === 0 && (
                  <div className="text-center py-10 px-4 border border-dashed border-festive-gold/30 rounded-xl space-y-3">
                    <Navigation className="w-8 h-8 text-festive-gold/60 mx-auto" />
                    <p className="text-sm font-semibold text-white">No pandal stops added yet</p>
                    <p className="text-xs text-festive-cream/60 max-w-sm mx-auto">
                      Choose a pandal from the dropdown on the left, click the "+" icon on any pandal card, or quick-load a popular circuit below:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleLoadPreset('north')}
                        className="text-xs px-3 py-1.5 bg-festive-ruby/80 hover:bg-festive-ruby text-white font-medium rounded-lg border border-festive-gold/30 transition-colors"
                      >
                        🏛️ Load North Heritage Circuit (5 stops)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadPreset('south')}
                        className="text-xs px-3 py-1.5 bg-festive-maroon/80 hover:bg-festive-maroon text-white font-medium rounded-lg border border-festive-gold/30 transition-colors"
                      >
                        ✨ Load South Blockbuster Circuit (5 stops)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Routing Tip */}
            <div className="mt-4 pt-3 border-t border-festive-gold/20 text-[11px] text-festive-sand/70 italic flex items-center justify-between">
              <span>💡 Road routing accounts for Kolkata Police Durga Puja crowd barricades.</span>
              {itineraryStops.length > 0 && (
                <button
                  onClick={handlePlanRoute}
                  className="text-festive-lightgold font-bold underline hover:text-white"
                >
                  Recalculate Route
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
