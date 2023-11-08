import React from "react";

import { useTranslation } from "react-i18next";
import SheetCustom from "@/components/Sheet/SheetCustom";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Label,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    toast,
} from "@min98/ui";
import { InputForm } from "@/components/Form";
import { Icon } from "@iconify/react";
import { parseError } from "@/Utils/systemUtil";
import { AdminRoleApi } from "@/apis/Admin";
import PermissionSelect from "./PermissionSelect";
interface RoleEditProps {
    item: any;
    onClose: () => void;
}
const RoleEdit: React.FC<RoleEditProps> = ({ item, onClose }) => {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState<boolean>(false);
    const [permissions, setPermissions] = React.useState<any[]>([]);
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
    ];
    const formSchema = z.object({
        ...Object.fromEntries(
            formFields.map((field) => [
                field.name,
                z.string().nonempty(`${field.label} ${t("label.required")}`),
            ]),
        ),
        guard_name: z.string(),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...Object.fromEntries(formFields.map((field) => [field.name, ""])),
            guard_name: item?.guard_name,
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
            const response = await AdminRoleApi.update(item.id, {
                ...values,
                status: item.status,
                permissions: permissions,
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
            title={t("label.editrole")}
            description={t("label.editrole")}
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
                            control={form.control}
                            {...field}
                        />
                    ))}
                    <div className="space-y-1">
                        <Label htmlFor="status">{t("label.guard_name")}</Label>
                        <Select
                            name="guard_name"
                            onValueChange={(value) => {
                                form.setValue("guard_name", value);
                            }}
                            defaultValue={form.getValues("guard_name")}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue
                                    placeholder={t("placeholder.guard_name")}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        {t("label.guard_name")}
                                    </SelectLabel>
                                    <SelectItem value="admin">
                                        {t("label.admin")}
                                    </SelectItem>
                                    <SelectItem value="user">
                                        {t("label.user")}
                                    </SelectItem>
                                    <SelectItem value="api">
                                        {t("label.api")}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </div>
                    <Button type="submit" color="success">
                        {t("common.save")}
                    </Button>
                </form>
            </Form>
            <PermissionSelect item={item} callback={setPermissions} />
        </SheetCustom>
    );
};
RoleEdit.displayName = "RoleEdit";
export default RoleEdit;
