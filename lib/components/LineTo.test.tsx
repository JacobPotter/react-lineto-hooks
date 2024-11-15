// LineTo.test.tsx
import LineTo from './LineTo';
import {describe, expect, test, vi} from 'vitest';
import {render} from 'vitest-browser-react';

describe('LineTo component', () => {
        const fromElem = <div className='start-element'/>
        const endElem = <div className='end-element'/>

    test('renders LineTo with default props', async () => {
        const component = render(<>
            {fromElem}
            {endElem}
            <LineTo from="start-element" to="end-element"/>
        </>);
        await vi.waitFor(() => {
            expect(component.container.children.length).toBe(3);
        },3000);
    });

    test('renders LineTo with custom props', async () => {
        const component = render(
            <>
                {fromElem}
                {endElem}
                <LineTo
                    from="start-element"
                    to="end-element"
                    borderColor="red"
                    borderWidth={2}
                    stepped={true}
                    delay={1000}
                />
            </>
        );
        await vi.waitFor(() => {
            expect(component.container.children.length).toBe(3);
            const lineNode = component.container.children[2];
            expect(lineNode.className).toBe('react-lineto-placeholder');
        },2000);
    });

    test('renders nothing if any of the from or to elements do not exist', async () => {
        const component = render(
            <>
                {endElem}
                <LineTo from="nonexistent-element" to="end-element"/>
            </>
        );
        await vi.waitFor(() => {
            expect(component.container.children.length).toBe(1);
        });
    });
})
