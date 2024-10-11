import React from "react";

export default function ButtonSelectFile({onFileSelect}: { onFileSelect: (file: File) => void }) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <label
        className="flex flex-col items-center px-6 py-6 bg-gray-700 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-all">
        <span className="text-gray-500">Drag and drop or click to upload</span>
        <input
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}