import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import classNames from "classnames";
const Flex = React.forwardRef(({ className, display, direction, align, justify, wrap, gap, ...props }, forwardedRef) => {
    const Comp = "div";
    return (_jsx(Comp, { ref: forwardedRef, className: classNames(className, `${display ? display : "flex"}`, `flex-${direction ? direction : "row"}`, `items-${align ? align : "start"}`, `justify-${justify ? justify : "start"}`, `flex-${wrap ? wrap : "nowrap"}`, `gap-${gap ? gap : "1"}`), ...props }));
});
Flex.displayName = "Flex";
export default Flex;
