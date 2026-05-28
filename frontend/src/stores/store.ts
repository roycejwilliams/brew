import { create } from "zustand";

interface OpenEventCard {
  isEventOpen: boolean;
  moment: MomentProp | null;
  scrollY: number;
  openEvent: (moment: MomentProp | null) => void;
  closeEvent: () => void;
}

export const openEventCard = create<OpenEventCard>((set) => ({
  isEventOpen: false,
  moment: null,
  scrollY: 0,
  openEvent: (moment: MomentProp | null) =>
    set({ isEventOpen: true, moment: moment, scrollY: window.scrollY }),
  closeEvent: () => set({ isEventOpen: false, moment: null }),
}));

interface UIStore {
  pulseOpen: boolean;
  setPulseOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  pulseOpen: false,
  setPulseOpen: (open) => set({ pulseOpen: open }),
}));
