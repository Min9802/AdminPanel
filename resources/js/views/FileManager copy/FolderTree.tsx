import React from "react";
import { FolderProps } from "./FileManager";
import { getTree } from "./Utils/ApiUtils";
import classNames from "classnames";

interface FolderTreeProps {
    disk: string;
    setSelectFolder: (data: any) => void;
}
interface TreeProps {
    items: FolderProps[];
}
interface ItemProps {
    item: FolderProps;
}
const FolderTree: React.FC<FolderTreeProps> = ({ disk, setSelectFolder }) => {
    const [tree, setTree] = React.useState<any[]>([]);
    /**
     * hook get tree
     */
    React.useEffect(() => {
        getTree(disk, "").then((data) => {
            setTree(data);
        });
    }, [disk]);
    React.useEffect(() => {}, [tree]);
    /**
     * handle Click Tree
     * @param disk
     * @param path
     */
    const handleClickTree = async (disk: string, path: string) => {
        const Tree = tree.find((el) => el.path == path);
        if (Tree.open) {
            Tree.open = false;
            const treeFilter = tree.filter((el) => el.dirname != path);
            setTree(treeFilter);
        } else {
            Tree.open = true;
            const newTree = await getTree(disk, path);
            MergeTree(newTree);
        }
    };
    /**
     * merge tree
     * @param dirs
     */
    const MergeTree = (dirs: any[]) => {
        const mergedTree = Array.from(
            new Set([...tree, ...dirs].map((item) => item.path)),
        ).map((path) => {
            const item = [...tree, ...dirs].find((dir) => dir.path === path);
            return item;
        });
        setTree(mergedTree);
    };
    /**
     * render item
     * @param items
     * @returns
     */
    const RenderItem: React.FC<ItemProps> = ({ item }) => {
        return (
            <li>
                <p className="flex items-center rounded-md px-2 py-1 hover:bg-gray-200">
                    <span
                        className={classNames(
                            item.open
                                ? "icon-[line-md--minus-square]"
                                : item.props.hasSubdirectories
                                ? "icon-[line-md--plus-square-twotone]"
                                : "icon-[line-md--minus-square]",
                            "mr-1",
                        )}
                        onClick={() => handleClickTree(disk, item.path)}
                    ></span>
                    <span
                        className="cursor-pointer"
                        onClick={() => setSelectFolder(item)}
                    >
                        {item.basename}
                    </span>
                </p>
                {item.props.hasSubdirectories ? (
                    <RenderChild item={item} />
                ) : null}
            </li>
        );
    };
    /**
     * render tree children
     * @param items
     * @returns
     */
    const RenderChild: React.FC<ItemProps> = ({ item }) => {
        const items = tree.filter((el) => el.dirname == item.path);
        return (
            <ul className="pl-2">
                {items.length > 0 &&
                    items.map((item, k) => {
                        return (
                            <React.Fragment key={k}>
                                <RenderItem item={item} />
                            </React.Fragment>
                        );
                    })}
            </ul>
        );
    };

    /**
     * render tree
     * @param items
     * @returns
     */
    const RenderTree: React.FC<TreeProps> = ({ items }) => {
        const itemParent = items.filter((el) => el.dirname == "");
        return (
            <ul>
                {itemParent.length > 0 &&
                    itemParent.map((item, k) => {
                        return (
                            <React.Fragment key={k}>
                                <RenderItem item={item} />
                            </React.Fragment>
                        );
                    })}
            </ul>
        );
    };
    return <RenderTree items={tree} />;
};

export default FolderTree;
