import { create } from "zustand";

interface OpenEventCard {
  isEventOpen: boolean;
  activeEventId: string | null;
  scrollY: number;
  openEvent: (id: string | null) => void;
  closeEvent: () => void;
}

export const openEventCard = create<OpenEventCard>((set) => ({
  isEventOpen: false,
  activeEventId: null,
  scrollY: 0,
  openEvent: (id: string | null) =>
    set({ isEventOpen: true, activeEventId: id, scrollY: window.scrollY }),
  closeEvent: () => set({ isEventOpen: false, activeEventId: null }),
}));
