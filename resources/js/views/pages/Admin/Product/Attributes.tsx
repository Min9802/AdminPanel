import React from "react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Col,
    Flex,
    Grid,
    Input,
    Label,
} from "@min98/ui";
import { AttrProps } from "./ProductAdd";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

interface AttributesProps {
    data?: any[];
    values?: any[];
    callback?: (data: AttrProps[]) => void;
}

const Attributes: React.FC<AttributesProps> = ({ data, values= [], callback }) => {
    const { t } = useTranslation();
    const [list, setList] = React.useState<any[]>([]);
    const [attributes, setAttributes] = React.useState<AttrProps[]>([]);
    const [fields, setFields] = React.useState<any[]>([]);

    /**
     * init data
     */
    React.useEffect(() => {
        if (data) {
            setList(data);
        }
    }, [data]);
    /**
     * init values
     */
    React.useEffect(() => {
        if (values?.length > 0) {
            setAttributes(values);
        }
    }, [values]);
    /**
     * callback hook
     */
    React.useEffect(() => {
        callback && callback(attributes);
    }, [attributes]);
    /**
     * define price schema
     */
    const priceSchema = z.number().refine((value) => !isNaN(value), {
        message: "Price must be a valid number",
        path: ["add_price"],
    });
    /**
     * add attribute
     * @param field
     */
    const addAttribute = (field: string) => {
        const dataArr = [...fields];
        dataArr.push(field);
        setFields(dataArr);
    };
    /**
     * remove attribute
     * @param field
     */
    const removeAttribute = (field: string, key: number) => {
        const dataArr = [...fields];
        const index = dataArr.indexOf(field);
        if (index > -1) {
            dataArr.splice(index, 1);
        }
        const indexOf = attributes.findIndex(
            (item) => item.id === key && item.type === field,
        );
        if (indexOf > -1) {
            const newAttr = [...attributes];
            newAttr.splice(indexOf, 1);
            setAttributes(newAttr);
        }
        setFields(dataArr);
    };
    /**
     * on change name
     * @param e
     * @param index
     */
    const onChangeName = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => {
        const { name, value } = e.target;
        const newFieldData = [...attributes];
        const indexOf = newFieldData.findIndex(
            (item) => item.id === index && item.type === name,
        );
        if (indexOf > -1) {
            newFieldData[indexOf].name = value;
        } else {
            newFieldData.push({
                id: index,
                type: name,
                name: value,
                add_price: 0,
            });
        }
        setAttributes(newFieldData);
    };
    /**
     * onchange Values
     * @param e
     * @param index
     */
    const onChangeValues = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => {
        const { name, value } = e.target;
        let newFieldData = [...attributes];

        try {
            const parsedValue = parseFloat(value);
            const validationResult = priceSchema.safeParse(parsedValue);
            const indexOf = newFieldData.findIndex(
                (item) => item.id === index && item.type === name,
            );
            if (validationResult.success) {
                if (indexOf > -1) {
                    newFieldData[indexOf].add_price = parsedValue;
                    delete newFieldData[indexOf].error;
                } else {
                    newFieldData.push({
                        id: index,
                        type: name,
                        name: name,
                        add_price: 0,
                    });
                }
            } else {
                const error = validationResult.error.flatten().formErrors[0];
                if (indexOf > -1) {
                    newFieldData[indexOf].add_price = 0;
                    newFieldData[indexOf].error = error;
                } else {
                    newFieldData.push({
                        id: index,
                        type: name,
                        name: name,
                        add_price: 0,
                        error: error,
                    });
                }
            }
            setAttributes(newFieldData);
        } catch (err) {
            if (err instanceof z.ZodError) {
                const error = err.flatten().formErrors[0];
                newFieldData = newFieldData.map((item) => ({
                    ...item,
                    error: item.id === index ? error : item.error,
                }));
            }
            setAttributes(newFieldData);
        }
    };
    return (
        <Card>
            <CardHeader>
                <Label>{t("label.attribute")}</Label>
                {list.length > 0 && (
                    <Flex align="start" direction="row">
                        {list.map((el, k) => (
                            <Button
                                color="success-light"
                                type="button"
                                tooltip={t("tooltip.add")}
                                key={k}
                                onClick={() => addAttribute(el.name)}
                            >
                                {el.name}
                                <Icon icon="mdi:plus-box-multiple" />
                            </Button>
                        ))}
                    </Flex>
                )}
            </CardHeader>
            <CardContent className="space-y-1">
                {fields.length > 0 && (
                    <Grid col="6" className="p-2 space-y-1">
                        <Col col="4" end="7" spaceX="1">
                            <Button
                                color="primary-light"
                                type="button"
                                disabled
                            >
                                {t("label.attribute")}
                            </Button>
                            <Button
                                color="primary-light"
                                type="button"
                                disabled
                            >
                                {t("label.add_price")}
                            </Button>
                        </Col>
                        <Col col="6" spaceY="1">
                            {fields.map((attr, k) => (
                                <Grid
                                    key={k}
                                    col="3"
                                    gap="1"
                                    align="center"
                                    justify="center"
                                >
                                    <Button
                                        tooltip={t("tooltip.remove")}
                                        type="button"
                                        key={k}
                                        color="primary-light"
                                        onClick={() => removeAttribute(attr, k)}
                                    >
                                        {attr}
                                    </Button>
                                    <Input
                                        id={`${k}`}
                                        name={attr}
                                        defaultValue={
                                            attributes.filter(
                                                (val) =>
                                                    val.name == attr &&
                                                    val.id == k,
                                            )[0]?.name ?? ""
                                        }
                                        onChange={(e) => onChangeName(e, k)}
                                    />
                                    <Input
                                        id={`${k}`}
                                        name={attr}
                                        defaultValue={
                                            attributes.filter(
                                                (val) =>
                                                    val.name == attr &&
                                                    val.id == k,
                                            )[0]?.add_price ?? ""
                                        }
                                        onChange={(e) => onChangeValues(e, k)}
                                    />
                                    <Col col="3" start="2">
                                        {attributes.length > 0 &&
                                            attributes
                                                .filter(
                                                    (v) =>
                                                        v.id === k &&
                                                        v.type === attr,
                                                )
                                                .map((item, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-red-500 text-sm"
                                                    >
                                                        {item.error &&
                                                            item.error}
                                                    </span>
                                                ))}
                                    </Col>
                                </Grid>
                            ))}
                        </Col>
                    </Grid>
                )}
            </CardContent>
        </Card>
    );
};

export default Attributes;
