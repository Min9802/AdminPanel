import React from "react";

import { useTranslation } from "react-i18next";
import SheetCustom from "@/components/Sheet/SheetCustom";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, toast } from "@min98/ui";
import { InputForm } from "@/components/Form";
import { Icon } from "@iconify/react";
import { parseError } from "@/Utils/systemUtil";
import { AdminStaffApi } from "@/apis/Admin";
import SelectRole from "./SelectRole";
interface StaffEditProps {
    item: any;
    onClose: () => void;
}
const StaffEdit: React.FC<StaffEditProps> = ({ item, onClose }) => {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState<boolean>(false);
    const [roles, setRoles] = React.useState<any[]>([]);
    /**
     * define form properties
     */
    const formFields = [
        {
            name: "username",
            label: t("label.username"),
            type: "text",
            iconStart: <Icon icon="mdi:label" />,
            placeholder: t("placeholder.username"),
            description: t("label.username"),
        },
        {
            name: "name",
            label: t("label.name"),
            type: "text",
            iconStart: <Icon icon="mdi:label" />,
            placeholder: t("placeholder.name"),
            description: t("label.name"),
        },
        {
            name: "email",
            label: t("label.email"),
            type: "email",
            iconStart: <Icon icon="mdi:at" />,
            placeholder: t("placeholder.email"),
            description: t("label.email"),
        },
    ];
    const formSchema = z.object({
        ...Object.fromEntries(
            formFields.map((field) => [
                field.name,
                z.string().nonempty(`${field.label} ${t("label.required")}`),
            ]),
        ),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...Object.fromEntries(formFields.map((field) => [field.name, ""])),
        },
    });
    /**
     * hook
     */
    React.useEffect(() => {
        if (item) {
            setOpen(true);
            setValueForm();
        }
    }, [item]);
    /**
     * on submit
     * @param values
     */
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await AdminStaffApi.update(item.id, {
                ...values,
                status: item.status,
                roles: roles,
            });
            const status = response.data.status;
            const message = response.data.message;
            const notify = {
                title: status,
                description: message,
                status: "success",
            };
            toast(notify);
            processClose();
            form.reset();
        } catch (err: any) {
            parseError(err);
            processClose();
        }
    };
    /**
     * process close
     */
    const processClose = () => {
        setOpen(false);
        onClose();
    };
    /**
     * set value form
     */
    const setValueForm = () => {
        Object.keys(item).forEach((key: any) => {
            form.setValue(key, item[key]);
        });
    };
    /**
     * return view
     */
    return (
        <SheetCustom
            open={open}
            cancel={() => processClose()}
            title={t("label.editstaff")}
            description={t("label.editstaff")}
            className="overflow-y-auto"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3"
                >
                    {formFields.map((field, key) => (
                        <InputForm
                            key={key}
                            label={field?.label}
                            name={field?.name}
                            iconStart={field?.iconStart}
                            type={field?.type}
                            description={field?.description}
                            control={form.control}
                        />
                    ))}
                    <Button type="submit" color="success">
                        {t("common.save")}
                    </Button>
                </form>
            </Form>
            <SelectRole item={item} callback={setRoles} />
        </SheetCustom>
    );
};
StaffEdit.displayName = "StaffEdit";
export default StaffEdit;
