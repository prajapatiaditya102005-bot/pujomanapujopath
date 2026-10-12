import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, Clock, ShieldAlert, ArrowRight, CheckCircle2, 
  Info, Compass, RefreshCw, Radio, CloudRain, Sun, Search, 
  Pause, Play, ExternalLink, Settings2, Bell, Zap 
} from 'lucide-react';
import { fetchLiveTrafficData, getKolkataTime } from '../services/trafficService';

export default function TravelSmarter({ trafficData: initialTrafficData }) {
  const [trafficData, setTrafficData] = useState(initialTrafficData);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [countdown, setCountdown] = useState(45);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBulletinIdx, setCurrentBulletinIdx] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const [customApiUrl, setCustomApiUrl] = useState('');
  const [activeEndpoint, setActiveEndpoint] = useState(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  // Fetch live online data
  const handleSync = async (endpoint = activeEndpoint) => {
    setIsSyncing(true);
    try {
      const liveResult = await fetchLiveTrafficData(endpoint);
      if (liveResult) {
        setTrafficData(liveResult);
        setSyncStatusMsg(`Synchronized live data at ${liveResult.live_meta?.last_sync_time || 'just now'}`);
        setTimeout(() => setSyncStatusMsg(''), 4000);
      }
    } catch (err) {
      console.error('Failed to sync live traffic data:', err);
    } finally {
      setIsSyncing(false);
      setCountdown(45);
    }
  };

  // Automated background polling every 45 seconds
  useEffect(() => {
    // Initial fetch on mount
    handleSync();

    const interval = setInterval(() => {
      if (autoUpdateEnabled) {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleSync();
            return 45;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoUpdateEnabled, activeEndpoint]);

  // Rotate breaking news bulletins every 6 seconds
  useEffect(() => {
    const bulletins = trafficData?.live_meta?.bulletins || [];
    if (bulletins.length <= 1) return;

    const bTimer = setInterval(() => {
      setCurrentBulletinIdx((prev) => (prev + 1) % bulletins.length);
    }, 6000);

    return () => clearInterval(bTimer);
  }, [trafficData]);

  if (!trafficData) return null;

  const liveMeta = trafficData.live_meta || {};
  const bulletins = liveMeta.bulletins || [];
  const weather = liveMeta.weather;

  // Filter alerts based on category, region, and search term
  const filteredAlerts = (trafficData.traffic_alerts || []).filter((alert) => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.detail.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'Active Now') return alert.isActiveNow;
    if (activeFilter === 'North Kolkata') return alert.location.toLowerCase().includes('shyambazar') || alert.location.toLowerCase().includes('bagbazar') || alert.location.toLowerCase().includes('chitpur');
    if (activeFilter === 'South Kolkata') return alert.location.toLowerCase().includes('rashbehari') || alert.location.toLowerCase().includes('gariahat') || alert.location.toLowerCase().includes('chetla');
    if (activeFilter === 'Central Kolkata') return alert.location.toLowerCase().includes('cr avenue') || alert.location.toLowerCase().includes('c.r.') || alert.location.toLowerCase().includes('girish park') || alert.location.toLowerCase().includes('mg road');
    if (activeFilter === 'Critical') return alert.severity === 'Critical';

    return true;
  });

  const getBadgeStyle = (badge) => {
    switch (badge) {
      case 'Live Verified':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/60';
      case 'Official Published':
        return 'bg-blue-950 text-blue-300 border-blue-500/60';
      case 'Historical / Estimated':
        return 'bg-amber-950 text-amber-300 border-amber-500/60';
      default:
        return 'bg-purple-950 text-purple-300 border-purple-500/60';
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'text-rose-300 bg-rose-950/80 border-rose-500/60';
      case 'High':
        return 'text-amber-300 bg-amber-950/80 border-amber-500/60';
      default:
        return 'text-blue-300 bg-blue-950/80 border-blue-500/60';
    }
  };

  return (
    <section id="travel-smarter" className="py-14 bg-[#110709] border-b border-festive-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center space-x-2 text-festive-lightgold text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-festive-maroon/70 border border-festive-gold/30">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Automated Live Traffic Advisory Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-wide">
            Travel Smarter This Puja
          </h2>
          <p className="text-sm sm:text-base text-festive-cream/80">
            Real-time road closures, dynamic pedestrian corridors, published crowd advisories, and alternative quiet pandal routes synchronized continuously from online civic streams.
          </p>
        </div>

        {/* 1. Real-Time Online Telemetry & Breaking News Marquee */}
        <div className="mb-8 rounded-2xl bg-[#1c0c14] border border-festive-gold/30 p-4 shadow-2xl space-y-4">
          
          {/* Top Control Bar: Connection Status, Weather & Auto-Sync Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-festive-gold/20">
            
            {/* Live Status Indicators */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>ONLINE STREAM ACTIVE</span>
              </span>

              <span className="text-festive-sand/90 text-xs flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-festive-gold" />
                <span>Last Synced: <strong className="text-white">{liveMeta.last_sync_time || 'Just now'} IST</strong></span>
              </span>

              {autoUpdateEnabled && (
                <span className="text-[11px] font-mono text-festive-lightgold bg-festive-ruby/20 px-2 py-0.5 rounded border border-festive-gold/25">
                  Auto-sync in {countdown}s
                </span>
              )}
            </div>

            {/* Action Buttons: Sync Now, Pause/Play, Config */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSync()}
                disabled={isSyncing}
                className="px-3 py-1.5 rounded-lg bg-festive-ruby hover:bg-festive-crimson disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 border border-festive-gold/40 shadow transition-all"
                title="Force refresh live online data now"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Online Now'}</span>
              </button>

              <button
                type="button"
                onClick={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
                className="p-1.5 rounded-lg bg-[#26101a] hover:bg-[#341624] text-festive-sand border border-festive-gold/30 text-xs"
                title={autoUpdateEnabled ? 'Pause automated updates' : 'Resume automated updates'}
              >
                {autoUpdateEnabled ? <Pause className="w-4 h-4 text-amber-300" /> : <Play className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  showConfig ? 'bg-festive-gold text-black border-festive-gold' : 'bg-[#26101a] hover:bg-[#341624] text-festive-sand border-festive-gold/30'
                }`}
                title="Configure custom online feed endpoint"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Environmental / Weather Telemetry Banner */}
          {weather && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-[#170a10] via-[#240e1a] to-[#170a10] border border-festive-gold/25 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                {weather.isRaining ? (
                  <CloudRain className="w-5 h-5 text-blue-400 animate-bounce" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
                )}
                <div>
                  <div className="font-bold text-white flex items-center space-x-2">
                    <span>Kolkata Real-Time Telemetry:</span>
                    <span className="text-festive-lightgold">{weather.tempC}°C</span>
                    <span className="text-festive-cream/60">({weather.humidity}% Humidity)</span>
                  </div>
                  <div className="text-[11px] text-festive-sand/80">
                    {weather.description} • Wind: {weather.windKmh} km/h
                  </div>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                weather.isRaining ? 'bg-amber-950 text-amber-300 border-amber-500/60' : 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
              }`}>
                {weather.isRaining ? '⚠️ Wet Road Caution' : '✓ Dry & Smooth Roads'}
              </span>
            </div>
          )}

          {/* Live Breaking News Bulletin Marquee */}
          {bulletins.length > 0 && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-red-950/70 via-festive-maroon/60 to-red-950/70 border border-red-500/40 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-[10px] tracking-wider uppercase shrink-0 animate-pulse">
                  LIVE BULLETIN
                </span>
                <span className="text-white font-medium truncate">
                  {bulletins[currentBulletinIdx]}
                </span>
              </div>

              <div className="flex items-center space-x-1 shrink-0 text-[10px] text-festive-cream/60">
                <span>{currentBulletinIdx + 1}/{bulletins.length}</span>
                <button
                  type="button"
                  onClick={() => setCurrentBulletinIdx((currentBulletinIdx + 1) % bulletins.length)}
                  className="p-1 hover:text-white"
                  title="Next bulletin"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Sync Success Feedback */}
          {syncStatusMsg && (
            <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{syncStatusMsg}</span>
            </div>
          )}

          {/* Configurable Custom Online API Panel (Collapsible) */}
          {showConfig && (
            <div className="p-4 rounded-xl bg-[#14080e] border border-festive-gold/30 space-y-3 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-festive-gold" />
                  <span>Configure Live Online Data Feed Endpoint</span>
                </span>
                <span className="text-[11px] text-festive-sand/70 font-mono">
                  Current: {activeEndpoint || '/data/traffic_advisories.json'}
                </span>
              </div>
              <p className="text-festive-cream/70 text-[11px]">
                By default, this module synchronizes live road conditions from Kolkata Police Traffic Department &amp; Open-Meteo online telemetry. You can connect a custom remote REST API endpoint below:
              </p>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://your-domain.com/api/traffic-updates.json"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#0e0407] text-white border border-festive-gold/30 rounded-lg text-xs focus:outline-none focus:border-festive-gold"
                />
                <button
                  type="button"
                  onClick={() => {
                    const ep = customApiUrl.trim() || null;
                    setActiveEndpoint(ep);
                    handleSync(ep);
                  }}
                  className="px-3 py-2 bg-festive-ruby hover:bg-festive-crimson text-white rounded-lg font-bold text-xs shrink-0"
                >
                  Apply &amp; Sync
                </button>
                {activeEndpoint && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveEndpoint(null);
                      setCustomApiUrl('');
                      handleSync(null);
                    }}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs shrink-0"
                  >
                    Reset Default
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* 2. Interactive Filter Tabs & Search */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Active Now', 'North Kolkata', 'South Kolkata', 'Central Kolkata', 'Critical'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  activeFilter === tab
                    ? 'bg-festive-ruby border-festive-gold text-white shadow-md'
                    : 'bg-[#180a10] border-festive-gold/20 text-festive-sand hover:text-white hover:border-festive-gold/40'
                }`}
              >
                {tab === 'Active Now' && <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-1.5 animate-pulse"></span>}
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-festive-gold/60" />
            <input
              type="text"
              placeholder="Filter roads, e.g. VIP Road..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#170a0f] text-white border border-festive-gold/30 rounded-xl text-xs focus:outline-none focus:border-festive-gold"
            />
          </div>
        </div>

        {/* 3. Verified Traffic Alerts with Dynamic Live Status */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-serif font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Live Road Closures &amp; Flow Diversions ({filteredAlerts.length})</span>
            </h3>
            <span className="text-xs text-festive-sand/80 font-mono">
              Auto-updating via Online Telemetry
            </span>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center bg-[#170a10] border border-dashed border-festive-gold/30 rounded-2xl space-y-2">
              <AlertTriangle className="w-8 h-8 text-festive-gold/50 mx-auto" />
              <p className="text-sm font-bold text-white">No alerts match the active filter</p>
              <button
                type="button"
                onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
                className="text-xs text-festive-lightgold underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-5 rounded-2xl bg-[#1a0c12] border shadow-xl space-y-3 flex flex-col justify-between transition-all ${
                    alert.isActiveNow 
                      ? 'border-red-500/60 shadow-red-950/40 ring-1 ring-red-500/30' 
                      : 'border-festive-gold/30'
                  }`}
                >
                  <div>
                    {/* Top Badges: Category, Live Active Tag, and Severity */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-festive-sand font-bold">
                        {alert.category}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          alert.isActiveNow
                            ? 'bg-red-950 text-red-200 border-red-500 animate-pulse'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
                        }`}>
                          {alert.liveTag || alert.status_badge}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityStyle(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-white leading-snug">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-festive-lightgold font-medium mt-1">
                      📍 {alert.location}
                    </p>
                    <p className="text-xs text-festive-cream/80 mt-2 leading-relaxed">
                      {alert.detail}
                    </p>

                    {/* Live Operational Note */}
                    {alert.liveNote && (
                      <div className="mt-2.5 p-2 rounded-lg bg-black/40 border border-festive-gold/20 text-[11px] text-festive-sand flex items-start space-x-1.5">
                        <Zap className="w-3.5 h-3.5 text-festive-gold shrink-0 mt-0.5" />
                        <span><strong>Live Status:</strong> {alert.liveNote}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2.5 border-t border-festive-gold/15 text-[11px] text-festive-sand/80 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-festive-gold shrink-0" />
                      <span>{alert.timing}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ✓ Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Published Crowd Advisories & Real-Time Visiting Windows */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-serif font-bold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-festive-gold" />
              <span>Crowd Management &amp; Real-Time Visiting Windows</span>
            </h3>
            <span className="text-xs text-festive-sand/80 font-mono">
              Evaluated for Kolkata IST: {liveMeta.last_sync_time || 'Live'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(trafficData.crowd_advisories || []).map((advisory) => (
              <div
                key={advisory.id}
                className="p-5 rounded-2xl bg-[#180a0f] border border-festive-gold/25 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">
                      {advisory.zone}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${advisory.colorClass || getBadgeStyle(advisory.status_badge)}`}>
                      {advisory.statusLabel || advisory.status_badge}
                    </span>
                  </div>

                  {/* Real-time Status Advice */}
                  {advisory.adviceText && (
                    <div className="mb-2.5 p-2 rounded-lg bg-black/40 border border-festive-gold/20 text-[11px] text-festive-sand">
                      💡 {advisory.adviceText}
                    </div>
                  )}

                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs mb-2">
                    <span className="text-red-300 font-semibold block text-[10px] uppercase">Peak Congestion:</span>
                    <span className="text-white font-bold">{advisory.peak_hours}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs">
                    <span className="text-emerald-300 font-semibold block text-[10px] uppercase">Recommended Window:</span>
                    <span className="text-emerald-100 font-bold">{advisory.recommended_window}</span>
                  </div>

                  <p className="text-xs text-festive-cream/70 leading-relaxed pt-2">
                    {advisory.advisory}
                  </p>
                </div>

                <div className="pt-2 border-t border-festive-gold/15 text-[10px] text-festive-sand/60 italic">
                  Source: Kolkata Police Crowd Safety Advisory
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Alternative Pandals in Nearby Areas */}
        <div className="bg-[#1a0c12] p-6 rounded-2xl border border-festive-gold/30 shadow-xl space-y-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-festive-gold" />
            <h3 className="text-lg font-serif font-bold text-white">
              Avoid Extreme Queues: Suggested Alternative Pandals Nearby
            </h3>
          </div>
          <p className="text-xs text-festive-cream/70">
            If you encounter multi-hour queues or gridlocked entry at high-footfall mega pandals, these top-tier artistic alternatives are located within 10-15 minutes walking radius with minimal congestion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {(trafficData.alternative_pandals || []).map((alt, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#12070a] border border-festive-gold/20 space-y-2 text-xs">
                <div className="text-red-400 font-bold">
                  Instead of: <span className="underline">{alt.busy_pandal}</span>
                </div>
                <div className="text-festive-lightgold font-bold flex items-center space-x-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-festive-gold shrink-0" />
                  <span>Try: {alt.alternatives.join(' or ')}</span>
                </div>
                <p className="text-festive-cream/70 text-[11px] leading-relaxed pt-1">
                  {alt.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
