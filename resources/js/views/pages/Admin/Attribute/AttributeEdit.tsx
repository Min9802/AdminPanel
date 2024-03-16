import React from "react";

import { useTranslation } from "react-i18next";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Form,
    toast,
    SheetCustom,
    InputForm,
    InputFormProps,
} from "@min98/ui";
import { Icon } from "@iconify/react";
import AdminAttributeApi from "@/apis/Admin/AdminAttributeApi";
import { parseError } from "@/Utils/systemUtil";
interface AttributeEditProps {
    item: any;
    onClose: () => void;
}
const AttributeEdit: React.FC<AttributeEditProps> = ({ item, onClose }) => {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState<boolean>(false);
    /**
     * define form properties
     */
    const formFields: InputFormProps[] = [
        {
            name: "name",
            label: t("label.name"),
            type: "text",
            iconStart: <Icon icon="mdi:label" />,
            placeholder: t("placeholder.name"),
            description: t("label.name"),
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
            const response = await AdminAttributeApi.update(item.id, {
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
            title={t("label.editAttribute")}
            description={t("label.editAttribute")}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3"
                >
                    {formFields.map((field, key) => (
                        <InputForm
                            key={key}
                            control={form.control}
                            {...field}
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
AttributeEdit.displayName = "AttributeEdit";
export default AttributeEdit;
