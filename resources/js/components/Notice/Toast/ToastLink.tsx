import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Button, ButtonProps } from "@min98/ui";

export interface AlertLinkProps extends ButtonProps {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}

const AlertLink = React.forwardRef<HTMLButtonElement, AlertLinkProps>(
    ({ children, className, ...rest }, ref) => {
        return (
            <Button
                ref={ref}
                className={classNames("alert-link", className)}
                {...rest}
            >
                {children}
            </Button>
        );
    },
);

AlertLink.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

AlertLink.displayName = "AlertLink";
export default AlertLink;
