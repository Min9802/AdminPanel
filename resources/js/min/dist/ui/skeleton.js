import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../lib/utils";
const Skeleton = ({ className, ...props }) => {
    return (_jsx("div", { className: cn("animate-pulse rounded-md bg-secondary/10", className), ...props }));
};
Skeleton.displayName = "Skeleton";
export { Skeleton };
