import React from "react";

import { useTranslation } from "react-i18next";
import SheetCustom from "@/components/Sheet/SheetCustom";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, toast } from "@min98/ui";
import { InputForm } from "@/components/Form";
import { Icon } from "@iconify/react";
import AdminPackageApi from "@/apis/Admin/AdminPackageApi";
import { parseError } from "@/Utils/systemUtil";
interface PackageEditProps {
    item: any;
    onClose: () => void;
}
const PackageEdit: React.FC<PackageEditProps> = ({ item, onClose }) => {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState<boolean>(false);
    /**
     * define form properties
     */
    const formFields = [
        {
            name: "name",
            label: t("label.name"),
            type: "text",
            iconStart: <Icon icon="mdi:label" />,
            placeholder: t("placeholder.name"),
            description: t("label.name"),
        },
        {
            name: "display_name",
            label: t("label.display_name"),
            type: "text",
            iconStart: <Icon icon="mdi:label" />,
            placeholder: t("placeholder.display_name"),
            description: t("label.display_name"),
        },
        // Add more fields as needed
    ];
    const formSchema = z.object(
        Object.fromEntries(
            formFields.map((field) => [
                field.name,
                z.string().nonempty(`${field.label} ${t("label.required")}`),
            ]),
        ),
    );
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...Object.fromEntries(formFields.map((field) => [field.name, ""])),
        },
    });
    /**
     * on submit
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
            const response = await AdminPackageApi.update(item.id, {
                ...values,
                status: item.status,
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
        Object.keys(item).forEach((key) => {
            form.setValue(key, item[key]);
        });
    };
    return (
        <SheetCustom
            open={open}
            cancel={() => processClose()}
            title={t("label.editpackage")}
            description={t("label.editpackage")}
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
        </SheetCustom>
    );
};
PackageEdit.displayName = "PackageEdit";
export default PackageEdit;
