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
} from "@min98/ui";
import { Icon } from "@iconify/react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldProps, InputForm } from "@/components/Form";
import { parseError } from "@/Utils/systemUtil";
import { pageInfoProps } from "@/store/reducers/appReducer";
import { AdminAttributeApi } from "@/apis/Admin";
import Attributes from "./Attributes";
import { FileManager } from "@/views/FileManager";
import DialogModal from "@/components/Modal/DialogModal";
export type AttrProps = {
    id: number;
    type: string;
    name: string;
    add_price: number;
    error?: any;
};
const ProductAdd: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState<boolean>(false);
    const [modalImage, setModalImage] = React.useState<boolean>(false);
    const [list, setList] = React.useState<any[]>([]);
    const [attributes, setAttributes] = React.useState<AttrProps[]>([]);
    const [images, setImages] = React.useState<any[]>([]);
    /**
     * set page info
     */
    const pageInfo: pageInfoProps = {
        title: "label.addproduct",
        desc: "label.addproduct",
    };
    React.useEffect(() => {
        setOpen(true);
        props.setPageInfo(pageInfo);
        getAttributes();
    }, []);
    React.useEffect(() => {
        console.log(images);
        console.log(attributes);
    }, [images, attributes]);
    /**
     * define form field
     */
    const formFields: FieldProps[] = [
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
        images: z.array(z.string()),
        status: z.string().nonempty("Status is required"),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...Object.fromEntries(formFields.map((field) => [field.name, ""])),
            images: [],
            status: "0",
        },
    });
    /**
     * callback attributes
     * @param data
     */
    const callbackAttributes = (data: AttrProps[]) => {
        setAttributes(data);
    };
    /**
     * callback close
     */
    const processClose = () => {
        setOpen(false);
    };
    /**
     * get attributes
     */
    const getAttributes = async () => {
        try {
            const response = await AdminAttributeApi.get();
            const data = response.data.content;
            setList(data);
        } catch (err: any) {
            parseError(err);
        }
    };
    /**
     * toggle modal image
     */
    const toggleModalImage = () => {
        setModalImage(!modalImage);
    };
    /**
     * on submit form
     * @param values
     */
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);

        // try {
        //     const response = await AdminPackageApi.add(values);
        //     const status = response.data.status;
        //     const message = response.data.message;
        //     const notify = {
        //         title: status,
        //         description: message,
        //         status: "success",
        //     };
        //     toast(notify);
        //     processClose();
        //     form.reset();
        // } catch (err: any) {
        //     parseError(err);
        //     // processClose();
        // }
    };
    return (
        <React.Fragment>
            <DialogModal
                open={modalImage}
                size="4xl"
                cancel={() => setModalImage(false)}
            >
                <FileManager callback={setImages} />
            </DialogModal>
            <Button color="success" onClick={() => setOpen(true)}>
                <Icon icon="mdi:plus" className="w-5 h-5" />
                {t("label.addproduct")}
            </Button>
            <SheetCustom
                open={open}
                cancel={() => processClose()}
                title={t("label.addproduct")}
                description={t("label.addproduct")}
                className="w-[400px] sm:w-[540px]"
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
                        <div className="space-y-1">
                            <Button
                                type="button"
                                variant="outline"
                                color="success"
                                onClick={toggleModalImage}
                            >
                                <Icon
                                    icon="mdi:file-image-plus"
                                    className="w-5 h-5"
                                    color="green"
                                />
                            </Button>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="status">{t("label.status")}</Label>
                            <Select
                                name="status"
                                onValueChange={(value: any) => {
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
                        <Attributes data={list} callback={callbackAttributes} />
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
ProductAdd.displayName = "ProductAdd";
export default connector(ProductAdd);
