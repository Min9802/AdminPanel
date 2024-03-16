import React from "react";
import { Item, ViewProps } from "./FileManager";
import { ColumnDef } from "@tanstack/react-table";
import { Button, DataTable } from "@min98/ui";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { bytesToHuman, timestampToDate } from "./Utils/FileUtils";

import MenuContext from "./MenuContext";

const TableView: React.FC<ViewProps> = ({
    disk,
    view,
    directories,
    files,
    ...props
}) => {
    const { t } = useTranslation();
    const { handleMultipleClick } = props;
    const [dataContent, setDataContent] = React.useState<any[]>([]);
    React.useEffect(() => {
        if (files && directories) {
            setDataContent([...directories, ...files]);
        }
    }, [files, directories]);
    /**
     * define columns
     */
    const columns: ColumnDef<Item>[] = [
        {
            accessorKey: "basename",

            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {t("label.name")}
                        <Icon
                            icon="mdi:unfold-more-horizontal"
                            className="ml-2 h-4 w-4"
                        />
                    </Button>
                );
            },
            cell: ({ row, table }) => {
                const data = row.original;
                return (
                    <MenuContext
                        view={view}
                        disk={disk}
                        data={data}
                        row={row}
                        table={table}
                        {...props}
                    />
                );
            },
        },
        {
            accessorKey: "size",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {t("label.size")}
                        <Icon
                            icon="mdi:unfold-more-horizontal"
                            className="ml-2 h-4 w-4"
                        />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="capitalize">
                        {data.type == "file" &&
                            bytesToHuman(row.getValue("size"))}
                    </div>
                );
            },
        },
        {
            accessorKey: "type",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {t("label.type")}
                        <Icon
                            icon="mdi:unfold-more-horizontal"
                            className="ml-2 h-4 w-4"
                        />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="capitalize">{`${row.getValue("type")} ${
                        data?.extension ?? ""
                    }`}</div>
                );
            },
        },
        {
            accessorKey: "timestamp",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {t("label.time")}
                        <Icon
                            icon="mdi:unfold-more-horizontal"
                            className="ml-2 h-4 w-4"
                        />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {timestampToDate(row.getValue("timestamp"))}
                </div>
            ),
        },
    ];
    return (
        <DataTable
            data={dataContent}
            columns={columns}
            search="basename"
            callBack={handleMultipleClick}
        />
    );
};

export default TableView;
