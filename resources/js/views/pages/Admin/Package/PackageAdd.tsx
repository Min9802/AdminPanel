import React from "react";
import { RootState } from "@/store/reducers/rootReducer";
import { ConnectedProps, connect } from "react-redux";
import * as actions from "@/store/actions";
import { useTranslation } from "react-i18next";
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
    SheetCustom,
    InputFormProps,
    InputForm,
} from "@min98/ui";
import { Icon } from "@iconify/react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminPackageApi from "@/apis/Admin/AdminPackageApi";
import { parseError } from "@/Utils/systemUtil";
import { pageInfoProps } from "@/store/reducers/appReducer";

const PackageAdd: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState<boolean>(false);
    /**
     * set page info
     */
    const pageInfo: pageInfoProps = {
        title: "label.addpackage",
        desc: "label.addpackage",
    };
    React.useEffect(() => {
        setOpen(true);
        props.setPageInfo(pageInfo);
    }, []);
    /**
     * define form field
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
    const formSchema = z.object({
        ...Object.fromEntries(
            formFields.map((field) => [
                field.name,
                z.string().nonempty(`${field.label} ${t("label.required")}`),
            ]),
        ),
        status: z.string().nonempty("Status is required"),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...Object.fromEntries(formFields.map((field) => [field.name, ""])),
            status: "0",
        },
    });
    /**
     * callback close
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
            const response = await AdminPackageApi.add(values);
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
                {t("label.addpackage")}
            </Button>
            <SheetCustom
                open={open}
                cancel={() => processClose()}
                title={t("label.addpackage")}
                description={t("label.addpackage")}
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
                            <Label htmlFor="status">{t("label.status")}</Label>
                            <Select
                                name="status"
                                onValueChange={(value) => {
                                    form.setValue("status", value);
                                }}
                                defaultValue={form.getValues("status")}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                        placeholder={t(
                                            "placeholder.choose_select",
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            {t("label.status")}
                                        </SelectLabel>
                                        <SelectItem value="0">
                                            {t("label.disable")}
                                        </SelectItem>
                                        <SelectItem value="1">
                                            {t("label.enable")}
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
            </SheetCustom>
        </React.Fragment>
    );
};
const mapStateToProps = (state: RootState) => {
    return {
        pageInfo: state.app.pageInfo,
    };
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
PackageAdd.displayName = "PackageAdd";
export default connector(PackageAdd);
