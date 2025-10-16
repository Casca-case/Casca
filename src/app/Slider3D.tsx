"use client";
import React, { useRef, useState, useTransition } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import "swiper/css";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";

const Slider3DLoop = () => {
  const containerRef = useRef(null);
  const router = useRouter();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const x = useMotionValue(0);
  const dragEndX = useMotionValue(0);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
      const configId = data.serverData.configId;
      startTransition(() => {
        router.push(`/configure/design?id=${configId}`);
      });
    },
  });

  const handleImageUpload = async (imageSrc: string) => {
    setUploading(true);
    setIsAnimationPaused(true);
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], "uploaded-image.png", {
        type: "image/png",
      });

      startUpload([file], { configId: undefined });
    } catch (error) {
      console.error("Image upload failed:", error);
      toast({
        title: "Upload Failed",
        description: "Could not upload the image. Please try again.",
        variant: "destructive",
      });
      setUploading(false);
      setIsAnimationPaused(false);
    }
  };

  const infiniteScrollAnimation = {
    x: ["0%", "-100%"],
    transition: {
      duration: 60,
      ease: "linear",
      repeat: Infinity,
      paused: isAnimationPaused,
    },
  };

  const slides = [1, 2, 3, 4];
  const duplicatedSlides = [
    ...slides,
    ...slides,
    ...slides,
    ...slides,
    ...slides,
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-10">
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-5xl font-bold text-white mb-4 hover:text-orange-400 transition-colors">
          Featured Cover Designs
        </h1>
        <p className="text-slate-300 text-xl hover:text-slate-100 transition-colors">
          Discover our most captivating book cover artworks
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-purple-500/20 to-blue-600/20 opacity-20 blur-3xl z-0"
      />

      <div className="relative overflow-hidden h-[70vh] cursor-grab active:cursor-grabbing">
        <motion.div
          ref={containerRef}
          className="flex w-[500%] h-full items-center flex-nowrap gap-4 px-2"
          animate={!isAnimationPaused ? infiniteScrollAnimation : { x: 0 }}
          drag="x"
          dragConstraints={{ left: -2000, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsAnimationPaused(true)}
          style={{ x }}
        >
          {duplicatedSlides.map((num, idx) => (
            <motion.div
              key={idx}
              className="group relative flex-shrink-0 w-[25vw] h-[60vh] rounded-2xl overflow-hidden shadow-xl"
              whileHover={{ scale: 1.05, rotateY: 10 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={`/slider_image${num}.png`}
                alt={`Cover Design ${num}`}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 hover:text-orange-400 transition-colors">
                    Cover Design {num}
                  </h3>
                  <p className="text-sm text-slate-200 hover:text-white transition-colors">
                    Created by our expert designers
                  </p>
                  <motion.button
                    whileHover={{ scale: uploading ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`mt-4 px-4 py-2 rounded-full text-white font-semibold transition-all ${
                      uploading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 hover:shadow-lg"
                    }`}
                    onClick={() =>
                      handleImageUpload(`/slider_image_raw${num}.jpg`)
                    }
                    disabled={uploading}
                  >
                    {uploading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </div>
                    ) : (
                      "View Details"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, idx) => (
          <motion.div
            key={idx}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              uploading ? "bg-gray-500" : "bg-orange-500/50 hover:bg-orange-500"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider3DLoop;
