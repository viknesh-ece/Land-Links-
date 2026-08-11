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

    // High-tech constellation nodes
    const numPoints = Math.min(width > 768 ? 65 : 30, 80);
    const points = [];

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
        color: i % 3 === 0 ? "rgba(56, 189, 248, " : i % 3 === 1 ? "rgba(99, 102, 241, " : "rgba(16, 185, 129, ",
        baseAlpha: Math.random() * 0.4 + 0.2
      });
    }

    // Subtle ambient gradient orbs
    const ambientOrbs = [
      { x: width * 0.2, y: height * 0.25, radius: width * 0.35, color: "rgba(14, 116, 144, 0.08)" },
      { x: width * 0.8, y: height * 0.7, radius: width * 0.4, color: "rgba(67, 56, 202, 0.07)" },
      { x: width * 0.5, y: height * 0.9, radius: width * 0.3, color: "rgba(16, 185, 129, 0.05)" }
    ];

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - width / 2) * 0.02;
      targetMouseY = (e.clientY - height / 2) * 0.02;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      ambientOrbs[0].x = width * 0.2;
      ambientOrbs[0].radius = width * 0.35;
      ambientOrbs[1].x = width * 0.8;
      ambientOrbs[1].radius = width * 0.4;
      ambientOrbs[2].x = width * 0.5;
      ambientOrbs[2].radius = width * 0.3;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Draw subtle ambient glow fields
      ambientOrbs.forEach((orb) => {
        const ox = orb.x + mouseX * 0.5;
        const oy = orb.y + mouseY * 0.5;
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, "rgba(7, 11, 20, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw constellation points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const drawX = p.x + mouseX * 0.8;
        const drawY = p.y + mouseY * 0.8;

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.baseAlpha})`;
        ctx.fill();

        // Connect nearby points with delicate high-tech vector lines
        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const p2x = p2.x + mouseX * 0.8;
          const p2y = p2.y + mouseY * 0.8;
          const dist = Math.hypot(drawX - p2x, drawY - p2y);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.18;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.65;
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(p2x, p2y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#070b14] block"
    />
  );
}
