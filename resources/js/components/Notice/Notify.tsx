import React, { useEffect, useState } from "react";
import * as actions from "@/store/actions";
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/reducers/rootReducer";
import Alert from "./Alert/Alert";
import Toastify from "./Toastify";

const Notify: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const [notify, setNotify] = useState<any>(false);
    const [loading, setLoading] = useState<boolean>(true);
    /**
     * set notify from redux
     */
    useEffect(() => {
        if (!loading) setNotify(props.notice);
    }, [props.notice]);
    useEffect(() => {
        setLoading(props.loading);
    }, [props.loading]);
    /**
     * auto clear notify
     */
    useEffect(() => {
        // const timer = setInterval(() => {
        //     clearNotify();
        // }, duration);
        // return () => {
        //     clearInterval(timer);
        // };
    }, []);
    /**
     * clear notice handle
     */
    const clearNotify = () => {
        setNotify(false);
        props.clearNotice();
    };
    /**
     * reder
     */
    return (
        <>
            {notify && notify.type == "alert" ? (
                <Alert
                    isOpen={notify ? true : false}
                    status={notify?.status}
                    icon={notify?.icon}
                    title={notify?.title}
                    message={notify?.message}
                    position="top-right"
                    callback={clearNotify}
                    onClose={clearNotify}
                />
            ) : notify && notify.type == "toast" ? (
                <Toastify
                    variant={notify?.status}
                    light
                    outline
                    title={notify.title}
                    position="top-right"
                    onClose={clearNotify}
                >
                    {notify.message}
                </Toastify>
            ) : null}
        </>
    );
};
const mapStateToProps = (state: RootState) => {
    return {
        loading: state.app.loading,
        notice: state.app.notice,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setNotice: (notice: object | any) =>
            dispatch(actions.setNotice(notice)),
        clearNotice: () => dispatch(actions.clearNotice()),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

// Define the additional props from mapDispatchToProps
interface DispatchProps {
    setNotice: (notice: object) => void;
    clearNotice: () => void;
}

export default connector(Notify);
