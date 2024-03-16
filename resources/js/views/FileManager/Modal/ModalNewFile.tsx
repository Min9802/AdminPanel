import { Icon } from "@iconify/react";
import { Button, Form, InputForm, InputFormProps, Modal } from "@min98/ui";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
interface ModalNewFileProps {
    open: boolean;
    onClose: () => void;
    actions: (data: any) => void;
}

const ModalNewFile: React.FC<ModalNewFileProps> = ({
    open,
    onClose,
    actions,
}) => {
    const { t } = useTranslation();
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
    const formSchema = z.object({
        ...Object.fromEntries(
            formFields.map((field: InputFormProps) => [
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
    const Submit = (values: z.infer<typeof formSchema>) => {
        actions(values);
        onClose();
        form.reset();
    };
    return (
        <Modal open={open} cancel={onClose} title={t("label.newfile")}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(Submit)}
                    className="space-y-3"
                >
                    {formFields.map((field, key) => (
                        <InputForm
                            key={key}
                            label={field?.label}
                            name={field?.name}
                            iconStart={field?.iconStart}
                            iconEnd={field?.iconEnd}
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
        </Modal>
    );
};

export default ModalNewFile;
