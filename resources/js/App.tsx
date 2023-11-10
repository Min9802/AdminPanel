import React, { Suspense, lazy } from "react";
import { Persistor } from "redux-persist";
import Loader from "@/common/Loader";

import AdminRoutes from "@/routes/AdminRoutes";
import AdminAuthRoutes from "@/routes/AdminAuthRoutes";
import { useAppDispatch } from "@/store/reducers/redux";
import * as actions from "@/store/actions";
const AdminLayout = lazy(() => import("@/views/layout/AdminLayout"));
const NotFound = lazy(() => import("@/views/pages/NotFound"));
import {
    GuardedRoute,
    GuardedRoutes,
    GuardProvider,
} from "react-router-guarded-routes";

import { Toaster } from "@min98/ui";
// import { Toaster } from "@/min";
interface AppProps {
    persistor: Persistor;
}
export type RouteProps = {
    path?: string;
    title?: string;
    icon?: any;
    component?: any;
    guards?: any;
    child?: RouteProps[];
};
export type RouteRenderProps = {
    route: RouteProps;
};
const App: React.FC<AppProps> = () => {
    const [loading, setLoading] = React.useState<boolean>(true);
    const pathName = window.location.pathname;
    const dispatch = useAppDispatch();
    /**
     * Set loading
     */
    React.useEffect(() => {
        const timer = setInterval(() => {
            setLoading(false);
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);
    /**
     * set loading redux
     */
    React.useMemo(() => {
        dispatch(actions.setLoading(true));
        if (loading) {
            dispatch(actions.setLoading(false));
        }
    }, [pathName]);
    /**
     * render guarded route
     * @param key
     * @param path
     * @param component
     * @param guards
     * @returns
     */
    const renderGuardedRoute = (
        key: any,
        path: any,
        component: any,
        guards: any,
    ) => {
        return (
            <GuardedRoute
                key={key}
                path={path}
                element={<Suspense fallback={<Loader />}>{component}</Suspense>}
                guards={guards}
            />
        );
    };
    /**
     * render route
     */
    const adminRoutes = AdminRoutes.map((route, key) => {
        if (route.child) {
            const childRoutes = route.child.map((childroute, k) => (
                <React.Fragment key={k}>
                    {renderGuardedRoute(
                        key,
                        `/admin/${route.path}`,
                        route.component,
                        route.guards,
                    )}
                    {renderGuardedRoute(
                        k,
                        `/admin/${route.path}/${childroute.path}`,
                        childroute.component,
                        childroute.guards,
                    )}
                </React.Fragment>
            ));
            return childRoutes;
        } else {
            return renderGuardedRoute(
                key,
                `/admin/${route.path}`,
                route.component,
                route.guards,
            );
        }
    });
    /**
     * render auth routers
     */
    const adminAuthroutes = AdminAuthRoutes.map((route, key) => {
        if (route.protected) {
            return (
                <GuardedRoute key={key} path="admin" element={<AdminLayout />}>
                    <GuardedRoute
                        path={`/admin/${route.path}`}
                        element={
                            <Suspense fallback={<Loader />}>
                                {route?.component}
                            </Suspense>
                        }
                        guards={route?.guards}
                    />
                </GuardedRoute>
            );
        } else {
            return renderGuardedRoute(
                key,
                `/admin/${route.path}`,
                route.component,
                route.guards,
            );
        }
    });
    return loading ? (
        <Loader />
    ) : (
        <React.Fragment>
            <Toaster />
            <GuardProvider fallback={<Suspense fallback={<Loader />} />}>
                <GuardedRoutes>
                    <GuardedRoute path="admin" element={<AdminLayout />}>
                        {adminRoutes}
                    </GuardedRoute>
                    {adminAuthroutes}
                    <GuardedRoute
                        path="*"
                        element={
                            <Suspense fallback={<Loader />}>
                                <NotFound />
                            </Suspense>
                        }
                    />
                </GuardedRoutes>
            </GuardProvider>
        </React.Fragment>
    );
};

export default App;
