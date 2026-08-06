"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, Eye, Layers, Maximize2, ShieldCheck, Sun, Zap, MapPin, Building, Activity, RotateCw } from "lucide-react";

export default function LandCanvas3D({ selectedProperty, activeVertical = "commercial" }) {
  const canvasRef = useRef(null);
  const [heatmapMode, setHeatmapMode] = useState("soil");
  const [viewAngle, setViewAngle] = useState(45);
  const [pitchAngle, setPitchAngle] = useState(55);
  const [showMassing, setShowMassing] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const animationFrameRef = useRef(null);

  const title = selectedProperty?.title || "10 Acres Prime Commercial Land";
  const location = selectedProperty?.location || "Devanahalli, Bangalore North";
  const price = selectedProperty?.price ? `₹ ${(selectedProperty.price / 10000000).toFixed(2)} Cr` : "₹ 4.50 Cr";
  const acres = selectedProperty?.price ? (selectedProperty.price / 15000000).toFixed(1) : "10.0";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 520);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    let currentAngle = viewAngle;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (autoRotate) {
        currentAngle = (currentAngle + 0.3) % 360;
      } else {
        currentAngle = viewAngle;
      }

      const centerX = width / 2;
      const centerY = height / 2 + 30;

      const radAngle = (currentAngle * Math.PI) / 180;
      const radPitch = (pitchAngle * Math.PI) / 180;

      const project3D = (x, y, z) => {
        const rx = x * Math.cos(radAngle) - z * Math.sin(radAngle);
        const rz = x * Math.sin(radAngle) + z * Math.cos(radAngle);

        const py = y * Math.cos(radPitch) - rz * Math.sin(radPitch);
        const pz = y * Math.sin(radPitch) + rz * Math.cos(radPitch);

        const scale = 360 / (360 + pz * 0.4);
        const screenX = centerX + rx * scale;
        const screenY = centerY + py * scale;

        return { x: screenX, y: screenY, scale };
      };

      const gridSize = 14;
      const step = 22;
      const startOffset = (-gridSize * step) / 2;

      for (let i = 0; i < gridSize - 1; i++) {
        for (let j = 0; j < gridSize - 1; j++) {
          const x1 = startOffset + i * step;
          const z1 = startOffset + j * step;

          const x2 = startOffset + (i + 1) * step;
          const z2 = startOffset + j * step;

          const x3 = startOffset + (i + 1) * step;
          const z3 = startOffset + (j + 1) * step;

          const x4 = startOffset + i * step;
          const z4 = startOffset + (j + 1) * step;

          const elev1 = Math.sin(i * 0.4 + z1 * 0.01) * 12 + Math.cos(j * 0.5) * 8;
          const elev2 = Math.sin((i + 1) * 0.4 + z2 * 0.01) * 12 + Math.cos(j * 0.5) * 8;
          const elev3 = Math.sin((i + 1) * 0.4 + z3 * 0.01) * 12 + Math.cos((j + 1) * 0.5) * 8;
          const elev4 = Math.sin(i * 0.4 + z4 * 0.01) * 12 + Math.cos((j + 1) * 0.5) * 8;

          const p1 = project3D(x1, -elev1, z1);
          const p2 = project3D(x2, -elev2, z2);
          const p3 = project3D(x3, -elev3, z3);
          const p4 = project3D(x4, -elev4, z4);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();

          let cellFill = "rgba(79, 70, 229, 0.08)";
          let cellStroke = "rgba(99, 102, 241, 0.25)";

          if (heatmapMode === "soil") {
            const intensity = 0.2 + 0.35 * Math.abs(Math.sin(i * 0.6 + j * 0.3));
            cellFill = `rgba(16, 185, 129, ${intensity})`;
            cellStroke = "rgba(52, 211, 153, 0.4)";
          } else if (heatmapMode === "water") {
            const intensity = 0.2 + 0.4 * Math.abs(Math.cos(i * 0.5 + j * 0.8));
            cellFill = `rgba(14, 165, 233, ${intensity})`;
            cellStroke = "rgba(56, 189, 248, 0.45)";
          } else if (heatmapMode === "logistics") {
            const distFromEdge = (i + j) / (gridSize * 2);
            cellFill = `rgba(245, 158, 11, ${0.15 + distFromEdge * 0.35})`;
            cellStroke = "rgba(251, 191, 36, 0.4)";
          } else if (heatmapMode === "solar") {
            const solarVal = 0.25 + 0.35 * Math.abs(Math.sin((i + j) * 0.4));
            cellFill = `rgba(244, 63, 94, ${solarVal})`;
            cellStroke = "rgba(251, 113, 133, 0.45)";
          }

          ctx.fillStyle = cellFill;
          ctx.fill();
          ctx.strokeStyle = cellStroke;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      const bMin = -gridSize * step * 0.35;
      const bMax = gridSize * step * 0.35;

      const bp1 = project3D(bMin, -15, bMin);
      const bp2 = project3D(bMax, -12, bMin);
      const bp3 = project3D(bMax, -10, bMax);
      const bp4 = project3D(bMin, -14, bMax);

      ctx.beginPath();
      ctx.moveTo(bp1.x, bp1.y);
      ctx.lineTo(bp2.x, bp2.y);
      ctx.lineTo(bp3.x, bp3.y);
      ctx.lineTo(bp4.x, bp4.y);
      ctx.closePath();
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(99, 102, 241, 0.12)";
      ctx.fill();

      if (showMassing) {
        const buildHeight = activeVertical === "commercial" ? 110 : activeVertical === "industrial" ? 60 : activeVertical === "residential" ? 130 : 40;
        const bWidth = activeVertical === "industrial" ? 120 : 70;
        const bDepth = activeVertical === "industrial" ? 100 : 70;

        const bx1 = -bWidth / 2;
        const bz1 = -bDepth / 2;
        const bx2 = bWidth / 2;
        const bz2 = bDepth / 2;

        const base1 = project3D(bx1, -12, bz1);
        const base2 = project3D(bx2, -12, bz1);
        const base3 = project3D(bx2, -12, bz2);
        const base4 = project3D(bx1, -12, bz2);

        const top1 = project3D(bx1, -12 - buildHeight, bz1);
        const top2 = project3D(bx2, -12 - buildHeight, bz1);
        const top3 = project3D(bx2, -12 - buildHeight, bz2);
        const top4 = project3D(bx1, -12 - buildHeight, bz2);

        const drawPoly = (pts, color, strokeColor) => {
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let k = 1; k < pts.length; k++) {
            ctx.lineTo(pts[k].x, pts[k].y);
          }
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        };

        const wallBase = activeVertical === "commercial" ? "rgba(99, 102, 241," : activeVertical === "industrial" ? "rgba(245, 158, 11," : "rgba(16, 185, 129,";
        
        drawPoly([base1, base2, top2, top1], `${wallBase} 0.65)`, `${wallBase} 0.9)`);
        drawPoly([base2, base3, top3, top2], `${wallBase} 0.80)`, `${wallBase} 0.95)`);
        drawPoly([top1, top2, top3, top4], `${wallBase} 0.90)`, "#ffffff");

        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 0.8;
        const floors = Math.floor(buildHeight / 12);
        for (let f = 1; f < floors; f++) {
          const fy = -12 - f * 12;
          const lineP1 = project3D(bx2, fy, bz1);
          const lineP2 = project3D(bx2, fy, bz2);
          ctx.beginPath();
          ctx.moveTo(lineP1.x, lineP1.y);
          ctx.lineTo(lineP2.x, lineP2.y);
          ctx.stroke();
        }

        const pinTop = project3D(0, -12 - buildHeight - 25, 0);
        ctx.beginPath();
        ctx.arc(pinTop.x, pinTop.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#6366f1";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`Proposed FSI 3.2 (Height: ${buildHeight}m)`, pinTop.x, pinTop.y - 12);
      }

      const cornerPin = project3D(bMax, -12, bMax);
      ctx.beginPath();
      ctx.arc(cornerPin.x, cornerPin.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#10b981";
      ctx.fill();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [viewAngle, pitchAngle, heatmapMode, showMassing, autoRotate, activeVertical]);

  return (
    <div className="relative w-full h-[520px] rounded-3xl bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 border border-slate-700/80 shadow-2xl overflow-hidden group">
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-xl pointer-events-auto">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <h4 className="text-xs font-black text-white leading-none">{title}</h4>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{location} • {acres} Acres</p>
          </div>
        </div>

        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-2xl flex items-center gap-3 shadow-xl pointer-events-auto">
          <span className="text-xs font-black text-emerald-400">{price}</span>
          <span className="h-3.5 w-px bg-slate-700"></span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            100% Vetted Title
          </span>
        </div>
      </div>

      <div className="absolute left-4 bottom-4 flex flex-col gap-2 z-10">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-2xl shadow-xl flex flex-col gap-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 pt-1">Spatial Layers</span>
          
          <button
            onClick={() => setHeatmapMode("soil")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              heatmapMode === "soil"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-sm"
                : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Soil & Load Capacity
          </button>

          <button
            onClick={() => setHeatmapMode("water")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              heatmapMode === "water"
                ? "bg-sky-500/20 border-sky-500/50 text-sky-400 shadow-sm"
                : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Groundwater Depth
          </button>

          <button
            onClick={() => setHeatmapMode("logistics")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              heatmapMode === "logistics"
                ? "bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-sm"
                : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            Highway Logistics Index
          </button>

          <button
            onClick={() => setHeatmapMode("solar")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              heatmapMode === "solar"
                ? "bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-sm"
                : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            Solar Irradiance
          </button>
        </div>
      </div>

      <div className="absolute right-4 bottom-4 flex flex-col items-end gap-2 z-10">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-2xl shadow-xl flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              autoRotate
                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                : "border-slate-700 text-slate-400 hover:text-white"
            }`}
          >
            <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "8s" }} />
            3D Orbit
          </button>

          <button
            onClick={() => setShowMassing(!showMassing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              showMassing
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400"
                : "border-slate-700 text-slate-400 hover:text-white"
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            Building Massing
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-400 flex items-center gap-3 z-0">
        <span>GIS: 13.245° N, 77.712° E</span>
        <span className="h-3 w-px bg-slate-700"></span>
        <span>FSI Capacity: 3.20</span>
        <span className="h-3 w-px bg-slate-700"></span>
        <span>Elevation Delta: +14m</span>
      </div>
    </div>
  );
}