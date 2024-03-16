import React from "react";

import { useTranslation } from "react-i18next";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Checkbox,
    Form,
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    InputForm,
    SheetCustom,
    ToastAction,
    toast,
} from "@min98/ui";
import { Icon } from "@iconify/react";
import { Copy, Random, parseError } from "@/Utils/systemUtil";
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
    const [resetPass, setResetPass] = React.useState<boolean>(false);
    const [random, setRandom] = React.useState<boolean>(false);
    const [showPass, setShowPass] = React.useState<boolean>(false);
    const [typeInput, setTypeInput] = React.useState<string>("password");
    /**
     * handle Show Pass
     */
    const handleShowPass = () => {
        setShowPass(true);
    };
    /**
     * handle Show Pass
     */
    const handleHidePass = () => {
        setShowPass(false);
    };
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
            required: true,
        },
        {
            name: "name",
            label: t("label.name"),
            type: "text",
            iconStart: <Icon icon="mdi:label" />,
            placeholder: t("placeholder.name"),
            description: t("label.name"),
            required: true,
        },
        {
            name: "password",
            label: t("label.password"),
            type: typeInput ?? "password",
            iconStart: <Icon icon="mdi:lock" />,
            iconEnd: showPass ? (
                <Icon icon="mdi:eye" />
            ) : (
                <Icon icon="mdi:eye-off" />
            ),
            placeholder: t("placeholder.password"),
            description: t("label.password"),
            disabled: !resetPass,
            handleFunc: showPass ? handleHidePass : handleShowPass,
        },
        {
            name: "email",
            label: t("label.email"),
            type: "email",
            iconStart: <Icon icon="mdi:at" />,
            placeholder: t("placeholder.email"),
            description: t("label.email"),
            required: true,
        },
    ];
    const formSchema = z.object({
        ...Object.fromEntries(
            formFields.map((field) => [
                field.name,
                field.required
                    ? z
                          .string()
                          .nonempty(`${field.label} ${t("label.required")}`)
                    : z.string(),
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
     * random password
     */
    React.useEffect(() => {
        if (random) {
            const randomPass = Random(1, 8);
            form.setValue("password", randomPass);
        }
    }, [random]);
    /**
     * show password
     */
    React.useEffect(() => {
        showPass ? setTypeInput("text") : setTypeInput("password");
    }, [showPass]);
    /**
     * handle copy
     * @param value
     */
    const handleCopy = (value: any) => {
        Copy(value);
    };
    /**
     * set reset password
     * @param checked
     */
    const resetPassword = (checked: boolean) => {
        if (checked) {
            setResetPass(true);
        } else {
            setResetPass(false);
            form.setValue("password", "");
        }
    };
    /**
     * random password
     * @param checked
     */
    const setRandomPassword = (checked: boolean) => {
        if (checked) {
            setRandom(true);
        } else {
            setRandom(false);
        }
    };
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
            if (form.getValues("password") !== "") {
                const password = form.getValues("password");
                const notify = {
                    title: status,
                    description: message,
                    action: (
                        <ToastAction
                            altText="Copy to clipboard"
                            onClick={() => handleCopy(password)}
                        >
                            {t("label.copy")}
                        </ToastAction>
                    ),
                    status: "success",
                };
                console.log(notify);

                toast(notify);
            } else {
                const notify = {
                    title: status,
                    description: message,
                    status: "success",
                };
                toast(notify);
            }
            processClose();
        } catch (err: any) {
            parseError(err);
        }
    };
    /**
     * process close
     */
    const processClose = () => {
        setOpen(false);
        onClose();
        form.reset();
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
                            control={form.control}
                            {...field}
                        />
                    ))}
                    {resetPass && (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={random}
                                    onCheckedChange={setRandomPassword}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>{t("label.random")}</FormLabel>
                                <FormDescription>
                                    {t("label.random_desc")}
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                            <Checkbox
                                checked={resetPass}
                                onCheckedChange={resetPassword}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>{t("label.resetpass")}</FormLabel>
                            <FormDescription>
                                {t("label.resetpass_desc")}
                            </FormDescription>
                        </div>
                    </FormItem>
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
