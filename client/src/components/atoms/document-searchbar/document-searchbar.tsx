import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const DocumentSearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`${
        isFocused ? "bg-white shadow-xl" : "bg-gray-100"
      } w-full max-w-2xl rounded-md h-12 flex items-center text-gray-500 mr-4`}
    >
      <div className="flex justify-center px-4">
        <MagnifyingGlassIcon className="w-6 h-6" />
      </div>
      <input
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        type="text"
        className={`${
          isFocused ? "bg-white" : "bg-gray-100"
        }w-full h-full pr-4 font-medium`}
        placeholder="Search"
        name=""
        id=""
      />
    </div>
  );
};

export default DocumentSearchBar;
