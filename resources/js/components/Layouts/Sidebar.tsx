import React, { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "@/assets/images/logo/Logo-sm.png";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
interface RouteProps {
    path?: string | any;
    title?: string;
    icon?: ReactNode;
    component?: ReactNode;
    child?: RouteProps[];
}

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
    routers: RouteProps[];
}

const Sidebar = ({ sidebarOpen, setSidebarOpen, routers }: SidebarProps) => {
    const { t } = useTranslation();
    const location = useLocation();
    const { pathname } = location;

    const trigger = React.useRef<any>(null);
    const sidebar = React.useRef<any>(null);

    const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
    const [sidebarExpanded, setSidebarExpanded] = React.useState(
        storedSidebarExpanded === null
            ? false
            : storedSidebarExpanded === "true",
    );

    // close on click outside
    React.useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    React.useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    React.useEffect(() => {
        localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector("body")?.classList.add("sidebar-expanded");
        } else {
            document
                .querySelector("body")
                ?.classList.remove("sidebar-expanded");
        }
    }, [sidebarExpanded]);
    /**
     * render Menu
     */
    const RenderMenu = ({ route }: any) => {
        if (route.child) {
            return (
                <SidebarLinkGroup
                    activeCondition={pathname.includes(route.path)}
                >
                    {(handleClick, open) => {
                        return (
                            <React.Fragment>
                                <NavLink
                                    to={route.path}
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-dark dark:text-white hover:text-white dark:hover:bg-meta-4 hover:bg-graydark duration-300 ease-in-out ${
                                        pathname.includes(route.path) &&
                                        "bg-graydark dark:bg-meta-4 text-white"
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        sidebarExpanded
                                            ? handleClick()
                                            : setSidebarExpanded(true);
                                    }}
                                >
                                    {route.icon}
                                    {/* {route.title} */}
                                    {t(route.title)}
                                    <Icon
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                                            open && "rotate-180"
                                        }`}
                                        icon="tabler:chevron-down"
                                    />
                                </NavLink>
                                {/* <!-- Dropdown Menu Start --> */}
                                <RenderSubMenu route={route} open={open} />
                                {/* <!-- Dropdown Menu End --> */}
                            </React.Fragment>
                        );
                    }}
                </SidebarLinkGroup>
            );
        }
        return (
            <li>
                <NavLink
                    to={route.path}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-dark dark:text-white hover:text-white hover:bg-graydark dark:hover:bg-meta-4 duration-300 ease-in-out ${
                        pathname.includes(route.path) &&
                        "bg-graydark dark:bg-meta-4 text-white"
                    }`}
                >
                    {route.icon}
                    {t(route.title)}
                    {/* {route.title} */}
                </NavLink>
            </li>
        );
    };
    /**
     * render subMenu
     */
    const RenderSubMenu = ({ route, open }: any) => {
        return (
            <React.Fragment>
                {route &&
                    route.child.map((child: any, key: number) => {
                        if (child.child) {
                            return (
                                <div
                                    key={key}
                                    className={`translate transform overflow-hidden ${
                                        !open && "hidden"
                                    }`}
                                >
                                    <ul className="my-1 flex flex-col gap-2.5 pl-6">
                                        <RenderMenu route={child} />
                                    </ul>
                                </div>
                            );
                        }
                        return (
                            <div
                                key={key}
                                className={`translate transform overflow-hidden ${
                                    !open && "hidden"
                                }`}
                            >
                                <ul className="my-1 flex flex-col gap-2.5 pl-6">
                                    <li>
                                        <NavLink
                                            to={`${route.path}/${child.path}`}
                                            className={({ isActive }) =>
                                                "group relative flex items-center gap-2.5 rounded-md px-4 py-1 font-medium text-dark dark:text-white hover:text-white dark:hover:bg-meta-4 hover:bg-graydark duration-300 ease-in-out " +
                                                (isActive &&
                                                    "bg-graydark dark:bg-meta-4 text-white")
                                            }
                                        >
                                            {child.icon}
                                            {/* {child.title} */}
                                            {t(child.title)}
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        );
                    })}
            </React.Fragment>
        );
    };
    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-15 flex h-screen w-72.5 flex-col overflow-y-hidden duration-300 ease-linear bg-white dark:bg-boxdark lg:static lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
                <NavLink to="/admin" className="flex text-center items-center">
                    <img
                        className="flex row-start-1 rounded-full h-1/3 w-1/3 object-center object-cover"
                        src={Logo}
                        alt="Logo"
                    />
                    <h2 className="flex row-end-1 text-2xl text-dark dark:text-white font-semibold">
                        Min-Services
                    </h2>
                </NavLink>

                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden"
                >
                    <Icon icon="tabler:x" />
                </button>
            </div>
            {/* <!-- SIDEBAR HEADER --> */}

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                    {/* <!-- Menu Group --> */}
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                            MENU
                        </h3>

                        <ul className="mb-6 flex flex-col gap-1.5">
                            {routers.length &&
                                routers.map((route, key) => {
                                    return (
                                        <React.Fragment key={key}>
                                            <RenderMenu route={route} />
                                        </React.Fragment>
                                    );
                                })}
                        </ul>
                    </div>
                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
        </aside>
    );
};
Sidebar.displayName = "Sidebar";
export default Sidebar;
