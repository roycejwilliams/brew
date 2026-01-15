import { create } from "zustand";

type OpenEventCard = {
  isEventOpen: boolean;
  activeEventId: string | null;
  scrollY: number;
  openEvent: (id: string) => void;
  closeEvent: () => void;
};

export const openEventCard = create<OpenEventCard>((set) => ({
  isEventOpen: false,
  activeEventId: null,
  scrollY: 0,
  openEvent: (id: string) =>
    set({ isEventOpen: true, activeEventId: id, scrollY: window.scrollY }),
  closeEvent: () => set({ isEventOpen: false, activeEventId: null }),
}));
