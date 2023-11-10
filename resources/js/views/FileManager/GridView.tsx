import React from "react";
import { Item, ViewProps } from "./FileManager";
import { Col, Flex, ScrollArea } from "@min98/ui";
import MenuContext from "./MenuContext";
const GridView: React.FC<ViewProps> = ({
    disk,
    view,
    clipboard,
    current,
    currents,
    directories,
    files,
    ...props
}) => {
    const [dataContent, setDataContent] = React.useState<any[]>([]);
    /**
     * init data
     */
    React.useEffect(() => {
        setDataContent([...directories, ...files]);
    }, [files, directories]);
    return (
        <Col col="1">
            <ScrollArea className="min-h-[400px] max-h-[600px] overflow-scroll">
                <Flex
                    align="center"
                    justify="center"
                    wrap="wrap"
                    gap="1"
                    className="mt-2 overflow-scroll"
                >
                    {dataContent &&
                        dataContent.length > 0 &&
                        dataContent.map((item: Item, k: number) => {
                            return (
                                <MenuContext
                                    key={k}
                                    view={view}
                                    disk={disk}
                                    data={item}
                                    clipboard={clipboard}
                                    current={current}
                                    currents={currents}
                                    {...props}
                                />
                            );
                        })}
                </Flex>
            </ScrollArea>
        </Col>
    );
};

export default GridView;
