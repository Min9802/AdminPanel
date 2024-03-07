import React from "react";
import { RootState } from "@/store/reducers/rootReducer";
import { ConnectedProps, connect } from "react-redux";
import * as actions from "@/store/actions";
import { useTranslation } from "react-i18next";
import SheetCustom from "@/components/Sheet/SheetCustom";
import {
    Button,
    Card,
    CardContent,
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
import { bytesToHuman } from "@/views/FileManager/Utils/FileUtils";
import { thumbnail } from "@/views/FileManager/Utils/ActionUtils";
import { Item } from "@/views/FileManager/FileManager";
import CkEditorCustom from "@/components/Form/CkEditorCustom";
export type AttrProps = {
    id: number;
    type: string;
    name: string;
    add_price: number;
    error?: any;
};
interface ItemProp {
    items: Item[];
}
type ItemUrl = {
    url: string;
    path: string;
};
const ProductAdd: React.FC<PropsFromRedux & DispatchProps> = (props) => {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState<boolean>(false);
    const [modalImage, setModalImage] = React.useState<boolean>(false);
    const [list, setList] = React.useState<any[]>([]);
    const [attributes, setAttributes] = React.useState<AttrProps[]>([]);
    const [images, setImages] = React.useState<Item[]>([]);
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
        attributes: z.array(z.string()),
        detail: z.array(z.string()),
        status: z.string().nonempty("Status is required"),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...Object.fromEntries(formFields.map((field) => [field.name, ""])),
            images: [],
            attributes: [],
            detail: "",
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
        form.reset();
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
     * callback images
     * @param data
     */
    const callbackImages = (data: any): void => {
        const listImages = [...images];
        const dataIndex = listImages.findIndex(
            (item) => item.path === data.path,
        );
        if (dataIndex == -1) {
            listImages.push(data);
        }
        setImages(listImages);
    };
    /**
     * remove images from list
     * @param file
     */
    const fileRemove = (file: Item) => {
        const updatedList = [...images];
        updatedList.splice(images.indexOf(file), 1);
        setImages(updatedList);
    };
    /**
     * Change Detail
     * @param data
     */
    const ChangeDetail = (data: any) => {
        console.log(data);
    };
    /**
     * on submit form
     * @param values
     */
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const imagePath = images.map((item) => ({
            disk: item.disk,
            path: item.path,
        }));
        values.images = imagePath;
        values.attributes = attributes;
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
    /**
     * preview image
     * @param param0
     * @returns
     */
    const RenderPreView: React.FC<ItemProp> = ({ items }) => {
        const [dataUrls, setUrls] = React.useState<ItemUrl[]>([]);
        /**
         * hook set url
         */
        React.useEffect(() => {
            const fetchData = async () => {
                const promises = items.map(async (item) => {
                    const url = await thumbnail(item?.disk, item);
                    return {
                        url: url as string,
                        path: item.path,
                    };
                });
                const resolvedData = await Promise.all(promises);
                setUrls(resolvedData);
            };

            fetchData();
        }, [items]);
        return (
            <Card>
                <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                        {items.map((item, index) => {
                            // Find the corresponding dataUrl based on path
                            const imageData = dataUrls.find(
                                (data) => data.path === item.path,
                            );

                            return (
                                <div
                                    className="flex flex-row items-center"
                                    key={index}
                                >
                                    <div className="text-left">
                                        <p className="text-dark text-sm break-all">
                                            {item.filename}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            {bytesToHuman(item.size)}
                                        </p>
                                    </div>
                                    {imageData && (
                                        <img
                                            className="mr-auto ml-auto"
                                            src={imageData.url}
                                            alt={item.filename}
                                        />
                                    )}
                                    <div className="float-right">
                                        <Icon
                                            className="cursor-pointer"
                                            icon="tabler:x"
                                            color="red"
                                            fontSize={25}
                                            onClick={() => fileRemove(item)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        );
    };
    return (
        <React.Fragment>
            <DialogModal
                open={modalImage}
                size="4xl"
                action={() => setModalImage(false)}
                cancel={() => setModalImage(false)}
            >
                <FileManager callback={callbackImages} />
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
                className="!sm:max-w-max overflow-y-scroll"
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
                        <RenderPreView items={images} />
                        <Attributes
                            data={list}
                            values={attributes}
                            callback={callbackAttributes}
                        />
                        <CkEditorCustom
                            handleChange={ChangeDetail}
                            config={{
                                disk: "public",
                                path: "Product",
                            }}
                        />
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
