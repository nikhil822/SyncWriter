import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FONTS } from "../../../constants/fonts";

interface FontSelectProps {
  onSelect: (font: string) => void;
  selectedFont: string;
}

const FontSelect = ({ onSelect, selectedFont }: FontSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100"
      >
        <span className="text-sm">{selectedFont}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-50">
          {FONTS.map((font) => (
            <button
              key={font}
              onClick={() => {
                onSelect(font);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              {font}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FontSelect;
