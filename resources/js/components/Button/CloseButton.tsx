import React from "react";
import classNames from "classnames";
import { Icon } from "@iconify/react";
export interface CloseButtonProps
    extends React.HTMLAttributes<HTMLButtonElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Toggle the disabled state for the component.
     */
    disabled?: boolean;
    /**
     * Change the default color to white.
     */
    white?: boolean;
}

export const CloseButton = React.forwardRef<
    HTMLButtonElement,
    CloseButtonProps
>(({ className, disabled, white, ...rest }, ref) => {
    return (
        <button
            type="button"
            className={classNames(
                "btn-close",
                {
                    "btn-close-white": white,
                },
                disabled,
                className,
            )}
            aria-label="Close"
            disabled={disabled}
            {...rest}
            ref={ref}
        >
            <Icon icon="tabler:x" />
        </button>
    );
});
CloseButton.displayName = "CloseButton";
export default CloseButton;
