import { create } from "zustand";

interface OpenEventCard {
  isEventOpen: boolean;
  moment: MomentProp | null;
  scrollY: number;
  openEvent: (moment: MomentProp | null) => void;
  closeEvent: () => void;
  updateMoment: (updates: Partial<MomentProp>) => void;
}

export const openEventCard = create<OpenEventCard>((set) => ({
  isEventOpen: false,
  moment: null,
  scrollY: 0,
  openEvent: (moment: MomentProp | null) =>
    set({ isEventOpen: true, moment: moment, scrollY: window.scrollY }),
  closeEvent: () => set({ isEventOpen: false, moment: null }),
  updateMoment: (updates: Partial<MomentProp>) =>
    set((state) => ({
      moment: state.moment ? { ...state.moment, ...updates } : state.moment,
    })),
}));

interface MiniModalStore {
  isMiniOpen: boolean;
  miniMoment: MomentProp | null;
  position: { x: number; y: number } | null;
  openMini: (moment: MomentProp, position: { x: number; y: number }) => void;
  closeMini: () => void;
}

export const useMiniModal = create<MiniModalStore>((set) => ({
  isMiniOpen: false,
  miniMoment: null,
  position: null,
  openMini: (moment, position) =>
    set({ isMiniOpen: true, miniMoment: moment, position }),
  closeMini: () => set({ isMiniOpen: false, miniMoment: null, position: null }),
}));

type ManageView = "moments" | "circle" | "referral" | null;

interface UIStore {
  pulseOpen: boolean;
  setPulseOpen: (open: boolean) => void;
  eventsOpen: boolean;
  setEventsOpen: (open: boolean) => void;
  toggleEvents: () => void;
  manageView: ManageView;
  setManageView: (view: ManageView) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  pulseOpen: false,
  setPulseOpen: (open) => set({ pulseOpen: open }),
  eventsOpen: false,
  setEventsOpen: (open) => set({ eventsOpen: open }),
  toggleEvents: () => set((s) => ({ eventsOpen: !s.eventsOpen })),
  manageView: "moments",
  setManageView: (view) => set({ manageView: view }),
}));
