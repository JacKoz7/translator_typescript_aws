"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";

export type IComboBoxOption<T> = {
  label: string;
  value: string;
  data: T;
};

export type IComboBox<T> = {
  placeholder: string;
  options: Array<IComboBoxOption<T>>;
  onSelect: (a: IComboBoxOption<T>) => void;
  selected: IComboBoxOption<T> | null | undefined;
};

export function Combobox<T>({
  placeholder,
  options,
  selected,
  onSelect,
}: IComboBox<T>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  useEffect(() => {
    if (selected) {
      setValue(selected?.value);
    }
  }, [selected]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-custom-cream"
        >
          {value
            ? options.find((framework) => framework.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 ">
        <Command className="bg-custom-cream">
          <CommandInput placeholder={placeholder} className="h-9 bg-custom-cream" />
          <CommandList className="bg-custom-cream">
            <CommandEmpty>No framework found.</CommandEmpty>
            {options.map((framework) => (
              <CommandItem 
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  const selectedOption = options.find(
                    (opt) => opt.value === currentValue
                  );
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                  if (selectedOption) {
                    onSelect(selectedOption);
                  }
                }}
              >
                {framework.label}
                <Check
                  className={cn(
                    "ml-auto bg-green-400",
                    value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
