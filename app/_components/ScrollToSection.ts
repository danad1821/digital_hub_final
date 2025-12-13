// src/app/_components/ScrollToSection.ts
import { useRef, useCallback } from "react";
import { SectionId, ScrollHandler } from "../_types";

// The offset to account for the fixed header
const HEADER_HEIGHT_OFFSET = 96;

type SectionRefs = {
  [K in SectionId]: any;
};

type ScrollToSectionHook = SectionRefs & {
  scrollToSection: ScrollHandler;
};

/**
 * Custom hook to manage refs and scrolling for section navigation.
 * @returns An object containing the refs and the scroll function.
 */
export const useScrollToSection = (): ScrollToSectionHook => {
  const servicesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const locationsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const sectionRefs: SectionRefs = {
    services: servicesRef,
    about: aboutRef,
    gallery: galleryRef,
    locations: locationsRef,
    contact: contactRef,
  };

  const scrollToSection: ScrollHandler = useCallback((sectionId) => {
    const ref = sectionRefs[sectionId];
    if (ref && ref.current) {
      const topOffset = ref.current.offsetTop - HEADER_HEIGHT_OFFSET;

      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
    }
  }, []);

  return {
    servicesRef,
    aboutRef,
    galleryRef,
    locationsRef,
    contactRef,
    scrollToSection,
  } as any;
};