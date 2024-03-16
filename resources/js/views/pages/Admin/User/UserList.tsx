import { RootState } from "@/store/reducers/rootReducer";
import React from "react";
import { ConnectedProps, connect } from "react-redux";
import * as actions from "@/store/actions";
import {
    Badge,
    Button,
    Card,
    CardContent,
    Checkbox,
    DataTable,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@min98/ui";
import { ColumnDef } from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { parseError } from "@/Utils/systemUtil";
import AdminUserApi from "@/apis/Admin/AdminUserApi";
export type User = {
    id: string;
    username: string;
    name: string;
    email: string;
    status_2fa: string;
    created_at: string;
    updated_at: string;
};
const UserList: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const { t } = useTranslation();
    const [list, setList] = React.useState<User[]>([]);
    const [item, setItem] = React.useState<any>(false);
    const [modalDelete, setModalDelete] = React.useState<boolean>(false);
    React.useEffect(() => {
        console.log(modalDelete);
    }, [item]);
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
    const columns: ColumnDef<User>[] = [
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
            accessorKey: "username",

            header: ({ column }) => {
                return (
                    <Button
                        className="!h-auto"
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {t("label.username")}
                        <Icon
                            icon="mdi:unfold-more-horizontal"
                            className="ml-2 h-4 w-4"
                        />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("username")}</div>
            ),
        },
        {
            accessorKey: "name",

            header: ({ column }) => {
                return (
                    <Button
                        className="!h-auto"
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
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "email",

            header: ({ column }) => {
                return (
                    <Button
                        className="!h-auto"
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {t("label.email")}
                        <Icon
                            icon="mdi:unfold-more-horizontal"
                            className="ml-2 h-4 w-4"
                        />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("email")}</div>
            ),
        },
        {
            accessorKey: "status_2fa",
            header: ({ column }) => {
                return (
                    <Button
                        className="!h-auto"
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {t("label.security_status")}
                        <Icon
                            icon="mdi:unfold-more-horizontal"
                            className="ml-2 h-4 w-4"
                        />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const value = row.getValue("status_2fa");
                // const data = row.original;
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
            meta: "sm:sticky sm:right-0 sm:bg-gray-200 md:sticky md:right-0 md:bg-gray-200 shadow-md",
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
    const pageInfo = {
        title: "adminpage.trashPackage",
        desc: "adminpage.trashPackage",
    };
    React.useEffect(() => {
        props.setPageInfo(pageInfo);
        getList();
    }, []);
    /**
     * get the list
     */
    const getList = async () => {
        try {
            const response = await AdminUserApi.list();
            const list = response.data.content;
            setList(list);
            return response;
        } catch (err: any) {
            parseError(err);
        }
    };
    // const handleDelete = async (id: string) => {
    //     try {
    //         const response = await AdminPackageApi.forceDelete(id);
    //         const status = response.data.status;
    //         const message = response.data.message;
    //         const notify = {
    //             title: status,
    //             description: message,
    //             status: "success",
    //         };
    //         toast(notify);
    //         setModalDelete(false);
    //         getList();
    //     } catch (err: any) {
    //         parseError(err);
    //     }
    // };
    const GroupDelete = (items: any[]) => {
        console.log(items);
    };
    return (
        <Card>
            <CardContent>
                <DataTable
                    data={list}
                    columns={columns}
                    search="username"
                    callBack={GroupDelete}
                />
            </CardContent>
        </Card>
    );
};
const mapStateToProps = (state: RootState) => {
    return {
        pageInfo: state.app.pageInfo,
    };
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
export default connector(UserList);
