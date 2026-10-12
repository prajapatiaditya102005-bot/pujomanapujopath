import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Search, Filter, MapPin, Navigation, RotateCcw, Crosshair, 
  Bus, Train, CheckCircle2, AlertCircle, Plus, Info, X 
} from 'lucide-react';

export default function InteractiveMap({
  pandals,
  selectedRegion,
  setSelectedRegion,
  selectedPandal,
  setSelectedPandal,
  onAddToItinerary,
  itineraryStops = [],
  routePolyline = null,
  routeStats = null,
  onOpenDetailsModal
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [startPointSelection, setStartPointSelection] = useState('none');

  // Major Kolkata Transit Starting Hubs
  const transitHubs = [
    { id: 'hwh', name: 'Howrah Junction Railway Station', lat: 22.5838, lng: 88.3426 },
    { id: 'sdah', name: 'Sealdah Railway Station', lat: 22.5668, lng: 88.3712 },
    { id: 'esp', name: 'Esplanade Metro Interchange', lat: 22.5645, lng: 88.3516 },
    { id: 'shyam', name: 'Shyambazar Five Point Crossing', lat: 22.6006, lng: 88.3718 },
    { id: 'gariahat', name: 'Gariahat Crossing (Pantaloons)', lat: 22.5186, lng: 88.3655 },
    { id: 'airport', name: 'Netaji Subhash Chandra Bose Airport', lat: 22.6547, lng: 88.4467 }
  ];

  // Helper to build color-coded SVG Leaflet icons
  const createMarkerIcon = (region, isSelected = false) => {
    let pinColor = '#EF4444'; // Red for North
    let ringColor = '#7F1D1D';
    if (region === 'South Kolkata') {
      pinColor = '#EC4899'; // Pink/Maroon for South
      ringColor = '#831843';
    } else if (region === 'Central Kolkata') {
      pinColor = '#F59E0B'; // Amber Gold for Central
      ringColor = '#78350F';
    }

    const size = isSelected ? 40 : 32;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${pinColor}" stroke="${isSelected ? '#FFFDF7' : ringColor}" stroke-width="${isSelected ? '2.5' : '1.5'}" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.6));">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3" fill="#FFFDF7"/>
      </svg>
    `;

    return L.divIcon({
      html: svg,
      className: 'pandal-pin',
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size + 4]
    });
  };

  const createUserLocationIcon = () => {
    const svg = `
      <div style="position: relative; width: 28px; height: 28px;">
        <div style="position: absolute; inset: 0; background: rgba(16, 185, 129, 0.4); border-radius: 9999px; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 28px; height: 28px; background: #059669; border: 2.5px solid #FFFFFF; border-radius: 9999px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.4);">
          <div style="width: 8px; height: 8px; background: #FFFFFF; border-radius: 9999px;"></div>
        </div>
      </div>
    `;
    return L.divIcon({
      html: svg,
      className: 'user-pin',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  };

  // 1. Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Centered on Kolkata Central (22.5726, 88.3639)
      const map = L.map(mapContainerRef.current, {
        center: [22.565, 88.363],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Standard OSM Tile Layer with proper attribution
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Pujo Mana PujoPath',
        maxZoom: 19
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // We keep map instance for smooth performance during component lifecycle
    };
  }, []);

  // 2. Filter pandals based on Region, Neighborhood, and Search Query
  const filteredPandals = pandals.filter((p) => {
    const matchesRegion = selectedRegion === 'All Kolkata' || p.region === selectedRegion;
    const matchesNeighborhood = selectedNeighborhood === 'All' || p.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase());
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bengali_name.includes(searchQuery) ||
      p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nearby_metro && p.nearby_metro.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.bus_routes && p.bus_routes.private_buses && p.bus_routes.private_buses.some((b) => b.includes(searchQuery)));

    return matchesRegion && matchesNeighborhood && matchesSearch;
  });

  // Extract unique neighborhoods for the selected region
  const availableNeighborhoods = [
    'All',
    ...Array.from(
      new Set(
        pandals
          .filter((p) => selectedRegion === 'All Kolkata' || p.region === selectedRegion)
          .map((p) => p.neighborhood.split('/')[0].trim())
      )
    )
  ];

  // 3. Update Markers on the Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredPandals.forEach((pandal) => {
      const isSelected = selectedPandal && selectedPandal.id === pandal.id;
      const marker = L.marker([pandal.latitude, pandal.longitude], {
        icon: createMarkerIcon(pandal.region, isSelected),
        title: pandal.name
      });

      // Construct Rich Popup
      const popupHtml = `
        <div style="font-family: 'Inter', system-ui, sans-serif; font-size: 13px; max-width: 260px;">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #F59E0B; margin-bottom: 2px;">
            ${pandal.region} • ${pandal.neighborhood}
          </div>
          <div style="font-size: 15px; font-weight: 800; color: #FFFFFF; line-height: 1.25; margin-bottom: 3px;">
            ${pandal.name}
          </div>
          <div style="font-size: 13px; color: #FBBF24; font-family: 'Hind Siliguri', sans-serif; margin-bottom: 6px;">
            ${pandal.bengali_name}
          </div>
          <div style="font-size: 11px; color: #E5E7EB; margin-bottom: 6px; line-height: 1.35;">
            📍 ${pandal.address}
          </div>
          <div style="font-size: 11px; color: #9CA3AF; margin-bottom: 8px;">
            🚇 <strong>Metro:</strong> ${pandal.nearby_metro}
          </div>
          <div style="font-size: 10px; color: #FDE68A; margin-bottom: 10px;">
            🚌 <strong>Buses:</strong> ${(pandal.bus_routes.private_buses || []).slice(0, 4).join(', ')}...
          </div>
          <div style="display: flex; gap: 6px;">
            <button id="popup-add-${pandal.id}" style="flex: 1; background: #991B1B; color: #FFFFFF; border: 1px solid #F59E0B; border-radius: 6px; padding: 6px 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
              + Add to Route
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setSelectedPandal(pandal);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-add-${pandal.id}`);
        if (btn) {
          btn.onclick = () => {
            onAddToItinerary(pandal);
          };
        }
      });

      markersLayerRef.current.addLayer(marker);
    });

    // Auto-fit bounds if we have filtered pandals
    if (filteredPandals.length > 0 && searchQuery.trim() !== '') {
      const group = L.featureGroup(markersLayerRef.current.getLayers());
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15));
    }
  }, [filteredPandals, selectedPandal]);

  // 4. Center map when a specific pandal is selected externally
  useEffect(() => {
    if (selectedPandal && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedPandal.latitude, selectedPandal.longitude], 15, {
        animate: true,
        duration: 0.8
      });
    }
  }, [selectedPandal]);

  // 5. Draw Route Polyline on Map if available
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerRef.current) return;

    routeLayerRef.current.clearLayers();

    if (routePolyline && routePolyline.length > 1) {
      // Draw outer glowing line
      const glowLine = L.polyline(routePolyline, {
        color: '#F59E0B',
        weight: 7,
        opacity: 0.5,
        lineCap: 'round',
        lineJoin: 'round'
      });

      // Draw primary path line
      const mainLine = L.polyline(routePolyline, {
        color: '#DC2626',
        weight: 4,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '8, 8'
      });

      routeLayerRef.current.addLayer(glowLine);
      routeLayerRef.current.addLayer(mainLine);

      // Fit bounds to entire route
      mapInstanceRef.current.fitBounds(mainLine.getBounds().pad(0.2));
    }
  }, [routePolyline]);

  // 6. Handle Browser Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current) {
          if (userMarkerRef.current) {
            mapInstanceRef.current.removeLayer(userMarkerRef.current);
          }
          userMarkerRef.current = L.marker([latitude, longitude], {
            icon: createUserLocationIcon(),
            title: 'Your Current Location'
          })
            .addTo(mapInstanceRef.current)
            .bindPopup('<strong>You are here</strong><br>GPS Location verified')
            .openPopup();

          mapInstanceRef.current.setView([latitude, longitude], 14);
        }
      },
      (err) => {
        setIsLocating(false);
        alert('Could not access current location: ' + err.message + '\nPlease select a nearby station from the starting point selector.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // 7. Handle Starting Hub Selector
  const handleHubSelect = (hubId) => {
    setStartPointSelection(hubId);
    if (hubId === 'none') {
      if (userMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      return;
    }

    const hub = transitHubs.find((h) => h.id === hubId);
    if (hub && mapInstanceRef.current) {
      if (userMarkerRef.current) {
        mapInstanceRef.current.removeLayer(userMarkerRef.current);
      }
      userMarkerRef.current = L.marker([hub.lat, hub.lng], {
        icon: createUserLocationIcon(),
        title: hub.name
      })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<strong>Starting Point:</strong><br>${hub.name}`)
        .openPopup();

      mapInstanceRef.current.setView([hub.lat, hub.lng], 14);
    }
  };

  // 8. Reset Filters & Map View
  const handleResetMap = () => {
    setSearchQuery('');
    setSelectedNeighborhood('All');
    setSelectedRegion('All Kolkata');
    setSelectedPandal(null);
    setStartPointSelection('none');
    if (routeLayerRef.current) routeLayerRef.current.clearLayers();
    if (userMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([22.565, 88.363], 12);
    }
  };

  return (
    <section id="map" className="py-14 bg-[#110709] border-b border-festive-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-festive-lightgold text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-festive-maroon/70 border border-festive-gold/30 mb-2">
              <MapPin className="w-3.5 h-3.5 text-festive-gold" />
              <span>Interactive Leaflet Map</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-wide">
              Kolkata Durga Puja Interactive Map
            </h2>
            <p className="text-sm text-festive-cream/80 max-w-2xl mt-1">
              Live, real-time map with verified coordinates, region color markers, neighborhood clustering, route calculation, and starting point selectors.
            </p>
          </div>

          {/* Reset Filters & Clear Map Button */}
          <button
            onClick={handleResetMap}
            className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-festive-maroon/60 hover:bg-festive-maroon text-festive-sand border border-festive-gold/30 text-xs font-semibold flex items-center space-x-2 transition-all shadow"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Map &amp; Filters</span>
          </button>
        </div>

        {/* Map Control Toolbar */}
        <div className="bg-[#1c0d13] p-4 rounded-2xl border border-festive-gold/30 shadow-xl mb-6 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-festive-gold absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by pandal name, metro, or bus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#12070a] text-white border border-festive-gold/30 rounded-xl focus:outline-none focus:border-festive-gold placeholder-festive-cream/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-festive-cream/60 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Region Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#12070a] text-white border border-festive-gold/30 rounded-xl focus:outline-none focus:border-festive-gold cursor-pointer"
            >
              <option value="All Kolkata">All Kolkata ({pandals.length})</option>
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
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#12070a] text-white border border-festive-gold/30 rounded-xl focus:outline-none focus:border-festive-gold cursor-pointer"
            >
              {availableNeighborhoods.map((nb) => (
                <option key={nb} value={nb}>
                  {nb === 'All' ? 'All Neighborhoods' : nb}
                </option>
              ))}
            </select>
          </div>

          {/* Starting Location Selector */}
          <div className="md:col-span-3 flex items-center space-x-2">
            <select
              value={startPointSelection}
              onChange={(e) => handleHubSelect(e.target.value)}
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#12070a] text-white border border-festive-gold/30 rounded-xl focus:outline-none focus:border-festive-gold cursor-pointer"
            >
              <option value="none">Set Start Point...</option>
              {transitHubs.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>

            {/* GPS Geolocation Button */}
            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              className="p-2 bg-festive-ruby hover:bg-festive-crimson disabled:opacity-50 text-white rounded-xl border border-festive-gold/40 transition-all shrink-0 shadow"
              title="Use Current GPS Location"
            >
              <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            </button>
          </div>

        </div>

        {/* Map Body: Left Interactive Map, Right Selected Pandal Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Leaflet Map Container */}
          <div className="lg:col-span-8 bg-[#180a0f] rounded-2xl border-2 border-festive-gold/40 shadow-2xl overflow-hidden relative">
            
            {/* Map Container Element */}
            <div
              ref={mapContainerRef}
              style={{ height: '560px', width: '100%' }}
              className="z-10"
            />

            {/* Map Color Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-20 bg-[#16090d]/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-festive-gold/30 shadow-lg text-xs space-y-1.5 pointer-events-auto">
              <div className="font-bold text-[11px] text-festive-sand uppercase tracking-wider mb-1">
                Marker Legend
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-600 border border-white" />
                <span className="text-festive-cream/90">North Kolkata</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-pink-600 border border-white" />
                <span className="text-festive-cream/90">South Kolkata</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-white" />
                <span className="text-festive-cream/90">Central Kolkata</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
                <span className="text-festive-cream/90">Your Origin / Hub</span>
              </div>
            </div>

            {/* Active Polyline Route Banner if drawn */}
            {routeStats && (
              <div className="absolute top-4 left-4 z-20 bg-[#1f0a12]/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-festive-gold/50 shadow-xl text-xs flex items-center space-x-3 pointer-events-auto">
                <Navigation className="w-4 h-4 text-festive-gold animate-bounce" />
                <div>
                  <div className="font-bold text-festive-lightgold">
                    Active Route Displayed
                  </div>
                  <div className="text-festive-cream/80 text-[11px]">
                    Total Distance: <strong className="text-white">{routeStats.distanceKm} km</strong> • Approx Travel Time: <strong className="text-white">{routeStats.durationMins} mins</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Pandals Count Badge */}
            <div className="absolute top-4 right-4 z-20 bg-[#16090d]/90 px-3 py-1.5 rounded-lg border border-festive-gold/30 text-xs font-semibold text-festive-sand shadow pointer-events-auto">
              Showing {filteredPandals.length} of {pandals.length} Pandals
            </div>

          </div>

          {/* Right Column: Selected Pandal Detail Sidebar */}
          <div className="lg:col-span-4 bg-[#1a0c12] rounded-2xl border border-festive-gold/30 p-5 shadow-2xl flex flex-col justify-between min-h-[560px]">
            {selectedPandal ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-festive-ruby text-white border border-festive-gold/30">
                    {selectedPandal.region}
                  </span>
                  <span className="text-xs font-mono font-semibold text-festive-gold">
                    Pandal #{selectedPandal.pandal_number}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-black text-white leading-tight">
                    {selectedPandal.name}
                  </h3>
                  <p className="text-base font-bengali font-semibold text-festive-lightgold mt-0.5">
                    {selectedPandal.bengali_name}
                  </p>
                  <p className="text-xs font-medium text-festive-sand/80 mt-1">
                    {selectedPandal.neighborhood}
                  </p>
                </div>

                {/* Verified Address & Geolocation */}
                <div className="p-3 rounded-xl bg-festive-night/80 border border-festive-gold/20 space-y-1.5 text-xs">
                  <div className="text-festive-cream/90 flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-festive-gold shrink-0 mt-0.5" />
                    <span>{selectedPandal.address}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-400 text-[11px] font-medium pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{selectedPandal.verification_status}</span>
                  </div>
                  <div className="text-[10px] font-mono text-festive-sand/60">
                    Coords: {selectedPandal.latitude.toFixed(4)}, {selectedPandal.longitude.toFixed(4)}
                  </div>
                </div>

                {/* Public Transit Connections */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start space-x-2 text-festive-cream/80">
                    <Train className="w-4 h-4 text-festive-gold shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-festive-sand">Nearby Metro:</div>
                      <div>{selectedPandal.nearby_metro}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 text-festive-cream/80">
                    <Bus className="w-4 h-4 text-festive-gold shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-festive-sand">Nearby Bus Routes:</div>
                      <div className="text-[11px] text-festive-cream/90 mt-0.5">
                        {(selectedPandal.bus_routes.private_buses || []).join(', ')}
                        {selectedPandal.bus_routes.government_buses && ` | Govt: ${selectedPandal.bus_routes.government_buses.join(', ')}`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Source PDF Traceability */}
                <div className="pt-2 text-[11px] text-festive-cream/60 border-t border-festive-gold/15 flex justify-between items-center font-mono">
                  <span>Source: {selectedPandal.source_pdf}</span>
                  <span>Page {selectedPandal.source_page}</span>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 space-y-2">
                  <button
                    onClick={() => onAddToItinerary(selectedPandal)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-festive-ruby to-festive-crimson hover:from-red-700 hover:to-festive-ruby text-white font-semibold text-xs border border-festive-gold/40 flex items-center justify-center space-x-2 transition-all shadow"
                  >
                    <Plus className="w-4 h-4 text-festive-gold" />
                    <span>Add to Route Planner</span>
                  </button>

                  <button
                    onClick={() => onOpenDetailsModal(selectedPandal)}
                    className="w-full py-2 px-4 rounded-xl bg-[#261017] hover:bg-[#341620] text-festive-sand font-medium text-xs border border-festive-gold/25 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Info className="w-3.5 h-3.5 text-festive-gold" />
                    <span>View Full Details &amp; Bus Timings</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center my-auto p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-festive-maroon/40 border border-festive-gold/30 flex items-center justify-center text-festive-gold">
                  <MapPin className="w-8 h-8 animate-bounce" />
                </div>
                <h4 className="text-lg font-serif font-bold text-white">
                  Select Any Pandal Marker
                </h4>
                <p className="text-xs text-festive-cream/70 max-w-xs leading-relaxed">
                  Click on any marker pin on the map to inspect its verified address, nearest metro station, cataloged bus numbers, and source guide page.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (filteredPandals.length > 0) setSelectedPandal(filteredPandals[0]);
                    }}
                    className="px-4 py-2 rounded-xl bg-festive-ruby/40 hover:bg-festive-ruby/70 text-festive-sand border border-festive-gold/30 text-xs font-semibold"
                  >
                    Inspect Featured Pandal
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Tip */}
            <div className="mt-4 pt-3 border-t border-festive-gold/15 text-[11px] text-festive-sand/70 italic text-center">
              💡 Drag, zoom, and explore directly inside Pujo Mana PujoPath.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
