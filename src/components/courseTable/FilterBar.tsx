"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { FacetedFilter } from "./FacetedFilter";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

interface FilterBarProps<TData> {
  table: Table<TData>;
}

export function FilterBar<TData>({ table }: FilterBarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search by code..."
          value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("code")?.setFilterValue(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("Days") && (
          <FacetedFilter column={table.getColumn("Days")} title="Days" />
        )}
        {table.getColumn("modality") && (
          <FacetedFilter
            column={table.getColumn("modality")}
            title="Modality"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
