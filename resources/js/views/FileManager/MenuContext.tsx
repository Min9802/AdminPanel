import React from "react";
import { FileProps, Item } from "./FileManager";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import {
    checkExtension,
    extensionToIcon,
    getType,
    splitFileName,
} from "./Utils/FileUtils";
import { ContextMenu } from "@/components/Form";
import classNames from "classnames";
import { thumbnail } from "./Utils/ActionUtils";
import { delay } from "@/Utils/systemUtil";
interface ViewListProps {
    item: Item;
    handleClick: (
        e: React.MouseEvent<HTMLSpanElement | HTMLButtonElement>,
    ) => void;
}
interface ViewGridProps {
    item: Item;
    disk: string;
    active?: boolean;
    handleClick: (
        e: React.MouseEvent<HTMLSpanElement | HTMLButtonElement>,
    ) => void;
    handleMultipleClick: (data: Item[]) => void;
}
interface MenuContextProps {
    disk: string;
    view: string;
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
}
interface ItemProps {
    item: Item;
    active?: boolean;
    disk: string;
    handleMultipleClick: (data: Item[]) => void;
    handleClick?: (
        e: React.MouseEvent<HTMLSpanElement | HTMLButtonElement>,
    ) => void;
}
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
                    <p>{splitFileName(item.basename)}</p>
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
    // console.log(item);
    return (
        <button
            type="button"
            className={classNames(
                "p-2 w-[120px] h-[120px] hover:rounded-md hover:shadow-4 justify-center",
                "active:bg-blue-200 active:rounded-md active:shadow-4",
                active && "active",
            )}
            onClick={handleClick}
        >
            {item.type === "file" ? (
                <>
                    {checkExtension(item.extension) == "image" ? (
                        <RenderPreView
                            item={item}
                            disk={disk}
                            handleMultipleClick={handleMultipleClick}
                        />
                    ) : (
                        <Icon
                            icon={extensionToIcon(item.extension)}
                            className="text-5xl mr-auto ml-auto"
                        />
                    )}
                    <p className="break-all">{splitFileName(item.filename)}</p>
                </>
            ) : (
                <>
                    <Icon
                        icon="mdi:folder-open"
                        className="text-5xl mr-auto ml-auto"
                        color="#FCD34D"
                    />
                    <p>{splitFileName(item.basename)}</p>
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
    const [url, setUrl] = React.useState<any>(null);
    /**
     * hook set url
     */
    React.useEffect(() => {
        delay(async () => {
            const url = await thumbnail(disk, item);
            setUrl(url);
        }, 50);
    }, []);
    return (
        <>
            {url && (
                <img
                    className="mr-auto ml-auto"
                    src={url}
                    alt={item.filename}
                />
            )}
        </>
    );
};
const MenuContext: React.FC<MenuContextProps> = ({
    disk,
    view,
    current,
    currents = [],
    data,
    row,
    table,
    ...props
}) => {
    const { t } = useTranslation();
    /**
     * define actions
     */
    const actions = [
        {
            title: t("label.detail"),
            shortcut: <Icon icon="mdi:information-outline" />,
            action: () => props?.toggleModalDetail(data),
        },
        {
            title: t("label.preview"),
            shortcut: <Icon icon="mdi:eye" />,
            action: () => props?.togglePreview(data),
            disabled:
                data.type == "file" && checkExtension(data.extension)
                    ? false
                    : true,
        },
        {
            title: t("label.rename"),
            shortcut: <Icon icon="mdi:rename-box" />,
            action: () => props?.toggleRename(data),
        },
        {
            title: t("label.edit"),
            shortcut: <Icon icon="mdi:pencil" />,
            action: () => props?.toggleEdit(data),
            disabled:
                data.type == "file" && getType(data.extension) ? false : true,
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
            action: () => props?.handleDownload(data),
        },

        {
            title: t("label.delete"),
            shortcut: <Icon icon="mdi:delete" color="red" />,
            action: () => {
                props?.toggleDelete(data);
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
            e.preventDefault();
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
                        item={data}
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
