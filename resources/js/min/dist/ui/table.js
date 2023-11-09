import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
const Table = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { className: "w-full overflow-auto", children: _jsx("table", { ref: ref, className: cn("w-full caption-bottom text-sm", className), ...props }) })));
Table.displayName = "Table";
const TableHeader = React.forwardRef(({ className, ...props }, ref) => (_jsx("thead", { ref: ref, className: cn("[&_tr]:border-b", className), ...props })));
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(({ className, ...props }, ref) => (_jsx("tbody", { ref: ref, className: cn("[&_tr:last-child]:border-0", className), ...props })));
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(({ className, ...props }, ref) => (_jsx("tfoot", { ref: ref, className: cn("bg-primary font-medium text-white", className), ...props })));
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(({ className, ...props }, ref) => (_jsx("tr", { ref: ref, className: cn("border-b border-gray-300 dark:border-dark transition-colors hover:bg-gray-100 dark:hover:bg-gray-300 dark:hover:text-dark", "data-[state=selected]:bg-gray-200 data-[state=selected]:text-dark", className), ...props })));
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(({ className, ...props }, ref) => (_jsx("th", { ref: ref, className: cn("h-10 px-2 text-left align-middle font-medium text-gray-700 hover:text-dark [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className), ...props })));
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(({ className, ...props }, ref) => (_jsx("td", { ref: ref, className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className), ...props })));
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(({ className, ...props }, ref) => (_jsx("caption", { ref: ref, className: cn("mt-4 text-sm text-gray-100", className), ...props })));
TableCaption.displayName = "TableCaption";
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, };
