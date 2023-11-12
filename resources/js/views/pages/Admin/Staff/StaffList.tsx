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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    toast,
} from "@min98/ui";
import { ColumnDef } from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Table/DataTable";
import { useTranslation } from "react-i18next";
import { parseError } from "@/Utils/systemUtil";
import AdminStaffApi from "@/apis/Admin/AdminStaffApi";
import { Role } from "../Role/RoleList";
import StaffEdit from "./StaffEdit";
import Modal from "@/components/Modal/Modal";
import { pageInfoProps } from "@/store/reducers/appReducer";

export type Staff = {
    id: string;
    username: string;
    name: string;
    email: string;
    roles: Role[];
    status_2fa: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
};
const StaffList: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const { t } = useTranslation();
    const [list, setList] = React.useState<Staff[]>([]);
    const [item, setItem] = React.useState<any>(false);
    const [modalDelete, setModalDelete] = React.useState<boolean>(false);
    const [modalEdit, setModalEdit] = React.useState<boolean>(false);
    const [modalUpdateStatus, setModalUpdateStatus] =
        React.useState<boolean>(false);
    /**
     * set page info
     */
    const pageInfo: pageInfoProps = {
        title: "label.staff",
        desc: "label.staff",
    };
    React.useEffect(() => {
        props.setPageInfo(pageInfo);
        getList();
    }, []);
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
            accessorKey: "name",

            header: t("label.name"),
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("name")}</div>
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
            accessorKey: "banned",

            header: () => (
                <div className="text-center">{t("label.status")}</div>
            ),
            cell: ({ row }) => {
                const value = row.getValue("banned");
                const data = row.original;
                return (
                    <div className="text-center font-medium">
                        {value == 1 ? (
                            <Badge
                                color="danger"
                                onClick={() => toggleUpdateStatus(data)}
                            >
                                {t("label.banned")}
                            </Badge>
                        ) : (
                            <Badge
                                color="success"
                                onClick={() => toggleUpdateStatus(data)}
                            >
                                {t("label.permitted")}
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
                            <DropdownMenuItem onClick={() => toggleEdit(data)}>
                                {t("common.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => toggleDelete(data)}
                                disabled={data.username == "Admin"}
                            >
                                <span className="text-red-500">
                                    {t("common.delete")}
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
            const response = await AdminStaffApi.list();
            const list = response.data.content;
            setList(list);
        } catch (err: any) {
            parseError(err);
        }
    };
    /**
     * toggle
     * @param id
     */
    const toggleEdit = (item: any) => {
        setModalEdit(!modalEdit);
        setItem(item);
    };
    const toggleUpdateStatus = (item: any) => {
        setModalUpdateStatus(!modalUpdateStatus);
        setItem(item);
    };
    const toggleDelete = (item: any) => {
        setModalDelete(!modalDelete);
        setItem(item);
    };
    /**
     * callback
     */
    const callBackEdit = () => {
        setModalEdit(false);
        setItem(false);
        getList();
    };
    /**
     * change status
     */
    const handleChangeStatus = async (id: string) => {
        try {
            const response = await AdminStaffApi.status(id);
            const status: string = response.data.status;
            const message: string = response.data.message;
            const notify = {
                title: status,
                description: message,
                status: "success",
            };
            toast(notify);
            getList();
            setModalUpdateStatus(false);
            setItem(false);
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
            const response = await AdminStaffApi.delete(id);
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
            {modalEdit ? (
                <StaffEdit item={item} onClose={callBackEdit} />
            ) : null}
            <Modal
                title={t("common.confirm")}
                open={modalUpdateStatus}
                cancel={() => setModalUpdateStatus(false)}
                action={() => handleChangeStatus(item.id)}
                message={t("ask.change")}
            ></Modal>
            <Modal
                title={t("common.confirm")}
                open={modalDelete}
                cancel={() => setModalDelete(false)}
                action={() => handleDelete(item.id)}
                message={t("ask.move_to_trash")}
            ></Modal>
            <Card>
                <CardContent>
                    <DataTable
                        data={list}
                        columns={columns}
                        search="username"
                    />
                </CardContent>
            </Card>
        </React.Fragment>
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
StaffList.displayName = "StaffList";
export default connector(StaffList);
