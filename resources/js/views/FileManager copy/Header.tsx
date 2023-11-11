import { ButtonGroup } from "@/components/Button";

import { Icon } from "@iconify/react";
import { Button, Col, Flex, Grid } from "@min98/ui";
import React from "react";
import { useTranslation } from "react-i18next";

interface HeaderProps {
    clipboard?: boolean;
    selected?: boolean;
    setView: (view: string) => void;
    props?: any;
    toggleReload: () => void;
    toggleNewFile: () => void;
    toggleNewFolder: () => void;
    toggleUpload: () => void;
    handleCopy: (data: any) => void;
    handleCut: (data: any) => void;
    handlePaste: () => void;
}

const Header: React.FC<HeaderProps> = ({
    clipboard,
    selected,
    setView,
    ...props
}) => {
    const { t } = useTranslation();
    const {
        toggleReload,
        toggleNewFile,
        toggleNewFolder,
        toggleUpload,
        handleCopy,
        handleCut,
        handlePaste,
    } = props;
    /**
     * handle SetView
     * @param view
     */
    const handleSetView = (view: string) => {
        setView(view);
    };
    return (
        <Grid
            col="4"
            align="center"
            justify="center"
            className="lg:!grid-cols-4 sm:grid-cols-1"
        >
            <Col col="3" className="">
                <Flex justify="start" align="start">
                    <ButtonGroup>
                        <Button
                            color="secondary"
                            onClick={toggleReload}
                            tooltip={t("label.reload")}
                        >
                            <Icon icon="mdi:reload" />
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button
                            color="secondary"
                            onClick={toggleNewFile}
                            tooltip={t("label.newfile")}
                        >
                            <Icon icon="mdi:file" />
                        </Button>
                        <Button
                            color="secondary"
                            onClick={toggleNewFolder}
                            tooltip={t("label.newfolder")}
                        >
                            <Icon icon="mdi:folder-plus-outline" />
                        </Button>
                        <Button
                            color="secondary"
                            onClick={toggleUpload}
                            tooltip={t("label.upload")}
                        >
                            <Icon icon="mdi:cloud-upload" />
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button
                            color="secondary"
                            onClick={() => handleCopy(null)}
                            disabled={!selected ? true : false}
                            tooltip={t("label.copy")}
                        >
                            <Icon icon="mdi:content-copy" />
                        </Button>
                        <Button
                            color="secondary"
                            onClick={() => handleCut(null)}
                            disabled={!selected ? true : false}
                            tooltip={t("label.cut")}
                        >
                            <Icon icon="mdi:content-cut" />
                        </Button>
                        <Button
                            color="secondary"
                            onClick={handlePaste}
                            disabled={!clipboard ? true : false}
                            tooltip={t("label.paste")}
                        >
                            <Icon icon="mdi:content-paste" />
                        </Button>
                    </ButtonGroup>
                </Flex>
            </Col>
            <Col col="1" className="">
                <Flex justify="end" align="end">
                    <ButtonGroup>
                        <Button
                            color="secondary"
                            onClick={() => handleSetView("list")}
                            tooltip={t("label.tableView")}
                        >
                            <Icon icon="mdi:list-box" />
                        </Button>
                        <Button
                            color="secondary"
                            onClick={() => handleSetView("grid")}
                            tooltip={t("label.gridView")}
                        >
                            <Icon icon="mdi:grid" />
                        </Button>
                    </ButtonGroup>
                </Flex>
            </Col>
        </Grid>
    );
};

export default Header;
