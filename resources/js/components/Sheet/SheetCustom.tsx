import React from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    Button,
} from "@min98/ui";
import { useTranslation } from "react-i18next";

interface PackageEditProps {
    className?: string;
    open: boolean;
    title?: string;
    description?: string;
    children?: React.ReactNode;
    action?: () => void;
    cancel: () => void;
}

const SheetCustom: React.FC<PackageEditProps> = ({
    className,
    open,
    title,
    description,
    children,
    cancel,
}) => {
    const { t } = useTranslation();
    return (
        <Sheet open={open} onOpenChange={cancel}>
            {/* <SheetTrigger asChild>
                <Button variant="outline">Open</Button>
            </SheetTrigger> */}
            <SheetContent className={className}>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>
                {children}
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button" color="danger-light">
                            {t("common.cancel")}
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default SheetCustom;
