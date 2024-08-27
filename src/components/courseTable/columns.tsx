"use client";

import { Class } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { SortableHeader } from "./SortableHeader";

export const columns: ColumnDef<Class>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        className="flex h-4 w-4"
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        className="flex h-4 w-4"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "section",
    header: ({ column }) => (
      <SortableHeader column={column} title={"Section"} />
    ),
  },
  {
    accessorFn: (row) => {
      return row.professor?.length !== 0 ? row.professor : "-";
    },
    meta: {
      headerClassName: "w-[300px] nowrap",
    },
    header: ({ column }) => (
      <SortableHeader column={column} title={"Professor"} />
    ),
    id: "Professor",
  },
  {
    header: "Enrolled",
    accessorFn: (row) => `${row.enrolled}/${row.enrollCap}`,
  },
  {
    header: "Room",
    accessorFn: (row) => {
      const filtered = row.rooms.filter((room) => room !== "");

      if (filtered.length === 0) return "-";

      return filtered.join(", ");
    },
    meta: {
      headerClassName: "w-[100px]",
    },
  },
  {
    header: "Days",
    accessorFn: (row) => {
      const days = row.schedules.map((sched) => sched.day);
      if (days.length === 4)
        return `${days.slice(0, 2).join("")}/${days.slice(2).join("")}`;

      return days.join("/");
    },
  },
  {
    id: "modality",
    accessorKey: "modality",
    meta: {
      headerClassName: "w-[100px]",
    },
  },
  {
    id: "restriction",
    accessorKey: "restriction",
  },
  {
    header: "Remarks",
    accessorKey: "remarks",
  },
  {
    id: "courseCode",
    accessorKey: "course",
  },
];
