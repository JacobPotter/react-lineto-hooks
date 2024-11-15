import React, { useEffect, useRef } from "react";
import { Property } from "csstype";

export interface LineProps {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  within?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: number;
  className?: string;
  zIndex?: number;
}

const defaultBorderColor = "black";
const defaultBorderStyle = "solid";
const defaultBorderWidth = 1;

const Line: React.FC<LineProps> = ({
  x0,
  y0,
  x1,
  y1,
  within,
  borderColor,
  borderStyle,
  borderWidth,
  className,
  zIndex,
}) => {
  const elRef = useRef<HTMLDivElement | null>(null);
  const withinRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const findElement = (className: string): HTMLElement | null => {
      return document.getElementsByClassName(className)[0] as HTMLElement;
    };

    withinRef.current = within ? findElement(within) : document.body;
    if (elRef.current && withinRef.current) {
      withinRef.current.appendChild(elRef.current);
    }

    const childElement = elRef.current;
    const withinElement = withinRef.current;
    return () => {
      if (childElement && withinElement) {
        withinElement.removeChild(childElement);
      }
    };
  }, [within]);

  const dy = y1 - y0;
  const dx = x1 - x0;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const length = Math.sqrt(dx * dx + dy * dy);

  const positionStyle: React.CSSProperties = {
    position: "absolute",
    top: `${y0}px`,
    left: `${x0}px`,
    width: `${length}px`,
    zIndex: zIndex ? String(zIndex) : "1",
    transform: `rotate(${angle}deg)`,
    transformOrigin: "0 0",
  };

  const defaultStyle: React.CSSProperties = {
    borderTopColor: borderColor || defaultBorderColor,
    borderTopStyle: (borderStyle ||
      defaultBorderStyle) as Property.BorderTopStyle,
    borderTopWidth: borderWidth || defaultBorderWidth,
  };

  return (
    <div className="react-lineto-placeholder">
      <div
        ref={elRef}
        className={className}
        style={{ ...defaultStyle, ...positionStyle }}
      />
    </div>
  );
};

export default Line;
