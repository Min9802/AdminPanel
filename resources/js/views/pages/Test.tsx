import React from "react";
import { useTranslation } from "react-i18next";
import { DropdownProps } from "../../components/dropdown/Dropdown";
import { Icon } from "@iconify/react";

const Test = () => {
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
        <div className="optional">
            <button className="optional:bg-red-500">aaa</button>
        </div>
    );
};

export default Test;
