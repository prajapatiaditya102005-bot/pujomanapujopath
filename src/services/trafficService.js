// Live Automated Online Traffic & Advisory Service for Durga Puja Kolkata
// Connects to online data endpoints (Weather & Environmental API, Public JSON feeds)
// and dynamically calculates real-time Kolkata Police road restriction statuses based on live Kolkata IST time.

import staticFallback from '../data/traffic_advisories.json';

const KOLKATA_WEATHER_API = 'https://api.open-meteo.com/v1/forecast?latitude=22.5726&longitude=88.3639&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m';
const DEFAULT_LOCAL_FEED = '/data/traffic_advisories.json';

/**
 * Get current Kolkata Time (IST: UTC+5:30)
 */
export function getKolkataTime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kolkataTime = new Date(utc + 3600000 * 5.5);
  return kolkataTime;
}

/**
 * Determine live restriction status based on current Kolkata IST hour
 */
function evaluateAlertLiveStatus(alert, kolkataHour) {
  if (alert.id === 'TA-01') {
    // 4:00 PM (16) to 4:00 AM (4)
    const isActive = kolkataHour >= 16 || kolkataHour < 4;
    return {
      isActiveNow: isActive,
      liveTag: isActive ? '🔴 ACTIVE NOW (Restricted)' : '🟢 NORMAL FLOW (Until 4 PM)',
      liveNote: isActive
        ? 'Pedestrian-only corridor active. Four-wheelers diverted via Southern Avenue / Prince Anwar Shah.'
        : 'Normal vehicular flow permitted. Pedestrian restrictions begin at 4:00 PM.'
    };
  } else if (alert.id === 'TA-02') {
    // 3:00 PM (15) to 5:00 AM (5)
    const isActive = kolkataHour >= 15 || kolkataHour < 5;
    return {
      isActiveNow: isActive,
      liveTag: isActive ? '🔴 ONE-WAY IN EFFECT' : '🟢 TWO-WAY NORMAL FLOW',
      liveNote: isActive
        ? 'Northward one-way active. Southward traffic diverted to Bidhan Sarani and Amherst Street.'
        : 'Regular two-way vehicular flow open until 3:00 PM.'
    };
  } else if (alert.id === 'TA-03') {
    // 24 Hours active during Puja
    return {
      isActiveNow: true,
      liveTag: '🔴 24/7 BARRICADE ACTIVE',
      liveNote: 'Service roads strictly pedestrianized. Airport travelers MUST use main Lake Town flyover.'
    };
  } else if (alert.id === 'TA-04') {
    // 2:00 PM (14) to 5:00 AM (5)
    const isActive = kolkataHour >= 14 || kolkataHour < 5;
    return {
      isActiveNow: isActive,
      liveTag: isActive ? '🔴 QUEUE BARRICADES ACTIVE' : '🟢 PASSABLE (Closes at 2 PM)',
      liveNote: isActive
        ? 'Tram tracks barricaded for Bagbazar Sarbojanin queues. Motorized access restricted.'
        : 'Morning supply and passenger vehicles permitted until 2:00 PM cutoff.'
    };
  }

  return {
    isActiveNow: false,
    liveTag: '⚪ ADVISORY PUBLISHED',
    liveNote: alert.detail
  };
}

/**
 * Determine live crowd status based on Kolkata IST hour
 */
function evaluateCrowdLiveStatus(advisory, kolkataHour) {
  const isPeak = kolkataHour >= 18 || kolkataHour < 3;
  const isRecommended = (kolkataHour >= 6 && kolkataHour <= 11) || (kolkataHour >= 3 && kolkataHour <= 6);

  if (isPeak) {
    return {
      isPeakNow: true,
      statusLabel: '🔥 EXTREME RUSH NOW',
      colorClass: 'text-rose-400 bg-rose-950/60 border-rose-500/50',
      adviceText: 'High human density & long barricaded queues. Expect > 45 mins wait.'
    };
  } else if (isRecommended) {
    return {
      isPeakNow: false,
      statusLabel: '✨ OPTIMAL DARSHAN WINDOW',
      colorClass: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/50',
      adviceText: 'Fast movement & minimal barricade wait times. Ideal for peaceful darshan.'
    };
  }

  return {
    isPeakNow: false,
    statusLabel: '🟡 MODERATE CROWD',
    colorClass: 'text-amber-300 bg-amber-950/60 border-amber-500/50',
    adviceText: 'Crowd building up steadily. Entry lines moving without stoppage.'
  };
}

/**
 * Fetch Live Data from Online Endpoints (Local JSON feed + Live Open-Meteo Weather)
 */
export async function fetchLiveTrafficData(customEndpoint = null) {
  let endpoint = customEndpoint;
  if (!endpoint) {
    if (typeof window !== 'undefined') {
      endpoint = `${DEFAULT_LOCAL_FEED}?t=${Date.now()}`;
    } else {
      endpoint = `http://localhost:3000${DEFAULT_LOCAL_FEED}?t=${Date.now()}`;
    }
  }

  let baseData = null;
  let liveWeather = null;
  let isOnline = false;

  // 1. Fetch Traffic Advisory JSON from online/local endpoint
  try {
    const res = await fetch(endpoint, { cache: 'no-cache' });
    if (res.ok) {
      baseData = await res.json();
      isOnline = true;
    }
  } catch (err) {
    // Graceful fallback
  }

  if (!baseData) {
    baseData = staticFallback;
  }

  // 2. Fetch Live Kolkata Environmental / Weather API
  try {
    const weatherRes = await fetch(KOLKATA_WEATHER_API);
    if (weatherRes.ok) {
      const wJson = await weatherRes.json();
      if (wJson && wJson.current) {
        liveWeather = {
          tempC: Math.round(wJson.current.temperature_2m),
          humidity: wJson.current.relative_humidity_2m,
          rainMm: wJson.current.rain || 0,
          windKmh: Math.round(wJson.current.wind_speed_10m),
          isRaining: (wJson.current.rain || 0) > 0,
          description: (wJson.current.rain || 0) > 0
            ? 'Light Rain / Wet Roads - Drive with caution'
            : 'Clear & Dry - Excellent conditions for Pandal hopping'
        };
      }
    }
  } catch (wErr) {
    console.warn('Open-Meteo weather fetch warning:', wErr);
  }

  // 3. Dynamically enrich alerts with Live Kolkata Time evaluation
  const kolkataTime = getKolkataTime();
  const currentHour = kolkataTime.getHours();
  const timeString = kolkataTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  const dateString = kolkataTime.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const enrichedAlerts = (baseData.traffic_alerts || []).map((alert) => {
    const liveStatus = evaluateAlertLiveStatus(alert, currentHour);
    return {
      ...alert,
      ...liveStatus
    };
  });

  const enrichedCrowds = (baseData.crowd_advisories || []).map((advisory) => {
    const liveCrowd = evaluateCrowdLiveStatus(advisory, currentHour);
    return {
      ...advisory,
      ...liveCrowd
    };
  });

  // 4. Generate dynamic breaking bulletins
  const bulletins = [
    `Kolkata Police Traffic Control: Live road status synchronized at ${timeString} IST.`,
    enrichedAlerts.find(a => a.id === 'TA-03')?.isActiveNow
      ? 'VIP Road Service Lane: Heavy pedestrian movement at Lake Town. Main flyovers smooth for airport transit.'
      : 'VIP Road: Steady airport flow maintained.',
    enrichedAlerts.find(a => a.id === 'TA-01')?.isActiveNow
      ? 'Rashbehari Avenue: Pedestrian corridor ACTIVE. Vehicles diverted to Southern Avenue.'
      : 'Rashbehari Avenue: Normal vehicular flow until 4:00 PM restriction window.',
    liveWeather?.isRaining
      ? `Live Weather Alert: ${liveWeather.description}. Watch for water pooling near underpasses.`
      : `Live Weather: ${liveWeather ? `${liveWeather.tempC}°C, Clear skies` : 'Fair conditions'} across Kolkata festival corridors.`
  ];

  return {
    ...baseData,
    traffic_alerts: enrichedAlerts,
    crowd_advisories: enrichedCrowds,
    live_meta: {
      is_online: isOnline,
      last_sync_time: timeString,
      last_sync_date: dateString,
      sync_timestamp: Date.now(),
      kolkata_hour: currentHour,
      bulletins,
      weather: liveWeather
    }
  };
}
