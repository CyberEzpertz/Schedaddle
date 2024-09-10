"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import { ClassSchedule } from "@/lib/definitions";
import Calendar from "./Calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FixedSizeList } from "react-window";
import SaveButton from "./SaveButton";
import ScheduleOverview from "./ScheduleOverview";
import useLocalStorage from "@/hooks/useLocalStorage";
import { HeartCrack } from "lucide-react";

const SavedTab = () => {
  const [schedules, setSchedules] = useLocalStorage<ClassSchedule[]>(
    "saved_schedules",
    []
  );
  const [active, setActive] = useState<number>(0);

  return (
    <div className="flex flex-row w-full min-h-0 py-8 px-16 gap-4 h-full">
      <div className="flex flex-col gap-4 grow">
        <Card className="flex flex-row gap-4 p-4">
          <div className="flex flex-row gap-2">
            <Select
              value={`${active}`}
              onValueChange={(val) => setActive(Number(val))}
              disabled={!Object.keys(schedules).length}
            >
              <SelectTrigger className="w-64">
                <SelectValue
                  placeholder={`${
                    !!Object.keys(schedules).length
                      ? schedules[active].name
                      : "-"
                  }`}
                >
                  {schedules[active] ? schedules[active].name : "-"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <FixedSizeList
                  width={`100%`}
                  height={Math.min(350, 35 * Object.keys(schedules).length)}
                  itemCount={Object.keys(schedules).length}
                  itemSize={35}
                >
                  {({ index, style }) => (
                    <SelectItem
                      key={index}
                      value={`${index}`}
                      style={{ ...style }}
                    >
                      {schedules[index].name}
                    </SelectItem>
                  )}
                </FixedSizeList>
              </SelectContent>
            </Select>
          </div>
          {schedules[active] && (
            <SaveButton
              activeSched={schedules[active].classes}
              colors={schedules[active].colors}
            />
          )}
        </Card>
        {schedules[active] ? (
          <Calendar
            courses={schedules[active].classes}
            colors={schedules[active].colors}
          />
        ) : (
          <Card className="p-6 w-full grow items-center flex flex-col justify-center text-muted-foreground gap-2">
            <HeartCrack size={100} />
            No schedules saved yet.
          </Card>
        )}
      </div>
      {schedules[active] ? (
        <ScheduleOverview
          activeSchedule={schedules[active].classes}
          colors={schedules[active].colors}
        />
      ) : (
        <Card className="w-[20%] p-6"></Card>
      )}
    </div>
  );
};

export default SavedTab;
