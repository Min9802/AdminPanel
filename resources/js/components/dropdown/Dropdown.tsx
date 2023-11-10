import React, { ReactNode } from "react";
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@min98/ui";
import { useNavigate } from "react-router-dom";
export type DropdownProps = {
    label: string;
    icon: ReactNode;
    path: string;
    child?: DropdownProps[];
    action?: () => void;
};
interface DropdownMenuProps {
    icon: ReactNode;
    label?: string | ReactNode;
    list: DropdownProps[];
}
interface RenderMenuProps {
    item: DropdownProps;
}
interface RenderSubMenuProps {
    item: DropdownProps[];
}
const RenderMenu: React.FC<RenderMenuProps> = ({ item }) => {
    const redirect = useNavigate();
    /**
     * handle click item
     * @param item
     */
    const handleClickItem = (item: DropdownProps) => {
        if (item?.action) {
            item?.action();
        } else {
            redirect(item.path);
        }
    };
    if (!item.child) {
        return (
            <React.Fragment>
                <DropdownMenuItem onClick={() => handleClickItem(item)}>
                    {item?.label}
                    {item?.icon ? (
                        <DropdownMenuShortcut className="ml-2">
                            {item?.icon}
                        </DropdownMenuShortcut>
                    ) : null}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
            </React.Fragment>
        );
    } else {
        return (
            <DropdownMenuGroup>
                <DropdownMenuLabel>{item?.label}</DropdownMenuLabel>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        {item?.label}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <RenderSubMenu item={item.child} />
                    </DropdownMenuPortal>
                </DropdownMenuSub>
            </DropdownMenuGroup>
        );
    }
};
const RenderSubMenu: React.FC<RenderSubMenuProps> = ({ item }) => {
    return (
        <DropdownMenuSubContent>
            {item.map((itemChild: any, key: number) => (
                <DropdownMenuItem key={key}>
                    <RenderMenu item={itemChild} />
                </DropdownMenuItem>
            ))}
        </DropdownMenuSubContent>
    );
};
const Dropdown: React.FC<DropdownMenuProps> = ({
    icon = null,
    label,
    list = [],
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={icon ? "icon" : "outline"}>
                    {icon ? icon : label ? label : null}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {list.map((item, key) => (
                    <RenderMenu item={item} key={key} />
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Dropdown;
