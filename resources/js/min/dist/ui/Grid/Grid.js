import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import classNames from "classnames";
const Grid = React.forwardRef(({ className, display, col, rows, flow, align, justify, gap, gapX, gapY, ...props }, forwardedRef) => {
    const Comp = "div";
    return (_jsx(Comp, { ref: forwardedRef, className: classNames(`${display ? display : "grid"}`, `grid-cols-${col ? col : "none"}`, `grid-rows-${rows ? rows : "none"}`, `grid-flow-${flow ? flow : ""}`, `items-${align ? align : "start"}`, `justify-${justify ? justify : "start"}`, `gap-${gap ? gap : "1"}`, `${gapX ? "gap-x-" + gapX : ""}`, `${gapY ? "gap-y-" + gapY : ""}`, className), ...props }));
});
Grid.displayName = "Grid";
export default Grid;
