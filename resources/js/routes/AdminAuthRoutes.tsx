import { lazy } from "react";
const Auth = lazy(() => import("@/views/pages/Admin/Auth/Auth"));
const Signout = lazy(() => import("@/views/pages/Admin/Auth/Signout"));
const Profile = lazy(() => import("@/views/pages/Admin/Auth/Profile"));
import { Icon } from "@iconify/react";
import { AdminAuth } from "@/middlewares/AdminGuard";
const guards = [AdminAuth];
const AdminAuthRoutes = [
    {
        path: "auth/signin",
        title: "Signin",
        icon: <Icon icon="tabler:login" fontSize={24} />,
        component: <Auth />,
    },
    {
        path: "auth/signout",
        title: "Signout",
        icon: <Icon icon="tabler:logout" fontSize={24} />,
        component: <Signout />,
        protected: true,
        guards: guards,
    },
    {
        path: "auth/profile",
        title: "Profile",
        icon: <Icon icon="tabler:user-circle" fontSize={24} />,
        component: <Profile />,
        protected: true,
        guards: guards,
    },
];
export default AdminAuthRoutes;
