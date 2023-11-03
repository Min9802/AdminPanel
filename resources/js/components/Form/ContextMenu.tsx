import { ButtonProps } from "@/min/ui/button";
import { Button, ContextMenuPortal } from "@min98/ui";
import { Slot } from "@radix-ui/react-slot";
import {
    ContextMenu as ContextMenuComponent,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@min98/ui";
import React from "react";
import { useTranslation } from "react-i18next";

interface ContextMenuProps extends Omit<ButtonProps, "onOpen"> {
    asChild?: boolean;
    title?: any;
    list?: ContextMenuType[];
    props?: any;
    ref?: any;
}
type ContextMenuType = {
    title?: any;
    sub?: ContextMenuProps[];
    action: () => void;
};
const ContextMenu = React.forwardRef<HTMLButtonElement, ContextMenuProps>(
    ({ asChild, title, list = [], ...props }, ref) => {
        const Comp = asChild ? Slot : Button;
        const { t } = useTranslation();
        /**
         * render menu
         * @param param0
         * @returns
         */
        const RenderMenu = ({ item }: any) => {
            return (
                <React.Fragment>
                    {item.sub ? (
                        <ContextMenuSub>
                            <ContextMenuSubTrigger>
                                {item.title}
                            </ContextMenuSubTrigger>
                            <RenderSubMenu item={item.sub} />
                        </ContextMenuSub>
                    ) : (
                        <ContextMenuItem
                            onClick={item?.action}
                            disabled={item.disabled}
                        >
                            {item.title}
                            <ContextMenuShortcut>
                                {item.shortcut}
                            </ContextMenuShortcut>
                        </ContextMenuItem>
                    )}
                </React.Fragment>
            );
        };
        /**
         * render sub menu
         * @param param0
         * @returns
         */
        const RenderSubMenu = ({ item }: any) => {
            return (
                <ContextMenuSubContent className="w-48" onClick={item?.action}>
                    {item.map((item: any, key: number) => (
                        <React.Fragment key={key}>
                            <RenderMenu item={item} />
                        </React.Fragment>
                    ))}
                </ContextMenuSubContent>
            );
        };
        return (
            <ContextMenuComponent>
                <ContextMenuTrigger>
                    <Comp
                        tooltip={t("label.right_click")}
                        variant="ghost"
                        {...props}
                    >
                        {title}
                    </Comp>
                </ContextMenuTrigger>

                <ContextMenuPortal>
                    <ContextMenuContent className="w-auto">
                        {list.length > 0 &&
                            list.map((item: any, key: number) => (
                                <React.Fragment key={key}>
                                    <RenderMenu item={item} />
                                </React.Fragment>
                            ))}
                    </ContextMenuContent>
                </ContextMenuPortal>
            </ContextMenuComponent>
        );
    },
);
ContextMenu.displayName = "ContextMenu";
export default ContextMenu;
