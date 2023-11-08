import React, {
    BaseSyntheticEvent,
    ChangeEventHandler,
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useState,
} from "react";
import PropTypes from "prop-types";

import { Badge, Popover, PopoverContent, PopoverTrigger } from "@min98/ui";
import { Button } from "@min98/ui";
import { Icon } from "@iconify/react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@min98/ui";
import { cn } from "@min98/ui";
import { useTranslation } from "react-i18next";

export type OptionMutiSelect = {
    value?: number | string;
    text?: string;
    disabled?: boolean;
};

interface MultipleSelectProps
    extends Omit<InputHTMLAttributes<HTMLSelectElement>, "option"> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Specifies the number of visible options in a drop-down list.
     */
    htmlSize?: number;
    /**
     * Method called immediately after the `value` prop changes.
     */
    onChange?: ChangeEventHandler<HTMLSelectElement>;
    /**
     * Options list of the select component. Available keys: `label`, `value`, `disabled`.
     * Examples:
     * - `options={[{ value: 'js', label: 'JavaScript' }, { value: 'html', label: 'HTML', disabled: true }]}`
     * - `options={['js', 'html']}`
     */
    options?: OptionMutiSelect[];
    /**
     * The `value` attribute of component.
     *
     * @controllable onChange
     */
    value?: string | number | string[];
    callback?: (agr: any) => void;
}

export const MultipleSelect = forwardRef<
    HTMLSelectElement,
    MultipleSelectProps
>(
    (
        {
            children,
            className,
            htmlSize,
            id,
            options = [],
            value,
            callback,
            ...rest
        },
        ref,
    ) => {
        const [open, setOpen] = useState<boolean>(false);
        const [selected, setSelected] = useState<any>([]);
        const [typing, SetTyping] = useState<any>(false);
        const { t } = useTranslation();
        /**
         * handle Click
         * @param value
         * @param type
         */
        const handleClick = (value: any, type: string) => {
            const newSelect = [...selected];
            if (type === "add") {
                if (!newSelect.includes(value)) {
                    newSelect.push(value);
                }
            } else if (type === "remove") {
                const indexToRemove = newSelect.indexOf(value);
                if (indexToRemove !== -1) {
                    newSelect.splice(indexToRemove, 1);
                }
            }

            setSelected(newSelect);
        };
        /**
         * get all values
         * @param options
         * @returns
         */
        const getAllValues = (options: any) => {
            let values: any = [];

            for (const option of options) {
                if (option.value !== undefined) {
                    values.push(option.value);
                } else if (option.options) {
                    values = values.concat(getAllValues(option.options));
                }
            }
            return values;
        };
        /**
         * get text for selected value
         * @param options
         * @param selectedValues
         * @returns
         */
        const getTextForSelectedValues = (
            options: any,
            selectedValues: any,
        ) => {
            const selectedTexts: any = [];

            for (const option of options) {
                if (
                    option.value !== undefined &&
                    selectedValues.includes(option.value)
                ) {
                    selectedTexts.push(option);
                } else if (option.options) {
                    selectedTexts.push(
                        ...getTextForSelectedValues(
                            option.options,
                            selectedValues,
                        ),
                    );
                }
            }

            return selectedTexts;
        };
        React.useEffect(() => {
            if (value) {
                setSelected(value);
            }
        }, []);
        React.useEffect(() => {
            callback?.(selected);
        }, [selected]);
        /**
         * render options
         * @param optionsList
         * @returns
         */

        /**
         * render selected
         * @returns
         */
        const RenderSelected: React.FC = () => {
            return (
                <div className="flex flex-wrap gap-1">
                    {getTextForSelectedValues(options, selected).map(
                        (option: any, key: number) => {
                            return (
                                <Badge
                                    key={key}
                                    color="secondary"
                                    className="justify-center items-center"
                                >
                                    {option.text}
                                    <span
                                        aria-hidden="true"
                                        onClick={() => {
                                            handleClick(option.value, "remove");
                                        }}
                                        className="ml-1 text-danger"
                                    >
                                        ×
                                    </span>
                                </Badge>
                            );
                        },
                    )}
                </div>
            );
        };
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-auto h-auto justify-between"
                    >
                        {Object.values(selected).length > 0 ? (
                            <RenderSelected />
                        ) : (
                            t("label.select")
                        )}
                        {selected.length > 0 ? (
                            <span
                                onClick={() => setSelected([])}
                                className="pl-2 pr-1"
                            >
                                <Icon icon="tabler:x" color="red" />
                            </span>
                        ) : null}
                        <Icon
                            icon="carbon:chevron-sort"
                            className="h-4 w-4 shrink-0 opacity-50"
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput
                            placeholder="Search..."
                            onFocus={() => SetTyping(true)}
                            onBlur={() => SetTyping(false)}
                        />
                        <CommandEmpty>{t("label.no_data")}</CommandEmpty>
                        <CommandGroup>
                            {options.map(
                                (option: OptionMutiSelect, index: number) => {
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={(currentValue) => {
                                                currentValue === option.value
                                                    ? ""
                                                    : currentValue;
                                                selected.includes(option?.value)
                                                    ? handleClick(
                                                          option?.value,
                                                          "remove",
                                                      )
                                                    : handleClick(
                                                          option?.value,
                                                          "add",
                                                      );
                                                // setOpen(false);
                                            }}
                                            onChange={(e) => console.log(e)}
                                        >
                                            <Icon
                                                icon="tabler:check"
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selected.includes(
                                                        option?.value,
                                                    )
                                                        ? "opacity-100"
                                                        : "opacity-0",
                                                )}
                                            />
                                            {option.text}
                                        </CommandItem>
                                    );
                                },
                            )}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    },
);

MultipleSelect.displayName = "MultipleSelect";
export default MultipleSelect;
export type { MultipleSelectProps };
