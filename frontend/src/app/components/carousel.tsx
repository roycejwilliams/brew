import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Card from "./card";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./CarouselArrowButtons";
import carouselStyle from "@/app/(app)/profile/carousel.module.css";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { motion, AnimatePresence } from "motion/react";

interface CarouselProps {
  width: number;
  height: number;
  id: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Carousel({ width, height, id }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, skipSnaps: true },
    [WheelGesturesPlugin()],
  );
  const [lastSlide, setIsLastSlide] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      const last = emblaApi.scrollSnapList().length - 1;
      setCurrentIndex(index);
      setTotalSlides(last + 1);
      setIsLastSlide(index === last);
    };

    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <section className="w-full relative h-full">
      {/* Right fade */}
      <AnimatePresence>
        {!lastSlide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="pointer-events-none absolute top-0 right-0 h-full w-32 z-10"
            style={{
              background:
                "linear-gradient(to left, rgba(17,17,17,0.95) 0%, transparent 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Left fade */}
      <AnimatePresence>
        {!prevBtnDisabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="pointer-events-none absolute top-0 left-0 h-full w-24 z-10"
            style={{
              background:
                "linear-gradient(to right, rgba(17,17,17,0.9) 0%, transparent 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Embla */}
      <section className={carouselStyle.embla}>
        <div className={carouselStyle.embla__viewport} ref={emblaRef}>
          <div className={carouselStyle.embla__container}>
            {Array.from({ length: 1 }).map((_, i) => (
              <motion.div
                className={carouselStyle.embla__slide}
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
              >
                <Card id={id} width={width} height={height} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="relative flex items-center justify-between mt-4 px-1  ">
          {/* Dot indicators */}
          {totalSlides > 1 && (
            <div className="flex items-center gap-1.5  mx-auto">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === currentIndex ? 16 : 5,
                    background:
                      i === currentIndex
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(255,255,255,0.15)",
                  }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="h-0.75 rounded-full"
                />
              ))}
            </div>
          )}

          {/* Arrow buttons */}
          <div
            className={`${carouselStyle.embla__buttons} flex items-center z-10 gap-2 ml-auto`}
          >
            <motion.div
              animate={{
                opacity: prevBtnDisabled ? 0 : 1,
                scale: prevBtnDisabled ? 0.85 : 1,
              }}
              transition={{ duration: 0.2, ease: EASE }}
              style={{ pointerEvents: prevBtnDisabled ? "none" : "auto" }}
            >
              <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
              />
            </motion.div>

            <motion.div
              animate={{
                opacity: nextBtnDisabled ? 0 : 1,
                scale: nextBtnDisabled ? 0.85 : 1,
              }}
              transition={{ duration: 0.2, ease: EASE }}
              style={{ pointerEvents: nextBtnDisabled ? "none" : "auto" }}
            >
              <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </section>
  );
}
