import React from "react";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/reducers/rootReducer";
import * as actions from "@/store/actions";
import { signOut } from "@/services/AuthServices";
import { useNavigate } from "react-router-dom";
import { toast } from "@min98/ui";
import { t } from "i18next";
const Signout: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const redirect = useNavigate();
    React.useEffect(() => {
        handleSignout();
    }, []);
    const handleSignout = async () => {
        try {
            const signout = await signOut();
            if (signout) {
                props.clearAccessToken();
                props.clearRefreshToken();
                props.unsetAdmin();
                redirect("/admin/auth/signin");
            }
        } catch (err: any) {
            const error = err.response.data;
            const message: string = error.message;
            const notify = {
                title: t("label.unauthorized"),
                description: message,
                status: "error",
            };
            toast(notify);
            redirect("/admin/auth/signin");
        }
    };
    return <></>;
};
Signout.displayName = "Signout";
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
export default connector(Signout);
