import * as React from "react";
import classNames from "classnames";

export type ColElement = React.ElementRef<"div">;
export interface ColProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  col?:
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "11"
    | "12";
  spaceX?: string;
  spaceY?: string;
  start?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11";
  end?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11";
  props?: any;
}
const Col = React.forwardRef<ColElement, ColProps>(
  ({ className, col, start, end, spaceX, spaceY, ...props }, forwardedRef) => {
    const Comp = "div";
    return (
      <Comp
        ref={forwardedRef}
        className={classNames(
          className,
          col ? `col-span-${col}` : "col-auto",
          spaceX ? `space-x-${spaceX}` : "space-x-0",
          spaceY ? `space-y-${spaceY}` : "space-y-0",
          start ? `col-start-${start}` : "",
          end ? `col-end-${end}` : ""
        )}
        {...props}
      />
    );
  }
);
Col.displayName = "Col";

export default Col;
