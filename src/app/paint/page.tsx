"use client";

import React, { useEffect, useRef, useState } from "react";

interface PainProps {
  width: number;
  height: number;
  canvasDraw: React.RefObject<HTMLCanvasElement>;
}

export default function Page(props: PainProps) {
  props.canvasDraw = useRef<HTMLCanvasElement>(null);
  const [contextDraw, setContextDraw] = useState<
    CanvasRenderingContext2D | undefined | null
  >(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [rectDOM, setRectDOM] = useState<DOMRect>();
  const radius = 1;

  useEffect(() => {
    const canvas = props.canvasDraw.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      setRectDOM(rect);

      if (!context) {
        return;
      }
      context.strokeStyle = "white";
      context.fillStyle = "white";
      context.lineWidth = radius * 2;

      setContextDraw(context);
    }
  }, [props.canvasDraw]);

  const handleMouseDown = (event: React.MouseEvent) => {
    setDrawing(true);
    handleMouseMove(event);
  };

  const handleMouseUp = () => {
    setDrawing(false);
    contextDraw?.beginPath();
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (contextDraw && drawing && rectDOM) {
      const x = event.clientX - rectDOM.left;
      const y = event.clientY - rectDOM.top;
      contextDraw.lineTo(x, y);
      contextDraw.stroke();
      contextDraw.arc(x, y, radius, 0, Math.PI * 2);
      contextDraw.fill();
      contextDraw.beginPath();
      contextDraw.moveTo(x, y);
    }
  };

  return (
    <canvas
      ref={props.canvasDraw}
      width={props.width}
      height={props.height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}
