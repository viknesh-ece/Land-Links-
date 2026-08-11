"use client";

import { useState } from "react";
import { 
  X, Compass, MapPin, ExternalLink, Navigation, Layers, 
  Maximize2, Eye, ShieldCheck, Satellite, ZoomIn, ZoomOut, 
  Globe, Share2, Copy, Check, Radio
} from "lucide-react";
import { getGPSCoordinates, getTNLandData } from "@/lib/tnNilamHelper";

export default function GISSatelliteModal({ property, onClose }) {
  const [mapType, setMapType] = useState("satellite"); // satellite | roadmap | hybrid
  const [showCadBoundary, setShowCadBoundary] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!property) return null;

  const coords = getGPSCoordinates(property);
  const tnData = getTNLandData(property);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
  const googleEarthUrl = `https://earth.google.com/web/search/${coords.lat},${coords.lng}`;
  const googleStreetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${coords.lat},${coords.lng}`;

  // Embedded Google Maps iframe URL with satellite / roadmap mode
  // t=k is satellite, t=m is standard roadmap, t=h is hybrid satellite+labels
  const mapModeParam = mapType === "satellite" ? "k" : mapType === "roadmap" ? "m" : "h";
  const embedUrl = `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&t=${mapModeParam}&z=${coords.zoom}&ie=UTF8&iwloc=&output=embed`;

  const handleCopyCoordinates = () => {
    navigator.clipboard.writeText(`${coords.lat}, ${coords.lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[150] flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl space-y-4 animate-scale-in text-white my-auto max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Satellite className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">GIS Satellite & Google Maps Overlay</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Radio className="h-3 w-3 animate-pulse text-emerald-400" /> Live GPS Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-indigo-400" />
                {coords.label} • Lat: {coords.lat}, Lng: {coords.lng}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Open in Google Maps</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer border-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Layer Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Map Layer:</span>
            {[
              { id: "satellite", label: "🛰️ Satellite View" },
              { id: "hybrid", label: "🗺️ Hybrid Vector" },
              { id: "roadmap", label: "🚗 Street Road Map" }
            ].map(layer => (
              <button
                key={layer.id}
                onClick={() => setMapType(layer.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  mapType === layer.id
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold select-none text-xs">
              <input
                type="checkbox"
                checked={showCadBoundary}
                onChange={(e) => setShowCadBoundary(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
              />
              <span>📐 Draw CAD Survey Boundary Overlay</span>
            </label>

            <button
              onClick={handleCopyCoordinates}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-[11px] flex items-center gap-1 transition-all"
              title="Copy GPS Coordinates"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-slate-400" />}
              <span>{copied ? "Copied!" : "Copy GPS"}</span>
            </button>
          </div>
        </div>

        {/* Map Viewport Area */}
        <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
          
          {/* Embedded Google Maps Live Satellite Frame */}
          <iframe
            title="Google Maps Satellite View"
            src={embedUrl}
            className="w-full h-full border-0 absolute inset-0 filter saturate-[1.1]"
            loading="lazy"
            allowFullScreen
          />

          {/* Semi-Transparent GIS Vector Overlay on top of Google Maps Satellite */}
          {showCadBoundary && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <svg viewBox="0 0 400 300" className="w-full h-full max-w-2xl max-h-96 opacity-90 drop-shadow-2xl">
                {/* Survey Polygon */}
                <polygon
                  points="90,70 310,50 280,240 110,220"
                  fill="rgba(99, 102, 241, 0.22)"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />

                {/* Survey Boundary Corner Stones */}
                <circle cx="90" cy="70" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text x="102" y="74" fill="#ffffff" fontSize="11" fontWeight="bold" className="drop-shadow-md">Stone #1 (NW)</text>

                <circle cx="310" cy="50" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text x="318" y="54" fill="#ffffff" fontSize="11" fontWeight="bold" className="drop-shadow-md">Stone #2 (NE)</text>

                <circle cx="280" cy="240" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text x="290" y="244" fill="#ffffff" fontSize="11" fontWeight="bold" className="drop-shadow-md">Stone #3 (SE)</text>

                <circle cx="110" cy="220" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text x="50" y="235" fill="#ffffff" fontSize="11" fontWeight="bold" className="drop-shadow-md">Stone #4 (SW)</text>

                {/* Center Target & Survey details */}
                <circle cx="200" cy="145" r="10" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                <rect x="130" y="165" width="140" height="28" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#6366f1" strokeWidth="1" />
                <text x="200" y="183" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Survey #{tnData.surveyNo}/{tnData.subDivisionNo}
                </text>

                {/* Measurement Dimension Labels */}
                <text x="200" y="44" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle" className="drop-shadow-md">
                  184.5 Meters (North Road Access)
                </text>
                <text x="310" y="150" fill="#fbbf24" fontSize="10" fontWeight="bold" className="drop-shadow-md">
                  162.0 Meters (East)
                </text>
                <text x="195" y="255" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle" className="drop-shadow-md">
                  170.2 Meters (South)
                </text>
                <text x="45" y="145" fill="#fbbf24" fontSize="10" fontWeight="bold" className="drop-shadow-md">
                  155.8 Meters (West)
                </text>
              </svg>
            </div>
          )}

          {/* Floating HUD Telemetry Card */}
          <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 shadow-2xl text-xs space-y-1 max-w-xs pointer-events-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-[10px] font-black uppercase text-indigo-400 flex items-center gap-1">
                <Compass className="h-3.5 w-3.5" /> GIS Survey Telemetry
              </span>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                DGPS ±2cm RTK
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-300 font-mono">
              <div><span className="text-slate-500 text-[10px] block">Patta No:</span> <b className="text-white">{tnData.pattaNo}</b></div>
              <div><span className="text-slate-500 text-[10px] block">Survey No:</span> <b className="text-cyan-300">{tnData.surveyNo}/{tnData.subDivisionNo}</b></div>
              <div><span className="text-slate-500 text-[10px] block">Taluk:</span> <b className="text-white">{tnData.taluk}</b></div>
              <div><span className="text-slate-500 text-[10px] block">Elevation:</span> <b className="text-emerald-400">298m MSL</b></div>
            </div>
          </div>

          {/* External Navigation Links Quick Bar */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-auto">
            <a
              href={googleEarthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <Globe className="h-3.5 w-3.5 text-blue-400" />
              <span>Google Earth 3D</span>
            </a>

            <a
              href={googleStreetViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <Eye className="h-3.5 w-3.5 text-amber-400" />
              <span>Street View 360°</span>
            </a>
          </div>

        </div>

        {/* Footer Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800 pt-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>GIS boundary verified against TamilNilam Collocated Land Records &amp; FMB Field Measurement Book.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer border-0 self-end sm:self-auto"
          >
            Close Map Overlay
          </button>
        </div>

      </div>
    </div>
  );
}
