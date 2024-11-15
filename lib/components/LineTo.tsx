import {FC, useEffect, useRef, useState} from "react";
import Line from "./Line.tsx";
import SteppedLine from "./SteppedLine.tsx"; // Ensure you import Line component correctly

/**
 * @interface LineToProps
 *
 * Interface defining the properties for drawing a line between two elements.
 */
export interface LineToProps {
  /**
   * Specifies the anchor point for the starting element.
   * It could be a string describing the anchor point
   * such as "top", "left", "middle", "center", "bottom", "right",
   * or a combination like "top left".
   * @example "top" | "middle center" | "50% 50%"
   */
  fromAnchor?: string;

  /**
   * Specifies the anchor point for the target element.
   * Similar to fromAnchor, it could be a descriptive string.
   * @example "bottom" | "center right" | "75% 25%"
   */
  toAnchor?: string;

  /**
   * Specifies the z-index of the line, which determines the stack
   * order of the line among other elements.
   * @example 100 | 200 | 1
   */
  zIndex?: number;

  /**
   * Specifies the color of the line's border.
   * Can take any valid CSS border-color value.
   * @example "black" | "#ff0000" | "rgba(0,0,0,0.5)"
   */
  borderColor?: string;

  /**
   * Specifies the style of the line's border.
   * Can take any valid CSS border-style value.
   * @example "solid" | "dashed" | "dotted"
   */
  borderStyle?: string;

  /**
   * Specifies the width of the line's border.
   * Can take any valid CSS border-width value.
   * @example 1 | 2 | 3
   */
  borderWidth?: number;

  /**
   * Specifies additional CSS classes for the line.
   * Can be used to apply specific styles or behaviors.
   * @example "my-custom-class"
   */
  className?: string;

  /**
   * Specifies the delay before the line is drawn.
   * It can be a boolean, string, or number.
   * When true, there is no delay (0ms), and if a string or number, parsed as milliseconds.
   * @example true | "1000" | 500
   */
  delay?: boolean | string | number;

  /**
   * Specifies the class name of the element where the line starts.
   * Must match the class name of an HTML element in the DOM.
   */
  from: string;

  /**
   * Specifies the class name of the target element where the line ends.
   * Must match the class name of an HTML element in the DOM.
   */
  to: string;

  /**
   * Determines if the line should be rendered as a stepped line, involving
   * multiple straight segments connected with right angles.
   * Default is false.
   * @example true | false
   */
  stepped?: boolean;

  /**
   * Specifies the orientation of the line if it is stepped.
   * Can be horizontal "h" or vertical "v".
   * @example "h" | "v"
   */
  orientation?: "h" | "v";
}

interface Anchor {
  x?: number;
  y?: number;
}

const defaultAnchor: Anchor = { x: 0.5, y: 0.5 };

const parseDelay = (value?: boolean | string | number): number | undefined => {
  if (typeof value === "undefined") {
    return 0;
  } else if (typeof value === "boolean") {
    return 0;
  }

  let delay: number;
  if (typeof value === "number") {
    delay = value;
  } else {
    delay = parseInt(value, 10);
  }
  if (isNaN(delay) || !isFinite(delay)) {
    throw new Error(`LineTo could not parse delay attribute "${value}"`);
  }
  return delay;
};

const parseAnchorPercent = (value: string): number => {
  const percent = parseFloat(value) / 100;
  if (isNaN(percent) || !isFinite(percent)) {
    throw new Error(`LineTo could not parse percent value "${value}"`);
  }
  return percent;
};

const parseAnchorText = (value: string): Partial<Anchor> | null => {
  switch (value) {
    case "top":
      return { y: 0 };
    case "left":
      return { x: 0 };
    case "middle":
      return { y: 0.5 };
    case "center":
      return { x: 0.5 };
    case "bottom":
      return { y: 1 };
    case "right":
      return { x: 1 };
    default:
      return null;
  }
};

const parseAnchor = (value?: string): Anchor => {
  if (!value) return defaultAnchor;

  const parts = value.split(" ");
  if (parts.length > 2) {
    throw new Error('LineTo anchor format is "<x> <y>"');
  }
  const [x, y] = parts;
  return {
    ...defaultAnchor,
    ...(x ? parseAnchorText(x) || { x: parseAnchorPercent(x) } : {}),
    ...(y ? parseAnchorText(y) || { y: parseAnchorPercent(y) } : {}),
  };
};

const findElement = (className: string): HTMLElement | null => {
  return document.getElementsByClassName(className)[0] as HTMLElement;
};

/**
 * LineTo component renders a line between two specified points on the screen. It supports
 * custom styling, orientation, and delay functionality. The line can be drawn either straight
 * or stepped.
 *
 * @typedef {Object} LineToProps
 *
 * @property {string} fromAnchor - The anchor point on the starting element.
 * @property {string} toAnchor - The anchor point on the ending element.
 * @property {number} delay - The delay in milliseconds before the line is drawn.
 * @property {string} from - The CSS selector for the starting element.
 * @property {string} to - The CSS selector for the ending element.
 * @property {boolean} stepped - If true, a stepped line is drawn instead of a straight line.
 * @property {string} borderColor - The color of the line border.
 * @property {string} borderStyle - The style of the line border (e.g., solid, dashed).
 * @property {number} borderWidth - The width of the line border in pixels.
 * @property {number} zIndex - The z-index of the line, controlling its stacking order.
 * @property {string} className - Additional CSS class names for the line element.
 * @property {string} orientation - The orientation of the line when drawn (e.g., horizontal, vertical).
 */
const LineTo: FC<LineToProps> = ({
  fromAnchor,
  toAnchor,
  delay,
  from,
  to,
  stepped,
  borderColor,
  borderStyle,
  borderWidth,
  zIndex,
  className,
  orientation,
}) => {
  const fromAnchorRef = useRef(parseAnchor(fromAnchor));
  const toAnchorRef = useRef(parseAnchor(toAnchor));
  const [stateDelay, setStateDelay] = useState(parseDelay(delay));
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    fromAnchorRef.current = parseAnchor(fromAnchor);
    toAnchorRef.current = parseAnchor(toAnchor);
  }, [fromAnchor, toAnchor]);

  const detect = () => {
    const a = findElement(from);
    const b = findElement(to);

    if (!a || !b) {
      return null;
    }

    const anchor0 = fromAnchorRef.current;
    const anchor1 = toAnchorRef.current;

    const box0 = a.getBoundingClientRect();
    const box1 = b.getBoundingClientRect();

    return {
      x0: box0.left + box0.width * (anchor0.x || 0),
      y0: box0.top + box0.height * (anchor0.y || 0),
      x1: box1.left + box1.width * (anchor1.x || 0),
      y1: box1.top + box1.height * (anchor1.y || 0),
    };
  };

  useEffect(() => {
    if (typeof stateDelay !== "undefined") {
      const timer = setTimeout(() => setUpdate(prevState => !prevState), stateDelay);
      return () => clearTimeout(timer);
    }
  }, [stateDelay]);

  useEffect(() => {
    if (typeof delay !== "undefined") {
      setStateDelay(parseDelay(delay));
    }
  }, [delay]);

  const points = detect();

  const lineStyling = {
    borderWidth,
    borderStyle,
    borderColor,
    zIndex,
    className,
  };

  return points ? (
    stepped ? (
      <SteppedLine {...points} {...lineStyling} orientation={orientation} />
    ) : (
      <Line {...points} {...lineStyling} />
    )
  ) : null;
};

export default LineTo;
