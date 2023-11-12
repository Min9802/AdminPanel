import React from "react";

interface SidebarLinkGroupProps {
    children: (handleClick: () => void, open: boolean) => React.ReactNode;
    activeCondition: boolean;
}
const SidebarLinkGroup: React.FC<SidebarLinkGroupProps> = ({
    children,
    activeCondition,
}) => {
    const [open, setOpen] = React.useState<boolean>(activeCondition);

    const handleClick = () => {
        setOpen(!open);
    };

    return <li>{children(handleClick, open)}</li>;
};

export default SidebarLinkGroup;
