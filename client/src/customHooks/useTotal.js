import { useState, useEffect } from "react";

function useTotal(data, name) {
  const [totalKg, setTotalKg] = useState(0);

  useEffect(() => {
    const newTotalKg = data.reduce((sum, item) => sum + item[name], 0);
    setTotalKg(newTotalKg.toFixed(2));
  }, [data]);

  return totalKg;
}

export default useTotal;
