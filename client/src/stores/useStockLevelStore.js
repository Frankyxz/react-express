import { create } from "zustand";

const useStockLevelStore = create((set) => ({
  meatCollection: [],
  setMeatCollection: (meatCollection) => set({ meatCollection }),
  meatPartTotals: {},
  setMeatPartTotals: (meatPartTotals) => set({ meatPartTotals }),
  levels: { raw: [], process: [] },
  setLevels: ({ raw, process }) => set({ levels: { raw, process } }),
}));

export default useStockLevelStore;
