import React from "react";
import { useTranslation } from "react-i18next";
import { Package } from "./PackageList";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/reducers/rootReducer";
import * as actions from "@/store/actions";
import { parseError } from "@/Utils/systemUtil";
import AdminPackageApi from "@/apis/Admin/AdminPackageApi";
import {
    Badge,
    Button,
    Card,
    CardContent,
    Checkbox,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    toast,
} from "@min98/ui";
import { DataTable } from "@/components/Table/Table";
import { ColumnDef } from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import Modal from "@/components/Modal/Modal";
import { pageInfoProps } from "@/store/reducers/appReducer";

const PackageTrash: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const { t } = useTranslation();
    const [list, setList] = React.useState<Package[]>([]);
    const [item, setItem] = React.useState<any>(false);
    const [modalDelete, setModalDelete] = React.useState<boolean>(false);
    /**
     * set page info
     */
    const pageInfo: pageInfoProps = {
        title: "label.trashPackage",
        desc: "label.trashPackage",
    };
    React.useEffect(() => {
        props.setPageInfo(pageInfo);
        getList();
    }, []);
    /**
     * toggle delete
     * @param data
     */
    const toggleDelete = async (data: any) => {
        setModalDelete(true);
        setItem(data);
    };
    /**
     * define columns
     */
    const columns: ColumnDef<Package>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value: any) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value: any) =>
                        row.toggleSelected(!!value)
                    }
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
            maxSize: 40,
        },
        {
            accessorKey: "name",

            header: t("label.name"),
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "display_name",
            meta: "Display Name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {t("label.display_name")}
                        <Icon
                            icon="mdi:unfold-more-horizontal"
                            className="ml-2 h-4 w-4"
                        />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("display_name")}</div>
            ),
        },
        {
            accessorKey: "status",

            header: () => (
                <div className="text-center">{t("label.status")}</div>
            ),
            cell: ({ row }) => {
                const value = row.getValue("status");
                const data = row.original;
                return (
                    <div className="text-center font-medium">
                        {value == 1 ? (
                            <Badge color="success">{t("label.enable")}</Badge>
                        ) : (
                            <Badge color="secondary">
                                {t("label.disable")}
                            </Badge>
                        )}
                    </div>
                );
            },
        },
        {
            id: "actions",
            enableHiding: false,
            maxSize: 40,
            header: () => (
                <div className="text-center">{t("label.action")}</div>
            ),
            cell: ({ row }) => {
                const data = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">
                                    {t("common.open_menu")}
                                </span>
                                <Icon
                                    icon="mdi:dots-horizontal"
                                    className="h-4 w-4"
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>
                                {t("label.action")}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => toggleDelete(data)}
                            >
                                {t("common.forceDelete")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    /**
     * get the list
     */
    const getList = async () => {
        try {
            const response = await AdminPackageApi.trash();
            const list = response.data.content.data;
            setList(list);
        } catch (err: any) {
            parseError(err);
        }
    };
    const handleDelete = async (id: string) => {
        try {
            const response = await AdminPackageApi.forceDelete(id);
            const status = response.data.status;
            const message = response.data.message;
            const notify = {
                title: status,
                description: message,
                status: "success",
            };
            toast(notify);
            setModalDelete(false);
            getList();
        } catch (err: any) {
            parseError(err);
        }
    };
    return (
        <React.Fragment>
            <Modal
                title={t("common.confirm")}
                open={modalDelete}
                cancel={() => setModalDelete(false)}
                action={() => handleDelete(item.id)}
                message={t("label.forceDelete")}
            ></Modal>
            <Card>
                <CardContent>
                    <DataTable data={list} columns={columns} search="name" />
                </CardContent>
            </Card>
        </React.Fragment>
    );
};
const mapStateToProps = (state: RootState) => {
    return {};
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        setPageInfo: (pageInfo: any) => dispatch(actions.SetInfoPage(pageInfo)),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
interface DispatchProps {
    setPageInfo: (pageInfo: any[]) => void;
}
PackageTrash.displayName = "PackageTrash";
export default connector(PackageTrash);
