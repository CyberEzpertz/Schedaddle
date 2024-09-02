"use client";

import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Class, classSchema, Filter } from "@/lib/definitions";
import { toast } from "./ui/use-toast";
import { createSchedules, getLocalStorage } from "@/lib/utils";
import { z } from "zod";
import Calendar from "./Calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FixedSizeList } from "react-window";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FilterSettings from "./FilterSettings";

type Props = {};

const ScheduleTab = (props: Props) => {
  const [schedules, setSchedules] = useState<Class[][]>([]);
  const [active, setActive] = useState<number>(0);

  const handleGenerate = () => {
    const localSelected = getLocalStorage("selected_data");
    const localFilter = getLocalStorage("filter_options");

    if (!localSelected || localSelected.length) {
      toast({
        title: "Uh oh! Generation of schedules failed...",
        description: "No schedules could be made with your selection...",
        variant: "destructive",
      });
      return;
    }

    const safeSelected = z
      .record(z.string(), z.array(classSchema))
      .parse(localSelected);

    const selectedData = Object.entries(safeSelected).map(([_, val]) => val);
    const newSchedules = createSchedules(
      selectedData,
      localFilter ?? undefined
    );

    if (newSchedules.length === 0) {
      toast({
        title: "Uh oh! No schedules could be generated.",
        description:
          "Try selecting more classes that don't conflict with each other.",
        variant: "destructive",
      });
      return;
    } else if (newSchedules.length >= 2048) {
      toast({
        title: "Uh oh! Too many classes will be generated.",
        description:
          "Narrow down your options and select less classes, then generate again.",
        variant: "destructive",
      });
      return;
    }

    // If no error occurs, just set schedules as normal.
    setSchedules(newSchedules);
    toast({
      title: "Sucessfully generated schedules!",
      description: `A total of ${newSchedules.length} were successfully generated.`,
    });
    localStorage.setItem("schedules", JSON.stringify(newSchedules));
  };

  useEffect(() => {
    const storedSchedules = localStorage.getItem("schedules");
    const parsedSchedules =
      storedSchedules !== null ? JSON.parse(storedSchedules) : [];

    setSchedules(parsedSchedules);
  }, []);

  return (
    <div className="flex flex-row w-full min-h-0 py-16 px-32 gap-4">
      <div className="flex flex-col gap-4 grow">
        <Card className="flex flex-row gap-4 p-4">
          <div className="flex flex-row gap-2">
            <Button
              onClick={() => setActive(active - 1)}
              disabled={active <= 0}
              variant="outline"
              size="icon"
            >
              <ChevronLeft />
            </Button>
            <Select onValueChange={(val) => setActive(Number(val))}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder={`Schedule ${active}`}>
                  Schedule {active}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <FixedSizeList
                  width={`100%`}
                  height={350}
                  itemCount={schedules.length}
                  itemSize={35}
                >
                  {({ index, style, isScrolling }) => (
                    <SelectItem
                      key={index}
                      value={`${index}`}
                      style={{ ...style }}
                    >
                      Schedule {index}
                    </SelectItem>
                  )}
                </FixedSizeList>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setActive(active + 1)}
              disabled={active >= schedules.length - 1}
              variant="outline"
              size="icon"
            >
              <ChevronRight />
            </Button>
          </div>
          <Button onClick={() => handleGenerate()}>Generate Schedules</Button>
          <FilterSettings />
        </Card>
        {schedules[active] && <Calendar courses={schedules[active]} />}
      </div>
      <Card className="w-64"></Card>
    </div>
  );
};

export default ScheduleTab;
