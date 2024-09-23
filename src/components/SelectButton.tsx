import React from "react";
import { SelectButton as PrimeSelectButton } from "primereact/selectbutton";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

interface SelectButtonProps {
  maxTime: number;
  setMaxTime: (value: number) => void;
  items: { name: string; value: number }[];
}

const SelectButton = ({ maxTime, setMaxTime, items }: SelectButtonProps) => {
  return (
    <div>
      <PrimeSelectButton
        value={maxTime}
        onChange={(e) => setMaxTime(e.value)}
        optionLabel="name"
        options={items}
      />
    </div>
  );
};
export default SelectButton;
