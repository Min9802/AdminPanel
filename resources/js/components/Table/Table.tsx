import * as React from "react";
import {
    ColumnFiltersState,
    ColumnResizeMode,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Button,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    Input,
    Label,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@min98/ui";
import { Icon } from "@iconify/react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@min98/ui";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { repeat } from "@/Utils/systemUtil";

export interface DataTableProps {
    data: any[];
    columns: any[];
    search?: string;
    callBack?: (arg: any) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
    data = [],
    columns = [],
    search = "",
    callBack,
}) => {
    const { t } = useTranslation();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [columnResizeMode, setColumnResizeMode] =
        React.useState<ColumnResizeMode>("onChange");
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        columnResizeMode,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });
    /**
     * hook callback
     */
    React.useEffect(() => {
        const rowSelected = table.getSelectedRowModel().flatRows;
        const selected = rowSelected.map((action) => action.original);
        callBack?.(selected);
    }, [rowSelection]);
    /**
     * hooke reset selection
     */
    React.useEffect(() => {
        repeat(() => {
            table.resetRowSelection();
        }, 60000);
    }, []);
    return (
        <div className="w-full">
            <div className="lg:flex lg:flex-row md:flex md:flex-col py-4 gap-1 justify-between items-center">
                <div className="gap-1">
                    {search ? (
                        <Input
                            placeholder="Filter..."
                            value={
                                (table
                                    .getColumn(search)
                                    ?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                                table
                                    .getColumn(search)
                                    ?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    ) : null}
                </div>
                <div className="flex items-end justify-end">
                    <Select
                        value={columnResizeMode}
                        onValueChange={(e: string) =>
                            setColumnResizeMode(e as ColumnResizeMode)
                        }
                    >
                        <SelectTrigger className="w-auto">
                            <SelectValue
                                placeholder={t("placeholder.choose_select")}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Resize</SelectLabel>
                                <SelectItem value="onEnd">
                                    Resize: onEnd
                                </SelectItem>
                                <SelectItem value="onChange">
                                    Resize: onChange
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                {t("table.columns")}{" "}
                                <Icon
                                    icon="mdi:chevron-down"
                                    className="ml-2 h-4 w-4"
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value: any) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                <Table style={{ width: table.getTotalSize() }}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(
                                    (header, index, headers) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={classNames(
                                                    "border-1 border-gray-200 relative !text-center",
                                                    headerGroup.headers
                                                        .length >= 5 &&
                                                        index ===
                                                            headers.length - 1
                                                        ? "sm:sticky sm:right-0 sm:bg-gray-200 md:sticky md:right-0 md:bg-gray-200 shadow-md"
                                                        : "",
                                                    header.column.columnDef
                                                        ?.meta as string,
                                                )}
                                                style={{
                                                    width: header.getSize(),
                                                }}
                                                colSpan={header.colSpan}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                                <div
                                                    onMouseDown={header.getResizeHandler()}
                                                    onTouchStart={header.getResizeHandler()}
                                                    className="cursor-col-resize absolute right-0 top-0 h-full w-[5px] select-none touch-none"
                                                    style={{
                                                        transform:
                                                            columnResizeMode ===
                                                                "onEnd" &&
                                                            header.column.getIsResizing()
                                                                ? `translateX(${
                                                                      table.getState()
                                                                          .columnSizingInfo
                                                                          .deltaOffset
                                                                  }px)`
                                                                : "",
                                                    }}
                                                />
                                            </TableHead>
                                        );
                                    },
                                )}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row
                                        .getVisibleCells()
                                        .map((cell, index, cells) => {
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    style={{
                                                        width: cell.column.getSize(),
                                                    }}
                                                    className={classNames(
                                                        row.getVisibleCells()
                                                            .length >= 5 &&
                                                            index ===
                                                                cells.length - 1
                                                            ? "sm:sticky sm:right-0 sm:bg-gray-200 md:sticky md:right-0 md:bg-gray-200 shadow-md"
                                                            : "",
                                                        cell.column.columnDef
                                                            ?.meta as string,
                                                        "!text-center",
                                                    )}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext(),
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {t("table.no_data")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="lg:flex lg:flex-row md:flex md:flex-col items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-dark dark:text-white">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="lg:flex lg:flex-row md:flex md:flex-col items-center gap-2">
                    <div className="flex flex-row">
                        <Button
                            size="sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            tooltip={t("tooltip.first")}
                        >
                            {"<<"}
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            tooltip={t("tooltip.previous")}
                        >
                            {"<"}
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            tooltip={t("tooltip.next")}
                        >
                            {">"}
                        </Button>
                        <Button
                            size="sm"
                            onClick={() =>
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={!table.getCanNextPage()}
                            tooltip={t("tooltip.last")}
                        >
                            {">>"}
                        </Button>
                    </div>
                    <div className="flex flex-row">
                        <span className="flex items-center gap-1">
                            <div>{t("label.page")}</div>
                            <strong>
                                {table.getState().pagination.pageIndex + 1}{" "}
                                {t("label.of")} {table.getPageCount()}
                            </strong>
                        </span>
                        <span className="flex items-center gap-1">
                            | {t("label.go_to_page")}:
                            <Input
                                type="number"
                                defaultValue={
                                    table.getState().pagination.pageIndex + 1
                                }
                                onChange={(e) => {
                                    const page = e.target.value
                                        ? Number(e.target.value) - 1
                                        : 0;
                                    table.setPageIndex(page);
                                }}
                                className="border p-1 rounded w-16"
                            />
                        </span>
                    </div>
                    <div className="flex flex-row">
                        <Select
                            name="status"
                            value={String(table.getState().pagination.pageSize)}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="w-auto">
                                <SelectValue
                                    placeholder={
                                        t("label.show") +
                                        table.getState().pagination.pageSize
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {["10", "20", "30", "40", "50"].map(
                                        (pageSize, key) => (
                                            <SelectItem
                                                key={key}
                                                value={pageSize}
                                            >
                                                {t("label.show") +
                                                    " " +
                                                    pageSize}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
};
