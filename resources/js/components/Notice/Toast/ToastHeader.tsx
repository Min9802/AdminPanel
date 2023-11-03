import React, { ElementType, forwardRef, HTMLAttributes } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export interface ToastHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
}

const ToastHeader = forwardRef<HTMLHeadingElement, ToastHeadingProps>(
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

ToastHeader.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    component: PropTypes.elementType,
};

ToastHeader.displayName = "ToastHeader";
export default ToastHeader;
