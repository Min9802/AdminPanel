import React from "react";
import { RootState } from "@/store/reducers/rootReducer";
import { ConnectedProps, connect } from "react-redux";
import * as actions from "@/store/actions";
import { useTranslation } from "react-i18next";
import SheetCustom from "@/components/Sheet/SheetCustom";
import {
    Button,
    Form,
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
import { Icon } from "@iconify/react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputForm } from "@/components/Form";
import { parseError } from "@/Utils/systemUtil";
import { AdminRoleApi } from "@/apis/Admin";
import PermissionSelect from "./PermissionSelect";
import { pageInfoProps } from "@/store/reducers/appReducer";

const RoleAdd: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState<boolean>(false);
    const [permissions, setPermissions] = React.useState<any[]>([]);
    /**
     * set page info
     */
    const pageInfo: pageInfoProps = {
        title: "label.addrole",
        desc: "label.addrole",
    };
    React.useEffect(() => {
        setOpen(true);
        props.setPageInfo(pageInfo);
    }, []);
    /**
     * define form field
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
        // Add more fields as needed
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
            guard_name: "admin",
        },
    });
    /**
     * call back close function
     */
    const processClose = () => {
        setOpen(false);
    };
    /**
     * on submit form
     * @param values
     */
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await AdminRoleApi.add({
                ...values,
                permissions,
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
            // processClose();
        }
    };
    return (
        <React.Fragment>
            <Button color="success" onClick={() => setOpen(true)}>
                <Icon icon="mdi:plus" className="w-5 h-5" />
                {t("label.addrole")}
            </Button>
            <SheetCustom
                open={open}
                cancel={() => processClose()}
                title={t("label.addrole")}
                description={t("label.addrole")}
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
                            <Label htmlFor="status">
                                {t("label.guard_name")}
                            </Label>
                            <Select
                                name="guard_name"
                                onValueChange={(value) => {
                                    form.setValue("guard_name", value);
                                }}
                                defaultValue={form.getValues("guard_name")}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                        placeholder={t(
                                            "placeholder.guard_name",
                                        )}
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
                <PermissionSelect item={null} callback={setPermissions} />
            </SheetCustom>
        </React.Fragment>
    );
};
const mapStateToProps = (state: RootState) => {
    return {};
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        setPageInfo: (pageInfo: any) => dispatch(actions.SetInfoPage(pageInfo)),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
interface DispatchProps {
    setPageInfo: (pageInfo: any[]) => void;
}
RoleAdd.displayName = "RoleAdd";
export default connector(RoleAdd);
