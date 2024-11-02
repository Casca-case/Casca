"use client";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
  EffectCreative,
} from "swiper/modules";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-creative";

const Slider3D = () => {
  const controls = useAnimation();

  useEffect(() => {
    let isMounted = true;

    const sequence = async () => {
      if (!isMounted) return;

      try {
        await controls.start({
          x: [-100, 100, -100, 100, 0],
          rotate: [0, 5, -5, 5, 0],
          scale: [1, 1.1, 1.1, 1.1, 1],
          transition: {
            duration: 4,
            times: [0, 0.25, 0.5, 0.75, 1],
            ease: "easeInOut",
          },
        });
        if (!isMounted) return;
        await controls.start({
          scale: [1, 0.8, 1.2, 1],
          rotate: [0, -10, 10, 0],
          y: [0, -20, 20, 0],
          transition: {
            duration: 1,
            ease: "backOut",
          },
        });
      } catch (error) {
        // Handle any potential errors
      }
    };

    sequence();

    return () => {
      isMounted = false;
    };
  }, [controls]);

  return (
    <div className="relative">
      <motion.div
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: 220, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute left-0 top-60 -translate-y-1/2 -translate-x-32 z-10"
      >
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg animate-pulse" />
      </motion.div>

      <motion.div
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: -220, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute right-0 top-60 -translate-y-1/2 translate-x-32 z-10"
      >
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full blur-lg animate-pulse" />
      </motion.div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-3xl" />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key="slider"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl mx-auto relative z-20"
        >
          <Swiper
            effect={"creative"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={3}
            creativeEffect={{
              prev: {
                shadow: true,
                translate: ["-120%", 0, -500],
                rotate: [0, 0, -15],
              },
              next: {
                shadow: true,
                translate: ["120%", 0, -500],
                rotate: [0, 0, 15],
              },
            }}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            autoplay={{
              delay: 1500,
              disableOnInteraction: false,
              reverseDirection: true,
            }}
            speed={1000}
            modules={[
              EffectCoverflow,
              EffectCreative,
              Pagination,
              Navigation,
              Autoplay,
            ]}
            className="mySwiper"
          >
            {[1, 2, 3, 4].map((num) => (
              <SwiperSlide
                key={num}
                className="bg-slate-50 rounded-lg transform transition-all duration-500 p-4"
              >
                <motion.div
                  animate={controls}
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, 5, -5, 0],
                    transition: {
                      duration: 0.3,
                      ease: "easeInOut",
                    },
                  }}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.1}
                  className="relative overflow-hidden rounded-lg p-4"
                >
                  <motion.img
                    src={`/slider_image${num}.png`}
                    alt={`Slide ${num}`}
                    className="w-64 h-auto object-cover rounded-lg"
                    whileHover={{
                      scale: 1.05,
                      rotate: [0, 5, -5, 0],
                      filter: "brightness(1.4)",
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Slider3D;
