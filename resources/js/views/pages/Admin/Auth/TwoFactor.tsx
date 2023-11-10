import Modal from "@/components/Modal/Modal";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, toast } from "@min98/ui";
import { InputForm } from "@/components/Form";
import { Icon } from "@iconify/react";
import { TwoFactoryAuth } from "@/apis/Global";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/reducers/rootReducer";
import * as actions from "@/store/actions";
import { useTranslation } from "react-i18next";
interface TwoFactorProps {
    open: boolean;
    admin: any;
    token: any;
    onClose: () => void;
    callback: () => void;
    props?: any;
}

const TwoFactor: React.FC<TwoFactorProps & PropsFromRedux & DispatchProps> = ({
    open = false,
    admin,
    token,
    onClose,
    callback,
    ...props
}) => {
    const { t } = useTranslation();
    const [modal, setModal] = React.useState<boolean>(open);
    /**
     * define form
     */
    const formSchema = z.object({
        code: z.string().nonempty("Code is required"),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
        },
    });
    /**
     * reset Modal if open modal change
     */
    React.useEffect(() => {
        setModal(open);
    }, [open]);
    /**
     * on Submit
     */
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await TwoFactoryAuth.verify2Fa(
                { code: values.code },
                token?.access_token,
            );
            const message: string = response.data.message;
            const notify = {
                title: t("label.login_success"),
                description: message,
                status: "success",
            };
            toast(notify);
            props.setAccessToken(token);
            props.setAdmin(admin);
            return callback?.();
        } catch (err: any) {
            const error = err.response.data;
            const message: string = error.message;
            const notify = {
                title: t("label.unauthorized"),
                description: message,
                status: "error",
            };
            toast(notify);
        }
    };
    return (
        <>
            {modal ? (
                <Modal
                    open={modal}
                    cancel={onClose}
                    action={form.handleSubmit(onSubmit)}
                    title={t("label.2fa")}
                >
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-3"
                        >
                            <InputForm
                                label={t("label.code")}
                                name="code"
                                iconStart={<Icon icon="tabler:shield-lock" />}
                                type="text"
                                description={t("label.verify2fa")}
                                control={form.control}
                                placeholder={t("placeholder.code")}
                            />
                        </form>
                    </Form>
                </Modal>
            ) : null}
        </>
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
        setAdmin: (admin: any) => dispatch(actions.setAdmin(admin)),
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
    setAdmin: (admin: any) => void;
    unsetAdmin: () => void;
}
TwoFactor.displayName = "TwoFactor";
export default connector(TwoFactor);
