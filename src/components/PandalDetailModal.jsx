import React from 'react';
import { X, MapPin, Train, Bus, Clock, Calendar, CheckCircle2, AlertCircle, Plus, Check, FileText } from 'lucide-react';

export default function PandalDetailModal({ pandal, onClose, onAddToItinerary, isAdded }) {
  if (!pandal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1b0b11] border-2 border-festive-gold/60 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-festive-ruby via-festive-crimson to-festive-maroon border-b border-festive-gold/30 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/40 text-festive-sand border border-festive-gold/40">
                {pandal.region}
              </span>
              <span className="text-xs font-mono text-festive-sand/90">
                Pandal #{pandal.pandal_number} • ID: {pandal.id}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight">
              {pandal.name}
            </h2>
            <p className="text-lg font-bengali font-bold text-festive-lightgold">
              {pandal.bengali_name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-festive-sand hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Location & Verification Box */}
          <div className="p-4 rounded-2xl bg-[#12070a] border border-festive-gold/25 space-y-2">
            <div className="flex items-start space-x-2 text-sm text-festive-cream/90">
              <MapPin className="w-4 h-4 text-festive-gold shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-festive-sand">Verified Address:</span> {pandal.address}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>{pandal.verification_status}</span>
              </div>
              <div className="font-mono text-festive-sand/70">
                Lat: {pandal.latitude.toFixed(5)}, Lng: {pandal.longitude.toFixed(5)}
              </div>
            </div>

            <div className="text-xs text-festive-cream/70 pt-1">
              <strong>Neighborhood Cluster:</strong> {pandal.neighborhood}
            </div>
          </div>

          {/* Highlights & Crowd Advisories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-festive-maroon/30 border border-festive-gold/20">
              <span className="font-bold text-festive-lightgold block mb-1">Estimated Visit Duration:</span>
              <span className="text-white text-sm font-semibold">{pandal.estimated_visit_duration}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-festive-maroon/30 border border-festive-gold/20">
              <span className="font-bold text-festive-lightgold block mb-1">Recommended Visiting Hours:</span>
              <span className="text-white text-xs">{pandal.best_visiting_time}</span>
            </div>
          </div>

          <div className="text-xs text-festive-cream/80 bg-[#14080c] p-3.5 rounded-xl border border-festive-gold/20 leading-relaxed">
            <strong className="text-festive-sand block mb-1">Cultural Highlights &amp; History:</strong>
            {pandal.highlights}
          </div>

          {/* Nearby Stations */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-festive-gold uppercase tracking-wider flex items-center space-x-2">
              <Train className="w-4 h-4" />
              <span>Nearby Railway &amp; Metro Stations</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#12070a] border border-festive-gold/20">
                <div className="font-bold text-festive-sand">Nearby Metro Station:</div>
                <div className="text-white mt-0.5">{pandal.nearby_metro}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#12070a] border border-festive-gold/20">
                <div className="font-bold text-festive-sand">Nearby Railway Station:</div>
                <div className="text-white mt-0.5">{pandal.nearby_railway}</div>
              </div>
            </div>
          </div>

          {/* Bus Information from Source PDF */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-festive-gold uppercase tracking-wider flex items-center space-x-2">
              <Bus className="w-4 h-4" />
              <span>Public Bus Routes (Extracted from Source PDF)</span>
            </h4>

            <div className="p-4 rounded-xl bg-[#12070a] border border-festive-gold/20 space-y-2 text-xs">
              <div>
                <strong className="text-festive-sand">Private Buses:</strong>{' '}
                <span className="text-white">
                  {pandal.bus_routes.private_buses && pandal.bus_routes.private_buses.length > 0
                    ? pandal.bus_routes.private_buses.join(', ')
                    : 'None listed in guide'}
                </span>
              </div>
              <div>
                <strong className="text-festive-sand">Mini Buses:</strong>{' '}
                <span className="text-white">
                  {pandal.bus_routes.mini_buses && pandal.bus_routes.mini_buses.length > 0
                    ? pandal.bus_routes.mini_buses.join(' • ')
                    : 'None listed in guide'}
                </span>
              </div>
              <div>
                <strong className="text-festive-sand">Government Buses (WBTC):</strong>{' '}
                <span className="text-white">
                  {pandal.bus_routes.government_buses && pandal.bus_routes.government_buses.length > 0
                    ? pandal.bus_routes.government_buses.join(', ')
                    : 'None listed in guide'}
                </span>
              </div>
              <div>
                <strong className="text-festive-sand">AC Buses:</strong>{' '}
                <span className="text-white">
                  {pandal.bus_routes.ac_buses && pandal.bus_routes.ac_buses.length > 0
                    ? pandal.bus_routes.ac_buses.join(', ')
                    : 'None listed in guide'}
                </span>
              </div>

              <p className="text-[11px] text-festive-cream/60 italic pt-1 border-t border-festive-gold/15">
                Note: Bus routes are associated with the {pandal.neighborhood} neighborhood cluster in the source guide.
              </p>
            </div>
          </div>

          {/* Bus Timings & Live Status Feature */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-festive-gold uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Bus Timings &amp; Service Status</span>
            </h4>

            {pandal.bus_timings && pandal.bus_timings.length > 0 ? (
              <div className="space-y-2.5">
                {pandal.bus_timings.map((t, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#14080c] border border-festive-gold/25 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-festive-lightgold text-sm">
                        Route {t.route} ({t.bus_type})
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">
                        {t.service_status}
                      </span>
                    </div>

                    <div className="text-festive-cream/90">
                      <strong>Boarding:</strong> {t.boarding_stop} ➔ <strong>Destination:</strong> {t.destination}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-festive-cream/70">
                      <div>First Bus: <strong className="text-white">{t.first_service}</strong></div>
                      <div>Last Bus: <strong className="text-white">{t.last_service}</strong></div>
                      <div>Frequency: <strong className="text-white">{t.frequency}</strong></div>
                    </div>

                    <div className="text-[10px] text-festive-sand/60 pt-1 border-t border-festive-gold/15 flex justify-between">
                      <span>Source: {t.source}</span>
                      <span>Verified: {t.last_verified}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#14080c] border border-festive-gold/20 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-amber-300">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-semibold">Bus route listed in the provided guide. Exact timetable not available.</span>
                </div>
                <div className="flex items-center space-x-2 text-festive-cream/60">
                  <Clock className="w-4 h-4" />
                  <span>Live bus tracking unavailable.</span>
                </div>
              </div>
            )}
          </div>

          {/* Source Document Traceability */}
          <div className="p-3 rounded-xl bg-[#100609] border border-festive-gold/20 flex items-center justify-between text-xs font-mono text-festive-sand/80">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-festive-gold" />
              <span>Source Document: {pandal.source_pdf}</span>
            </div>
            <span>Page {pandal.source_page}</span>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 bg-black/40 border-t border-festive-gold/30 flex items-center justify-between gap-3">
          <button
            onClick={() => onAddToItinerary(pandal)}
            className={`py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
              isAdded
                ? 'bg-emerald-800 text-white border border-emerald-400'
                : 'bg-gradient-to-r from-festive-ruby to-festive-crimson hover:from-red-700 hover:to-festive-ruby text-white border border-festive-gold/50 shadow-lg'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Itinerary</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-festive-gold" />
                <span>Add to My Itinerary</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-festive-maroon/60 hover:bg-festive-maroon text-festive-sand text-xs sm:text-sm font-semibold border border-festive-gold/30"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
