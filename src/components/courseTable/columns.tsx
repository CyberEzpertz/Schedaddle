"use client";

import { Class, Schedule } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { SortableHeader } from "./SortableHeader";
import { Badge } from "../ui/badge";
import { MapPin, Wifi } from "lucide-react";
import { convertTime, toProperCase } from "@/lib/utils";

export const columns: ColumnDef<Class>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        className="flex h-4 w-4 border-secondary"
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        className="flex h-4 w-4 border-secondary"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    meta: {
      headerClassName: "w-10",
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: "Code",
    filterFn: "includesString",
    meta: {
      headerClassName: "w-12",
    },
  },
  {
    accessorKey: "section",
    header: ({ column }) => (
      <SortableHeader
        className="min-w-12 max-w-16"
        column={column}
        title={"Section"}
      />
    ),
    meta: {
      headerClassName: "w-20",
    },
  },
  {
    id: "Professor",
    accessorFn: (row) => {
      return row.professor.length !== 0 ? toProperCase(row.professor) : "-";
    },
    meta: {
      headerClassName: "w-[300px] nowrap",
    },
    header: ({ column }) => (
      <SortableHeader column={column} title={"Professor"} />
    ),
  },
  {
    header: "Schedules",
    cell: ({ row }) => {
      const schedules = row.original.schedules.reduce<Schedule[]>(
        (acc, curr) => {
          if (
            !acc.some((acc) => acc.start === curr.start && acc.end === curr.end)
          )
            acc.push(curr);
          return acc;
        },
        []
      );
      return (
        <div className="flex flex-col gap-1">
          {schedules.map((sched, i) => (
            <Badge
              key={i}
              variant="outline"
              className={`bg-background/50 select-none flex gap-2 rounded-lg p-2 px-4 font-medium w-[160px]  justify-center items-center`}
            >
              {/* {sched.isOnline ? <Wifi size={16} /> : <MapPin size={16} />} */}
              {`${convertTime(sched.start)} - ${convertTime(sched.end)}`}
            </Badge>
          ))}
        </div>
      );
    },
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
      const days = [...new Set(row.schedules.map((sched) => sched.day))];

      if (days.length === 4)
        return `${days.slice(0, 2).join("")}/${days.slice(2).join("")}`;

      return days.join("/");
    },
    filterFn: "arrIncludesSome",
  },
  {
    header: "Enrolled",
    accessorFn: (row) => `${row.enrolled}/${row.enrollCap}`,
  },

  {
    id: "modality",
    accessorKey: "modality",
    meta: {
      headerClassName: "w-[100px]",
    },
    filterFn: "arrIncludesSome",
  },
  {
    id: "restriction",
    accessorKey: "restriction",
    filterFn: "arrIncludesSome",
  },

  {
    header: "Remarks",
    accessorKey: "remarks",
  },

  {
    id: "courseCode",
    accessorKey: "course",
  },
  {
    id: "status",
    accessorFn: (row) => {
      const isClosed = row.enrolled >= row.enrollCap;

      return isClosed ? "Closed" : "Open";
    },
    filterFn: "arrIncludesSome",
  },
];
