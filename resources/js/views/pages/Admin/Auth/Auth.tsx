import React, { useEffect } from "react";
import * as actions from "@/store/actions";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/store/reducers/rootReducer";
import LogoDark from "@/assets/images/logo/Logo-sm.png";
import Logo from "@/assets/images/logo/Logo-sm.png";
import { Grid } from "@/components/Grid";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Label,
    Input,
    Button,
    Form,
    FormMessage,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormDescription,
    toast,
} from "@min98/ui";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputForm } from "@/components/Form";
import { getConfig, parseError } from "@/Utils/systemUtil";
import ReCAPTCHA from "react-google-recaptcha";
import OauthApi from "@/apis/Global/OauthApi";
import { Info } from "@/services/AuthServices";
import TwoFactor from "./TwoFactor";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const env = import.meta.env;
const Auth: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const { t } = useTranslation();
    const [type, setType] = React.useState("password");
    const [config, setConfig] = React.useState<any>([]);
    const [modal, setModal] = React.useState<boolean>(false);
    const [adminTemp, setAdminTemp] = React.useState<any>([]);
    const [tokenTemp, setTokenTemp] = React.useState<any>([]);
    const recaptchaRef = React.useRef(null);
    const redirect = useNavigate();
    /**
     * Get config system
     */
    useEffect(() => {
        getConfigSystem();
        if (props.access_token) {
            Check();
        }
    }, []);
    /**
     * check
     */
    const Check = async () => {
        try {
            const AdminInfo = await Info();
            if (AdminInfo) {
                const notify = {
                    title: t("label.logged_in"),
                    description: t("label.logged_in"),
                    status: "info",
                };
                toast(notify);
                redirect("/admin");
            } else {
                clearAuth();
            }
        } catch (err: any) {
            parseError(err);
            clearAuth();
        }
    };
    /**
     * clear authentication
     */
    const clearAuth = () => {
        props.clearAccessToken();
        props.clearRefreshToken();
        props.unsetAdmin();
    };
    /**
     * handle change type
     */
    const handleShowPass = () => {
        setType("text");
    };
    const handleHidePass = () => {
        setType("password");
    };
    /**
     * define form
     */
    /**
     * define input fields
     */
    const formFields = [
        {
            name: "username",
            label: t("label.username"),
            type: "text",
            iconStart: <Icon icon="tabler:user" />,
            placeholder: t("placeholder.username"),
            description: t("label.username"),
        },
        {
            name: "password",
            label: t("label.password"),
            type: type,
            iconStart: <Icon icon="tabler:lock" />,
            iconEnd:
                type == "text" ? (
                    <Icon icon="tabler:eye-off" />
                ) : (
                    <Icon icon="tabler:eye" />
                ),

            handleFunc: type == "password" ? handleShowPass : handleHidePass,
            placeholder: t("placeholder.password"),
            description: t("label.password"),
        },
        // Add more fields as needed
    ];
    const formSchema = z.object(
        Object.fromEntries(
            formFields.map((field) => [
                field.name,
                z.string().nonempty(`${field.label} ${t("label.required")}`),
            ]),
        ),
    );
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...Object.fromEntries(formFields.map((field) => [field.name, ""])),
        },
    });
    /**
     * get  config
     */
    const getConfigSystem = async () => {
        const configSystem = await getConfig();
        setConfig(configSystem);
    };

    /**
     * on submit form
     * @param values
     * @returns
     */
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (
            config &&
            config?.settings?.site.recaptcha_enable &&
            !values.recaptcha
        ) {
            form.setError("recaptcha", {
                type: "manual",
                message: t("validation.recaptcha"),
            });
            return;
        }
        try {
            const { VITE_CLIENT_ADMIN, VITE_SECRET_ADMIN } = env;
            const data = {
                grant_type: "password",
                client_id: VITE_CLIENT_ADMIN,
                client_secret: VITE_SECRET_ADMIN,
                username: values.username,
                password: values.password,
            };
            const response = await OauthApi.Token(data);
            return setAdmin(response);
        } catch (err: any) {
            console.log(err);

            parseError(err);
        }
    };
    /**
     * set Admin
     * @param {*} response
     * @return {Function} Action LoginAdmin
     */
    const setAdmin = async (response: any) => {
        const user = { ...response.data };
        const expires_in = user.expires_in;
        const expires = new Date();
        expires.setTime(expires.getTime() + expires_in * 1000);

        const access_token = {
            access_token: user.access_token,
            expires: expires,
        };
        const RefreshToken_expries = new Date();
        RefreshToken_expries.setTime(
            RefreshToken_expries.getTime() + 31556926 * 1000,
        );
        const refresh_token = {
            refresh_token: user.refresh_token,
            expires: RefreshToken_expries,
        };
        const AdminInfo = await Info(access_token.access_token);
        if (!AdminInfo) {
            const notify = {
                title: t("label.unauthorized"),
                description: t("label.unauthorized"),
                status: "error",
            };
            toast(notify);
        } else {
            if (AdminInfo.status_2fa) {
                setModal(true);
                setTokenTemp(access_token);
                setAdminTemp(AdminInfo);
            } else {
                props.setAccessToken(access_token);
                props.setRefreshToken(refresh_token);
                const notify = {
                    title: t("label.login_success"),
                    description: t("label.login_success"),
                    status: "success",
                };
                toast(notify);
                redirect("/admin");
            }
        }
    };
    /**
     * onClose Modal 2Fa
     */
    const onClose = () => {
        setModal(!modal);
        setAdminTemp([]);
        setTokenTemp([]);
        const notify = {
            title: t("label.unauthorized"),
            description: t("label.unauthorized"),
            status: "error",
        };
        toast(notify);
    };
    /**
     * callBack 2Fa
     */
    const callBack = () => {
        setModal(false);
        redirect("/admin");
    };
    return (
        <Grid justify="center" align="center" gapY="30" className="mt-30">
            <TwoFactor
                open={modal}
                onClose={onClose}
                admin={adminTemp}
                token={tokenTemp}
                callback={callBack}
            />
            <Card>
                <CardHeader className="justify-center items-center">
                    <CardTitle>
                        <img src={Logo} alt="Logo" className="h-10 w-auto" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="account" className="lg:w-[400px]">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("label.account")}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(
                                                onSubmit,
                                            )}
                                            className="space-y-3"
                                        >
                                            {formFields.map(
                                                (fieldName, key) => (
                                                    <InputForm
                                                        key={key}
                                                        label={fieldName?.label}
                                                        name={fieldName?.name}
                                                        iconStart={
                                                            fieldName?.iconStart
                                                        }
                                                        iconEnd={
                                                            fieldName?.iconEnd
                                                        }
                                                        type={fieldName?.type}
                                                        description={
                                                            fieldName?.description
                                                        }
                                                        handleFunc={
                                                            fieldName?.handleFunc
                                                        }
                                                        control={form.control}
                                                    />
                                                ),
                                            )}
                                            {config &&
                                            config?.settings?.site
                                                .recaptcha_enable ? (
                                                <FormField
                                                    control={form.control}
                                                    name="recaptcha"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                {t(
                                                                    "label.recaptcha",
                                                                )}
                                                            </FormLabel>
                                                            <FormControl>
                                                                <ReCAPTCHA
                                                                    ref={
                                                                        recaptchaRef
                                                                    }
                                                                    sitekey={
                                                                        config
                                                                            .settings
                                                                            .site
                                                                            .recaptcha_site_key
                                                                    }
                                                                    onChange={(
                                                                        value: any,
                                                                    ) =>
                                                                        form.setValue(
                                                                            "recaptcha",
                                                                            value,
                                                                        )
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                {t(
                                                                    "label.recaptcha",
                                                                )}
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            ) : null}
                                            <Button type="submit">
                                                {" "}
                                                {t("label.login")}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                                <CardFooter></CardFooter>
                            </Card>
                        </TabsContent>
                        <TabsContent value="password">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("label.password")}</CardTitle>
                                    <CardDescription>
                                        {t("label.forgot_password")}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="text" />
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
        </Grid>
    );
};
const mapStateToProps = (state: RootState) => {
    return {
        access_token: state.admin.access_token,
        refresh_token: state.admin.refresh_token,
        adminInfo: state.admin.adminInfo,
        language: state.app.language,
        sidebar: state.app.statusbar,
        config: state.app.config,
        notify: state.app.notify,
    };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        changeLanguage: (language: string) =>
            dispatch(actions.changeLanguageApp(language)),
        setConfig: (config: any[]) => dispatch(actions.setConfig(config)),
        setNotify: (notice: any[]) => dispatch(actions.setNotice(notice)),
        clearNotify: () => dispatch(actions.clearNotice()),
        setAccessToken: (access_token: any) =>
            dispatch(actions.setAccessToken(access_token)),
        clearAccessToken: () => dispatch(actions.clearAccessToken()),
        setRefreshToken: (refresh_token: any) =>
            dispatch(actions.setRefreshToken(refresh_token)),
        clearRefreshToken: () => dispatch(actions.clearRefreshToken()),
        unsetAdmin: () => dispatch(actions.unsetAdmin()),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
interface DispatchProps {
    changeLanguage: (language: string) => void;
    setConfig: (config: any[]) => void;
    setNotify: (notice: any[]) => void;
    clearNotify: () => void;
    setAccessToken: (access_token: any[]) => void;
    clearAccessToken: () => void;
    setRefreshToken: (refresh_token: any[]) => void;
    clearRefreshToken: () => void;
    unsetAdmin: () => void;
}
Auth.displayName = "Auth";
export default connector(Auth);
