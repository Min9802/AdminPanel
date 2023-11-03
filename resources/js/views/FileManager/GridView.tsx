import React from "react";
import { ViewProps } from "./FileManager";
import { useTranslation } from "react-i18next";
import { Col, Flex, Grid } from "@min98/ui";
import MenuContext from "./MenuContext";
const GridView: React.FC<ViewProps> = ({
    disk,
    view,
    current,
    directories,
    files,
    ...props
}) => {
    const { t } = useTranslation();
    return (
        <Col col="1">
            <Flex
                align="center"
                justify="center"
                wrap="wrap"
                gap={1}
                className="mt-2"
            >
                {directories.map((item: any, k: number) => {
                    return (
                        <MenuContext
                            view={view}
                            disk={disk}
                            data={item}
                            current={current}
                            {...props}
                        />
                    );
                })}
                {files.map((item: any, k: number) => {
                    return (
                        <MenuContext
                            view={view}
                            disk={disk}
                            data={item}
                            current={current}
                            {...props}
                        />
                    );
                })}
            </Flex>
        </Col>
    );
};

export default GridView;
