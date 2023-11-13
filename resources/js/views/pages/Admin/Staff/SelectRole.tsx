import React from "react";
import {
    Card,
    CardContent,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@min98/ui";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { MultipleSelect } from "@/components/Form";
import { OptionMutiSelect } from "@/components/Form/MultipleSelect";
import { parseError } from "@/Utils/systemUtil";
import { AdminRoleApi } from "@/apis/Admin";
interface SelectRoleProps {
    item?: any;
    callback?: (arg: any) => void;
}

const SelectRole: React.FC<SelectRoleProps> = ({ item, callback }) => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const [list, setList] = React.useState<OptionMutiSelect[]>([]);
    const { t } = useTranslation();
    /**
     * define form properties
     */
    const FormSchema = z.object({
        roles: z
            .array(z.string())
            .refine((value) => value.some((item) => item), {
                message: "You have to select at least one item.",
            }),
    });
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            roles: [],
        },
    });
    /**
     * get list roles
     */
    const getList = async () => {
        try {
            const response = await AdminRoleApi.list();
            const list = response.data.content;
            const roles = list.map((item: any) => {
                return {
                    value: item.name,
                    text: item.name,
                };
            });
            setList(roles);
        } catch (err: any) {
            parseError(err);
        }
    };
    React.useEffect(() => {
        getList();
        if (item) {
            const values = item.roles.map((it: any) => it.name);
            setSelected(item.roles.map((it: any) => it.name));
            form.setValue("roles", values);
        }
    }, []);
    React.useEffect(() => {
        const RoleSelected = form.getValues("roles");
        if (item && item.id == 1 && !RoleSelected.includes("SuperAdmin")) {
            form.setValue("roles", [...RoleSelected, "SuperAdmin"]);
        }
        callback?.(form.getValues("roles"));
    }, [selected]);
    return (
        <Card>
            <CardContent>
                {list.length > 0 && (
                    <Form {...form}>
                        <form className="space-y-3">
                            <div className="space-y-1">
                                <FormItem className="block">
                                    <div>
                                        <FormLabel htmlFor="roles">
                                            {t("label.role")}
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <FormField
                                            control={form.control}
                                            name="roles"
                                            render={() => (
                                                <MultipleSelect
                                                    options={list}
                                                    callback={(value: any) => {
                                                        setSelected(value);
                                                        form.setValue(
                                                            "roles",
                                                            value,
                                                        );
                                                    }}
                                                    value={form.getValues(
                                                        "roles",
                                                    )}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </div>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    );
};
SelectRole.displayName = "SelectRole";
export default SelectRole;
