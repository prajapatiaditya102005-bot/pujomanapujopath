import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroDurga from './components/HeroDurga.jsx';
import HowrahBridgeSection from './components/HowrahBridgeSection.jsx';
import RegionSelector from './components/RegionSelector.jsx';
import InteractiveMap from './components/InteractiveMap.jsx';
import PandalDirectory from './components/PandalDirectory.jsx';
import PandalDetailModal from './components/PandalDetailModal.jsx';
import RoutePlanner from './components/RoutePlanner.jsx';
import TransportGuide from './components/TransportGuide.jsx';
import TravelSmarter from './components/TravelSmarter.jsx';
import GuideDownloadsModal from './components/GuideDownloadsModal.jsx';
import Footer from './components/Footer.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

// Import Authentic Datasets
import northPandals from './data/north_kolkata_pandals.json';
import southPandals from './data/south_kolkata_pandals.json';
import centralPandals from './data/central_kolkata_pandals.json';
import transportData from './data/transport_routes.json';
import trafficData from './data/traffic_advisories.json';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All Kolkata');
  const [selectedPandal, setSelectedPandal] = useState(null);
  const [detailsModalPandal, setDetailsModalPandal] = useState(null);
  const [guidesModalOpen, setGuidesModalOpen] = useState(false);
  const [itineraryStops, setItineraryStops] = useState([]);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [routeStats, setRouteStats] = useState(null);

  // Combine all pandals
  const allPandals = useMemo(() => {
    return [...northPandals, ...southPandals, ...centralPandals];
  }, []);

  // Quick initial loading screen simulation for smooth asset mounting
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Add / Remove from itinerary handler
  const handleAddToItinerary = (pandal) => {
    if (!itineraryStops.some((s) => s.id === pandal.id)) {
      setItineraryStops((prev) => [...prev, pandal]);
    } else {
      // Remove if already added (toggle)
      setItineraryStops((prev) => prev.filter((s) => s.id !== pandal.id));
    }
  };

  // Select pandal and scroll to map
  const handleSelectPandalOnMap = (pandal) => {
    setSelectedPandal(pandal);
    const mapElement = document.getElementById('map');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Route calculation callback
  const handleCalculateRoute = (polyline, stats) => {
    setRoutePolyline(polyline);
    setRouteStats(stats);
  };

  // Show route and scroll to map
  const handleShowRouteOnMap = () => {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0507] text-festive-cream font-sans">
      
      {/* 1. Global Navbar */}
      <Navbar
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        onOpenGuides={() => setGuidesModalOpen(true)}
      />

      <main className="flex-grow">
        {/* 2. Animated Maa Durga Hero Section */}
        <HeroDurga
          onExploreMap={() => {
            const el = document.getElementById('map');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onPlanRoute={() => {
            const el = document.getElementById('planner');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenTransit={() => {
            const el = document.getElementById('transit');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenGuides={() => setGuidesModalOpen(true)}
        />

        {/* 3. Visual Howrah Bridge Section */}
        <HowrahBridgeSection />

        {/* 4. Explore Durga Puja Across Kolkata (North, South, Central Selection) */}
        <RegionSelector
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          northCount={northPandals.length}
          southCount={southPandals.length}
          centralCount={centralPandals.length}
        />

        {/* 5. Interactive Embedded Leaflet Map */}
        <InteractiveMap
          pandals={allPandals}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedPandal={selectedPandal}
          setSelectedPandal={setSelectedPandal}
          onAddToItinerary={handleAddToItinerary}
          itineraryStops={itineraryStops}
          routePolyline={routePolyline}
          routeStats={routeStats}
          onOpenDetailsModal={(p) => setDetailsModalPandal(p)}
        />

        {/* 6. Pandal Directory with Search & Filtering */}
        <PandalDirectory
          pandals={allPandals}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          onSelectPandalOnMap={handleSelectPandalOnMap}
          onOpenDetailsModal={(p) => setDetailsModalPandal(p)}
          onAddToItinerary={handleAddToItinerary}
          itineraryStops={itineraryStops}
        />

        {/* 7. Bus Routes & Public Transport Guide */}
        <TransportGuide
          transportData={transportData}
          pandals={allPandals}
        />

        {/* 8. Plan My Puja Night Smart Route Planner */}
        <RoutePlanner
          pandals={allPandals}
          itineraryStops={itineraryStops}
          setItineraryStops={setItineraryStops}
          onCalculateRoute={handleCalculateRoute}
          onShowRouteOnMap={handleShowRouteOnMap}
          routeStats={routeStats}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />

        {/* 9. Travel Smarter This Puja (Traffic, Diversions & Crowd Advisories) */}
        <TravelSmarter trafficData={trafficData} />
      </main>

      {/* 10. Global Footer */}
      <Footer onOpenGuides={() => setGuidesModalOpen(true)} />

      {/* Detail Modal for Selected Pandal */}
      {detailsModalPandal && (
        <PandalDetailModal
          pandal={detailsModalPandal}
          onClose={() => setDetailsModalPandal(null)}
          onAddToItinerary={handleAddToItinerary}
          isAdded={itineraryStops.some((s) => s.id === detailsModalPandal.id)}
        />
      )}

      {/* Translated PDF Source Guides & Download Modal */}
      <GuideDownloadsModal
        isOpen={guidesModalOpen}
        onClose={() => setGuidesModalOpen(false)}
      />

    </div>
  );
}
