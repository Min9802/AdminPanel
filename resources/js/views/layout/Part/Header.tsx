import { Link } from "react-router-dom";
import Logo from "@root/assets/images/logo/Logo-sm.png";
import DarkModeSwitcher from "@/components/ActionChange/DarkModeSwitcher";
import ChangeLang from "@/components/ActionChange/ChangeLang";
import Dropdown, { DropdownProps } from "@/components/dropdown/Dropdown";
import { Icon } from "@iconify/react";

import { useTranslation } from "react-i18next";
const Header = (props: {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
}) => {
    const { t } = useTranslation();
    const listDropdown: DropdownProps[] = [
        {
            icon: <Icon icon="mdi:account" />,
            label: t("label.account"),
            path: "/admin/auth/account",
            child: [
                {
                    icon: <Icon icon="mdi:account" />,
                    label: t("label.profile"),
                    path: "/admin/auth/profile",
                },
                {
                    icon: <Icon icon="mdi:wallet-bifold" />,
                    label: t("label.wallet"),
                    path: "/admin/auth/wallet",
                },
            ],
        },
        {
            icon: <Icon icon="mdi:logout" />,
            label: t("label.logout"),
            path: "/admin/auth/signout",
        },
    ];
    return (
        <header className="sticky top-0 z-10 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
            <div className="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    {/* <!-- Hamburger Toggle BTN --> */}
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}
                        className="z-10 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
                    >
                        <span className="relative block h-5.5 w-5.5 cursor-pointer">
                            <span className="du-block absolute right-0 h-full w-full">
                                <span
                                    className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-0 duration-200 ease-in-out dark:bg-white ${
                                        !props.sidebarOpen &&
                                        "!w-full delay-300"
                                    }`}
                                ></span>
                                <span
                                    className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                                        !props.sidebarOpen &&
                                        "delay-400 !w-full"
                                    }`}
                                ></span>
                                <span
                                    className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                                        !props.sidebarOpen &&
                                        "!w-full delay-500"
                                    }`}
                                ></span>
                            </span>
                            <span className="absolute right-0 h-full w-full rotate-45">
                                <span
                                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                                        !props.sidebarOpen && "!h-0 !delay-0"
                                    }`}
                                ></span>
                                <span
                                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                                        !props.sidebarOpen && "!h-0 !delay-200"
                                    }`}
                                ></span>
                            </span>
                        </span>
                    </button>
                    {/* <!-- Hamburger Toggle BTN --> */}

                    <Link className="block flex-shrink-0 lg:hidden" to="/">
                        <img
                            className="flex row-start-1 rounded-full h-1/3 w-1/3 object-center object-cover"
                            src={Logo}
                            alt="Logo"
                        />
                    </Link>
                </div>

                <div className="hidden sm:block">
                    <form action="#" method="POST">
                        <div className="relative">
                            <button className="absolute top-1/2 left-0 -translate-y-1/2">
                                <Icon icon="tabler:search" />
                            </button>

                            <input
                                type="text"
                                placeholder="Type to search..."
                                className="w-full bg-transparent pr-4 pl-9 focus:outline-none"
                            />
                        </div>
                    </form>
                </div>

                <div className="flex items-center gap-3 2xsm:gap-7">
                    <ul className="flex items-center gap-2 2xsm:gap-3">
                        {/* Switch change language */}
                        <ChangeLang />
                        {/* <!-- Dark Mode Toggler --> */}
                        <DarkModeSwitcher />
                        {/* <!-- Dark Mode Toggler --> */}

                        {/* <!-- Notification Menu Area --> */}
                        {/* <DropdownNotification /> */}
                        {/* <!-- Notification Menu Area --> */}

                        {/* <!-- Chat Notification Area --> */}
                        {/* <DropdownMessage /> */}
                        {/* <!-- Chat Notification Area --> */}
                    </ul>

                    {/* <!-- User Area --> */}
                    {/* <DropdownUser /> */}
                    <Dropdown
                        icon={<Icon icon="mdi:account-circle" fontSize={25} />}
                        list={listDropdown}
                    />

                    {/* <!-- User Area --> */}
                </div>
            </div>
        </header>
    );
};
Header.displayName = "Header";
export default Header;
