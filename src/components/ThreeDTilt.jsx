"use client";
import React, { useState } from "react";
export default function ThreeDTilt({ children, className = "" }) {
    const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    const [shadow, setShadow] = useState("rgba(0, 0, 0, 0) 0px 0px 0px");
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
        const rotateX = -y * 12; // Rotate X based on mouse Y offset
        const rotateY = x * 12; // Rotate Y based on mouse X offset
        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`);
        // Dynamic shadow shift opposite to mouse angle
        setShadow(`${-x * 15}px ${-y * 15}px 30px rgba(99, 102, 241, 0.15)`);
    };
    const handleMouseLeave = () => {
        setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
        setShadow("rgba(0, 0, 0, 0) 0px 0px 0px");
    };
    return (<div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{
            transform,
            boxShadow: shadow,
            transition: "transform 150ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 150ms ease",
            transformStyle: "preserve-3d",
        }} className={className}>
      {children}
    </div>);
}
