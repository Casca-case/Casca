"use client";
import React, { useState, useEffect } from "react";
import Chatbot from "./Chatbot";

const Page = () => {
  const [position, setPosition] = useState({
    x: 0,
    y: 55,
  });
  const [windowWidth, setWindowWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [alignment, setAlignment] = useState<"left" | "right">("right");

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setPosition({ x: window.innerWidth - 100, y: 100 });

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setPosition((prev) => ({
        ...prev,
        x: alignment === "left" ? 0 : window.innerWidth - 100,
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [alignment]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDragging && e.clientX && e.clientY) {
      const x = e.clientX;
      const maxHeight = window.innerHeight * 0.3;
      const minHeight = 55;
      const y = Math.min(Math.max(e.clientY, minHeight), maxHeight);

      const threshold = windowWidth / 2;
      const newAlignment = x < threshold ? "left" : "right";
      const finalX = newAlignment === "left" ? 0 : windowWidth - 100;

      setAlignment(newAlignment);
      setPosition({ x: finalX, y });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="h-screen w-screen">
      <div
        className={`fixed w-fit z-50 cursor-move touch-none ${
          alignment === "left" ? "left-0" : "right-0"
        }`}
        style={{
          top: position.y,
          transition: isDragging ? "none" : "all 0.3s ease-out",
        }}
        draggable
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        <Chatbot />
      </div>
    </div>
  );
};

export default Page;