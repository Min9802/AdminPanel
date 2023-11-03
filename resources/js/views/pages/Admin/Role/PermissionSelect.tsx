import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseError } from "@/Utils/systemUtil";
import {
    Card,
    CardContent,
    Checkbox,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@min98/ui";
import { AdminPermissionApi } from "@/apis/Admin";
import { PermissionDefaut } from "@/configs/constant";
interface PermissionSelectProps {
    item: any;
    callback: (data: any) => void;
}

const PermissionSelect: React.FC<PermissionSelectProps> = ({
    item,
    callback,
}) => {
    const [permissions, setPermissions] = React.useState<any[]>([]);
    const [selected, setSelected] = React.useState<any[]>([]);

    /**
     * get permissions
     */
    const getPermission = async () => {
        try {
            const response = await AdminPermissionApi.get();
            const permissions = response.data.content;
            setPermissions(permissions);
        } catch (err: any) {
            parseError(err);
        }
    };
    /**
     * define form
     */
    const FormSchema = z.object({
        items: z
            .array(z.string())
            .refine((value) => value.some((item) => item), {
                message: "You have to select at least one item.",
            }),
    });
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: [],
        },
    });
    /**
     * hook
     * @param data
     */
    React.useEffect(() => {
        callback?.(selected);
    }, [selected]);
    /**
     * hook init value
     */
    React.useEffect(() => {
        getPermission();
        if (item) {
            const permission_checked = item.permissions.map(
                (permission: any) => permission.name,
            );
            form.setValue("items", permission_checked);
            setSelected(permission_checked);
        }
    }, []);
    return (
        <Card>
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-3"
                        onClick={() => {
                            setSelected(form.getValues("items"));
                        }}
                    >
                        {permissions
                            .filter((per) => !per.name.includes("-"))
                            .map((permission, key) => {
                                return (
                                    <Card key={key}>
                                        <CardContent>
                                            <FormField
                                                control={form.control}
                                                name="items"
                                                render={({ field }) => {
                                                    const permissionChild =
                                                        permissions.filter(
                                                            (per) =>
                                                                per.name.includes(
                                                                    permission.name,
                                                                ),
                                                        );
                                                    return (
                                                        <FormItem className="items-start space-x-3 space-y-0">
                                                            <div className="mb-4">
                                                                <FormItem
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(
                                                                                permission.name,
                                                                            )}
                                                                            disabled={
                                                                                item &&
                                                                                item.name ==
                                                                                    "SuperAdmin" &&
                                                                                PermissionDefaut.some(
                                                                                    (
                                                                                        str,
                                                                                    ) =>
                                                                                        permission.name.includes(
                                                                                            str,
                                                                                        ),
                                                                                )
                                                                            }
                                                                            onCheckedChange={(
                                                                                checked,
                                                                            ) => {
                                                                                const actions_name =
                                                                                    permissionChild.map(
                                                                                        (
                                                                                            action: any,
                                                                                        ) =>
                                                                                            action.name,
                                                                                    );
                                                                                const items_checked =
                                                                                    [
                                                                                        permission.name,
                                                                                        ...actions_name,
                                                                                    ];

                                                                                return checked
                                                                                    ? field.onChange(
                                                                                          [
                                                                                              ...field.value,
                                                                                              ...items_checked,
                                                                                          ],
                                                                                      )
                                                                                    : field.onChange(
                                                                                          field.value?.filter(
                                                                                              (
                                                                                                  value,
                                                                                              ) =>
                                                                                                  !items_checked.includes(
                                                                                                      value,
                                                                                                  ),
                                                                                          ),
                                                                                      );
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-semibold">
                                                                        {
                                                                            permission.name
                                                                        }
                                                                    </FormLabel>
                                                                </FormItem>
                                                            </div>
                                                            {permissionChild.map(
                                                                (
                                                                    action: any,
                                                                ) => (
                                                                    <FormField
                                                                        key={
                                                                            action.id
                                                                        }
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="items"
                                                                        render={({
                                                                            field,
                                                                        }) => {
                                                                            return (
                                                                                <FormItem
                                                                                    key={
                                                                                        action.id
                                                                                    }
                                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                                >
                                                                                    <FormControl>
                                                                                        <Checkbox
                                                                                            checked={field.value?.includes(
                                                                                                action.name,
                                                                                            )}
                                                                                            disabled={
                                                                                                item &&
                                                                                                item.name ==
                                                                                                    "SuperAdmin" &&
                                                                                                PermissionDefaut.some(
                                                                                                    (
                                                                                                        str,
                                                                                                    ) =>
                                                                                                        permission.name.includes(
                                                                                                            str,
                                                                                                        ),
                                                                                                )
                                                                                            }
                                                                                            onCheckedChange={(
                                                                                                checked,
                                                                                            ) => {
                                                                                                return checked
                                                                                                    ? field.onChange(
                                                                                                          [
                                                                                                              ...field.value,
                                                                                                              action.name,
                                                                                                          ],
                                                                                                      )
                                                                                                    : field.onChange(
                                                                                                          field.value?.filter(
                                                                                                              (
                                                                                                                  value,
                                                                                                              ) =>
                                                                                                                  value !==
                                                                                                                  action.name,
                                                                                                          ),
                                                                                                      );
                                                                                            }}
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormLabel className="text-sm font-normal">
                                                                                        {
                                                                                            action.name
                                                                                        }
                                                                                    </FormLabel>
                                                                                </FormItem>
                                                                            );
                                                                        }}
                                                                    />
                                                                ),
                                                            )}
                                                            <FormMessage />
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                );
                            })}
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
PermissionSelect.displayName = "PermissionSelect";
export default PermissionSelect;
