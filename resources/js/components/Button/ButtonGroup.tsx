import classNames from "classnames";
import React from "react";

type ButtonGroupProps = {
    children: React.ReactNode;
};

const ButtonGroup: React.FC<ButtonGroupProps> = ({ children }) => {
    return (
        <div className="inline-flex rounded-md shadow mx-1">
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                    const isFirst = index === 0;
                    const isLast = index === React.Children.count(children) - 1;
                    const justOne = React.Children.count(children) === 1;
                    const childElement = child as React.ReactElement<{
                        className?: string;
                    }>;

                    return React.cloneElement(childElement, {
                        className: classNames(
                            "px-3 py-2 rounded-md",
                            isFirst ? "rounded-r-none" : "",
                            isLast ? "rounded-l-none" : "",
                            !isFirst && !isLast ? "rounded-none" : "",
                            justOne ? "rounded-md" : "",
                            childElement.props.className,
                        ),
                    });
                }
                return child; // Return non-React elements as-is
            })}
        </div>
    );
};

export default ButtonGroup;
