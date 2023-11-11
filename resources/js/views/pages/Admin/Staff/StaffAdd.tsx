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
import { ConnectedProps, connect } from "react-redux";
import { RootState } from "@/store/reducers/rootReducer";
import * as actions from "@/store/actions";
import SelectRole from "./SelectRole";
import { pageInfoProps } from "@/store/reducers/appReducer";

const StaffAdd: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState<boolean>(false);
    const [roles, setRoles] = React.useState<any[]>([]);
    /**
     * set page info
     */
    const pageInfo: pageInfoProps = {
        title: "label.addstaff",
        desc: "label.addstaff",
    };
    React.useEffect(() => {
        setOpen(true);
        props.setPageInfo(pageInfo);
    }, []);
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
     * on submit
     * @param values
     */
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await AdminStaffApi.add({
                ...values,
                roles,
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
        } catch (err: any) {
            parseError(err);
        }
    };

    /**
     * process close
     */
    const processClose = () => {
        setOpen(false);
        form.reset();
    };
    /**
     * return view
     */
    return (
        <React.Fragment>
            <Button color="success" onClick={() => setOpen(true)}>
                <Icon icon="mdi:plus" className="w-5 h-5" />
                {t("label.addstaff")}
            </Button>
            <SheetCustom
                open={open}
                cancel={() => processClose()}
                title={t("label.addstaff")}
                description={t("label.addstaff")}
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

                        <Button type="submit" color="success">
                            {t("common.save")}
                        </Button>
                    </form>
                </Form>
                <SelectRole callback={setRoles} />
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
StaffAdd.displayName = "StaffAdd";
export default connector(StaffAdd);
