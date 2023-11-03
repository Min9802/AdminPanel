import { lazy } from "react";
import { Icon } from "@iconify/react";
import { AdminAuth } from "@/middlewares/AdminGuard";
const Calendar = lazy(() => import("@/views/pages/Calendar"));
const Chart = lazy(() => import("@/views/pages/Chart"));
const FormElements = lazy(() => import("@/views/pages/Form/FormElements"));
const FormLayout = lazy(() => import("@/views/pages/Form/FormLayout"));
const Profile = lazy(() => import("@/views/pages/Admin/Auth/Profile"));
const Settings = lazy(() => import("@/views/pages/Settings"));
const Tables = lazy(() => import("@/views/pages/Tables"));
const Alerts = lazy(() => import("@/views/pages/UiElements/Alerts"));
const Buttons = lazy(() => import("@/views/pages/UiElements/Buttons"));
const ECommerce = lazy(() => import("@/views/pages/Dashboard/ECommerce"));
const Home = lazy(() => import("@/views/pages/Home"));
const Home2 = lazy(() => import("@/views/pages/Home2"));

const StaffList = lazy(() => import("@/views/pages/Admin/Staff/StaffList"));
const StaffAdd = lazy(() => import("@/views/pages/Admin/Staff/StaffAdd"));
const StaffTrash = lazy(() => import("@/views/pages/Admin/Staff/StaffTrash"));

const UserList = lazy(() => import("@/views/pages/Admin/User/UserList"));
const RoleList = lazy(() => import("@/views/pages/Admin/Role/RoleList"));
const RoleAdd = lazy(() => import("@/views/pages/Admin/Role/RoleAdd"));
const PermissionList = lazy(
    () => import("@/views/pages/Admin/Permission/PermissionList"),
);
const PermissionAdd = lazy(
    () => import("@/views/pages/Admin/Permission/PermissionAdd"),
);
const PackageList = lazy(
    () => import("@/views/pages/Admin/Package/PackageList"),
);
const PackageAdd = lazy(() => import("@/views/pages/Admin/Package/PackageAdd"));
const PackageTrash = lazy(
    () => import("@/views/pages/Admin/Package/PackageTrash"),
);
const ProductList = lazy(
    () => import("@/views/pages/Admin/Product/ProductList"),
);
const ProductAdd = lazy(() => import("@/views/pages/Admin/Product/ProductAdd"));
const guards = [AdminAuth];
const AdminRoutes = [
    {
        path: "role",
        title: "label.role",
        icon: <Icon icon="mdi:shield-account-outline" fontSize={24} />,
        // component: <PackageList />,
        guards: guards,
        child: [
            {
                path: "list",
                title: "label.list",
                icon: <Icon icon="mdi:format-list-bulleted" fontSize={24} />,
                component: <RoleList />,
                guards: guards,
            },
            {
                path: "add",
                title: "label.add",
                icon: <Icon icon="mdi:plus-box-multiple" fontSize={24} />,
                component: <RoleAdd />,
                guards: guards,
            },
        ],
    },
    {
        path: "permission",
        title: "label.permission",
        icon: <Icon icon="mdi:shield-account-outline" fontSize={24} />,
        // component: <PackageList />,
        guards: guards,
        child: [
            {
                path: "list",
                title: "label.list",
                icon: <Icon icon="mdi:format-list-bulleted" fontSize={24} />,
                component: <PermissionList />,
                guards: guards,
            },
            {
                path: "add",
                title: "label.add",
                icon: <Icon icon="mdi:plus-box-multiple" fontSize={24} />,
                component: <PermissionAdd />,
                guards: guards,
            },
        ],
    },
    {
        path: "staff",
        title: "label.staff",
        icon: <Icon icon="mdi:user" fontSize={24} />,
        guards: guards,
        child: [
            {
                path: "list",
                title: "label.list",
                icon: <Icon icon="mdi:format-list-bulleted" fontSize={24} />,
                component: <StaffList />,
                guards: guards,
            },
            {
                path: "add",
                title: "label.add",
                icon: <Icon icon="mdi:plus-box-multiple" fontSize={24} />,
                component: <StaffAdd />,
                guards: guards,
            },
            {
                path: "trash",
                title: "label.deleted",
                icon: <Icon icon="mdi:delete-circle-outline" fontSize={24} />,
                component: <StaffTrash />,
                guards: guards,
            },
        ],
    },
    {
        path: "user",
        title: "label.user",
        icon: <Icon icon="mdi:user" fontSize={24} />,
        guards: guards,
        child: [
            {
                path: "list",
                title: "label.list",
                icon: <Icon icon="mdi:format-list-bulleted" fontSize={24} />,
                component: <UserList />,
                guards: guards,
            },
            {
                path: "add",
                title: "label.add",
                icon: <Icon icon="mdi:plus-box-multiple" fontSize={24} />,
                component: <StaffAdd />,
                guards: guards,
            },
            {
                path: "trash",
                title: "label.deleted",
                icon: <Icon icon="mdi:delete-circle-outline" fontSize={24} />,
                component: <StaffTrash />,
                guards: guards,
            },
        ],
    },
    {
        path: "package",
        title: "label.package",
        icon: <Icon icon="mdi:package-variant-closed" fontSize={24} />,
        // component: <PackageList />,
        guards: guards,
        child: [
            {
                path: "list",
                title: "label.list",
                icon: <Icon icon="mdi:format-list-bulleted" fontSize={24} />,
                component: <PackageList />,
                guards: guards,
            },
            {
                path: "add",
                title: "label.add",
                icon: <Icon icon="mdi:plus-box-multiple" fontSize={24} />,
                component: <PackageAdd />,
                guards: guards,
            },
            {
                path: "trash",
                title: "label.deleted",
                icon: <Icon icon="mdi:delete-circle-outline" fontSize={24} />,
                component: <PackageTrash />,
                guards: guards,
            },
        ],
    },
    {
        path: "product",
        title: "label.product",
        icon: <Icon icon="fluent-mdl2:product-list" fontSize={24} />,
        guards: guards,
        child: [
            {
                path: "list",
                title: "label.list",
                icon: <Icon icon="mdi:format-list-bulleted" fontSize={24} />,
                component: <ProductList />,
                guards: guards,
            },
            {
                path: "add",
                title: "label.add",
                icon: <Icon icon="mdi:plus-box-multiple" fontSize={24} />,
                component: <ProductAdd />,
                guards: guards,
            },
            {
                path: "trash",
                title: "label.deleted",
                icon: <Icon icon="mdi:delete-circle-outline" fontSize={24} />,
                component: <PackageTrash />,
                guards: guards,
            },
        ],
    },
    {
        path: "home",
        title: "Home",
        icon: <Icon icon="tabler:home" color="red" fontSize={24} />,
        component: <Home />,
        guards: guards,
    },
    {
        path: "test",
        title: "Home2",
        icon: <Icon icon="tabler:home" color="red" fontSize={24} />,
        component: <Home2 />,
        guards: guards,
    },
    {
        path: "dashboard",
        title: "Dashboard",
        icon: <Icon icon="tabler:user" color="red" fontSize={24} />,
        component: <ECommerce />,
        guards: guards,
    },
    {
        path: "profile",
        title: "Profile",
        icon: <Icon icon="tabler:user-circle" fontSize={24} />,
        component: <Profile />,
        guards: guards,
    },
    {
        path: "calendar",
        title: "Calender",
        icon: <Icon icon="tabler:calendar" fontSize={24} />,
        component: <Calendar />,
        guards: guards,
    },

    {
        path: "forms",
        title: "Forms Elements",
        icon: <Icon icon="tabler:forms" fontSize={24} />,
        component: <FormElements />,
        guards: guards,
        child: [
            {
                path: "elements",
                title: "Forms Elements",
                icon: <Icon icon="tabler:forms" fontSize={24} />,
                component: <FormElements />,
                guards: guards,
            },
            {
                path: "layout",
                icon: <Icon icon="tabler:forms" fontSize={24} />,
                title: "Form Layouts",
                component: <FormLayout />,
                guards: guards,
            },
        ],
    },

    {
        path: "tables",
        title: "Tables",
        icon: <Icon icon="tabler:table" fontSize={24} />,
        component: <Tables />,
        guards: guards,
    },
    {
        path: "settings",
        title: "Settings",
        icon: <Icon icon="tabler:settings" fontSize={24} />,
        component: <Settings />,
        guards: guards,
    },
    {
        path: "chart",
        title: "Chart",
        icon: <Icon icon="tabler:chart-histogram" fontSize={24} />,
        component: <Chart />,
        guards: guards,
    },
    {
        path: "ui",
        title: "ui",
        icon: <Icon icon="tabler:alert-triangle" fontSize={24} />,
        component: <Alerts />,
        guards: guards,
        child: [
            {
                path: "ui/alerts",
                title: "Alerts",
                icon: <Icon icon="tabler:alert-triangle" fontSize={24} />,
                component: <Alerts />,
                guards: guards,
            },
            {
                path: "ui/buttons",
                title: "Buttons",
                icon: <Icon icon="tabler:layout-board-split" fontSize={24} />,
                component: <Buttons />,
                guards: guards,
            },
        ],
    },
];
export default AdminRoutes;
