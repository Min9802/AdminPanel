import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@min98/ui";
import React, { ReactNode } from "react";
import { Input } from "@min98/ui";
import classNames from "classnames";

export interface InputFormProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    control?: any;
    label?: string;
    name?: any;
    iconStart?: ReactNode;
    iconEnd?: ReactNode;
    description?: string;
    placeholder?: string;
    props?: any;
    type?: string;
    handleFunc?: any;
}
const InputForm: React.FC<InputFormProps> = ({
    control,
    name,
    label,
    iconStart,
    iconEnd,
    placeholder,
    description,
    handleFunc,
    ...props
}) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="block">
                    <div>
                        <FormLabel>{label}</FormLabel>
                    </div>
                    <div
                        className={classNames(
                            iconStart || iconEnd
                                ? "inline-flex items-center justify-center"
                                : "",
                        )}
                    >
                        {iconStart ? (
                            <button
                                type="button"
                                className="h-9 p-2 items-center justify-center bg-gray-100 text-dark border border-tl-gray-100 border-b-gray-300 rounded-br-none rounded-tr-none rounded-tl-md rounded-bl-md disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={props?.disabled}
                            >
                                {iconStart}
                            </button>
                        ) : null}
                        <FormControl>
                            <Input
                                className={classNames(
                                    iconStart
                                        ? "rounded-bl-none rounded-tl-none"
                                        : "",
                                    iconEnd
                                        ? "rounded-br-none rounded-tr-none"
                                        : "",
                                )}
                                placeholder={placeholder}
                                {...field}
                                {...props}
                            />
                        </FormControl>
                        {iconEnd ? (
                            <button
                                type="button"
                                className="text-dark cursor-pointer h-9 p-2 items-center justify-center bg-gray-100 border border-tr-gray-100 border-b-gray-300 rounded-bl-none rounded-tl-none rounded-tr-md rounded-br-md disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={handleFunc}
                                disabled={props?.disabled}
                            >
                                {iconEnd}
                            </button>
                        ) : null}
                    </div>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
InputForm.displayName = "InputForm";
export default InputForm;
