import React from "react";

interface ButtonDownloadFileProps {
  onClick: () => void;
}

export default function ButtonDownloadFile({onClick}: ButtonDownloadFileProps) {
  return (
    <div className="flex items-center justify-center">
      <label
        onClick={onClick}
        className="flex flex-col items-center px-6 py-6 bg-gray-700 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-all">
        <span className="text-gray-500">Download File</span>
      </label>
    </div>
  );
}