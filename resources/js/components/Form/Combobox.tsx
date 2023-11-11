import * as React from "react";
import { cn } from "@min98/ui";
import { Button } from "@min98/ui";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@min98/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@min98/ui";
import { Icon } from "@iconify/react";
type Option = {
    disabled?: boolean;
    label?: string;
    value?: string | number;
};
interface ComboBoxProps {
    options?: Option[] | any;
    callback?: (agr: any) => void;
}
const ComboBox: React.FC<ComboBoxProps> = ({ options = [], callback }) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    React.useEffect(() => {
        callback?.(value);
    }, [value]);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? options.find(
                              (option: Option) => option.value === value,
                          )?.label
                        : "Select..."}
                    <Icon
                        icon="carbon:chevron-sort"
                        className="ml-2 h-4 w-4 shrink-0 opacity-50"
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandEmpty>No Result found.</CommandEmpty>
                    <CommandGroup>
                        {options.map((option: Option) => (
                            <CommandItem
                                key={option.value}
                                onSelect={(currentValue) => {
                                    setValue(
                                        currentValue === value
                                            ? ""
                                            : currentValue,
                                    );
                                    setOpen(false);
                                }}
                            >
                                <Icon
                                    icon="tabler:check"
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
ComboBox.displayName = "ComboBox";
export default ComboBox;
