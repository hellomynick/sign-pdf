import React, { useEffect, useRef, useState } from "react";
import { getDocument, PDFDocumentProxy } from "pdfjs-dist/legacy/build/pdf.mjs";
import ButtonSelectFile from "@/components/common/button-select-file";
import { PageViewport, PDFPageProxy } from "pdfjs-dist/types/web/interfaces";
import Paint from "@/components/pdf/paint";
import { PDFDocument } from "pdf-lib";

export default function PdfRender() {
  const [pdf, setPdf] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPageNumber, setTotalPageNumber] = useState<number | undefined>(
    undefined
  );
  const [docProxy, setDocProxy] = useState<PDFDocumentProxy | undefined>(
    undefined
  );
  const [docPageProxy, setDocPageProxy] = useState<PDFPageProxy | undefined>(
    undefined
  );
  const [contextFileRender, setContextFileRender] =
    useState<CanvasRenderingContext2D>();
  const [rectDOM, setRectDOM] = useState<DOMRect>();

  const canvasFileRender = useRef<HTMLCanvasElement>(null);

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
      PDFDocument.load(pdf).then((pdfDoc) => {
        const page = pdfDoc.getPage(pageNumber);
        const { width, height } = page.getSize();
        console.log(width, height);
      });
    }
  }, [pageNumber, pdf]);

  useEffect(() => {
    if (pdf) {
      const loadingTask = getDocument(pdf);
      loadingTask.promise.then(async function (
        pdf: PDFDocumentProxy
      ): Promise<void> {
        console.log("PDF loaded", pdf);
        setTotalPageNumber(pdf.numPages);
        setDocProxy(pdf);
        setPageNumber(1); //get first page
      });
    }
  }, [pdf]);

  useEffect(() => {
    if (docProxy) {
      docProxy.getPage(pageNumber).then(function (page) {
        setDocPageProxy(page);
        console.log("Page loaded");
        const scale = 1;
        const viewport = page.getViewport({ scale: scale });

        const renderContext = canvasPdfContext(viewport);
        if (!renderContext) return;
        const viewPage = page.view;
        console.log(viewPage);
        page
          .render({ canvasContext: contextFileRender!, viewport: viewport })
          .promise.then()
          .catch((e) => {
            console.log(e);
          });
      });
    }
  }, [contextFileRender, docProxy, pageNumber]);

  const canvasPdfContext = (
    viewport: PageViewport
  ):
    | { canvasContext: CanvasRenderingContext2D; viewport: PageViewport }
    | undefined => {
    const canvas = canvasFileRender.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        return renderContext;
      }
    }
  };

  useEffect(() => {
    const canvas = canvasFileRender.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      setRectDOM(rect);

      if (!context) {
        return;
      }
      context.strokeStyle = "black";
      context.fillStyle = "black";
      context.lineWidth = 1 * 2;

      setContextFileRender(context);
    }
  }, []);

  return (
    <div className="flex">
      <div className="flex justify-center items-center border border-solid border-white">
        <Paint
          rectDOM={rectDOM!}
          width={700}
          height={800}
          contextDraw={contextFileRender!}
          canvasDraw={canvasFileRender}
        />
      </div>

      <div className="ml-3 flex flex-col gap-2">
        <ButtonSelectFile onFileSelect={handleFileUpload} />

        <div className="flex justify-center items-center w-8 h-8 border border-solid border-white">
          {pdf ? pageNumber : 0}
        </div>

        <div className="flex justify-center items-center w-8 h-8 border border-solid border-white">
          {pdf ? totalPageNumber : 0}
        </div>

        <div
          className="flex justify-center items-center w-auto h-8 border border-solid border-white cursor-pointer"
          onClick={nextPage}
        >
          Next Page
        </div>

        <div
          className="flex justify-center items-center w-auto h-8 border border-solid border-white cursor-pointer"
          onClick={backPage}
        >
          Previous Page
        </div>
      </div>
    </div>
  );
}
