"use client";

import React, { useState } from "react";

interface PainProps {
  width: number;
  height: number;
  canvasDraw: React.RefObject<HTMLCanvasElement>;
  contextDraw: CanvasRenderingContext2D;
  rectDOM: DOMRect;
}

export default function Page(props: PainProps) {
  const [drawing, setDrawing] = useState<boolean>(false);
  const radius = 1;

  const handleMouseDown = (event: React.MouseEvent) => {
    setDrawing(true);
    handleMouseMove(event);
  };

  const handleMouseUp = () => {
    setDrawing(false);
    props.contextDraw?.beginPath();
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (props.contextDraw && drawing && props.rectDOM) {
      const x = event.clientX - (props.rectDOM.left - window.scrollX);
      const y = event.clientY - (props.rectDOM.top - window.scrollY);
      props.contextDraw.lineTo(x, y);
      props.contextDraw.stroke();
      props.contextDraw.arc(x, y, radius, 0, Math.PI * 2);
      props.contextDraw.fill();
      props.contextDraw.beginPath();
      props.contextDraw.moveTo(x, y);
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
    ></canvas>
  );
}
