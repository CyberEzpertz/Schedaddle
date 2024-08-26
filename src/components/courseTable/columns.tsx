"use client";

import { Class } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";

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
    header: "Section",
  },
  {
    accessorKey: "professor",
    header: "Professor",
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
  },
  {
    header: "Days",
    accessorFn: (row) => {
      const days = row.schedules.map((sched) => sched.day);
      return days.join("/");
    },
  },
  {
    header: "Modality",
    accessorKey: "modality",
  },
  {
    header: "Restriction",
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
