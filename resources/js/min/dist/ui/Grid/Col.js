import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import classNames from "classnames";
const Col = React.forwardRef(({ className, col, start, end, spaceX, spaceY, ...props }, forwardedRef) => {
    const Comp = "div";
    return (_jsx(Comp, { ref: forwardedRef, className: classNames(className, col ? `col-span-${col}` : "col-auto", spaceX ? `space-x-${spaceX}` : "space-x-0", spaceY ? `space-y-${spaceY}` : "space-y-0", start ? `col-start-${start}` : "", end ? `col-end-${end}` : ""), ...props }));
});
Col.displayName = "Col";
export default Col;
