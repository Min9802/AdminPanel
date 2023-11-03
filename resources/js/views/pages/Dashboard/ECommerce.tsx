import React, { BaseSyntheticEvent, useState } from "react";
import CardFour from "../Example/Card/CardFour.tsx";
import CardOne from "../Example/Card/CardOne.tsx";
import CardThree from "../Example/Card/CardThree.tsx";
import CardMini from "@/components/Card/CardMini.tsx";

import ChartThree from "@/components/Chart/ChartThree.tsx";
import ChartTwo from "@/components/Chart/ChartTwo.tsx";
import ChatCard from "@/components/Chart/ChatCard.tsx";
import TableOne from "@/components/Table/TableOne.tsx";

import { RootState } from "@/store/reducers/rootReducer.ts";
import { ConnectedProps, connect } from "react-redux";
import * as actions from "@/store/actions";
import { Icon } from "@iconify/react";
import ChartOne from "@/components/Chart/ChartOne.tsx";
import { t } from "i18next";
import MapOne from "../Example/Map/MapOne.tsx";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@min98/ui";
import { Button } from "@min98/ui";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@min98/ui";
import { Badge } from "@min98/ui";

const ECommerce: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const [toast, setToast] = useState(false);
    const [modal, setModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };
    const handleModal = () => {
        setModal(!modal);
    };
    const handleConfirm = () => {
        console.log(1234);
    };
    const options = [
        {
            value: 0,
            text: "Angular",
        },
        {
            value: 1,
            text: "Bootstrap",
        },
        {
            value: 2,
            text: "React.js",
        },
        {
            value: 3,
            text: "Vue.js",
        },
        {
            label: "backend",
            options: [
                {
                    value: 4,
                    text: "Django",
                },
                {
                    value: 5,
                    text: "Laravel",
                },
                {
                    value: 6,
                    text: "Node.js",
                },
            ],
        },
    ];
    return (
        <>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>
                        <Icon
                            icon="tabler:user"
                            color="red"
                            fontSize="text-3xl"
                        />
                        Test Card
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="btn">
                                    Hover
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add to library</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="space-x-8">
                        <Button
                            tooltip={t("label.enable2fa")}
                            onClick={() => {
                                props.setNotice({
                                    status: "success",
                                    type: "toast",
                                    title: "Notice",
                                    message: "Notice test",
                                });
                            }}
                        >
                            <Icon icon="tabler:user" color="success" /> Test
                            Toast
                        </Button>
                        <Button
                            variant="outline"
                            color="warning"
                            onClick={() => {
                                props.setNotice({
                                    status: "warning",
                                    // icon: (
                                    //     <Icon icon="tabler:user" color="red" />
                                    // ),
                                    type: "alert",
                                    title: "Test Alert modal",
                                    message:
                                        "lorem ipsum dolor sit amet, consectetur",
                                });
                            }}
                        >
                            <Icon icon="tabler:user" color="red" /> Test Noti
                        </Button>
                        <Button onClick={handleModal}>
                            <Icon icon="tabler:user" color="red" /> Test Modal
                        </Button>
                        <Badge color="secondary">Test</Badge>
                    </div>
                </CardContent>
                <CardFooter>Close</CardFooter>
            </Card>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardOne />
                <CardMini
                    icon={<Icon icon="mdi:shopping" color="blue" />}
                    body={{
                        content: "$3.456K",
                        color: "text-meta-1",
                    }}
                    desc="total"
                    footer={{
                        content: "25%",
                    }}
                    style={{
                        border: "lg",
                    }}
                />
                <CardThree />
                <CardFour />
            </div>

            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                {/* <ChartOne /> */}

                <ChartOne />
                <ChartTwo />
                <ChartThree />
                <MapOne />
                <div className="col-span-12 xl:col-span-8">
                    <TableOne />
                </div>
                <ChatCard />
            </div>
        </>
    );
};
const mapStateToProps = (state: RootState) => {
    return {
        notice: state.app.notice,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setNotice: (notice: object) => dispatch(actions.setNotice(notice)),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

// Define the additional props from mapDispatchToProps
interface DispatchProps {
    setNotice: (notice: object) => void;
}

export default connector(ECommerce);
