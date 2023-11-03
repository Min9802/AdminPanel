import React from "react";
import { FileProps, FolderProps, Item } from "./FileManager";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { checkExtension, extensionToIcon, getType } from "./Utils/FileUtils";
import { ContextMenu } from "@/components/Form";
import classNames from "classnames";
import { thumbnail } from "./Utils/ActionUtils";
import { delay } from "@/Utils/systemUtil";

interface MenuContextProps {
    disk: string;
    view: string;
    current?: Item;
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
    togglePreview: (data: FileProps) => void;
    toggleRename: (data: Item) => void;
    toggleEdit: (data: Item) => void;
    toggleDelete: (data: Item) => void;
}
interface ItemProps {
    item: Item;
    current?: Item;
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
const RenderItemList: React.FC<ItemProps> = ({ item, handleClick }) => {
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
const RenderItemGrid: React.FC<ItemProps> = ({
    item,
    current,
    disk,
    handleClick,
    handleMultipleClick,
}) => {
    return (
        <button
            type="button"
            className={classNames(
                "p-2 min-w-[100px] hover:rounded-md hover:shadow-4 justify-center",
                "active:bg-blue-200 active:rounded-md active:shadow-4",
                current ? current.path == item.path && "active" : "",
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
                            className="text-7xl"
                        />
                    )}
                    <p>{item.filename}</p>
                </>
            ) : (
                <>
                    <Icon
                        icon="mdi:folder-open"
                        className="text-7xl"
                        color="#FCD34D"
                    />
                    <p>{item.basename}</p>
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
    current,
    data,
    row,
    table,
    ...props
}) => {
    const { t } = useTranslation();
    const {
        handleMultipleClick,
        handleOneClick,
        handleDoubleClick,
        handleDownload,
        handleCopy,
        handleCut,
        handlePaste,
        togglePreview,
        toggleRename,
        toggleEdit,
        toggleDelete,
    } = props;
    /**
     * define actions
     */
    const actions = [
        {
            title: t("label.preview"),
            shortcut: <Icon icon="mdi:eye" />,
            action: () => togglePreview(data),
            disabled:
                data.type == "file" && checkExtension(data.extension)
                    ? false
                    : true,
        },
        {
            title: t("label.rename"),
            shortcut: <Icon icon="mdi:rename-box" />,
            action: () => toggleRename(data),
        },
        {
            title: t("label.edit"),
            shortcut: <Icon icon="mdi:pencil" />,
            action: () => toggleEdit(data),
            disabled:
                data.type == "file" && getType(data.extension) ? false : true,
        },
        {
            title: t("label.copy"),
            shortcut: <Icon icon="mdi:content-copy" />,
            action: () => {
                const count = table?.getFilteredSelectedRowModel().rows.length;
                if (count > 0) {
                    handleCopy(null);
                } else {
                    handleCopy(data);
                }
            },
        },
        {
            title: t("label.cut"),
            shortcut: <Icon icon="mdi:content-cut" />,
            action: () => {
                const count = table?.getFilteredSelectedRowModel().rows.length;
                if (count > 0) {
                    handleCut(null);
                } else {
                    handleCut(data);
                }
            },
        },
        {
            title: t("label.paste"),
            shortcut: <Icon icon="mdi:content-paste" />,
            action: () => handlePaste(),
        },
        {
            title: t("label.download"),
            shortcut: <Icon icon="mdi:download" />,
            action: () => handleDownload(data),
        },

        {
            title: t("label.delete"),
            shortcut: <Icon icon="mdi:delete" color="red" />,
            action: () => {
                toggleDelete(data);
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
            if (count === 1) {
                if (view == "list") {
                    row.toggleSelected();
                } else if (view == "grid") {
                    handleOneClick(data);
                }
                // handleOneClick(data);
            } else if ((count === 2 && data.type) === "dir") {
                table?.resetRowSelection();
                handleDoubleClick(data);
            }
        },
        [handleOneClick, handleDoubleClick],
    );

    return (
        <ContextMenu
            className={classNames(
                "items-center",
                view == "list" ? "flex" : "flex-col",
            )}
            asChild={view == "list" ? false : true}
            title={
                view == "list" && data ? (
                    <RenderItemList
                        item={data}
                        disk={disk}
                        handleClick={handleClick}
                        handleMultipleClick={handleMultipleClick}
                    />
                ) : view == "grid" && data ? (
                    <RenderItemGrid
                        item={data}
                        disk={disk}
                        current={current}
                        handleClick={handleClick}
                        handleMultipleClick={handleMultipleClick}
                    />
                ) : null
            }
            list={actions}
        />
    );
};

export default MenuContext;
