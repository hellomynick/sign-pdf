"use client";

import React, {useState} from "react";
import ButtonSelectFile from "@/components/common/button-select-file";
import {degrees, PDFDocument, rgb, StandardFonts} from "pdf-lib";
import ButtonDownloadFile from "@/components/common/button-download-file";

export default function EditPdf() {
  const [pdf, setPdf] = useState<ArrayBuffer | null>(null);

  const handleFileUpload = (file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onloadend = () => {
      setPdf(fileReader.result as ArrayBuffer);
    };
    console.log("file", file);
  };

  const modifyPdf = async () => {
    if (pdf) {
      const pdfDoc = await PDFDocument.load(pdf);
      console.log("pdf", pdfDoc);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const firstPage = pdfDoc.getPage(0);
      const {width, height} = firstPage.getSize();
      console.log(`${firstPage.getHeight()} ${firstPage.getWidth()}`);
      firstPage.drawText("Test edittttttttttttt", {
        x: width - 400,
        y: height / 2 + 300,
        size: 50,
        font: helveticaFont,
        color: rgb(0.95, 0.1, 0.1),
        rotate: degrees(-45),
      });

      const pdfBytes = await pdfDoc.save();
      downloadPdf(pdfBytes);
    }
  };

  const downloadPdf = (pdfBytes: Uint8Array) => {
    const blob = new Blob([pdfBytes], {type: "application/pdf"});
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "test.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Clean up
    window.URL.revokeObjectURL(link.href);
  };

  return (
    <div>
      <div className="flex">
        <div className="ml-3 flex flex-col">
          <ButtonSelectFile onFileSelect={handleFileUpload}/>
        </div>
        <div className="ml-3 flex flex-col">
          <ButtonDownloadFile onClick={modifyPdf}/>
        </div>
      </div>
    </div>
  );
}