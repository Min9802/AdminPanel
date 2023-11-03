import React, { ReactNode } from "react";
import { Button } from "@min98/ui";
import {
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
    label?: string;
    icon?: ReactNode;
    path?: string;
    child?: DropdownProps[];
    action?: () => void;
};
interface DropdownMenuProps {
    icon?: ReactNode;
    label?: string | ReactNode;
    list: DropdownProps[];
}

const Dropdown: React.FC<DropdownMenuProps> = ({
    icon = null,
    label,
    list = [],
}) => {
    const redirect = useNavigate();
    const OnClickItem = (item: DropdownProps) => {
        if (item.path) {
            redirect(item.path);
        } else if (item.action) {
            return item?.action();
        }
    };
    const RenderMenu = ({ item }: any) => {
        if (!item.child) {
            return (
                <React.Fragment>
                    <DropdownMenuItem onClick={() => OnClickItem(item)}>
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
    const RenderSubMenu = React.forwardRef(({ item, ...props }: any, ref) => {
        return (
            <DropdownMenuSubContent>
                {item.map((itemChild: any, key: number) => (
                    <DropdownMenuItem key={key}>
                        <RenderMenu item={itemChild} />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuSubContent>
        );
    });
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={icon ? "icon" : "outline"}>
                    {icon ? icon : label}
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
