import React from 'react';
import Line from './Line.tsx'; // Ensure you import Line component correctly

interface SteppedLineProps {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  orientation?: 'h' | 'v';
  borderWidth?: number;
}

const defaultBorderWidth = 1;

const SteppedLine: React.FC<SteppedLineProps> = (props) => {
  const { orientation="h" } = props;

  const renderVertical = () => {
    const { x0, y0, x1, y1, borderWidth } = props;

    const roundedX0 = Math.round(x0);
    const roundedY0 = Math.round(y0);
    const roundedX1 = Math.round(x1);
    const roundedY1 = Math.round(y1);

    const dx = roundedX1 - roundedX0;
    if (Math.abs(dx) <= 1) {
      return <Line {...props} x0={roundedX0} y0={roundedY0} x1={roundedX0} y1={roundedY1} />;
    }

    const bw = borderWidth || defaultBorderWidth;
    const y2 = Math.round((roundedY0 + roundedY1) / 2);

    const xOffset = dx > 0 ? bw : 0;
    const minX = Math.min(roundedX0, roundedX1) - xOffset;
    const maxX = Math.max(roundedX0, roundedX1);

    return (
        <div className="react-steppedlineto">
          <Line {...props} x0={roundedX0} y0={roundedY0} x1={roundedX0} y1={y2} />
          <Line {...props} x0={roundedX1} y0={roundedY1} x1={roundedX1} y1={y2} />
          <Line {...props} x0={minX} y0={y2} x1={maxX} y1={y2} />
        </div>
    );
  };

  const renderHorizontal = () => {
    const { x0, y0, x1, y1, borderWidth } = props;

    const roundedX0 = Math.round(x0);
    const roundedY0 = Math.round(y0);
    const roundedX1 = Math.round(x1);
    const roundedY1 = Math.round(y1);

    const dy = roundedY1 - roundedY0;
    if (Math.abs(dy) <= 1) {
      return <Line {...props} x0={roundedX0} y0={roundedY0} x1={roundedX1} y1={roundedY0} />;
    }

    const bw = borderWidth || defaultBorderWidth;
    const x2 = Math.round((roundedX0 + roundedX1) / 2);

    const yOffset = dy < 0 ? bw : 0;
    const minY = Math.min(roundedY0, roundedY1) - yOffset;
    const maxY = Math.max(roundedY0, roundedY1);

    return (
        <div className="react-steppedlineto">
          <Line {...props} x0={roundedX0} y0={roundedY0} x1={x2} y1={roundedY0} />
          <Line {...props} x0={roundedX1} y0={roundedY1} x1={x2} y1={roundedY1} />
          <Line {...props} x0={x2} y0={minY} x1={x2} y1={maxY} />
        </div>
    );
  };

  return orientation === 'h' ? renderHorizontal() : renderVertical();
};

export default SteppedLine;
