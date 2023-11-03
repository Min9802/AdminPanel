import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useForm } from "react-hook-form";
import { MultipleSelect } from "@/components/Form/MultipleSelect";
import ContextMenu from "@/components/Form/ContextMenu";
import * as actions from "@/store/actions";

import {
    Button,
    Label,
    Badge,
    Checkbox,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Form,
    Input,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@min98/ui";
import { Switch } from "@/min";
import InputForm from "@/components/Form/InputForm";
import Dropdown from "@/components/dropdown/Dropdown";

import { Icon } from "@iconify/react";
import Modal from "@/components/Modal/Modal";
import { ToastAction, useToast } from "@min98/ui";
import { t } from "i18next";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/reducers/rootReducer";
import { DataTable } from "../../components/Table/Table";
// import { Button } from "@/min";

const Home: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const { toast } = useToast();
    const pageInfo = {
        title: t("adminpage.product"),
        desc: t("adminpage.product"),
    };
    React.useEffect(() => {
        props.setPageInfo(pageInfo);
    }, []);
    const formSchema = z
        .object({
            username: z.string().min(2, {
                message: "Username must be at least 2 characters.",
            }),
            password: z.string().min(6, {
                message: "Password must be at least 6 characters.",
            }),
            confirmPassword: z.string().min(2, {
                message: "Confirm Password",
            }),
            email: z
                .string({
                    required_error: "Email require.",
                })
                .email({ message: "Email require" }),
            country: z
                .string({
                    required_error: "Please select an email to display.",
                })
                .nonempty("Field is required"),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords don't match",
            path: ["confirmPassword"],
        });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
            confirmPassword: "",
            country: "",
        },
    });
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }
    const [open, setOpen] = React.useState(false);
    const [type, setType] = React.useState("password");
    const handleShowPass = () => {
        setType("text");
    };
    const handleHidePass = () => {
        setType("password");
    };
    const callBack = (e: any) => {
        console.log(e);
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
    ];

    const listDropdown = [
        {
            icon: <Icon icon="mdi:home" />,
            label: "Home",
            path: "/",
        },
        {
            icon: <Icon icon="mdi:account" />,
            label: "Account",
            path: "/account",
            child: [
                {
                    icon: <Icon icon="mdi:account" />,
                    label: "Profile",
                    path: "/profile",
                },
                {
                    icon: <Icon icon="mdi:wallet-bifold" />,
                    label: "Wallet",
                    path: "/wallet",
                },
            ],
        },
    ];
    const formFields = [
        {
            name: "username",
            label: "Username",
            type: "text",
            placeholder: "Enter your username",
            description: "This is your public display name.",
        },
        {
            name: "password",
            label: "Password",
            iconStart: <Icon icon="tabler:lock" />,
            iconEnd:
                type == "text" ? (
                    <Icon icon="tabler:eye-off" />
                ) : (
                    <Icon icon="tabler:eye" />
                ),
            type: type,
            handleFunc: type == "password" ? handleShowPass : handleHidePass,
            placeholder: "Enter your password",
            description: "Password must be at least 6 characters.",
        },
        {
            name: "confirmPassword",
            label: "Confirm Password",
            type: type,
            iconEnd:
                type == "text" ? (
                    <Icon icon="tabler:eye-off" />
                ) : (
                    <Icon icon="tabler:eye" />
                ),
            handleFunc: type == "password" ? handleShowPass : handleHidePass,
            placeholder: "Confirm your password",
            description: "Confirm your password.",
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter your email",
            description: "Email is require.",
        },
        {
            name: "country",
            label: "Country",
            type: "text",
            placeholder: "Select your country",
            description: "Please select your country.",
        },
        // Add more fields as needed
    ];

    return (
        <>
            <Button variant={"outline"} color="primary">
                Test
            </Button>

            <Modal
                title="Test"
                open={open}
                message="aloooooo"
                cancel={() => setOpen(!open)}
            >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
                rem sunt deserunt itaque repellendus totam molestiae nemo optio
                beatae iure quia harum eveniet, illo doloribus incidunt minima
                est ullam consequuntur?
            </Modal>
            <Card>
                <CardContent>
                    <Button
                        variant="outline"
                        color="success-light"
                        onClick={() => {
                            toast({
                                title: "Scheduled: Catch up ",
                                description:
                                    "Friday, February 10, 2023 at 5:57 PM",
                                status: "error",
                                // action: (
                                //     <ToastAction altText="Goto schedule to undo">
                                //         Undo
                                //     </ToastAction>
                                // ),
                            });
                        }}
                    >
                        <Icon icon="mdi:account-circle" fontSize={25} />
                    </Button>
                    <Tabs
                        defaultValue="account"
                        className="lg:w-[400px] sm:w-auto"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account</CardTitle>
                                    <CardDescription>
                                        Make changes to your account here. Click
                                        save when you're done.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            defaultValue="Pedro Duarte"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="username">
                                            Username
                                        </Label>
                                        <Input
                                            id="username"
                                            defaultValue="@peduarte"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="country">Country</Label>
                                        <Select>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select a fruit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        Fruits
                                                    </SelectLabel>
                                                    <SelectItem value="apple">
                                                        Apple
                                                    </SelectItem>
                                                    <SelectItem value="banana">
                                                        Banana
                                                    </SelectItem>
                                                    <SelectItem value="blueberry">
                                                        Blueberry
                                                    </SelectItem>
                                                    <SelectItem value="grapes">
                                                        Grapes
                                                    </SelectItem>
                                                    <SelectItem value="pineapple">
                                                        Pineapple
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Save changes</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="password">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Password</CardTitle>
                                    <CardDescription>
                                        Change your password here. After saving,
                                        you'll be logged out.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="current">
                                            Current password
                                        </Label>
                                        <Input id="current" type="password" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="new">
                                            New password
                                        </Label>
                                        <Input id="new" type="password" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Save password</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            <Card>
                <CardHeader></CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            {formFields.map((fieldName, key) => (
                                <InputForm
                                    key={key}
                                    label={fieldName?.label}
                                    name={fieldName?.name}
                                    iconStart={fieldName?.iconStart}
                                    iconEnd={fieldName?.iconEnd}
                                    type={fieldName?.type}
                                    description={fieldName?.description}
                                    handleFunc={fieldName?.handleFunc}
                                    control={form.control}
                                />
                            ))}
                            <MultipleSelect
                                options={options}
                                callback={callBack}
                                value={["1", "3"]}
                            />
                            <div className="items-top flex space-x-2">
                                <Checkbox id="terms1" />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="terms1"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Accept terms and conditions
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                        You agree to our Terms of Service and
                                        Privacy Policy.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="airplane-mode" />
                                <Label htmlFor="airplane-mode">
                                    Airplane Mode
                                </Label>
                            </div>
                            <Button
                                variant={"outline"}
                                color="primary"
                                type="submit"
                            >
                                <Badge color="danger-light">Test</Badge>
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader></CardHeader>
                <CardContent>
                    <Button onClick={() => setOpen(!open)}>Open Modal</Button>
                    <Dropdown label="Account" list={listDropdown} />
                </CardContent>
            </Card>
            <Card>
                <CardContent></CardContent>
            </Card>
        </>
    );
};
const mapStateToProps = (state: RootState) => {
    return {};
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        setPageInfo: (pageInfo: any) => dispatch(actions.SetInfoPage(pageInfo)),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
interface DispatchProps {
    setPageInfo: (pageInfo: any[]) => void;
}
export default connector(Home);
