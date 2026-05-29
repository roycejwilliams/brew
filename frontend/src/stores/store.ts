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
