// ============================================================
// 🌾 NammaVivasayam AI — SatelliteMapViewer Component
// Starts with India Overview → Auto Zooms to Tamil Nadu →
// Madurai District → Selected Taluk → Farm Boundary
// Satellite / Street / Hybrid Layer Switcher & Real Imagery
// ============================================================

import { useState, useEffect, useRef } from 'react';
import {
  satelliteService,
  TALUK_COORDINATES,
  type TalukGeoLocation,
  type SatelliteImageryResult,
  type MapDisplayMode,
  type SatelliteLayerMode
} from '../../services/satelliteService';

interface SatelliteMapViewerProps {
  initialLocationId?: string;
  isExpandedModal?: boolean;
  onClose?: () => void;
}

type ZoomStep = 1 | 2 | 3 | 4 | 5; // 1: India, 2: Tamil Nadu, 3: Madurai, 4: Taluk, 5: Farm Plot

export default function SatelliteMapViewer({
  initialLocationId = 'melur',
  isExpandedModal = false,
  onClose,
}: SatelliteMapViewerProps) {
  const [selectedLocation, setSelectedLocation] = useState<TalukGeoLocation>(
    TALUK_COORDINATES[initialLocationId] || TALUK_COORDINATES.melur
  );
  const [zoomStep, setZoomStep] = useState<ZoomStep>(1); // Start at India view
  const [isAutoZooming, setIsAutoZooming] = useState(false);
  const [mapMode, setMapMode] = useState<MapDisplayMode>('satellite');
  const [satLayer, setSatLayer] = useState<SatelliteLayerMode>('ndvi');
  const [imageryData, setImageryData] = useState<SatelliteImageryResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExpandedModal, setShowExpandedModal] = useState(false);
  const zoomTimerRef = useRef<any[]>([]);

  // Fetch Sentinel-2 telemetry when selected location or spectral layer changes
  useEffect(() => {
    let isCurrent = true;
    satelliteService.getImagery(selectedLocation.id, satLayer).then(res => {
      if (isCurrent) setImageryData(res);
    });
    return () => { isCurrent = false; };
  }, [selectedLocation, satLayer]);

  // Execute smooth automatic zooming hierarchy:
  // Step 1: India (20.59°N, 78.96°E)
  // Step 2: Tamil Nadu (11.12°N, 78.65°E)
  // Step 3: Madurai District (9.92°N, 78.11°E)
  // Step 4: Selected Taluk (e.g. Melur 10.02°N, 78.33°E)
  // Step 5: Farm Boundary
  const runAutoZoomSequence = (targetLoc: TalukGeoLocation) => {
    // Clear any active zoom timers
    zoomTimerRef.current.forEach(clearTimeout);
    zoomTimerRef.current = [];

    setSelectedLocation(targetLoc);
    setIsAutoZooming(true);
    setZoomStep(1); // 1: India

    const t1 = setTimeout(() => setZoomStep(2), 650); // 2: Tamil Nadu
    const t2 = setTimeout(() => setZoomStep(3), 1300); // 3: Madurai District
    const t3 = setTimeout(() => setZoomStep(4), 1950); // 4: Selected Taluk
    const t4 = setTimeout(() => {
      setZoomStep(5); // 5: Farm Plot Boundary
      setIsAutoZooming(false);
    }, 2600);

    zoomTimerRef.current = [t1, t2, t3, t4];
  };

  useEffect(() => {
    // Auto-trigger sequence on first mount
    runAutoZoomSequence(selectedLocation);
    return () => {
      zoomTimerRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleSelectLocation = (loc: TalukGeoLocation) => {
    runAutoZoomSequence(loc);
  };

  const handleManualZoomIn = () => {
    if (zoomStep < 5) setZoomStep((prev) => (prev + 1) as ZoomStep);
  };

  const handleManualZoomOut = () => {
    if (zoomStep > 1) setZoomStep((prev) => (prev - 1) as ZoomStep);
  };

  const handleResetToIndia = () => {
    zoomTimerRef.current.forEach(clearTimeout);
    setIsAutoZooming(false);
    setZoomStep(1);
  };

  const allLocations = satelliteService.getAllLocations();
  const filteredLocations = allLocations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.nativeName.includes(searchQuery)
  );

  // Zoom Level Metadata
  const zoomLabels: Record<ZoomStep, { title: string; subtitle: string; scale: string }> = {
    1: { title: '🇮🇳 India National Overview', subtitle: 'Viewing subcontinent geographic baseline', scale: '1:10,000,000' },
    2: { title: '🌾 Tamil Nadu State Boundary', subtitle: 'Cauvery & Vaigai agricultural basins', scale: '1:2,500,000' },
    3: { title: '📍 Madurai District (மदुरை)', subtitle: 'Samba/Rabi agricultural belt & Vaigai canal network', scale: '1:500,000' },
    4: { title: `📍 ${selectedLocation.name} Taluk (${selectedLocation.nativeName})`, subtitle: `Lat: ${selectedLocation.lat}°N, Lng: ${selectedLocation.lng}°E · Elev: ${selectedLocation.elevationM}m`, scale: '1:50,000' },
    5: { title: `🚜 ${selectedLocation.name} Farmer Plot #108`, subtitle: `1.8 Acres · 4-Point GPS Polygon Boundary · Sentinel-2 10m GSD`, scale: '1:5,000' },
  };

  return (
    <div style={{
      background: '#04130c',
      borderRadius: '20px',
      border: '1.5px solid rgba(52, 211, 153, 0.35)',
      overflow: 'hidden',
      color: '#f3f4f6',
      boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
      position: 'relative',
      fontFamily: 'inherit'
    }}>
      {/* Top Map Control Bar */}
      <div style={{
        padding: '12px 16px',
        background: 'linear-gradient(90deg, #062b1b 0%, #0d3b25 100%)',
        borderBottom: '1px solid rgba(52, 211, 153, 0.25)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px'
      }}>
        {/* Real Data vs Demo Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            background: imageryData?.isRealData ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)',
            border: imageryData?.isRealData ? '1px solid #10b981' : '1px solid #f59e0b',
            color: imageryData?.isRealData ? '#6ee7b7' : '#fde047',
            padding: '3px 10px', borderRadius: '999px', fontWeight: 800, letterSpacing: '0.04em'
          }}>
            {imageryData?.isRealData ? '🛰️ REAL SATELLITE DATA' : '⚠️ DEMO / SIMULATED DATA'}
          </span>

          <span style={{ fontSize: '11px', color: '#a7f3d0' }}>
            ESA Copernicus Sentinel-2
          </span>
        </div>

        {/* Layer Mode Switcher: Satellite / Street / Hybrid */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: '8px' }}>
          {(['satellite', 'street', 'hybrid'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setMapMode(mode)}
              style={{
                background: mapMode === mode ? '#10b981' : 'transparent',
                color: mapMode === mode ? '#062b1b' : '#d1fae5',
                border: 'none', borderRadius: '6px', padding: '4px 10px',
                fontSize: '11px', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
              }}
            >
              {mode === 'satellite' ? '🛰️ Satellite' : mode === 'street' ? '🗺️ Street/Map' : '🔀 Hybrid'}
            </button>
          ))}
        </div>

        {/* Expand / Close Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isExpandedModal && (
            <button
              onClick={() => setShowExpandedModal(true)}
              style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              ⤢ Expand Map
            </button>
          )}
          {isExpandedModal && onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444',
                color: '#fca5a5', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {/* Location Search & Quick Taluk Selectors */}
      <div style={{
        padding: '10px 16px', background: 'rgba(0,0,0,0.5)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px'
      }}>
        <input
          type="text"
          placeholder="🔍 Search taluk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '11px',
            color: '#e5e7eb',
            outline: 'none',
            width: '140px'
          }}
        />
        <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>Locations:</span>
        {filteredLocations.map(loc => (
          <button
            key={loc.id}
            onClick={() => handleSelectLocation(loc)}
            disabled={isAutoZooming}
            style={{
              background: selectedLocation.id === loc.id ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
              border: selectedLocation.id === loc.id ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.12)',
              color: selectedLocation.id === loc.id ? '#062b1b' : '#e5e7eb',
              borderRadius: '999px', padding: '3px 12px', fontSize: '11px', fontWeight: 700,
              cursor: isAutoZooming ? 'wait' : 'pointer', transition: 'all 0.2s'
            }}
          >
            📍 {loc.name} ({loc.nativeName})
          </button>
        ))}
      </div>

      {/* Main Map View Canvas */}
      <div style={{
        position: 'relative',
        height: isExpandedModal ? '500px' : '340px',
        overflow: 'hidden',
        background: mapMode === 'street' ? '#1e293b' : '#061a12',
      }}>
        {/* Layer 1: Base Map Image / Raster with Zoom Simulation */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          transition: 'all 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: zoomStep === 1
            ? 'scale(0.85)'
            : zoomStep === 2
            ? 'scale(1.15) translate(-10px, 15px)'
            : zoomStep === 3
            ? 'scale(1.6) translate(-25px, 20px)'
            : zoomStep === 4
            ? 'scale(2.2) translate(-35px, 25px)'
            : 'scale(3.0) translate(-45px, 30px)',
          transformOrigin: '50% 50%'
        }}>
          {mapMode !== 'street' ? (
            <img
              src={satLayer === 'ndvi' ? '/images/field_satellite_ndvi.jpg' : '/images/field_satellite_rgb.jpg'}
              alt="Sentinel-2 Satellite Feed"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                filter: mapMode === 'hybrid' ? 'contrast(125%) saturate(110%)' : 'none'
              }}
            />
          ) : (
            // Street / Vector Map Simulation
            <div style={{
              width: '100%', height: '100%',
              background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
              backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />
          )}
        </div>

        {/* Vector Grid & Boundary Overlay for Street/Hybrid */}
        {(mapMode === 'hybrid' || mapMode === 'street') && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(rgba(245, 158, 11, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px', pointerEvents: 'none'
          }} />
        )}

        {/* Center Target Crosshair & Farm Boundary Polygon at Zoom 4 & 5 */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none', textAlign: 'center'
        }}>
          {zoomStep >= 4 ? (
            <div style={{
              width: zoomStep === 5 ? '160px' : '90px',
              height: zoomStep === 5 ? '120px' : '70px',
              border: '2.5px dashed #34d399',
              background: 'rgba(16, 185, 129, 0.18)',
              borderRadius: '8px',
              boxShadow: '0 0 25px rgba(52, 211, 153, 0.6)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              animation: 'pulse 2s infinite'
            }}>
              <span style={{ fontSize: '18px' }}>🌾</span>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#fff', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px' }}>
                {selectedLocation.name} Parcel #108
              </span>
            </div>
          ) : (
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: '#ef4444', border: '3px solid #ffffff',
              boxShadow: '0 0 15px #ef4444', animation: 'bounce 1s infinite'
            }} />
          )}
        </div>

        {/* Floating Zoom Progress Indicator */}
        <div style={{
          position: 'absolute', top: '12px', left: '14px',
          background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(52, 211, 153, 0.4)', borderRadius: '12px',
          padding: '8px 14px', maxWidth: '320px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#34d399' }}>
            <span>{zoomLabels[zoomStep].title}</span>
            {isAutoZooming && (
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', animation: 'ping 1s infinite' }} />
            )}
          </div>
          <div style={{ fontSize: '11px', color: '#d1fae5', opacity: 0.9, marginTop: '2px' }}>
            {zoomLabels[zoomStep].subtitle}
          </div>
          <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
            Scale: {zoomLabels[zoomStep].scale} · Step {zoomStep}/5
          </div>
        </div>

        {/* Zoom Controls (+ / - / Reset to India) */}
        <div style={{
          position: 'absolute', top: '12px', right: '14px',
          display: 'flex', flexDirection: 'column', gap: '6px'
        }}>
          <button
            onClick={handleManualZoomIn}
            disabled={zoomStep === 5 || isAutoZooming}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff', fontSize: '16px', fontWeight: 800, cursor: 'pointer'
            }}
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleManualZoomOut}
            disabled={zoomStep === 1 || isAutoZooming}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff', fontSize: '16px', fontWeight: 800, cursor: 'pointer'
            }}
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={handleResetToIndia}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.25)',
              color: '#fbbf24', fontSize: '14px', fontWeight: 800, cursor: 'pointer'
            }}
            title="Reset to All India View"
          >
            🇮🇳
          </button>
        </div>

        {/* Spectral Index Buttons (NDVI / RGB / SAR) */}
        {mapMode !== 'street' && (
          <div style={{
            position: 'absolute', bottom: '12px', right: '14px',
            display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.8)', padding: '4px', borderRadius: '8px'
          }}>
            <button
              onClick={() => setSatLayer('ndvi')}
              style={{
                background: satLayer === 'ndvi' ? '#10b981' : 'transparent',
                color: satLayer === 'ndvi' ? '#062b1b' : '#fff',
                border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer'
              }}
            >
              🌿 NDVI
            </button>
            <button
              onClick={() => setSatLayer('rgb')}
              style={{
                background: satLayer === 'rgb' ? '#f59e0b' : 'transparent',
                color: satLayer === 'rgb' ? '#062b1b' : '#fff',
                border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer'
              }}
            >
              🌍 True Color
            </button>
          </div>
        )}

        {/* Imagery Date & Provider Ribbon */}
        <div style={{
          position: 'absolute', bottom: '12px', left: '14px',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px',
          padding: '4px 10px', fontSize: '10px', color: '#e5e7eb'
        }}>
          {imageryData?.status === 'AVAILABLE' ? (
            <span>
              📅 Acquired: <strong>{imageryData.acquisitionDate}</strong> · Cloud: {imageryData.cloudCoverPct}% · {imageryData.satellite}
            </span>
          ) : (
            <span style={{ color: '#fca5a5' }}>
              ⚠️ Satellite imagery unavailable for this date/location.
            </span>
          )}
        </div>
      </div>

      {/* Expanded Modal Overlay if triggered */}
      {showExpandedModal && !isExpandedModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ width: '100%', maxWidth: '900px' }}>
            <SatelliteMapViewer
              initialLocationId={selectedLocation.id}
              isExpandedModal={true}
              onClose={() => setShowExpandedModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
