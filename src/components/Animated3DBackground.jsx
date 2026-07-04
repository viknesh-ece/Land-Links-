"use client";

import { useEffect, useRef } from "react";

export default function Animated3DBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 1. Initialize floating glowing blobs (increased opacity and speed for rich visible colors)
    const blobs = [
      {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.min(width, height) * 0.45,
        color: "rgba(139, 92, 246, 0.28)", // Violet
      },
      {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.min(width, height) * 0.48,
        color: "rgba(99, 102, 241, 0.28)", // Indigo
      },
      {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.min(width, height) * 0.38,
        color: "rgba(6, 182, 212, 0.25)", // Cyan
      },
      {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.min(width, height) * 0.4,
        color: "rgba(244, 63, 94, 0.22)", // Rose Pink
      },
      {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0,
        radius: Math.min(width, height) * 0.35,
        color: "rgba(245, 158, 11, 0.20)", // Soft Amber
      }
    ];

    // 2. Initialize bokeh bubbles
    const bubbles = [];
    const numBubbles = 35;
    for (let i = 0; i < numBubbles; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height + height * 0.2,
        radius: Math.random() * 70 + 15,
        speedY: Math.random() * 0.3 + 0.1,
        speedX: (Math.random() - 0.5) * 0.12,
        opacity: Math.random() * 0.08 + 0.03, // slightly higher opacity for contrast
        // Cycle colors: teal, purple, and rose pink
        color: i % 3 === 0 ? "6, 182, 212" : i % 3 === 1 ? "244, 63, 94" : "124, 58, 237", 
      });
    }

    // 3. Initialize background constellation points
    const constellationPoints = [];
    const numPoints = 25;
    for (let i = 0; i < numPoints; i++) {
      constellationPoints.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.7), // keep mostly in upper half like mountains/sky
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.15, // slightly more visible
      });
    }

    // Handle resizing
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      // Update blob sizes based on new dimensions
      blobs[0].radius = Math.min(width, height) * 0.45;
      blobs[1].radius = Math.min(width, height) * 0.48;
      blobs[2].radius = Math.min(width, height) * 0.38;
      blobs[3].radius = Math.min(width, height) * 0.4;
      blobs[4].radius = Math.min(width, height) * 0.35;
    };
    window.addEventListener("resize", handleResize);

    // Mouse interactivity
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - width / 2) * 0.02;
      targetMouseY = (e.clientY - height / 2) * 0.02;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Render loop
    const render = () => {
      // Clear canvas (let CSS background gradient show through as the base layer)
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // --- Draw Blurry Glowing Blobs ---
      blobs.forEach((blob) => {
        // Move blobs
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce boundaries
        if (blob.x < -blob.radius || blob.x > width + blob.radius) blob.vx *= -1;
        if (blob.y < -blob.radius || blob.y > height + blob.radius) blob.vy *= -1;

        // Apply mouse drag displacement
        const drawX = blob.x + mouseX * 2.5;
        const drawY = blob.y + mouseY * 2.5;

        // Draw radial gradient glow
        const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, blob.radius);
        grad.addColorStop(0, blob.color);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(drawX, drawY, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Draw Background Mountains/Peaks Contour (First Image) ---
      // We draw 3 overlapping background peak structures
      const peaks = [
        { startX: -100, peakX: width * 0.25, peakY: height * 0.45, endX: width * 0.65 },
        { startX: width * 0.15, peakX: width * 0.5, peakY: height * 0.35, endX: width * 0.85 },
        { startX: width * 0.45, peakX: width * 0.75, peakY: height * 0.5, endX: width + 100 },
      ];

      ctx.save();
      peaks.forEach((peak, index) => {
        // Use darker lines for white background contrast
        const strokeColor = index === 1 ? "rgba(124, 58, 237, 0.12)" : "rgba(79, 70, 229, 0.08)";
        const fillColor = index === 1 ? "rgba(124, 58, 237, 0.01)" : "rgba(79, 70, 229, 0.005)";

        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = fillColor;
        ctx.lineWidth = 1.5;

        // Shift slightly with mouse for depth / parallax effect
        const mx = mouseX * (index + 1) * 0.3;
        const my = mouseY * (index + 1) * 0.3;

        ctx.beginPath();
        ctx.moveTo(peak.startX + mx, height);
        ctx.lineTo(peak.peakX + mx, peak.peakY + my);
        ctx.lineTo(peak.endX + mx, height);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        // Draw peak glowing node
        ctx.beginPath();
        ctx.arc(peak.peakX + mx, peak.peakY + my, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(124, 58, 237, 0.4)";
        ctx.fill();
      });
      ctx.restore();

      // --- Draw Constellation Faint Points & Lines (First Image) ---
      constellationPoints.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height * 0.7) p.vy *= -1;

        const px = p.x + mouseX * 0.8;
        const py = p.y + mouseY * 0.8;

        // Draw point (darker indigo/purple nodes)
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 58, 237, ${p.opacity})`;
        ctx.fill();
      });

      // Draw faint lines between close constellation points
      ctx.lineWidth = 0.5;
      for (let i = 0; i < numPoints; i++) {
        for (let j = i + 1; j < numPoints; j++) {
          const pi = constellationPoints[i];
          const pj = constellationPoints[j];
          const pix = pi.x + mouseX * 0.8;
          const piy = pi.y + mouseY * 0.8;
          const pjx = pj.x + mouseX * 0.8;
          const pjy = pj.y + mouseY * 0.8;

          const dist = Math.hypot(pix - pjx, piy - pjy);
          if (dist < 150) {
            // Darker line connections for white contrast
            ctx.strokeStyle = `rgba(124, 58, 237, ${(1 - dist / 150) * 0.12})`;
            ctx.beginPath();
            ctx.moveTo(pix, piy);
            ctx.lineTo(pjx, pjy);
            ctx.stroke();
          }
        }
      }

      // --- Draw Translucent Floating Bokeh Circles (Second Image) ---
      bubbles.forEach((b) => {
        // Rise and sway
        b.y -= b.speedY;
        b.x += b.speedX;

        // Recycle if goes off the top
        if (b.y < -b.radius) {
          b.y = height + b.radius;
          b.x = Math.random() * width;
        }
        if (b.x < -b.radius || b.x > width + b.radius) {
          b.speedX *= -1;
        }

        const bx = b.x + mouseX * 1.5;
        const by = b.y + mouseY * 1.5;

        // Draw circle
        ctx.beginPath();
        ctx.arc(bx, by, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${b.color}, ${b.opacity})`;
        ctx.fill();

        // Subtle outer border ring for some bokeh bubbles
        if (b.radius > 35) {
          ctx.strokeStyle = `rgba(${b.color}, ${b.opacity * 0.5})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-transparent block"
    />
  );
}
