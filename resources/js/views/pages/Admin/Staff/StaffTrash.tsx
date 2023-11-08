import React from "react";
import { useTranslation } from "react-i18next";
import { Staff } from "./StaffList";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/reducers/rootReducer";
import * as actions from "@/store/actions";
import { dateTime, parseError, timestampToDate } from "@/Utils/systemUtil";
import AdminStaffApi from "@/apis/Admin/AdminStaffApi";
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

const StaffTrash: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const { t } = useTranslation();
    const [list, setList] = React.useState<Staff[]>([]);
    const [item, setItem] = React.useState<any>(false);
    const [modalRestore, setModalRestore] = React.useState<boolean>(false);
    const [modalDelete, setModalDelete] = React.useState<boolean>(false);
    /**
     * set page info
     */
    const pageInfo: pageInfoProps = {
        title: "label.trashstaff",
        desc: "label.trashstaff",
    };
    React.useEffect(() => {
        props.setPageInfo(pageInfo);
        getList();
    }, []);
    /**
     * toggle restore
     * @param data
     */
    const toggleRestore = async (data: any) => {
        setModalRestore(true);
        setItem(data);
    };
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
    const columns: ColumnDef<Staff>[] = [
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
            accessorKey: "username",

            header: t("label.username"),
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("username")}</div>
            ),
        },
        {
            accessorKey: "email",

            header: t("label.email"),
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("email")}</div>
            ),
        },
        {
            accessorKey: "role",

            header: t("label.role"),
            cell: ({ row }) => {
                const data = row.original;
                const roles = data.roles;

                return (
                    <div className="text-center font-medium space-x-1 space-y-1">
                        {roles.map((role, key) => (
                            <Badge key={key} color="secondary">
                                {role.name}
                            </Badge>
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: "deleted_at",

            header: () => (
                <div className="text-center">{t("label.deleted_at")}</div>
            ),
            cell: ({ row }) => {
                const value = row.getValue("deleted_at");
                const data = row.original;
                return (
                    <div className="text-center font-medium">
                        {dateTime(data.deleted_at)}
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
                                onClick={() => toggleRestore(data)}
                            >
                                <span className="text-orange-300">
                                    {t("common.restore")}
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => toggleDelete(data)}
                            >
                                <span className="text-red-500">
                                    {t("common.forceDelete")}
                                </span>
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
            const response = await AdminStaffApi.trash();
            const list = response.data.content;
            setList(list);
        } catch (err: any) {
            parseError(err);
        }
    };
    /**
     * handle restore
     * @param id
     */
    const handleRestore = async (id: string) => {
        try {
            const response = await AdminStaffApi.restore(id);
            const status = response.data.status;
            const message = response.data.message;
            const notify = {
                title: status,
                description: message,
                status: "success",
            };
            toast(notify);
            setModalRestore(false);
            getList();
        } catch (err: any) {
            parseError(err);
        }
    };
    /**
     * handle delete
     * @param id
     */
    const handleDelete = async (id: string) => {
        try {
            const response = await AdminStaffApi.forceDelete(id);
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
                open={modalRestore}
                cancel={() => setModalRestore(false)}
                action={() => handleRestore(item.id)}
                message={t("ask.restore")}
            ></Modal>
            <Modal
                title={t("common.confirm")}
                open={modalDelete}
                cancel={() => setModalDelete(false)}
                action={() => handleDelete(item.id)}
                message={t("ask.forceDelete")}
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
StaffTrash.displayName = "StaffTrash";
export default connector(StaffTrash);
