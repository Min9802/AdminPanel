import { Icon } from "@iconify/react/dist/iconify.js";
import { Badge, Button } from "@min98/ui";
import React from "react";
import { FolderProps } from "./FileManager";

interface ListDiskProps {
    disks: string[];
    selectDisk: string;
    selectFolder?: FolderProps;
    setSelectDisk: (disk: string) => void;
    setSelectFolder: (data: FolderProps) => void;
}

const ListDisk: React.FC<ListDiskProps> = ({
    disks,
    selectDisk,
    selectFolder,
    setSelectDisk,
    setSelectFolder,
}) => {
    const [breadcrumb, setBreadcrumb] = React.useState<string[]>([]);
    /**
     * hook
     */
    React.useEffect(() => {
        if (selectFolder && selectFolder.type) {
            const pathSplit = selectFolder?.path.split("/");
            setBreadcrumb(pathSplit);
        }
    }, [selectFolder]);
    React.useEffect(() => {
        setBreadcrumb([]);
    }, [selectDisk]);
    /**
     * handle click breadcrumb
     * @param path
     */
    const handleClickBreadcrumb = (path: string) => {
        const index = breadcrumb.indexOf(path);
        if (index !== -1 && index >= 0) {
            const breadcrumbFilter = breadcrumb.slice(0, index + 1);
            const mergedPath = breadcrumbFilter.join("/");
            setSelectFolder({ path: mergedPath } as FolderProps);
            setBreadcrumb(breadcrumbFilter);
        }
    };
    return (
        <div className="flex flex-col gap-1 border-b-1 border-b-dark py-2">
            <div className="inline-flex p-1 gap-1">
                {disks.length > 0 &&
                    disks.map((disk, k) => (
                        <Badge
                            key={k}
                            color="secondary-light"
                            className="cursor-pointer"
                            onClick={() => setSelectDisk(disk)}
                        >
                            <Icon
                                icon="clarity:hard-disk-solid"
                                className="mr-1"
                            />
                            {disk}
                        </Badge>
                    ))}
            </div>
            <div className="inline-flex bg-primary-light p-1 gap-1">
                <Button
                    color="secondary-light"
                    size="sm"
                    onClick={() => {
                        setSelectFolder({
                            path: "/",
                        } as FolderProps);
                        setBreadcrumb([]);
                    }}
                >
                    <Icon icon="clarity:hard-disk-solid" className="mr-1" />
                </Button>

                {breadcrumb.map((item, k) => (
                    <React.Fragment key={k}>
                        /
                        <Button
                            key={k}
                            color="secondary-light"
                            size="sm"
                            onClick={() => handleClickBreadcrumb(item)}
                        >
                            {item}
                        </Button>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default ListDisk;
