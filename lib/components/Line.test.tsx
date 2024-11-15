import {describe, expect, it} from "vitest";
import Line from "./Line";
import {render} from "vitest-browser-react";
import {FC} from "react";

describe('Line', () => {
    it('renders without error', () => {
        const {container} = render(
            <Line
                x0={0}
                y0={0}
                x1={10}
                y1={10}
            />
        );

        expect(container.firstChild).toBeDefined();
    });

    it('renders with className', () => {
        const {container} = render(
            <Line
                x0={0}
                y0={0}
                x1={10}
                y1={10}
                className='test-class'
            />
        );

        expect(container.querySelector('.test-class')).toBeDefined();
    });

    it('renders within given class', () => {
        const Wrapper: FC = () => <div className="within-class"></div>;

        const { container } = render(
          <Line x0={0} y0={0} x1={10} y1={10} within="within-class" />,
          { wrapper: Wrapper },
        );

        const wrapperElement = container.parentElement;
        expect(wrapperElement).toContainElement(container.firstChild);
    });
});
