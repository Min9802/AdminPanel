import Modal from "@/components/Modal/Modal";
import { Icon } from "@iconify/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form } from "@min98/ui";
import { InputForm } from "@/components/Form";
import { FileProps, FolderProps } from "../FileManager";
import { InputFormProps } from "@/components/Form/InputForm";

interface ModalRenameProps {
    open: boolean;
    onClose: () => void;
    item: FileProps | FolderProps;
    actions: (data: any) => void;
}

const ModalRename: React.FC<ModalRenameProps> = ({
    open,
    item,
    actions,
    onClose,
}) => {
    const { t } = useTranslation();
    const formFields: InputFormProps[] = [
        {
            name: "newName",
            label: t("label.newName"),
            type: "text",
            iconStart: <Icon icon="mdi:label" />,
            iconEnd:
                item?.hasOwnProperty("extension") && item.type == "file" ? (
                    <span className="py-2">
                        {(item as FileProps)?.extension}
                    </span>
                ) : (
                    ""
                ),
            placeholder: t("placeholder.newName"),
            description: t("label.newName"),
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
        const DirName = item.dirname;
        const newName = DirName
            ? `${DirName}/${values.newName}${
                  item?.hasOwnProperty("extension") && item.type == "file"
                      ? `.${(item as FileProps).extension}`
                      : ""
              }`
            : `${values.newName}${
                  item?.hasOwnProperty("extension") && item.type == "file"
                      ? `.${(item as FileProps).extension}`
                      : ""
              }`;
        const data = {
            oldName: item.path,
            newName: newName,
            type: item.type.toLocaleLowerCase(),
        };
        actions(data);
        onClose();
        form.reset();
    };
    React.useEffect(() => {
        if (item) {
            if (item.hasOwnProperty("extension")) {
                form.setValue("newName", (item as FileProps)?.filename);
            } else {
                form.setValue("newName", item?.basename);
            }
        }
    }, [item]);
    return (
        <Modal open={open} cancel={onClose} title={t("label.rename")}>
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

export default ModalRename;
