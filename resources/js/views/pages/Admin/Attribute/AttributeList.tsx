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
import AdminAttributeApi from "@/apis/Admin/AdminAttributeApi";
import { ColumnDef } from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Table/DataTable";
import Modal from "@/components/Modal/Modal";
import AttributeEdit from "./AttributeEdit";
import { useTranslation } from "react-i18next";
import { parseError } from "@/Utils/systemUtil";
import { pageInfoProps } from "@/store/reducers/appReducer";

export type Attribute = {
    id: string;
    name: string;
    display_name: string;
    status: 0 | 1;
    created_at: string;
    updated_at: string;
};

const AttributeList: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const { t } = useTranslation();
    const [list, setList] = React.useState<Attribute[]>([]);
    const [modalEdit, setModalEdit] = React.useState<boolean>(false);
    const [modalDelete, setModalDelete] = React.useState<boolean>(false);
    const [modalUpdateStatus, setModalUpdateStatus] =
        React.useState<boolean>(false);
    const [item, setItem] = React.useState<any>(false);
    /**
     * set page info
     */
    const pageInfo: pageInfoProps = {
        title: "label.attribute",
        desc: "label.attribute",
    };
    React.useEffect(() => {
        props.setPageInfo(pageInfo);
        getList();
    }, []);
    /**
     * get list
     * @param data
     */
    const getList = async () => {
        try {
            const response = await AdminAttributeApi.list();
            const Attributes = response.data.content;
            setList(Attributes);
        } catch (err: any) {
            const error = err.response.data;
            const status: string = error.status;
            const message: string = error.message;
            const notify = {
                title: status,
                description: message,
                status: "error",
            };
            toast(notify);
        }
    };
    /**
     * delete Attribute
     * @param id
     */
    const handleDelete = async (id: string) => {
        try {
            const response = await AdminAttributeApi.delete(id);
            const status: string = response.data.status;
            const message: string = response.data.message;
            const notify = {
                title: status,
                description: message,
                status: "success",
            };
            toast(notify);
            getList();
            setModalDelete(false);
            setItem(false);
        } catch (err: any) {
            parseError(err);
        }
    };
    /**
     * change status
     */
    const handleChangeStatus = async (id: string) => {
        try {
            const response = await AdminAttributeApi.updateStatus(id);
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
    const callBackEdit = () => {
        setModalEdit(false);
        setItem(false);
        getList();
    };
    /**
     * define columns
     */
    const columns: ColumnDef<Attribute>[] = [
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
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "status",

            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {t("label.status")}
                        <Icon
                            icon="mdi:unfold-more-horizontal"
                            className="ml-2 h-4 w-4"
                        />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const value = row.getValue("status");
                const data = row.original;
                return (
                    <div className="text-center font-medium">
                        {value == 1 ? (
                            <Badge
                                color="success"
                                onClick={() => toggleUpdateStatus(data)}
                            >
                                {t("label.enable")}
                            </Badge>
                        ) : (
                            <Badge
                                color="secondary"
                                onClick={() => toggleUpdateStatus(data)}
                            >
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
                            <DropdownMenuItem onClick={() => toggleEdit(data)}>
                                {t("common.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => toggleDelete(data)}
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
    return (
        <>
            {modalEdit ? (
                <AttributeEdit item={item} onClose={() => callBackEdit()} />
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
                    <DataTable data={list} columns={columns} search="name" />
                </CardContent>
            </Card>
        </>
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
AttributeList.displayName = "AttributeList";
export default connector(AttributeList);
