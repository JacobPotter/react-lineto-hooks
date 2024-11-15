import {useEffect, useState, useRef, FC} from 'react';
import Line from './Line.tsx';
import SteppedLine from "./SteppedLine.tsx"; // Ensure you import Line component correctly

export interface LineToProps {
  fromAnchor?: string;
  toAnchor?: string;
  zIndex?:number;
  delay?: boolean | string | number;
  from: string;
  to: string;
  stepped?: boolean;
}

interface Anchor {
  x?: number;
  y?: number;
}

const defaultAnchor: Anchor = { x: 0.5, y: 0.5 };

const parseDelay = (value?: boolean | string | number): number | undefined => {
  if (typeof value === 'undefined') {
    return value;
  } else if (typeof value === 'boolean' && value) {
    return 0;
  }
  const delay = parseInt(value as string, 10);
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
    case 'top':
      return { y: 0 };
    case 'left':
      return { x: 0 };
    case 'middle':
      return { y: 0.5 };
    case 'center':
      return { x: 0.5 };
    case 'bottom':
      return { y: 1 };
    case 'right':
      return { x: 1 };
    default:
      return null;
  }
};

const parseAnchor = (value?: string): Anchor => {
  if (!value) return defaultAnchor;

  const parts = value.split(' ');
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

const LineTo: FC<LineToProps> = ({ fromAnchor, toAnchor, delay, from, to,stepped }) => {
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
    if (typeof stateDelay !== 'undefined') {
      const timer = setTimeout(() => setUpdate(!update), stateDelay);
      return () => clearTimeout(timer);
    }
  }, [stateDelay, update]);

  useEffect(() => {
    if (typeof delay !== 'undefined') {
      setStateDelay(parseDelay(delay));
    }
  }, [delay]);

  const points = detect();

  return points ? stepped?<SteppedLine {...points} />:<Line {...points} /> : null;
};

export default LineTo;
