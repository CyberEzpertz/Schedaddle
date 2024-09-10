"use client";

import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Class, classSchema, ColorsEnum } from "@/lib/definitions";
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
import { CalendarPlus2, ChevronLeft, ChevronRight } from "lucide-react";
import FilterSettings from "./FilterSettings";
import SaveButton from "./SaveButton";
import ScheduleOverview from "./ScheduleOverview";
import useLocalStorage from "@/hooks/useLocalStorage";

const ScheduleTab = () => {
  const [schedules, setSchedules] = useLocalStorage<Class[][]>("schedules", []);
  const [colors, setColors] = useLocalStorage<Record<string, ColorsEnum>>(
    "course_colors",
    {}
  );
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
    const [newSchedules, newColors] = createSchedules(
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
    setColors(newColors);
    toast({
      title: "Sucessfully generated schedules!",
      description: `A total of ${newSchedules.length} were successfully generated.`,
    });
    localStorage.setItem("schedules", JSON.stringify(newSchedules));
    localStorage.setItem("course_colors", JSON.stringify(newColors));
  };

  return (
    <div className="flex flex-row w-full min-h-0 py-8 px-16 gap-4 h-full">
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
            <Select
              value={`${active}`}
              onValueChange={(val) => setActive(Number(val))}
              disabled={schedules.length === 0}
            >
              <SelectTrigger className="w-64">
                <SelectValue
                  placeholder={`${
                    schedules.length !== 0 ? `Schedule ${active}` : "-"
                  }`}
                >
                  Schedule {active}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <FixedSizeList
                  width={`100%`}
                  height={Math.min(350, 35 * schedules.length)}
                  itemCount={schedules.length}
                  itemSize={35}
                >
                  {({ index, style }) => (
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
          {schedules[active] && (
            <SaveButton activeSched={schedules[active]} colors={colors} />
          )}
        </Card>
        {schedules[active] ? (
          <Calendar courses={schedules[active]} colors={colors} />
        ) : (
          <Card className="p-6 w-full grow items-center flex flex-row justify-center text-muted-foreground gap-2">
            <CalendarPlus2 size={100} strokeWidth={1.25} />
            <span className="flex flex-col gap-2">
              <span className="font-bold text-xl">
                No schedules generated yet
              </span>
              <span>Try clicking the Generate Schedules Button!</span>
            </span>
          </Card>
        )}
      </div>
      <ScheduleOverview activeSchedule={schedules[active]} colors={colors} />
    </div>
  );
};

export default ScheduleTab;
