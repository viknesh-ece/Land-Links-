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

    // Green botanical/land nodes
    const numPoints = Math.min(width > 768 ? 50 : 25, 60);
    const points = [];

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 0.8,
        color: i % 2 === 0 ? "rgba(5, 150, 105, " : "rgba(13, 148, 136, ",
        baseAlpha: Math.random() * 0.3 + 0.2
      });
    }

    // Lush ambient glowing fields for Green & White mode
    const ambientOrbs = [
      { x: width * 0.15, y: height * 0.2, radius: width * 0.4, color: "rgba(209, 250, 229, 0.65)" },
      { x: width * 0.85, y: height * 0.65, radius: width * 0.45, color: "rgba(167, 243, 208, 0.55)" },
      { x: width * 0.5, y: height * 0.85, radius: width * 0.35, color: "rgba(236, 253, 245, 0.7)" }
    ];

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - width / 2) * 0.015;
      targetMouseY = (e.clientY - height / 2) * 0.015;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      ambientOrbs[0].x = width * 0.15;
      ambientOrbs[0].radius = width * 0.4;
      ambientOrbs[1].x = width * 0.85;
      ambientOrbs[1].radius = width * 0.45;
      ambientOrbs[2].x = width * 0.5;
      ambientOrbs[2].radius = width * 0.35;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      // Draw subtle ambient glow fields
      ambientOrbs.forEach((orb) => {
        const ox = orb.x + mouseX * 0.4;
        const oy = orb.y + mouseY * 0.4;
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, "rgba(240, 253, 244, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw subtle connecting lines & points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const drawX = p.x + mouseX * 0.6;
        const drawY = p.y + mouseY * 0.6;

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.baseAlpha})`;
        ctx.fill();

        // Connect nearby points with delicate green lines
        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const drawX2 = p2.x + mouseX * 0.6;
          const drawY2 = p2.y + mouseY * 0.6;
          const dx = drawX - drawX2;
          const dy = drawY - drawY2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.12;
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(drawX2, drawY2);
            ctx.strokeStyle = `rgba(5, 150, 105, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
}
