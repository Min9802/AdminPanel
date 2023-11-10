import { lazy } from "react";
import { Icon } from "@iconify/react";
import { AdminAuth } from "@/middlewares/AdminGuard";

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
const AttributeList = lazy(
    () => import("@/views/pages/Admin/Attribute/AttributeList"),
);
const AttributeAdd = lazy(
    () => import("@/views/pages/Admin/Attribute/AttributeAdd"),
);
const AttributeTrash = lazy(
    () => import("@/views/pages/Admin/Attribute/AttributeTrash"),
);
const ProductList = lazy(
    () => import("@/views/pages/Admin/Product/ProductList"),
);
const ProductAdd = lazy(() => import("@/views/pages/Admin/Product/ProductAdd"));
const Test = lazy(() => import("@/views/pages/Test"));
const guards = [AdminAuth];
const AdminRoutes = [
    {
        path: "/",
        title: "label.role",
        icon: <Icon icon="mdi:shield-account-outline" fontSize={24} />,
        component: <Test />,
        guards: guards,
    },
    {
        path: "role",
        title: "label.role",
        icon: <Icon icon="mdi:shield-account-outline" fontSize={24} />,
        component: <PackageList />,
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
        component: <PermissionList />,
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
        path: "attribute",
        title: "label.attribute",
        icon: <Icon icon="lucide:table-properties" fontSize={24} />,
        // component: <PackageList />,
        guards: guards,
        child: [
            {
                path: "list",
                title: "label.list",
                icon: <Icon icon="mdi:format-list-bulleted" fontSize={24} />,
                component: <AttributeList />,
                guards: guards,
            },
            {
                path: "add",
                title: "label.add",
                icon: <Icon icon="mdi:plus-box-multiple" fontSize={24} />,
                component: <AttributeAdd />,
                guards: guards,
            },
            {
                path: "trash",
                title: "label.deleted",
                icon: <Icon icon="mdi:delete-circle-outline" fontSize={24} />,
                component: <AttributeTrash />,
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
];
export default AdminRoutes;
