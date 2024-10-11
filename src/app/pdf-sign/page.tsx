"use client";
import {GlobalWorkerOptions} from "pdfjs-dist/legacy/build/pdf.mjs";
import PdfRender from "@/components/pdf/pdf-render";

GlobalWorkerOptions.workerSrc = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf.worker.mjs";

export default function Page() {
  return (
    <PdfRender/>
  );
}