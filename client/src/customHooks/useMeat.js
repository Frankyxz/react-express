import { useState, useEffect } from "react";
import useMeatStore from "../stores/useMeatStore";
import axios from "axios";
import { url } from "../js/url";
const useMeat = () => {
  const [brandSelect, setBrandSelect] = useState("");

  const {
    selectedMeatType,
    setMeatTypeOptions,
    setSelectedMeatType,
    partsOptions,
    setPartsOptions,
    selectedParts,
    setSelectedParts,
    meatBrandOptions,
    meatData,
    setMeatData,
    meatTypeOptions,
    setMeatBrandOptions,
  } = useMeatStore();

  useEffect(() => {
    const loadMeatOptions = async () => {
      try {
        const res = await axios.get(`${url}/useMeat/fetch-meat`);
        console.log(res.data);
        setMeatTypeOptions(res.data);
        setSelectedMeatType(
          selectedMeatType != "" ? selectedMeatType : res.data[0] || ""
        );
      } catch (error) {
        console.error("Error loading meat options: ", error);
      }
    };

    loadMeatOptions();
  }, []);

  return {
    selectedMeatType,
    setSelectedMeatType,
    partsOptions,
    selectedParts,
    setSelectedParts,
    meatBrandOptions,
    meatData,
    meatTypeOptions,
    brandSelect,
    setBrandSelect,
  };
};

export default useMeat;
