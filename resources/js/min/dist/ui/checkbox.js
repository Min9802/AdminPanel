import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "../lib/utils";
const Checkbox = React.forwardRef(({ className, ...props }, ref) => (_jsx(CheckboxPrimitive.Root, { ref: ref, className: cn("peer h-4 w-4 shrink-0 rounded-md border border-gray-100 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dark disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-dark data-[state=checked]:text-white", className), ...props, children: _jsx(CheckboxPrimitive.Indicator, { className: cn("flex items-center justify-center text-current"), children: _jsx(CheckIcon, { className: "h-4 w-4" }) }) })));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
export { Checkbox };
