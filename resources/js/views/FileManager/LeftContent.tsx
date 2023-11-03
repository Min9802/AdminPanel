import { Flex } from "@/components/Grid";
import { Icon } from "@iconify/react";
import { Button } from "@min98/ui";
import React from "react";
import FolderTree from "./FolderTree";
import { FolderProps } from "./FileManager";

interface LeftContentProps {
    selectDisk: string;
    setSelectFolder: (data: FolderProps) => void;
}
const LeftContent: React.FC<LeftContentProps> = ({
    selectDisk,
    setSelectFolder,
}) => {
    return (
        <React.Fragment>
            <Button
                variant="ghost"
                onClick={() => {
                    setSelectFolder({ path: "/" } as FolderProps);
                }}
            >
                <Icon icon="clarity:hard-disk-solid" className="mr-1" />
                {selectDisk}
            </Button>
            <Flex>
                <FolderTree
                    disk={selectDisk}
                    setSelectFolder={setSelectFolder}
                />
            </Flex>
        </React.Fragment>
    );
};

export default LeftContent;
