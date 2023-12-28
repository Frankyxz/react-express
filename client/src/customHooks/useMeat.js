import { useState, useEffect } from "react";
import useMeatStore from "../stores/useMeatStore";
import axios from "axios";
import { url } from "../js/url";
const useMeat = () => {
  const [brandSelect, setBrandSelect] = useState("");

  const { selectedMeatType, setMeatTypeOptions, setSelectedMeatType, partsOptions, setPartsOptions, selectedParts, setSelectedParts, meatBrandOptions, meatData, setMeatData, meatTypeOptions, setMeatBrandOptions } = useMeatStore();

  useEffect(() => {
    const loadMeatOptions = async () => {
      try {
        const res = await axios.get(`${url}/useMeat/fetch-meat`);
        setMeatTypeOptions(res.data);
        setSelectedMeatType(
          selectedMeatType != "" ? selectedMeatType : res.data[0] || ""
        );
      } catch (error) {
        console.error(error.message);
      }
    };

    loadMeatOptions();
  }, []);

  useEffect(() => {
    const fetchMeatPart = async () => {
      if (selectedMeatType !== "") {
        const res = await axios.get(
          `${url}/useMeat/fetch-part/${selectedMeatType}`
        );
        setPartsOptions(res.data);
        setSelectedParts(res.data[0] || "");
      }
    };

    fetchMeatPart();
  }, [selectedMeatType]);

  const loadData = async () => {
    try {
      const res = await axios.get(
        `${url}/useMeat/fetch-box/${selectedMeatType}/${selectedParts}`
      );
      setMeatData(res.data);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    loadData();
  }, [selectedParts]);

  useEffect(() => {
    const loadMeatBrandOptions = async () => {
      try {
        if (selectedParts !== "") {
          const res = await axios.get(
            `${url}/useMeat/fetch-brand/${selectedMeatType}/${selectedParts}`
          );

          setMeatBrandOptions(res.data);
          setBrandSelect(res.data[0] || "");
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    loadMeatBrandOptions();
  }, [selectedParts, selectedMeatType]);

  return { selectedMeatType, setSelectedMeatType, partsOptions, selectedParts, setSelectedParts, meatBrandOptions, meatData, meatTypeOptions, brandSelect, setBrandSelect, loadData };
};

export default useMeat;
