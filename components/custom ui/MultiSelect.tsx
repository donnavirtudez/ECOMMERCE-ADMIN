"use client";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useState, useRef, useEffect } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface CollectionType {
  _id: string;
  title: string;
}

interface MultiSelectProps {
  placeholder: string;
  collections: CollectionType[];
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  collections,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected: CollectionType[] = value
    .map((id) => collections.find((c) => c._id === id))
    .filter((c): c is CollectionType => c !== undefined);

  const selectables = collections.filter((c) => !selected.includes(c));

  return (
    <Command className="overflow-visible bg-[#FFFFFF]" ref={wrapperRef}>
      <div className="flex gap-1 flex-wrap border rounded-md">
        {selected.map((collection) => (
          <Badge
            key={collection._id}
            className="bg-[#616161] text-[#FFFFFF] rounded-full text-sm font-medium"
          >
            {collection.title}
            <button
              className="cursor-pointer ml-1 rounded-full outline-none hover:bg-[#DC0000]"
              onClick={() => onRemove(collection._id)}
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <CommandInput
          placeholder={placeholder}
          value={inputValue}
          onValueChange={setInputValue}
          onFocus={() => setOpen(true)}
          ref={inputRef}
        />
      </div>

      <div className="relative mt-2">
        {open && (
          <CommandGroup className="absolute w-full z-10 top-0 max-h-40 overflow-y-auto border rounded-md shadow-md bg-white sm:bg-white">
            {selectables.length === 0 ? (
              <div className="text-center text-gray-500">
                No collections found
              </div>
            ) : (
              selectables.map((collection) => (
                <CommandItem
                  key={collection._id}
                  onMouseDown={(e) => e.preventDefault()}
                  onSelect={() => {
                    onChange(collection._id);
                    setInputValue("");

                    inputRef.current?.focus();
                  }}
                  className="hover:bg-[#F0F0F0] cursor-pointer"
                >
                  {collection.title}
                </CommandItem>
              ))
            )}
          </CommandGroup>
        )}
      </div>
    </Command>
  );
};

export default MultiSelect;
