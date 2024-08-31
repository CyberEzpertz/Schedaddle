"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FilterForm from "./FilterForm";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";

const FilterSettings = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Filter Settings</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[650px] max-h-[80vh] p-6 overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-4">
          <DialogTitle>Filter Settings</DialogTitle>
          <DialogDescription>
            Change how we should filter your schedules.
          </DialogDescription>
        </DialogHeader>
        <FilterForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default FilterSettings;
