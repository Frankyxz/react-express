import { create } from "zustand";

const useSalesStore = create((set) => ({
  today: 0,
  week: 0,
  month: 0,
  year: 0,
  setDay: (today) => set({ today }),
  setWeek: (week) => set({ week }),
  setMonth: (month) => set({ month }),
  setYear: (year) => set({ year }),
}));

export default useSalesStore;
