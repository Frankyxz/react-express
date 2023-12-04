import { create } from "zustand";

const useMeatStore = create((set) => ({
  selectedMeatType: "",
  partsOptions: [],
  selectedParts: "",
  meatBrandOptions: [],
  meatData: [],
  meatTypeOptions: [],
  setSelectedMeatType: (selectedMeatType) => set({ selectedMeatType }),
  setPartsOptions: (partsOptions) => set({ partsOptions }),
  setSelectedParts: (selectedParts) => set({ selectedParts }),
  setMeatBrandOptions: (meatBrandOptions) => set({ meatBrandOptions }),
  setMeatData: (meatData) => set({ meatData }),
  setMeatTypeOptions: (meatTypeOptions) => set({ meatTypeOptions }),
}));

export default useMeatStore;
