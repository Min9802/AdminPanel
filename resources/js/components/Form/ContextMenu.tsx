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
export interface ContextMenuProps {
    className?: string;
    asChild?: boolean;
    title?: any;
    list?: ContextMenuType[];
    props?: any;
    ref?: any;
}
export type ContextMenuType = {
    title?: any;
    disabled?: boolean;
    shortcut?: React.ReactNode;
    sub?: ContextMenuType[];
    action?: () => void;
};
export interface ItemProps {
    item: ContextMenuType;
}
/**
 * render menu
 * @param param0
 * @returns
 */
const RenderMenu: React.FC<ItemProps> = ({ item }) => {
    return (
        <React.Fragment>
            {item.sub ? (
                <ContextMenuSub>
                    <ContextMenuSubTrigger>{item.title}</ContextMenuSubTrigger>
                    <RenderSubMenu item={item} />
                </ContextMenuSub>
            ) : (
                <ContextMenuItem
                    onClick={item?.action}
                    disabled={item.disabled}
                >
                    {item.title}
                    <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
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
const RenderSubMenu: React.FC<ItemProps> = ({ item }) => {
    const subs = item?.sub;
    return (
        <ContextMenuSubContent className="w-48" onClick={item?.action}>
            {subs &&
                subs.length > 0 &&
                subs.map((item: any, key: number) => (
                    <React.Fragment key={key}>
                        <RenderMenu item={item} />
                    </React.Fragment>
                ))}
        </ContextMenuSubContent>
    );
};
const ContextMenu = React.forwardRef<HTMLButtonElement, ContextMenuProps>(
    ({ asChild, title, list = [], ...props }, ref) => {
        const Comp = asChild ? Slot : Button;
        const { t } = useTranslation();

        return (
            <ContextMenuComponent>
                <ContextMenuTrigger>
                    <Comp
                        tooltip={t("label.right_click")}
                        variant="ghost"
                        {...props}
                        ref={ref}
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
