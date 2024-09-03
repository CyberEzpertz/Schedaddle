"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Class,
  classSchema,
  ColorsEnum,
  Filter,
  Schedule,
} from "@/lib/definitions";
import { toast } from "./ui/use-toast";
import {
  convertTime,
  createSchedules,
  getCardColors,
  getLocalStorage,
  toProperCase,
} from "@/lib/utils";
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
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Clock,
  DoorOpen,
  FilePen,
  User,
} from "lucide-react";
import FilterSettings from "./FilterSettings";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

type Props = {};

const ScheduleTab = (props: Props) => {
  const [schedules, setSchedules] = useState<Class[][]>([]);
  const [colors, setColors] = useState<Record<string, ColorsEnum>>({});
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

  useEffect(() => {
    const storedSchedules = getLocalStorage("schedules") ?? [];
    const storedColors = getLocalStorage("course_colors") ?? {};

    setSchedules(storedSchedules);
    setColors(storedColors);
  }, []);

  return (
    <div className="flex flex-row w-full min-h-0 py-8 px-16 gap-4">
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
        {schedules[active] && (
          <Calendar courses={schedules[active]} colors={colors} />
        )}
      </div>
      <ScrollArea className="w-[20%] rounded-lg border">
        <div className="p-4 flex flex-col gap-2">
          {schedules[active] &&
            schedules[active].map((courseClass) => {
              const schedules = courseClass.schedules.reduce<Schedule[]>(
                (acc, curr) => {
                  if (
                    !acc.some(
                      (acc) => acc.start === curr.start && acc.end === curr.end
                    )
                  )
                    acc.push(curr);
                  return acc;
                },
                []
              );

              const days = courseClass.schedules.map((sched) => sched.day);

              const { color, border } = getCardColors(
                colors[courseClass.course]
              );

              return (
                <Card key={courseClass.code} className={`${color}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 font-bold text-lg">
                      {courseClass.course} [{courseClass.code}]
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 text-sm">
                    <div className="flex gap-2">
                      <User size={18} strokeWidth={3} />{" "}
                      {courseClass.professor !== ""
                        ? toProperCase(courseClass.professor)
                        : "TBA"}
                    </div>
                    <div className="flex gap-2">
                      <CalendarClock size={18} strokeWidth={3} />
                      {days.join("/")}
                    </div>
                    {schedules.map((sched) => (
                      <div
                        className="flex gap-2 items-center"
                        key={`${sched.day}${sched.start}`}
                      >
                        <Clock size={18} strokeWidth={3} />

                        {`${convertTime(sched.start)} - ${convertTime(
                          sched.end
                        )} ${schedules.length > 1 ? `(${sched.day})` : ""}`}
                      </div>
                    ))}
                    {courseClass.rooms.map((room) =>
                      room !== "" ? (
                        <div
                          className="flex gap-2 items-center"
                          key={`${courseClass.course}${room}`}
                        >
                          <DoorOpen size={18} strokeWidth={3} />
                          {room}
                        </div>
                      ) : (
                        <></>
                      )
                    )}
                    <div className="flex gap-2">
                      <FilePen size={18} strokeWidth={3} />
                      {courseClass.remarks}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ScheduleTab;
