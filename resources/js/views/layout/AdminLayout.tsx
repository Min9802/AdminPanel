import React from "react";

import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/reducers/rootReducer";
import * as actions from "@/store/actions";

import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "./Part";
import Notify from "@/components/Notice/Notify";
import Breadcrumb from "@/components/Breadcrumb";

import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { pageInfoProps } from "@/store/reducers/appReducer";
import AdminRoutes from "@/routes/AdminRoutes";
export type HelmetProps = {
    pageInfo: pageInfoProps;
};
const AdminLayout: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);
    const { t } = useTranslation();
    const pageInfo: any | HelmetProps = props.pageInfo;
    const SetHelmet: React.FC = () => {
        return (
            <React.Fragment>
                {pageInfo ? (
                    <Helmet>
                        <title> {t(pageInfo?.title)} </title>
                        <meta name="description" content={t(pageInfo?.desc)} />
                        <meta
                            property="og:title"
                            content={t(pageInfo?.ogtitle)}
                        />
                        <meta
                            property="og:site_name"
                            content={t(pageInfo?.siteName)}
                        />
                        <meta
                            property="og:description"
                            content={t(pageInfo?.description)}
                        />
                        <meta property="og:url" content={pageInfo?.url} />
                        <meta property="og:image" content={pageInfo?.image} />
                        {pageInfo?.image ? (
                            <>
                                <meta
                                    property="og:image:width"
                                    content="1525"
                                />
                                <meta
                                    property="og:image:height"
                                    content="538"
                                />
                            </>
                        ) : null}
                    </Helmet>
                ) : null}
            </React.Fragment>
        );
    };
    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {/* set helmet page */}
            {props?.pageInfo ? <SetHelmet /> : null}
            {/* set helmet page */}
            {/* <!-- ===== Page Wrapper Start ===== --> */}
            <div className="flex h-screen overflow-hidden">
                {/* <!-- ===== Sidebar Start ===== --> */}
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    routers={AdminRoutes}
                />
                {/* <!-- ===== Sidebar End ===== --> */}

                {/* <!-- ===== Content Area Start ===== --> */}
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    {/* <!-- ===== Header Start ===== --> */}
                    <Header
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    {/* <!-- ===== Header End ===== --> */}

                    {/* <!-- ===== Main Content Start ===== --> */}
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                            {/* start  Notice Alert */}
                            <Notify />
                            <Breadcrumb
                                pageName={
                                    props?.pageInfo
                                        ? props?.pageInfo?.title
                                        : ""
                                }
                            />
                            {/* end  Notice Alert */}
                            <Outlet />
                        </div>
                    </main>
                    {/* <!-- ===== Main Content End ===== --> */}
                </div>
                {/* <!-- ===== Content Area End ===== --> */}
            </div>
            {/* <!-- ===== Page Wrapper End ===== --> */}
        </div>
    );
};
const mapStateToProps = (state: RootState) => {
    return {
        notice: state.app.notice,
        pageInfo: state.app.pageInfo,
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

export default connector(AdminLayout);
