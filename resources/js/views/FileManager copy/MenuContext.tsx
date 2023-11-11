import React from "react";
import { FileProps, Item } from "./FileManager";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { checkExtension, extensionToIcon, getType } from "./Utils/FileUtils";
import { ContextMenu } from "@/components/Form";
import classNames from "classnames";
import { ClipboardProps, thumbnail } from "./Utils/ActionUtils";
import { delay } from "@/Utils/systemUtil";

type MenuContextProps = {
    disk: string;
    view: string;
    clipboard?: ClipboardProps;
    current?: Item;
    currents?: Item[];
    data: Item;
    row?: any;
    table?: any;
    props?: any;
    handleMultipleClick: (data: Item[]) => void;
    handleOneClick: (data: Item) => void;
    handleDoubleClick: (data: Item) => void;
    handleDownload: (data: Item) => void;
    handleCopy: (data: any) => void;
    handleCut: (data: any) => void;
    handlePaste: () => void;
    toggleModalDetail: (data: Item) => void;
    togglePreview: (data: FileProps) => void;
    toggleRename: (data: Item) => void;
    toggleEdit: (data: Item) => void;
    toggleDelete: (data: Item) => void;
};
type ViewListProps = {
    item: Item;
    handleClick: (
        e: React.MouseEvent<HTMLSpanElement | HTMLButtonElement>,
    ) => void;
};
type ViewGridProps = {
    item: Item;
    disk: string;
    active?: boolean;
    handleClick: (
        e: React.MouseEvent<HTMLSpanElement | HTMLButtonElement>,
    ) => void;
    handleMultipleClick: (data: Item[]) => void;
};
type ItemProps = {
    item: Item;
    active?: boolean;
    disk: string;
    handleMultipleClick: (data: Item[]) => void;
    handleClick?: (
        e: React.MouseEvent<HTMLSpanElement | HTMLButtonElement>,
    ) => void;
};
/**
 * render item list
 * @param param0
 * @returns
 */
const RenderItemList: React.FC<ViewListProps> = ({ item, handleClick }) => {
    return (
        <span className="inline-flex" onClick={handleClick}>
            {item.type === "file" ? (
                <>
                    <Icon
                        icon={extensionToIcon(item.extension)}
                        className="mr-1"
                    />
                    <p>{item.filename}</p>
                </>
            ) : (
                <>
                    <Icon icon="mdi:folder-open" className="mr-1" />
                    <p>{item.basename}</p>
                </>
            )}
        </span>
    );
};
/**
 * render item grid
 * @param param0
 * @returns
 */
const RenderItemGrid: React.FC<ViewGridProps> = ({
    item,
    active,
    disk,
    handleClick,
    handleMultipleClick,
}) => {
    const [dataContent, setDataContent] = React.useState<any>(item);
    React.useEffect(() => {
        setDataContent(item);
    }, [item]);
    return (
        <button
            type="button"
            className={classNames(
                "p-2 min-w-[100px] hover:rounded-md hover:shadow-4 justify-center",
                "active:bg-blue-200 active:rounded-md active:shadow-4",
                active && "active",
            )}
            onClick={handleClick}
        >
            {dataContent.type === "file" ? (
                <>
                    {checkExtension(dataContent.extension) == "image" ? (
                        <RenderPreView
                            item={dataContent}
                            disk={disk}
                            handleMultipleClick={handleMultipleClick}
                        />
                    ) : (
                        <Icon
                            icon={extensionToIcon(dataContent.extension)}
                            className="text-7xl"
                        />
                    )}
                    <p>{dataContent.filename}</p>
                </>
            ) : (
                <>
                    <Icon
                        icon="mdi:folder-open"
                        className="text-7xl"
                        color="#FCD34D"
                    />
                    <p>{dataContent.basename}</p>
                </>
            )}
        </button>
    );
};
/**
 * render preview
 * @param param0
 * @returns
 */
const RenderPreView: React.FC<ItemProps> = ({ item, disk }) => {
    const [url, setUrl] = React.useState<any>();
    const [loading, setLoading] = React.useState<boolean>(false);
    /**
     * hook set url
     */
    React.useEffect(() => {
        if (!url && !loading && disk) {
            delay(async () => {
                const url = await thumbnail(disk, item);
                setUrl(url);
            }, 300);
            setLoading(true);
        }
    }, [item]);
    return <img src={url} />;
};
const MenuContext: React.FC<MenuContextProps> = ({
    disk,
    view,
    clipboard,
    current,
    currents = [],
    data,
    row,
    table,
    ...props
}) => {
    const { t } = useTranslation();
    const [dataContent, setDataContent] = React.useState<any>(data);
    React.useEffect(() => {
        setDataContent(data);
    }, [data]);
    /**
     * define actions
     */
    const actions = [
        {
            title: t("label.detail"),
            shortcut: <Icon icon="mdi:information-outline" />,
            action: () => props?.toggleModalDetail(dataContent),
        },
        {
            title: t("label.preview"),
            shortcut: <Icon icon="mdi:eye" />,
            action: () => props?.togglePreview(dataContent),
            disabled:
                dataContent.type == "file" &&
                checkExtension(dataContent.extension)
                    ? false
                    : true,
        },
        {
            title: t("label.rename"),
            shortcut: <Icon icon="mdi:rename-box" />,
            action: () => props?.toggleRename(dataContent),
        },
        {
            title: t("label.edit"),
            shortcut: <Icon icon="mdi:pencil" />,
            action: () => props?.toggleEdit(dataContent),
            disabled:
                dataContent.type == "file" && getType(dataContent.extension)
                    ? false
                    : true,
        },
        {
            title: t("label.copy"),
            shortcut: <Icon icon="mdi:content-copy" />,
            action: () => {
                const count = table?.getFilteredSelectedRowModel().rows.length;
                if (count > 0) {
                    props?.handleCopy(null);
                } else {
                    props?.handleCopy(data);
                }
            },
        },
        {
            title: t("label.cut"),
            shortcut: <Icon icon="mdi:content-cut" />,
            action: () => {
                const count = table?.getFilteredSelectedRowModel().rows.length;
                if (count > 0) {
                    props?.handleCut(null);
                } else {
                    props?.handleCut(data);
                }
            },
        },
        {
            title: t("label.paste"),
            shortcut: <Icon icon="mdi:content-paste" />,
            action: () => props?.handlePaste(),
        },
        {
            title: t("label.download"),
            shortcut: <Icon icon="mdi:download" />,
            action: () => props?.handleDownload(dataContent),
        },

        {
            title: t("label.delete"),
            shortcut: <Icon icon="mdi:delete" color="red" />,
            action: () => {
                props?.toggleDelete(dataContent);
                const timeOut = setInterval(() => {
                    table?.resetRowSelection();
                }, 5000);
                return clearInterval(timeOut);
            },
        },
    ];

    /**
     * handle click
     * @param e
     */
    const handleClick = React.useCallback(
        (e: React.MouseEvent<HTMLSpanElement | HTMLButtonElement>) => {
            // e.preventDefault();
            const count = e.detail;
            const isCtrlPressed = e.ctrlKey;

            if (count === 1) {
                if (view === "list") {
                    if (isCtrlPressed) {
                        toggleDataInArray(data);
                    } else {
                        row.toggleSelected();
                    }
                } else if (view === "grid") {
                    if (isCtrlPressed) {
                        toggleDataInArray(data);
                    } else {
                        props?.handleOneClick(data);
                        props?.handleMultipleClick([]);
                    }
                }
            } else if (count === 2 && data.type === "dir") {
                table?.resetRowSelection();
                props?.handleDoubleClick(data);
            }
        },
        [
            data,
            view,
            row,
            table,
            props?.handleOneClick,
            props?.handleDoubleClick,
        ],
    );
    /**
     * toggle data in array
     * @param data
     */
    const toggleDataInArray = (data: Item) => {
        const updatedArray = [...currents];
        const dataIndex = updatedArray.findIndex(
            (item) => item.path === data.path,
        );
        if (dataIndex !== -1) {
            updatedArray.splice(dataIndex, 1);
        } else {
            updatedArray.push(data);
        }
        props?.handleMultipleClick(updatedArray);
    };

    return (
        <ContextMenu
            className={classNames(
                "items-center",
                view == "list" ? "flex" : "flex-col",
            )}
            asChild={view == "list" ? false : true}
            title={
                view == "list" && data ? (
                    <RenderItemList item={data} handleClick={handleClick} />
                ) : view == "grid" && data ? (
                    <RenderItemGrid
                        item={dataContent}
                        disk={disk}
                        active={
                            current?.path === data.path
                                ? true
                                : currents.includes(data)
                                ? true
                                : false
                        }
                        handleClick={handleClick}
                        handleMultipleClick={props?.handleMultipleClick}
                    />
                ) : null
            }
            list={actions}
        />
    );
};

export default MenuContext;
