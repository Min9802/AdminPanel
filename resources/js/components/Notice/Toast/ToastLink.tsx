import React, { AnchorHTMLAttributes, forwardRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { Link } from "../../Link/Link";

export interface AlertLinkProps
    extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}

const AlertLink = forwardRef<HTMLAnchorElement, AlertLinkProps>(
    ({ children, className, ...rest }, ref) => {
        return (
            <Link
                className={classNames("alert-link", className)}
                {...rest}
                ref={ref}
            >
                {children}
            </Link>
        );
    },
);

AlertLink.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

AlertLink.displayName = "AlertLink";
export default AlertLink;
