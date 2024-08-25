"use client";

import { Class } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Class>[] = [
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
];
