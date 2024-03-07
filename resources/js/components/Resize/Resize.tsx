import React from "react";
import { ResizableBox, Resizable, ResizeCallbackData } from "react-resizable";

interface ResizeBoxProps {
    width?: number;
    height?: number;
    min?: [number, number];
    max?: [number, number];
    children?: React.ReactNode;
    axis?: "x" | "y" | "both";
}

const ResizeBox: React.FC<ResizeBoxProps> = ({
    width = 200,
    height = 200,
    min = [100, 100],
    max,
    axis = "both",
    ...props
}) => {
    return (
        <ResizableBox
            width={width}
            height={height}
            minConstraints={min}
            maxConstraints={max}
            className="p-4 border-4"
            axis={axis}
            {...props}
        >
            {props?.children}
        </ResizableBox>
    );
};
ResizeBox.displayName = "ResizeBox";
interface ResizeProps {
    width?: number;
    height?: number;
    children?: React.ReactNode;
    axis?: "x" | "y" | "both";
}
const Resize: React.FC<ResizeProps> = ({
    width = 200,
    height = 200,
    axis = "both",
    ...props
}) => {
    const [size, setSize] = React.useState({
        width,
        height,
    });
    const onResize:
        | ((e: React.SyntheticEvent, data: ResizeCallbackData) => any)
        | undefined = (event, { node, size, handle }) => {
        setSize({ width: size.width, height: size.height });
    };
    return (
        <Resizable
            height={size.height}
            width={size.width}
            axis={axis}
            onResize={onResize}
            className="p-4 border-4"
            {...props}
        >
            {props?.children}
        </Resizable>
    );
};
Resize.displayName = "Resize";
export { ResizeBox, Resize };
