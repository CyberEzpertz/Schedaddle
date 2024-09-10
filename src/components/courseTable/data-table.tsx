"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { setSelectedData } from "@/lib/utils";
import { Class } from "@/lib/definitions";
import { ScrollArea } from "../ui/scroll-area";
import { FilterBar } from "./FilterBar";
import useLocalStorage from "@/hooks/useLocalStorage";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  lastFetched?: Date;
  activeCourse: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  lastFetched,
  activeCourse,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useLocalStorage<RowSelectionState>(
    "selected_rows",
    {},
    activeCourse
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: (updater) => {
      const newRowSelectionValue =
        updater instanceof Function ? updater(rowSelection) : updater;
      const selectedRowsData = Object.keys(newRowSelectionValue).map(
        (rowId) => data[Number.parseInt(rowId)]
      );

      setSelectedData(activeCourse, selectedRowsData as Class[]);
      setRowSelection(newRowSelectionValue);
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    state: {
      columnFilters,
      rowSelection,
      sorting,
    },
    initialState: {
      columnVisibility: {
        courseCode: false,
        modality: false,
        restriction: false,
        status: false,
      },
    },
  });

  useEffect(() => {}, [activeCourse]);

  return (
    <div className="flex w-full flex-col gap-4">
      <FilterBar table={table} />
      <ScrollArea className="w-full rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={header.column.columnDef.meta?.headerClassName}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.cellClassName}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="text-sm text-muted-foreground">
        {`${Object.keys(rowSelection).length} out of ${
          data.length
        } rows selected. ${
          lastFetched
            ? `Last Fetched: ${new Date(lastFetched).toLocaleString()}`
            : ""
        }`}
      </div>
    </div>
  );
}
