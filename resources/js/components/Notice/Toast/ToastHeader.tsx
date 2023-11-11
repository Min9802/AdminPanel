import React from "react";
import classNames from "classnames";

export interface ToastHeadingProps
    extends React.HTMLAttributes<HTMLHeadingElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | React.ElementType;
}

const ToastHeader = React.forwardRef<HTMLHeadingElement, ToastHeadingProps>(
    ({ children, className, component: Component = "h4", ...rest }, ref) => {
        return (
            <Component
                className={classNames("Toast-heading", className)}
                {...rest}
                ref={ref}
            >
                {children}
            </Component>
        );
    },
);
ToastHeader.displayName = "ToastHeader";
export default ToastHeader;
