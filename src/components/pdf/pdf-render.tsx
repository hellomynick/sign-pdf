import React, {useEffect, useRef, useState} from "react";
import {getDocument, PDFDocumentProxy} from "pdfjs-dist/legacy/build/pdf.mjs";
import ButtonSelectFile from "@/components/common/button-select-file";

export default function PdfRender() {
  const [pdf, setPdf] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPageNumber, setTotalPageNumber] = useState<number | undefined>(undefined);
  const [docProxy, setDocProxy] = useState<PDFDocumentProxy | undefined>(undefined);

  const canvasFileRender = useRef<HTMLCanvasElement | null>(null);

  const handleFileUpload = (file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      setPdf(fileReader.result as string);
    };
  };

  const nextPage = () => {
    if (pageNumber === totalPageNumber) {
      return;
    }
    setPageNumber(pageNumber + 1);
  };

  const backPage = () => {
    //if page number equal default page number is 1, it should don't anything
    if (pageNumber === 1) {
      return;
    }

    setPageNumber(pageNumber - 1);
  };

  useEffect(() => {
    if (pdf) {
      const loadingTask = getDocument(pdf);
      loadingTask.promise.then(async function (pdf: PDFDocumentProxy): Promise<void> {
        console.log("PDF loaded", pdf);
        setTotalPageNumber(pdf.numPages);
        setDocProxy(pdf);
        setPageNumber(1); //default page
      });
    }
  }, [pdf]);

  useEffect(() => {
    if (docProxy) {
      // Fetch the first page
      docProxy.getPage(pageNumber).then(function (page) {
        console.log("Page loaded");
        const scale = 1;
        const viewport = page.getViewport({scale: scale});

        // Prepare canvas using PDF page dimensions
        const canvas = canvasFileRender.current;
        if (canvas) {
          const context = canvas.getContext("2d");
          if (context) {
            // Render PDF page into canvas context
            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            const renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
              console.log("Page rendered");
            });
          }
        }
      });
    }
  }, [docProxy, pageNumber]);

  return (
    <div className="flex">
      <div className="flex justify-center items-center border border-solid border-white">
        <canvas width={700}
                height={800}
                ref={canvasFileRender}></canvas>
      </div>

      <div className="ml-3 flex flex-col gap-2">
        <ButtonSelectFile onFileSelect={handleFileUpload}/>

        <div className="flex justify-center items-center w-8 h-8 border border-solid border-white">
          {pdf ? pageNumber : 0}
        </div>

        <div className="flex justify-center items-center w-8 h-8 border border-solid border-white">
          {pdf ? totalPageNumber : 0}
        </div>

        <div className="flex justify-center items-center w-20 h-8 border border-solid border-white cursor-pointer"
             onClick={nextPage}>
          Next Page
        </div>
      </div>
    </div>
  );
}