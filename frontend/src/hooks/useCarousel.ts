import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import useEmblaCarousel from "embla-carousel-react";
import { usePrevNextButtons } from "@/app/components/CarouselArrowButtons";
import { useEffect, useState } from "react";

// hooks/useCarousel.ts
export const useCarousel = (moments: MomentProp[]) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, skipSnaps: true },
    [WheelGesturesPlugin()],
  );
  const [lastSlide, setIsLastSlide] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      setIsLastSlide(index === last);
    };

    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return {
    emblaRef,
    lastSlide,
    currentIndex,
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};
