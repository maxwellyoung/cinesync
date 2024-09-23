import React, { useEffect, useRef } from "react";

const AnimatedDotMatrix: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const dotSize = 5;
    const gap = 20;
    const dots: { x: number; y: number; opacity: number }[] = [];

    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        dots.push({ x, y, opacity: Math.random() });
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      dots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
        ctx.fill();

        dot.opacity += Math.random() * 0.02 - 0.01;
        if (dot.opacity < 0) dot.opacity = 0;
        if (dot.opacity > 1) dot.opacity = 1;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default AnimatedDotMatrix;
