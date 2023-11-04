import Modal from "@/components/Modal/Modal";
import { Icon } from "@iconify/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Item } from "../FileManager";
import { Button, Col, Grid, toast } from "@min98/ui";
import { timestampToDate } from "../Utils/FileUtils";
import { createShare, listShare, unShare } from "../Utils/ActionUtils";

interface ModalDetailProps {
    open: boolean;
    onClose: () => void;
    disk: string;
    item?: Item;
    actions?: (data: any) => void;
}

const ModalDetail: React.FC<ModalDetailProps> = ({
    open,
    disk,
    item,
    actions,
    onClose,
}) => {
    const { t } = useTranslation();
    const [data, setData] = React.useState<any>({});
    const [shares, setShares] = React.useState<any[]>([]);

    React.useEffect(() => {
        setData(item);
        if (disk == "nextcloud" && item) {
            getShare(disk, item);
        }
    }, [item]);
    /**
     * handle copy to clipboard
     * @param data any
     */
    const handleCopy = (data: any) => {
        navigator.clipboard.writeText(data);
        const notify = {
            title: t("label.clipboard"),
            description: t("label.clipboard"),
            status: "success",
        };
        toast(notify);
    };
    /**
     * get share link
     * @param disk string
     * @param data any
     */
    const getShare = async (disk: string, data: any) => {
        const list = await listShare(disk, data);
        setShares(list);
    };
    /**
     * handle share
     * @param disk string
     * @param data any
     */
    const handleShare = async (disk: string, data: any) => {
        await createShare(disk, data);
        await getShare(disk, data);
    };
    /**
     * handle unshare
     * @param id number
     */
    const handleUnShare = async (id: number) => {
        await unShare(id);
        await getShare(disk, data);
    };
    return (
        <Modal open={open} cancel={onClose} title={t("label.detail")}>
            {data && (
                <Col col="2">
                    <Col col="1">
                        <Grid col="3">
                            <h4 className="capitalize font-bold">basename:</h4>
                            <span className="break-all">{data.basename}</span>
                            <div className="justify-end">
                                <Button
                                    size="sm"
                                    tooltip={t("tooltip.copy")}
                                    onClick={() => handleCopy(data.basename)}
                                >
                                    <Icon icon="mdi:content-copy" />
                                </Button>
                            </div>
                        </Grid>
                        <Grid col="3">
                            <h4 className="capitalize font-bold">dirname:</h4>
                            <span className="break-all">{data.dirname}</span>
                            <div className="justify-end">
                                <Button
                                    size="sm"
                                    tooltip={t("tooltip.copy")}
                                    onClick={() => handleCopy(data.dirname)}
                                >
                                    <Icon icon="mdi:content-copy" />
                                </Button>
                            </div>
                        </Grid>
                        <Grid col="3">
                            <h4 className="capitalize font-bold">path:</h4>
                            <span className="break-all">{data.path}</span>
                            <div className="justify-end">
                                <Button
                                    size="sm"
                                    tooltip={t("tooltip.copy")}
                                    onClick={() => handleCopy(data.path)}
                                >
                                    <Icon icon="mdi:content-copy" />
                                </Button>
                            </div>
                        </Grid>
                        <Grid col="3">
                            <h4 className="capitalize font-bold">timestamp:</h4>
                            <span className="break-all">
                                {timestampToDate(data.timestamp)}
                            </span>
                        </Grid>
                        <Grid col="3">
                            <h4 className="capitalize font-bold">type:</h4>
                            <span>{data.type}</span>
                        </Grid>
                        <Grid col="3">
                            <h4 className="capitalize font-bold">
                                visibility:
                            </h4>
                            <span>{data.visibility}</span>
                        </Grid>
                    </Col>
                    <Col col="1">
                        {disk == "nextcloud" && (
                            <React.Fragment>
                                <Button
                                    onClick={() =>
                                        handleShare(disk as string, data)
                                    }
                                    color="success"
                                    tooltip={t("tooltip.create_share")}
                                >
                                    <Icon icon="mdi:plus-box-multiple" />
                                </Button>
                                <Grid col="1">
                                    <h4 className="capitalize font-bold">
                                        {t("label.share")}
                                    </h4>
                                    <table>
                                        <tbody>
                                            {shares.length > 0 &&
                                                shares.map((item, k) => (
                                                    <tr key={k}>
                                                        <td className="flex flex-row">
                                                            <span className="">
                                                                {item.url}
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                tooltip={t(
                                                                    "tooltip.copy",
                                                                )}
                                                                onClick={() =>
                                                                    handleCopy(
                                                                        item.url,
                                                                    )
                                                                }
                                                            >
                                                                <Icon icon="mdi:content-copy" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                tooltip={t(
                                                                    "tooltip.unshare",
                                                                )}
                                                                onClick={() =>
                                                                    handleUnShare(
                                                                        item.id,
                                                                    )
                                                                }
                                                            >
                                                                <Icon
                                                                    icon="mdi:close-thick"
                                                                    color="red"
                                                                />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </Grid>
                            </React.Fragment>
                        )}
                    </Col>
                </Col>
            )}
        </Modal>
    );
};

export default ModalDetail;
