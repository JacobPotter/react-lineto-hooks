import SteppedLine,{  SteppedLineProps } from "./SteppedLine";
import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

describe("SteppedLine", () => {
  it("renders correctly for vertical orientation", async () => {
    const props: SteppedLineProps = {
      orientation: "v",
      x0: 10,
      y0: 20,
      x1: 20,
      y1: 30,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "red",
      className: "stepped-line",
      zIndex: 1,
    };

    const { container } = render(<SteppedLine {...props} />);

    const lineElements = container.querySelectorAll(".react-lineto-placeholder");
    expect(lineElements.length).toEqual(3);
  });

  it("renders correctly for horizontal orientation", async () => {
    const props: SteppedLineProps = {
      orientation: "h",
      x0: 10,
      y0: 20,
      x1: 20,
      y1: 30,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "red",
      className: "stepped-line",
      zIndex: 1,
      within: {
        x: 0,
        y: 0,
      },
    };

    const { container } = render(<SteppedLine {...props} />);

    const lineElements = container.querySelectorAll(".react-lineto-placeholder");
    expect(lineElements.length).toEqual(3);
  });
});
