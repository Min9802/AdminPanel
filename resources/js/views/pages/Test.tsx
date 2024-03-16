import {
    DateTimePicker,
    DatePickerRange,
    Dropdown,
    DropdownProps,
    OptionMutiSelect,
    ContextMenuType,
    OptionComboBoxProps,
    ComboBox,
    ContextMenuCustom,
    MultipleSelect,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Grid,
    Input,
    Label,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@min98/ui";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@min98/ui";

const Test = () => {
    const Onchange = (event: any) => {
        console.log(event);
    };
    const [date, setDate] = React.useState<Date>();
    const [dateRange, setDateRange] = React.useState<DateRange>();
    const [selecteds, setSelected] = React.useState<any>();

    React.useEffect(() => {
        console.log(date);
        console.log(dateRange);
    }, [date, dateRange]);
    const options: OptionComboBoxProps[] = [
        {
            value: "next.js",
            label: "Next.js",
            disabled: true,
        },
        {
            value: "sveltekit",
            label: "SvelteKit",
        },
        {
            value: "nuxt.js",
            label: "Nuxt.js",
        },
        {
            value: "remix",
            label: "Remix",
        },
    ];
    const list: DropdownProps[] = [
        {
            label: "date",
            icon: <Icon icon="tabler:calendar-month" />,
            action: () => {
                console.log(143);
            },
            child: [
                {
                    label: "date1",
                    icon: <Icon icon="tabler:calendar-month" />,
                    path: "/admin/date1",
                    child: [
                        {
                            label: "date2",
                            icon: <Icon icon="tabler:calendar-month" />,
                            action: () => {
                                console.log(123);
                            },
                        },
                        {
                            label: "dateRange2",
                            icon: <Icon icon="tabler:calendar-week" />,
                            path: "/admin/dateRange2",
                        },
                    ],
                },
                {
                    label: "dateRange",
                    icon: <Icon icon="tabler:calendar-week" />,
                    path: "/admin/dateRange",
                },
            ],
        },
        {
            label: "dateRange",
            icon: <Icon icon="tabler:calendar-week" />,
            path: "/admin/dateRange",
        },
    ];
    const menus: ContextMenuType[] = [
        {
            title: "preview",
            shortcut: <Icon icon="mdi:eye" />,
            action: () => console.log(143),
        },
        {
            title: "preview1",
            shortcut: <Icon icon="mdi:eye" />,
            action: () => console.log(123),
        },
    ];
    const selects: OptionMutiSelect[] = [
        {
            text: "Select1",
            value: "Select1",
        },
        {
            text: "Select2",
            value: "Select2",
        },
        {
            text: "Select3",
            value: "Select3",
        },
    ];
    return (
        <>
            <Grid col="3">
                <ComboBox options={options} callback={Onchange}></ComboBox>
                <DateTimePicker date={date} setDate={setDate}></DateTimePicker>
                <DatePickerRange setDate={setDateRange}></DatePickerRange>
                <Dropdown
                    icon={<Icon icon="tabler:x" />}
                    label="Nuxt.js"
                    list={list}
                ></Dropdown>
                <ContextMenuCustom
                    title={"aaa"}
                    list={menus}
                ></ContextMenuCustom>
                <MultipleSelect
                    options={selects}
                    callback={(value: any) => {
                        setSelected(value);
                    }}
                    value={selecteds}
                />
            </Grid>
            <Grid col="3">
                <Tabs defaultValue="account" className="lg:w-[400px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>account</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="text" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter></CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>password</CardTitle>
                                <CardDescription>password</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save password</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
                ;
            </Grid>
        </>
    );
};

export default Test;
