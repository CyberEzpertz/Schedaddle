"use client";

import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Class, classSchema } from "@/lib/definitions";
import { toast } from "./ui/use-toast";
import { createSchedules } from "@/lib/utils";
import { z } from "zod";
import Calendar from "./Calendar";

type Props = {};

const ScheduleTab = (props: Props) => {
  const [schedules, setSchedules] = useState<Class[][]>([]);
  const [active, setActive] = useState<number>(0);

  const handleGenerate = () => {
    const storedSelected = localStorage.getItem("selected_data");
    const parsedSelected =
      storedSelected !== null ? JSON.parse(storedSelected) : null;

    if (!parsedSelected) {
      toast({
        title: "Invalid Generation!",
        description: "Select some classes first before generating.",
      });
      return;
    }
    const safeSelected = z
      .record(z.string(), z.array(classSchema))
      .parse(parsedSelected);

    const selectedData = Object.entries(safeSelected).map(([_, val]) => val);
    const newSchedules = createSchedules(selectedData);
    setSchedules(newSchedules);

    localStorage.setItem("schedules", JSON.stringify(newSchedules));
  };

  useEffect(() => {
    const storedSchedules = localStorage.getItem("schedules");
    const parsedSchedules =
      storedSchedules !== null ? JSON.parse(storedSchedules) : null;

    setSchedules(parsedSchedules);
  }, []);

  return (
    <div className="flex flex-row w-4/5">
      <div>
        <Button onClick={() => handleGenerate()}>Generate Schedules</Button>
        <Card className="h-96 overflow-auto">
          <div className="p-4 flex flex-col gap-2">
            {schedules.map((sched, i) => (
              <Button
                key={i}
                variant={active === i ? "default" : "outline"}
                onClick={() => setActive(i)}
              >
                Schedule {i}
              </Button>
            ))}
          </div>
        </Card>
      </div>
      {schedules[active] && <Calendar courses={schedules[active]} />}
    </div>
  );
};

export default ScheduleTab;
