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

interface CarouselProps {
  width: number;
  height: number;
  id: string;
}

export default function Carousel({ width, height, id }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, skipSnaps: true },
    [WheelGesturesPlugin()]
  );
  const [lastSlide, setIsLastSlide] = useState(false);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const currentIndex = emblaApi.selectedScrollSnap();
      const lastIndex = emblaApi.scrollSnapList().length - 1;
      setIsLastSlide(currentIndex === lastIndex);
    };

    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <section className="w-full relative h-full px-12">
      <div
        className={`
    pointer-events-none absolute top-0 right-0 h-full w-1/4
    bg-linear-to-l blur-xl from-black/85 to-transparent z-10 
    transition-opacity duration-500 ease-out
    ${lastSlide ? "opacity-0" : "opacity-100"}
  `}
      ></div>

      <section className={carouselStyle.embla}>
        <div className={carouselStyle.embla__viewport} ref={emblaRef}>
          <div className={carouselStyle.embla__container}>
            {Array.from({ length: 1 }).map((_, i) => (
              <div className={carouselStyle.embla__slide} key={i}>
                <Card id={id} width={width} height={height} />
              </div>
            ))}
          </div>
        </div>
        <div className="embla__controls">
          <div className={carouselStyle.embla__buttons}>
            <div
              className={`
        transition-opacity duration-300 
        ${prevBtnDisabled ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
            >
              <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
              />
            </div>
            <div
              className={`
        transition-opacity duration-300
        ${nextBtnDisabled ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
            >
              <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
